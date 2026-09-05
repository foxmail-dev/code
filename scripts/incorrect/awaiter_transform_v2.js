/**
 * Babel Plugin: Transform __awaiter/__generator to async/await
 *
 * This plugin converts TypeScript-downcompiled __awaiter/__generator patterns
 * back to native async/await syntax.
 *
 * Usage:
 *   node awaiter_transform.js <input_file> <output_file>
 *   node awaiter_transform.js --dir <input_dir> <output_dir>
 */

const babel = require("@babel/core");
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const parser = require("@babel/parser");
const fs = require("fs");
const path = require("path");

/**
 * Parse code with proper error recovery for anonymous functions
 */
function parseCode(code) {
  try {
    // Try parsing as a program first
    return parser.parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
      plugins: ["typescript", "jsx"],
    });
  } catch (e) {
    // If it's an anonymous function, wrap it in parentheses
    try {
      return parser.parse(`(${code})`, {
        sourceType: "unambiguous",
        allowReturnOutsideFunction: true,
        plugins: ["typescript", "jsx"],
      });
    } catch (e2) {
      // Try wrapping in a variable assignment
      return parser.parse(`var _fn = ${code}`, {
        sourceType: "unambiguous",
        allowReturnOutsideFunction: true,
        plugins: ["typescript", "jsx"],
      });
    }
  }
}

/**
 * Main Babel plugin function
 */
function awaiterTransformPlugin() {
  return {
    name: "transform-awaiter-to-async",
    visitor: {
      CallExpression(path) {
        // Check for __awaiter call
        if (
          t.isIdentifier(path.node.callee, { name: "__awaiter" }) &&
          path.node.arguments.length >= 3
        ) {
          transformAwaiterCall(path);
        }
      },
    },
  };
}

/**
 * Transform __awaiter(this, void 0, Promise, function() { ... }) to async function
 */
function transformAwaiterCall(path) {
  const args = path.node.arguments;
  if (args.length < 3) return;

  const thisArg = args[0];
  const generatorFunc = args[3]; // The generator function

  if (!t.isFunctionExpression(generatorFunc)) return;

  // Find the __generator call inside
  let generatorBody = null;
  let generatorParamName = null;

  traverseGeneratorFunction(generatorFunc, (paramName, switchStmt) => {
    generatorParamName = paramName;
    generatorBody = switchStmt;
  });

  if (!generatorBody) {
    // No __generator found, might be already async or simple case
    return;
  }

  // Parse the state machine and convert to async
  const asyncFunction = convertStateMachineToAsync(
    generatorFunc,
    generatorBody,
    generatorParamName,
    thisArg,
  );

  if (asyncFunction) {
    // Replace the __awaiter call with the async function call
    const parentReturn = path.parentPath;
    if (t.isReturnStatement(parentReturn)) {
      // The __awaiter is wrapped in a return statement
      const outerFunc = parentReturn.parentPath;
      if (
        t.isFunctionExpression(outerFunc.node) ||
        t.isFunctionDeclaration(outerFunc.node)
      ) {
        // Convert outer function to async
        outerFunc.node.async = true;
        // Replace return __awaiter(...) with just the await call
        const newCall = t.callExpression(
          t.identifier(outerFunc.node.id ? outerFunc.node.id.name : ""),
          generatorFunc.params,
        );
        // Actually we need to inline the async function body
        parentReturn.replaceWith({
          type: "ReturnStatement",
          argument: t.awaitExpression(asyncFunction),
        });
      }
    } else {
      // Direct call, wrap in IIFE or just use async function
      path.replaceWith({
        type: "CallExpression",
        callee: t.asyncArrowFunction(generatorFunc.params, asyncFunction.body),
        arguments: [],
      });
    }
  }
}

/**
 * Traverse generator function to find __generator call and switch statement
 */
function traverseGeneratorFunction(func, callback) {
  const body = func.body.body;
  if (!Array.isArray(body)) return;

  for (const stmt of body) {
    if (t.isReturnStatement(stmt) && stmt.argument) {
      const arg = stmt.argument;
      if (
        t.isCallExpression(arg) &&
        t.isIdentifier(arg.callee, { name: "__generator" })
      ) {
        // Found __generator call
        const genArgs = arg.arguments;
        if (genArgs.length >= 2 && t.isFunctionExpression(genArgs[1])) {
          const innerFunc = genArgs[1];
          const param = innerFunc.params[0];
          const paramName = param ? param.name : "_a";

          // Find switch statement in inner function
          const innerBody = innerFunc.body.body;
          if (Array.isArray(innerBody)) {
            for (const s of innerBody) {
              if (
                t.isReturnStatement(s) &&
                s.argument &&
                t.isSwitchStatement(s.argument)
              ) {
                callback(paramName, s.argument);
                return;
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Convert state machine (switch statement) to async function body
 */
function convertStateMachineToAsync(
  generatorFunc,
  switchStmt,
  stateVarName,
  thisArg,
) {
  const cases = switchStmt.cases;
  if (!cases || cases.length === 0) return null;

  // Build state map: label -> case body
  const stateMap = new Map();
  for (const c of cases) {
    const label = c.test.value;
    stateMap.set(label, c.consequent);
  }

  // Start from state 0 and follow the control flow
  const statements = [];
  const visitedStates = new Set();
  let currentState = 0;

  // Collect variable declarations from generator function
  const varDecls = [];
  for (const stmt of generatorFunc.body.body) {
    if (t.isVariableDeclaration(stmt)) {
      varDecls.push(stmt);
    }
  }

  // Add variable declarations first
  statements.push(...varDecls);

  // Process states starting from 0
  const processedStatements = processState(
    currentState,
    stateMap,
    visitedStates,
    stateVarName,
  );
  if (processedStatements) {
    statements.push(...processedStatements);
  }

  // Create async arrow function body
  return t.blockStatement(statements);
}

/**
 * Process a single state and return corresponding statements
 */
function processState(stateLabel, stateMap, visitedStates, stateVarName) {
  if (visitedStates.has(stateLabel)) return [];
  visitedStates.add(stateLabel);

  const consequent = stateMap.get(stateLabel);
  if (!consequent) return [];

  const statements = [];

  for (const stmt of consequent) {
    const result = processStatement(
      stmt,
      stateMap,
      visitedStates,
      stateVarName,
    );
    if (result) {
      if (Array.isArray(result)) {
        statements.push(...result);
      } else {
        statements.push(result);
      }

      // If we hit a return/goto, stop processing this state
      if (t.isReturnStatement(result) || t.isBreakStatement(result)) {
        break;
      }
    }
  }

  return statements;
}

/**
 * Process a single statement in the state machine
 */
function processStatement(stmt, stateMap, visitedStates, stateVarName) {
  // Handle return [4, promise] - yield/await
  if (
    t.isReturnStatement(stmt) &&
    stmt.argument &&
    t.isArrayExpression(stmt.argument)
  ) {
    const elements = stmt.argument.elements;
    if (elements.length >= 1 && t.isNumericLiteral(elements[0])) {
      const code = elements[0].value;

      if (code === 4) {
        // [4, promise] -> await promise
        const promise = elements[1];
        // Check if next statement uses .sent()
        return t.expressionStatement(t.awaitExpression(promise));
      } else if (code === 2) {
        // [2] or [2, value] -> return
        if (elements.length > 1 && elements[1]) {
          return t.returnStatement(elements[1]);
        } else {
          return t.returnStatement(null);
        }
      } else if (code === 3) {
        // [3, label] -> goto label (handled by control flow)
        if (elements.length > 1 && t.isNumericLiteral(elements[1])) {
          const targetLabel = elements[1].value;
          return processState(
            targetLabel,
            stateMap,
            visitedStates,
            stateVarName,
          );
        }
      }
    }

    // Handle ternary conditional: condition ? [4, promise] : [3, label]
    if (t.isConditionalExpression(stmt.argument)) {
      return processConditional(
        stmt.argument,
        stateMap,
        visitedStates,
        stateVarName,
      );
    }
  }

  // Handle assignment with sent(): x = _a.sent()
  if (
    t.isExpressionStatement(stmt) &&
    t.isAssignmentExpression(stmt.expression)
  ) {
    const expr = stmt.expression;
    if (
      t.isCallExpression(expr.right) &&
      t.isMemberExpression(expr.right.callee) &&
      t.isIdentifier(expr.right.callee.property, { name: "sent" })
    ) {
      // This is x = _a.sent(), which means we already awaited, just keep the assignment
      // The await was handled in previous statement
      return stmt;
    }
  }

  // Handle standalone sent(): _a.sent()
  if (t.isExpressionStatement(stmt) && t.isCallExpression(stmt.expression)) {
    const expr = stmt.expression;
    if (
      t.isMemberExpression(expr.callee) &&
      t.isIdentifier(expr.callee.property, { name: "sent" })
    ) {
      // Already handled by previous await, skip
      return null;
    }
  }

  // Handle label assignment: _a.label = N (used for fall-through)
  if (
    t.isExpressionStatement(stmt) &&
    t.isAssignmentExpression(stmt.expression)
  ) {
    const expr = stmt.expression;
    if (
      t.isMemberExpression(expr.left) &&
      t.isIdentifier(expr.left.property, { name: "label" })
    ) {
      // Skip label assignments, handled by control flow
      return null;
    }
  }

  // Handle try-catch-finally: o.trys.push([...])
  if (t.isExpressionStatement(stmt) && t.isCallExpression(stmt.expression)) {
    const expr = stmt.expression;
    if (
      t.isMemberExpression(expr.callee) &&
      t.isIdentifier(expr.callee.property, { name: "push" }) &&
      t.isMemberExpression(expr.callee.object) &&
      t.isIdentifier(expr.callee.object.property, { name: "trys" })
    ) {
      // This is start of try block, need special handling
      return handleTryBlock(stmt, stateMap, visitedStates, stateVarName);
    }
  }

  // Handle regular expressions/statements
  if (t.isExpressionStatement(stmt)) {
    return stmt;
  }

  // Handle variable declarations
  if (t.isVariableDeclaration(stmt)) {
    return stmt;
  }

  return stmt;
}

/**
 * Process conditional expression (ternary)
 */
function processConditional(condExpr, stateMap, visitedStates, stateVarName) {
  // condition ? [4, promise] : [3, label]
  // or: condition ? [4, promise] : [4, otherPromise]

  const test = condExpr.test;
  const consequent = condExpr.consequent;
  const alternate = condExpr.alternate;

  // Parse both branches
  const thenStmts = parseArrayReturn(
    consequent,
    stateMap,
    visitedStates,
    stateVarName,
  );
  const elseStmts = parseArrayReturn(
    alternate,
    stateMap,
    visitedStates,
    stateVarName,
  );

  // Create if statement
  const ifStmt = t.ifStatement(
    test,
    t.blockStatement(
      Array.isArray(thenStmts) ? thenStmts : [thenStmts].filter(Boolean),
    ),
    elseStmts
      ? t.blockStatement(
          Array.isArray(elseStmts) ? elseStmts : [elseStmts].filter(Boolean),
        )
      : null,
  );

  return ifStmt;
}

/**
 * Parse array return statement like [4, promise] or [3, label]
 */
function parseArrayReturn(node, stateMap, visitedStates, stateVarName) {
  if (!node) return null;

  if (t.isArrayExpression(node)) {
    const elements = node.elements;
    if (elements.length >= 1 && t.isNumericLiteral(elements[0])) {
      const code = elements[0].value;
      if (code === 4 && elements[1]) {
        return t.expressionStatement(t.awaitExpression(elements[1]));
      } else if (code === 2) {
        return t.returnStatement(elements[1] || null);
      } else if (code === 3 && elements[1]) {
        const targetLabel = elements[1].value;
        return processState(targetLabel, stateMap, visitedStates, stateVarName);
      }
    }
  }

  if (t.isConditionalExpression(node)) {
    return processConditional(node, stateMap, visitedStates, stateVarName);
  }

  return null;
}

/**
 * Handle try-catch-finally blocks
 */
function handleTryBlock(stmt, stateMap, visitedStates, stateVarName) {
  const call = stmt.expression;
  const args = call.arguments[0];

  if (t.isArrayExpression(args)) {
    const elements = args.elements;
    // [start, end, finStart, finEnd]
    const startLabel = elements[0].value;
    const endLabel = elements[1].value;
    const finStartLabel = elements[2] ? elements[2].value : null;
    const finEndLabel = elements[3] ? elements[3].value : null;

    // Get try block statements
    const tryStmts = [];
    for (let label = startLabel + 1; label < endLabel; label++) {
      const stateStmts = processState(
        label,
        stateMap,
        new Set(visitedStates),
        stateVarName,
      );
      if (stateStmts) tryStmts.push(...stateStmts);
    }

    // Get catch block if exists
    let catchClause = null;
    if (finStartLabel !== null) {
      const catchStmts = [];
      for (let label = endLabel; label < finStartLabel; label++) {
        const stateStmts = processState(
          label,
          stateMap,
          new Set(visitedStates),
          stateVarName,
        );
        if (stateStmts) catchStmts.push(...stateStmts);
      }

      if (catchStmts.length > 0) {
        catchClause = t.catchClause(
          t.identifier("e"),
          t.blockStatement(catchStmts),
        );
      }
    }

    // Get finally block if exists
    let finalizer = null;
    if (finStartLabel !== null && finEndLabel !== null) {
      const finallyStmts = [];
      for (let label = finStartLabel; label < finEndLabel; label++) {
        const stateStmts = processState(
          label,
          stateMap,
          new Set(visitedStates),
          stateVarName,
        );
        if (stateStmts) finallyStmts.push(...stateStmts);
      }

      if (finallyStmts.length > 0) {
        finalizer = t.blockStatement(finallyStmts);
      }
    }

    return t.tryStatement(t.blockStatement(tryStmts), catchClause, finalizer);
  }

  return stmt;
}

/**
 * CLI entry point
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log("Usage:");
    console.log("  node awaiter_transform.js <input_file> <output_file>");
    console.log("  node awaiter_transform.js --dir <input_dir> <output_dir>");
    process.exit(1);
  }

  /**
   * Transform a single file with error recovery
   */
  function transformFile(inputPath, outputPath) {
    const inputCode = fs.readFileSync(inputPath, "utf-8");

    // Try different parsing strategies
    const parseStrategies = [
      (code) => code, // Original
      (code) => `(${code})`, // Wrap in parentheses
      (code) => `var _fn = ${code}`, // Assign to variable
      (code) => `function _fn() { ${code} }`, // Wrap in function
    ];

    let result = null;
    let lastError = null;

    for (const strategy of parseStrategies) {
      try {
        const wrappedCode = strategy(inputCode);
        result = babel.transformSync(wrappedCode, {
          plugins: [awaiterTransformPlugin],
          parserOpts: {
            sourceType: "unambiguous",
            allowReturnOutsideFunction: true,
            plugins: ["typescript", "jsx"],
          },
          generatorOpts: {
            compact: false,
            comments: false,
            shouldPrintComment: () => false,
          },
        });
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!result) {
      throw lastError;
    }

    // Extract the actual code from wrapper if needed
    let outputCode = result.code;

    // Remove wrapper if we added one
    if (
      outputCode.startsWith("var _fn = ") ||
      outputCode.startsWith("function _fn(")
    ) {
      // Extract the function body
      const match = outputCode.match(
        /(?:var _fn = |function _fn\(\) \{)([\s\S]*?)(?:\};?\s*$|\}$)/,
      );
      if (match) {
        outputCode = match[1].trim();
      }
    } else if (outputCode.startsWith("(") && outputCode.endsWith(");")) {
      // Remove parentheses wrapper
      outputCode = outputCode.slice(1, -2);
    }

    fs.writeFileSync(outputPath, outputCode);
  }

  if (args[0] === "--dir") {
    const inputDir = args[1];
    const outputDir = args[2];

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".js"));

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, `transformed_${file}`);

      try {
        transformFile(inputPath, outputPath);
        console.log(`✓ ${file}`);
        successCount++;
      } catch (err) {
        console.error(`✗ ${file}: ${err.message}`);
        failCount++;
      }
    }

    console.log(`\nDone: ${successCount} succeeded, ${failCount} failed`);
  } else {
    const inputFile = args[0];
    const outputFile = args[1];

    transformFile(inputFile, outputFile);
    console.log(`Transformed ${inputFile} -> ${outputFile}`);
  }
}

// Export for use as Babel plugin
module.exports = awaiterTransformPlugin;

// Run CLI if executed directly
if (require.main === module) {
  main();
}
