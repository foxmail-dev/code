/**
 * Babel Plugin: __awaiter/__generator to async/await (Strict Mode)
 *
 * Features:
 * - Converts __generator state machines back to native async/await
 * - Throws detailed errors on unhandled control flow paths with specific reasons
 * - Reports exception causes for each failure mode
 */

const babel = require("@babel/core");
const t = require("@babel/types");
const fs = require("fs");
const path = require("path");

/**
 * Custom error class for reconstruction failures with detailed diagnostics
 */
class ReconstructionError extends Error {
  constructor(stateNum, reason, suggestions = [], originalStmt = null) {
    super(reason);
    this.name = "ReconstructionError";
    this.stateNum = stateNum;
    this.reason = reason;
    this.suggestions = suggestions;
    this.originalStmt = originalStmt;
  }

  formatMessage() {
    let msg = `State ${this.stateNum}: ${this.reason}`;
    if (this.suggestions.length > 0) {
      msg += "\nSuggestions:";
      this.suggestions.forEach((s) => (msg += `\n  - ${s}`));
    }
    return msg;
  }
}

/**
 * Main transformation plugin with strict error handling
 */
function awaiterTransformPlugin() {
  return {
    name: "awaiter-to-async-await-strict",

    visitor: {
      CallExpression(path) {
        // Match __awaiter(this, void 0, Promise, function* () { ... })
        if (!t.isIdentifier(path.node.callee, { name: "__awaiter" })) return;

        const args = path.node.arguments;
        if (args.length < 3) return;

        const [thisArg, , generatorFunc] = args;

        if (
          !t.isFunctionExpression(generatorFunc) ||
          !generatorFunc.generator
        ) {
          return;
        }

        try {
          // Convert generator function to async function
          const asyncBody = convertGeneratorToAsync(generatorFunc);

          const asyncFunc = t.functionExpression(
            null,
            generatorFunc.params,
            t.blockStatement(asyncBody),
            false, // not a generator
            true, // is async
          );

          // Replace __awaiter call with async function call
          const newCall = t.callExpression(
            t.memberExpression(asyncFunc, t.identifier("call")),
            [thisArg],
          );

          path.replaceWith(newCall);
          path.skip();
        } catch (error) {
          if (error instanceof ReconstructionError) {
            throw path.buildCodeFrameError(
              `Failed to convert to async/await:\n${error.formatMessage()}`,
            );
          }
          throw error;
        }
      },
    },
  };
}

/**
 * Convert generator function body to async function body
 */
function convertGeneratorToAsync(generatorFunc) {
  const body = generatorFunc.body.body;
  const result = [];

  // Find the return __generator(...) statement
  let generatorCall = null;
  for (const stmt of body) {
    if (
      t.isReturnStatement(stmt) &&
      stmt.argument &&
      t.isCallExpression(stmt.argument) &&
      t.isIdentifier(stmt.argument.callee, { name: "__generator" })
    ) {
      generatorCall = stmt.argument;
      break;
    }
  }

  if (!generatorCall) {
    throw new ReconstructionError(
      -1,
      "No __generator call found in generator function",
      [
        "Expected pattern: return __generator(this, function (_) { switch(_) { ... } })",
      ],
    );
  }

  // Get the inner function that contains the switch statement
  const genArgs = generatorCall.arguments;
  if (genArgs.length < 2 || !t.isFunctionExpression(genArgs[1])) {
    throw new ReconstructionError(-1, "Invalid __generator arguments", [
      "Expected: __generator(this, function(stateVar) { switch(stateVar.label) { ... } })",
    ]);
  }

  const innerFunc = genArgs[1];
  const stateVarName = innerFunc.params[0] ? innerFunc.params[0].name : "_a";

  // Find the switch statement
  const switchStmt = findSwitchStatement(innerFunc.body.body, stateVarName);
  if (!switchStmt) {
    throw new ReconstructionError(
      -1,
      `No switch(${stateVarName}.label) statement found`,
      ["The state machine must have a switch statement on the state variable"],
    );
  }

  // Build state map and process states
  const stateMap = buildStateMap(switchStmt);

  // Process from state 0
  const visitedStates = new Set();
  const processed = processState(0, stateMap, visitedStates, stateVarName);

  if (!processed) {
    throw new ReconstructionError(0, "Failed to process entry state", [
      "Check if state 0 exists in the switch statement",
    ]);
  }

  return processed.statements;
}

/**
 * Find switch statement on stateVar.label
 */
function findSwitchStatement(statements, stateVarName) {
  for (const stmt of statements) {
    if (
      t.isReturnStatement(stmt) &&
      stmt.argument &&
      t.isSwitchStatement(stmt.argument)
    ) {
      const switchStmt = stmt.argument;
      if (
        t.isMemberExpression(switchStmt.discriminant) &&
        t.isIdentifier(switchStmt.discriminant.object, {
          name: stateVarName,
        }) &&
        t.isIdentifier(switchStmt.discriminant.property, { name: "label" })
      ) {
        return switchStmt;
      }
    }
  }
  return null;
}

/**
 * Build map of state number -> case body
 */
function buildStateMap(switchStmt) {
  const stateMap = new Map();
  for (const case_ of switchStmt.cases) {
    if (t.isNumericLiteral(case_.test)) {
      stateMap.set(case_.test.value, case_.consequent);
    }
  }
  return stateMap;
}

/**
 * Process a single state and convert to async statements
 */
function processState(stateLabel, stateMap, visitedStates, stateVarName) {
  if (visitedStates.has(stateLabel)) {
    return { statements: [], nextState: null, terminated: false };
  }
  visitedStates.add(stateLabel);

  const consequent = stateMap.get(stateLabel);
  if (!consequent) {
    return null;
  }

  const statements = [];
  let terminated = false;
  let nextState = null;

  for (const stmt of consequent) {
    if (t.isBreakStatement(stmt)) continue;

    // Handle return [X, value] patterns
    if (t.isReturnStatement(stmt) && stmt.argument) {
      const arg = stmt.argument;

      // Pattern: return [N, value] or return [N]
      if (t.isArrayExpression(arg)) {
        const elements = arg.elements;

        if (elements.length === 0) {
          throw new ReconstructionError(
            stateLabel,
            "Empty array in return statement",
            ["Expected: return [stateCode, value?]"],
          );
        }

        const firstElem = elements[0];
        if (!t.isNumericLiteral(firstElem)) {
          throw new ReconstructionError(
            stateLabel,
            `Non-numeric state code: ${generateCode(firstElem)}`,
            ["State codes must be numeric literals"],
          );
        }

        const stateCode = firstElem.value;

        switch (stateCode) {
          case 0: // Continue/fall-through
            // No action needed
            break;

          case 1: // Yield/Await - expects [1, promise]
            if (elements.length < 2) {
              throw new ReconstructionError(
                stateLabel,
                "State 1 (await) missing promise expression",
                [
                  "Expected: return [1, promiseExpression]",
                  "The second element should be the promise to await",
                ],
              );
            }
            statements.push(
              t.expressionStatement(t.awaitExpression(elements[1])),
            );
            break;

          case 2: // Return - [2] or [2, value]
            if (elements.length >= 2) {
              statements.push(t.returnStatement(elements[1]));
            } else {
              statements.push(t.returnStatement(null));
            }
            terminated = true;
            break;

          case 3: // Goto/jump - [3, targetState]
            if (elements.length < 2) {
              throw new ReconstructionError(
                stateLabel,
                "State 3 (goto) missing target state",
                [
                  "Expected: return [3, targetStateNumber]",
                  "This indicates a jump to another state",
                ],
              );
            }

            const targetState = elements[1];
            if (t.isNumericLiteral(targetState)) {
              // Recursively process the target state
              const targetResult = processState(
                targetState.value,
                stateMap,
                visitedStates,
                stateVarName,
              );
              if (targetResult) {
                statements.push(...targetResult.statements);
                terminated = targetResult.terminated;
                nextState = targetResult.nextState;
              }
            } else {
              throw new ReconstructionError(
                stateLabel,
                "State 3 (goto) has non-numeric target",
                [
                  "Target state must be a numeric literal",
                  "Variables or expressions as jump targets cannot be converted automatically",
                ],
              );
            }
            break;

          case 4: // Alternative await - [4, promise]
            if (elements.length < 2) {
              throw new ReconstructionError(
                stateLabel,
                "State 4 (await variant) missing promise expression",
                ["Expected: return [4, promiseExpression]"],
              );
            }
            statements.push(
              t.expressionStatement(t.awaitExpression(elements[1])),
            );
            break;

          default:
            throw new ReconstructionError(
              stateLabel,
              `Unknown state code: ${stateCode}`,
              [
                "Valid codes: 0 (continue), 1 (await), 2 (return), 3 (goto), 4 (await)",
              ],
            );
        }
        continue;
      }

      // Other return statements - keep as-is
      statements.push(t.cloneNode(stmt));
      terminated = true;
      continue;
    }

    // Keep other statements (variable declarations, expressions, etc.)
    const transformed = transformStatement(
      stmt,
      stateMap,
      visitedStates,
      stateVarName,
    );
    if (transformed) {
      if (Array.isArray(transformed)) {
        statements.push(...transformed);
      } else {
        statements.push(transformed);
      }
    }
  }

  return { statements, nextState, terminated };
}

/**
 * Transform individual statements (try-catch, if, etc.)
 */
function transformStatement(stmt, stateMap, visitedStates, stateVarName) {
  if (t.isTryStatement(stmt)) {
    return transformTryStatement(stmt, stateMap, visitedStates, stateVarName);
  }

  if (t.isIfStatement(stmt)) {
    return transformIfStatement(stmt, stateMap, visitedStates, stateVarName);
  }

  if (t.isBreakStatement(stmt) || t.isContinueStatement(stmt)) {
    return null;
  }

  // Clone other statements
  return t.cloneNode(stmt);
}

function transformTryStatement(tryStmt, stateMap, visitedStates, stateVarName) {
  const handler = tryStmt.handler;
  const finalizer = tryStmt.finalizer;

  let catchClause = null;
  if (handler) {
    const catchResult = processStatements(
      handler.body.body,
      stateMap,
      visitedStates,
      stateVarName,
    );
    catchClause = t.catchClause(handler.param, t.blockStatement(catchResult));
  }

  let finallyBlock = null;
  if (finalizer) {
    const finallyResult = processStatements(
      finalizer.body,
      stateMap,
      visitedStates,
      stateVarName,
    );
    finallyBlock = t.blockStatement(finallyResult);
  }

  const tryResult = processStatements(
    tryStmt.block.body,
    stateMap,
    visitedStates,
    stateVarName,
  );

  return t.tryStatement(t.blockStatement(tryResult), catchClause, finallyBlock);
}

function transformIfStatement(ifStmt, stateMap, visitedStates, stateVarName) {
  const consequent = t.isBlockStatement(ifStmt.consequent)
    ? processStatements(
        ifStmt.consequent.body,
        stateMap,
        visitedStates,
        stateVarName,
      )
    : [
        transformStatement(
          ifStmt.consequent,
          stateMap,
          visitedStates,
          stateVarName,
        ),
      ].filter(Boolean);

  let alternate = null;
  if (ifStmt.alternate) {
    alternate = t.isBlockStatement(ifStmt.alternate)
      ? processStatements(
          ifStmt.alternate.body,
          stateMap,
          visitedStates,
          stateVarName,
        )
      : [
          transformStatement(
            ifStmt.alternate,
            stateMap,
            visitedStates,
            stateVarName,
          ),
        ].filter(Boolean);
  }

  return t.ifStatement(
    ifStmt.test,
    t.blockStatement(consequent),
    alternate ? t.blockStatement(alternate) : null,
  );
}

function processStatements(statements, stateMap, visitedStates, stateVarName) {
  const result = [];
  for (const stmt of statements) {
    const transformed = transformStatement(
      stmt,
      stateMap,
      visitedStates,
      stateVarName,
    );
    if (transformed) {
      if (Array.isArray(transformed)) {
        result.push(...transformed);
      } else {
        result.push(transformed);
      }
    }
  }
  return result;
}

function generateCode(node) {
  try {
    return (
      babel.transformFromAstSync(t.cloneNode(node), null, {
        generatorOpts: { compact: true },
      }).code || "<unknown>"
    );
  } catch {
    return "<unknown>";
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error(
      "Usage: node awaiter_transform_strict.js <input-file> [output-file]",
    );
    console.error(
      "       node awaiter_transform_strict.js --dir <input-dir> <output-dir>",
    );
    process.exit(1);
  }

  function transformFile(inputPath, outputPath) {
    const code = fs.readFileSync(inputPath, "utf-8");

    try {
      const result = babel.transformSync(code, {
        filename: inputPath,
        plugins: [awaiterTransformPlugin()],
        generatorOpts: {
          compact: false,
          comments: true,
        },
      });

      fs.writeFileSync(outputPath, result.code);
      console.log(`✓ ${path.basename(inputPath)}`);
      return { success: true };
    } catch (error) {
      console.error(`✗ ${path.basename(inputPath)}:`);
      console.error(`  ${error.message}`);
      if (error.loc) {
        console.error(`  at ${error.loc.line}:${error.loc.column}`);
      }
      return { success: false, error: error.message };
    }
  }

  if (args[0] === "--dir") {
    const inputDir = args[1];
    const outputDir = args[2];

    if (!inputDir || !outputDir) {
      console.error("Error: --dir requires both input and output directories");
      process.exit(1);
    }

    const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".js"));
    let successCount = 0;
    let failCount = 0;
    const failures = [];

    fs.mkdirSync(outputDir, { recursive: true });

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);

      const result = transformFile(inputPath, outputPath);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
        failures.push({ file, error: result.error });
      }
    }

    console.log(`\n========================================`);
    console.log(`Results: ${successCount} succeeded, ${failCount} failed`);
    console.log(`========================================`);

    if (failures.length > 0) {
      console.error("\nFailure Details:");
      console.error("----------------------------------------");
      for (const f of failures) {
        console.error(`\n${f.file}:`);
        console.error(`  ${f.error.split("\n").join("\n  ")}`);
      }
      process.exit(1);
    }
  } else {
    const inputPath = args[0];
    const outputPath = args[1] || inputPath.replace(".js", ".async.js");

    const result = transformFile(inputPath, outputPath);
    if (!result.success) {
      process.exit(1);
    }
  }
}

module.exports = awaiterTransformPlugin;
