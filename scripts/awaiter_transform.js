/**
 * Babel Plugin: Transform __awaiter/__generator to async/await
 * 
 * This plugin converts TypeScript-downcompiled __awaiter/__generator patterns
 * back to native async/await syntax.
 * 
 * @author Auto-generated based on state machine analysis
 */

const babel = require('@babel/core');
const t = require('@babel/types');
const generator = require('@babel/generator').default;
const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');

/**
 * State machine instruction types
 */
const INSTRUCTION_TYPES = {
  YIELD: 'yield',           // [4, promise] - await a promise
  RETURN: 'return',         // [2] or [2, value] - return from function
  THROW: 'throw',           // throw error
  GOTO: 'goto',             // [3, label] - jump to label
  TRY_START: 'try_start',   // o.trys.push([start, end, finStart, finEnd])
  TRY_END: 'try_end',       // End of try block
  CATCH: 'catch',           // Catch handler
  FINALLY: 'finally',       // Finally handler
  SENT: 'sent',             // i.sent() - get resolved value
  CONDITIONAL: 'conditional' // Conditional jump based on ternary
};

/**
 * Parse a switch case body to extract instructions
 */
function parseCaseBody(caseNode, state) {
  const instructions = [];
  const statements = caseNode.consequent;
  
  for (const stmt of statements) {
    if (t.isReturnStatement(stmt)) {
      // return [2] or return [2, value] or return [4, promise] etc.
      if (stmt.argument && t.isArrayExpression(stmt.argument)) {
        const elements = stmt.argument.elements;
        if (elements.length >= 1) {
          const code = elements[0].value;
          
          if (code === 2) {
            // Return statement
            const returnValue = elements.length > 1 ? elements[1] : null;
            instructions.push({
              type: INSTRUCTION_TYPES.RETURN,
              value: returnValue,
              raw: stmt
            });
          } else if (code === 4) {
            // Yield/Await statement
            const promise = elements.length > 1 ? elements[1] : null;
            instructions.push({
              type: INSTRUCTION_TYPES.YIELD,
              promise: promise,
              raw: stmt
            });
          } else if (code === 3) {
            // Goto/Jump statement
            const targetLabel = elements.length > 1 ? elements[1]?.value : null;
            instructions.push({
              type: INSTRUCTION_TYPES.GOTO,
              target: targetLabel,
              raw: stmt
            });
          } else if (code === 6) {
            // Throw statement (in some variants)
            const errorExpr = elements.length > 1 ? elements[1] : null;
            instructions.push({
              type: INSTRUCTION_TYPES.THROW,
              error: errorExpr,
              raw: stmt
            });
          }
        }
      } else if (stmt.argument && t.isConditionalExpression(stmt.argument)) {
        // Conditional return: condition ? [4, p] : [3, label]
        instructions.push({
          type: INSTRUCTION_TYPES.CONDITIONAL,
          expression: stmt.argument,
          raw: stmt
        });
      }
    } else if (t.isExpressionStatement(stmt)) {
      const expr = stmt.expression;
      
      // Check for i.sent() call
      if (t.isCallExpression(expr) && 
          t.isMemberExpression(expr.callee) &&
          t.isIdentifier(expr.callee.property) &&
          expr.callee.property.name === 'sent') {
        instructions.push({
          type: INSTRUCTION_TYPES.SENT,
          raw: stmt
        });
      }
      
      // Check for label assignment: i.label = X
      if (t.isAssignmentExpression(expr) &&
          t.isMemberExpression(expr.left) &&
          t.isIdentifier(expr.left.property) &&
          expr.left.property.name === 'label') {
        // This is handled separately as control flow
      }
      
      // Check for trys.push
      if (t.isCallExpression(expr) &&
          t.isMemberExpression(expr.callee) &&
          t.isIdentifier(expr.callee.property) &&
          expr.callee.property.name === 'push' &&
          t.isMemberExpression(expr.callee.object) &&
          t.isIdentifier(expr.callee.object.property) &&
          expr.callee.object.property.name === 'trys') {
        const args = expr.arguments[0];
        if (t.isArrayExpression(args)) {
          const els = args.elements;
          instructions.push({
            type: INSTRUCTION_TYPES.TRY_START,
            start: els[0]?.value,
            end: els[1]?.value,
            finallyStart: els[2]?.value,
            finallyEnd: els[3]?.value,
            raw: stmt
          });
        }
      }
    } else if (t.isThrowStatement(stmt)) {
      instructions.push({
        type: INSTRUCTION_TYPES.THROW,
        error: stmt.argument,
        raw: stmt
      });
    } else if (t.isVariableDeclaration(stmt)) {
      // Pass through variable declarations
      instructions.push({
        type: 'declaration',
        node: stmt,
        raw: stmt
      });
    } else if (t.isIfStatement(stmt)) {
      instructions.push({
        type: 'if',
        node: stmt,
        raw: stmt
      });
    } else if (t.isForStatement(stmt) || t.isForInStatement(stmt) || t.isForOfStatement(stmt)) {
      instructions.push({
        type: 'loop',
        node: stmt,
        raw: stmt
      });
    } else if (t.isSwitchStatement(stmt)) {
      instructions.push({
        type: 'switch',
        node: stmt,
        raw: stmt
      });
    } else if (t.isTryStatement(stmt)) {
      instructions.push({
        type: 'try',
        node: stmt,
        raw: stmt
      });
    }
  }
  
  return instructions;
}

/**
 * Analyze conditional expression in array return
 * e.g., condition ? [4, promise] : [3, label]
 */
function parseConditionalArray(condExpr, stateVarName) {
  const result = {
    type: 'conditional_await',
    test: condExpr.test,
    consequent: null,
    alternate: null
  };
  
  // Parse consequent (true branch)
  if (t.isArrayExpression(condExpr.consequent)) {
    const els = condExpr.consequent.elements;
    const code = els[0]?.value;
    if (code === 4) {
      result.consequent = {
        type: 'await',
        promise: els[1]
      };
    } else if (code === 3) {
      result.consequent = {
        type: 'goto',
        target: els[1]?.value
      };
    } else if (code === 2) {
      result.consequent = {
        type: 'return',
        value: els[1] || null
      };
    }
  }
  
  // Parse alternate (false branch)
  if (t.isArrayExpression(condExpr.alternate)) {
    const els = condExpr.alternate.elements;
    const code = els[0]?.value;
    if (code === 4) {
      result.alternate = {
        type: 'await',
        promise: els[1]
      };
    } else if (code === 3) {
      result.alternate = {
        type: 'goto',
        target: els[1]?.value
      };
    } else if (code === 2) {
      result.alternate = {
        type: 'return',
        value: els[1] || null
      };
    }
  }
  
  return result;
}

/**
 * Build CFG from switch cases
 */
function buildCFG(switchStatement, stateVarName) {
  const cfg = new Map(); // label -> { instructions, successors }
  const cases = switchStatement.cases;
  
  for (const caseNode of cases) {
    const label = caseNode.test?.value;
    if (label === undefined) continue;
    
    const instructions = parseCaseBody(caseNode, stateVarName);
    
    // Determine successors
    const successors = [];
    let hasExplicitJump = false;
    
    for (const instr of instructions) {
      if (instr.type === INSTRUCTION_TYPES.GOTO) {
        successors.push(instr.target);
        hasExplicitJump = true;
      } else if (instr.type === INSTRUCTION_TYPES.RETURN || 
                 instr.type === INSTRUCTION_TYPES.THROW) {
        hasExplicitJump = true;
      } else if (instr.type === INSTRUCTION_TYPES.CONDITIONAL) {
        const cond = parseConditionalArray(instr.expression, stateVarName);
        if (cond.consequent?.type === 'goto') successors.push(cond.consequent.target);
        if (cond.alternate?.type === 'goto') successors.push(cond.alternate.target);
        if (cond.consequent?.type === 'await' || cond.alternate?.type === 'await') {
          // After await, continues to next case
          const nextLabel = getNextLabel(cases, label);
          if (nextLabel !== null) successors.push(nextLabel);
        }
      } else if (instr.type === INSTRUCTION_TYPES.YIELD) {
        // After yield, typically goes to next case
        const nextLabel = getNextLabel(cases, label);
        if (nextLabel !== null) successors.push(nextLabel);
      }
    }
    
    // Fall-through: if no explicit jump, goes to next case
    if (!hasExplicitJump && instructions.length > 0) {
      const nextLabel = getNextLabel(cases, label);
      if (nextLabel !== null && !successors.includes(nextLabel)) {
        successors.push(nextLabel);
      }
    }
    
    cfg.set(label, {
      instructions,
      successors,
      node: caseNode
    });
  }
  
  return cfg;
}

function getNextLabel(cases, currentLabel) {
  const idx = cases.findIndex(c => c.test?.value === currentLabel);
  if (idx === -1 || idx === cases.length - 1) return null;
  
  // Find next case with a test value
  for (let i = idx + 1; i < cases.length; i++) {
    if (cases[i].test !== null) {
      return cases[i].test.value;
    }
  }
  return null;
}

/**
 * Convert CFG back to structured control flow
 */
function reconstructControlFlow(cfg, startLabel, stateVarName, varDeclarations) {
  const visited = new Set();
  const blocks = [];
  
  function visit(label, context = { inTry: false, tryHandlers: [] }) {
    if (visited.has(label)) return null;
    visited.add(label);
    
    const block = cfg.get(label);
    if (!block) return null;
    
    const statements = [];
    
    // Add variable declarations at the start if this is the first block
    if (label === 0 && varDeclarations.length > 0) {
      statements.push(...varDeclarations);
    }
    
    for (const instr of block.instructions) {
      if (instr.type === 'declaration') {
        statements.push(instr.node);
      } else if (instr.type === 'if' || instr.type === 'loop' || 
                 instr.type === 'switch' || instr.type === 'try') {
        statements.push(instr.node);
      } else if (instr.type === INSTRUCTION_TYPES.SENT) {
        // Skip - handled by await
      } else if (instr.type === INSTRUCTION_TYPES.TRY_START) {
        // Handle try-catch-finally
        const tryBlock = reconstructTryBlock(cfg, label, instr, stateVarName, visited);
        if (tryBlock) {
          statements.push(tryBlock);
          // Skip to after the try block
          if (instr.finallyEnd !== undefined) {
            visit(instr.finallyEnd, context);
          }
          continue;
        }
      } else if (instr.type === INSTRUCTION_TYPES.CONDITIONAL) {
        const cond = parseConditionalArray(instr.expression, stateVarName);
        const ifStmt = buildConditionalStatement(cond, stateVarName, cfg, visited, context);
        if (ifStmt) {
          statements.push(ifStmt);
        }
        continue;
      } else if (instr.type === INSTRUCTION_TYPES.YIELD) {
        // Create await expression
        const awaitExpr = t.awaitExpression(instr.promise);
        
        // Check if next statement uses the result
        const nextInstr = block.instructions[block.instructions.indexOf(instr) + 1];
        if (nextInstr?.type === INSTRUCTION_TYPES.SENT) {
          // Value is used, need to assign it
          // Look ahead for usage pattern
          statements.push(t.expressionStatement(awaitExpr));
        } else {
          statements.push(t.expressionStatement(awaitExpr));
        }
      } else if (instr.type === INSTRUCTION_TYPES.RETURN) {
        if (instr.value) {
          statements.push(t.returnStatement(instr.value));
        } else {
          statements.push(t.returnStatement(null));
        }
        break; // Exit block
      } else if (instr.type === INSTRUCTION_TYPES.THROW) {
        statements.push(t.throwStatement(instr.error));
        break;
      } else if (instr.type === INSTRUCTION_TYPES.GOTO) {
        // Handle goto - either convert to structured flow or keep as labeled continue
        const targetBlock = cfg.get(instr.target);
        if (targetBlock) {
          // Try to structure this
          const structured = restructureGoto(cfg, label, instr.target, stateVarName, visited, context);
          if (structured) {
            statements.push(...structured);
          }
        }
      }
    }
    
    return t.blockStatement(statements);
  }
  
  function reconstructTryBlock(cfg, startLabel, tryInstr, stateVarName, visited) {
    const { start, end, finallyStart, finallyEnd } = tryInstr;
    
    // Collect all cases from start to end
    const tryLabels = collectLabelsBetween(cfg, start, end);
    const tryStatements = [];
    
    for (const lbl of tryLabels) {
      const block = cfg.get(lbl);
      if (block) {
        for (const instr of block.instructions) {
          if (instr.type === 'declaration') {
            tryStatements.push(instr.node);
          } else if (instr.type === INSTRUCTION_TYPES.YIELD) {
            tryStatements.push(t.expressionStatement(t.awaitExpression(instr.promise)));
          } else if (instr.type === INSTRUCTION_TYPES.RETURN) {
            tryStatements.push(t.returnStatement(instr.value || null));
          } else if (instr.type === INSTRUCTION_TYPES.THROW) {
            tryStatements.push(t.throwStatement(instr.error));
          } else if (instr.type === INSTRUCTION_TYPES.GOTO) {
            // Handle internal gotos
            if (instr.target >= start && instr.target < end) {
              // Internal jump - try to structure
            }
          }
        }
      }
    }
    
    // Build catch block
    let catchClause = null;
    if (start !== end) {
      // There's a catch handler
      const catchLabels = collectLabelsBetween(cfg, end, finallyStart !== undefined ? finallyStart : Infinity);
      const catchStatements = [];
      
      for (const lbl of catchLabels) {
        const block = cfg.get(lbl);
        if (block) {
          for (const instr of block.instructions) {
            if (instr.type === 'declaration') {
              catchStatements.push(instr.node);
            } else if (instr.type === INSTRUCTION_TYPES.YIELD) {
              catchStatements.push(t.expressionStatement(t.awaitExpression(instr.promise)));
            } else if (instr.type === INSTRUCTION_TYPES.RETURN) {
              catchStatements.push(t.returnStatement(instr.value || null));
            } else if (instr.type === INSTRUCTION_TYPES.THROW) {
              catchStatements.push(t.throwStatement(instr.error));
            }
          }
        }
      }
      
      catchClause = t.catchClause(
        t.identifier('e'),
        t.blockStatement(catchStatements)
      );
    }
    
    // Build finally block
    let finalizer = null;
    if (finallyStart !== undefined && finallyEnd !== undefined) {
      const finallyLabels = collectLabelsBetween(cfg, finallyStart, finallyEnd);
      const finallyStatements = [];
      
      for (const lbl of finallyLabels) {
        const block = cfg.get(lbl);
        if (block) {
          for (const instr of block.instructions) {
            if (instr.type === 'declaration') {
              finallyStatements.push(instr.node);
            } else if (instr.type === INSTRUCTION_TYPES.YIELD) {
              finallyStatements.push(t.expressionStatement(t.awaitExpression(instr.promise)));
            }
          }
        }
      }
      
      if (finallyStatements.length > 0) {
        finalizer = t.blockStatement(finallyStatements);
      }
    }
    
    return t.tryStatement(
      t.blockStatement(tryStatements),
      catchClause,
      finalizer
    );
  }
  
  function collectLabelsBetween(cfg, start, end) {
    const labels = [];
    const sortedLabels = Array.from(cfg.keys()).sort((a, b) => a - b);
    
    for (const lbl of sortedLabels) {
      if (lbl >= start && lbl < end) {
        labels.push(lbl);
      }
    }
    
    return labels;
  }
  
  function buildConditionalStatement(cond, stateVarName, cfg, visited, context) {
    if (!cond.consequent && !cond.alternate) return null;
    
    const consequentStmts = [];
    const alternateStmts = [];
    
    // Process consequent
    if (cond.consequent?.type === 'await') {
      consequentStmts.push(t.expressionStatement(t.awaitExpression(cond.consequent.promise)));
    } else if (cond.consequent?.type === 'return') {
      consequentStmts.push(t.returnStatement(cond.consequent.value || null));
    }
    
    // Process alternate
    if (cond.alternate?.type === 'await') {
      alternateStmts.push(t.expressionStatement(t.awaitExpression(cond.alternate.promise)));
    } else if (cond.alternate?.type === 'return') {
      alternateStmts.push(t.returnStatement(cond.alternate.value || null));
    } else if (cond.alternate?.type === 'goto') {
      // Convert goto to structured flow if possible
      const targetBlock = cfg.get(cond.alternate.target);
      if (targetBlock) {
        // Inline the target or create helper
      }
    }
    
    return t.ifStatement(
      cond.test,
      t.blockStatement(consequentStmts),
      alternateStmts.length > 0 ? t.blockStatement(alternateStmts) : null
    );
  }
  
  function restructureGoto(cfg, fromLabel, toLabel, stateVarName, visited, context) {
    // Try to convert goto to structured control flow
    const targetBlock = cfg.get(toLabel);
    if (!targetBlock) return null;
    
    // Check if this is a simple fall-through that can be removed
    const fromBlock = cfg.get(fromLabel);
    if (fromBlock && fromBlock.successors.length === 1 && fromBlock.successors[0] === toLabel) {
      // Simple sequential flow - no extra statement needed
      return [];
    }
    
    // Check if this forms a loop
    if (toLabel <= fromLabel) {
      // Backward jump - likely a loop
      // This is complex and may need special handling
      return null;
    }
    
    // For forward jumps, try to inline or restructure
    return null;
  }
  
  const result = visit(startLabel);
  return result;
}

/**
 * Main transformation function
 */
function transformAwaiter(path) {
  const node = path.node;
  
  // Match: __awaiter(this, void 0, Promise, function () { ... })
  if (!t.isCallExpression(node)) return;
  if (!t.isIdentifier(node.callee) || node.callee.name !== '__awaiter') return;
  
  const args = node.arguments;
  if (args.length < 4) return;
  
  // Extract the generator function (4th argument)
  const genFunc = args[3];
  if (!t.isFunctionExpression(genFunc)) return;
  
  // The generator function returns __generator call
  const genBody = genFunc.body;
  if (!t.isBlockStatement(genBody)) return;
  
  const returnStmt = genBody.body.find(s => t.isReturnStatement(s));
  if (!returnStmt) return;
  
  const genCall = returnStmt.argument;
  if (!t.isCallExpression(genCall)) return;
  if (!t.isIdentifier(genCall.callee) || genCall.callee.name !== '__generator') return;
  
  // Get the inner function passed to __generator
  const innerFunc = genCall.arguments[1];
  if (!t.isFunctionExpression(innerFunc)) return;
  
  const innerBody = innerFunc.body;
  if (!t.isBlockStatement(innerBody)) return;
  
  // Find the switch statement
  const switchStmt = innerBody.body.find(s => t.isSwitchStatement(s));
  if (!switchStmt) return;
  
  // Identify state variable name (e.g., 'i', 'o', 'r')
  const switchDiscriminant = switchStmt.discriminant;
  let stateVarName = 'state';
  if (t.isMemberExpression(switchDiscriminant) &&
      t.isIdentifier(switchDiscriminant.property) &&
      switchDiscriminant.property.name === 'label') {
    if (t.isIdentifier(switchDiscriminant.object)) {
      stateVarName = switchDiscriminant.object.name;
    }
  }
  
  // Collect variable declarations from the generator function
  const varDeclarations = innerBody.body.filter(s => t.isVariableDeclaration(s));
  
  // Build CFG
  const cfg = buildCFG(switchStmt, stateVarName);
  
  // Reconstruct control flow starting from label 0
  const newBody = reconstructControlFlow(cfg, 0, stateVarName, varDeclarations);
  
  if (newBody) {
    // Create async function
    const asyncFunc = t.functionExpression(
      genFunc.id,
      genFunc.params,
      newBody,
      false,
      true // async = true
    );
    
    // Replace __awaiter call with async IIFE or direct call
    // If __awaiter is called with `this`, we need to preserve context
    
    const thisArg = args[0];
    const promiseConstructor = args[2];
    
    // Create the transformed code
    // Pattern: (async function() { ... }).call(this)
    const callExpr = t.callExpression(
      t.memberExpression(asyncFunc, t.identifier('call')),
      [thisArg]
    );
    
    path.replaceWith(callExpr);
  }
}

/**
 * Babel Plugin Definition
 */
function awaiterToAsyncPlugin() {
  return {
    name: 'awaiter-to-async',
    visitor: {
      CallExpression: transformAwaiter
    }
  };
}

/**
 * Process a single file
 */
function processFile(inputPath, outputPath) {
  let code = fs.readFileSync(inputPath, 'utf-8');
  
  // Check if this is a function snippet (not a complete program)
  // Snippets often start with "function (...) {" without being wrapped
  const isSnippet = code.trim().startsWith('function');
  
  try {
    // Wrap snippet in a variable assignment to make it valid JS
    let wrappedCode = code;
    let unwrapPattern = null;
    
    if (isSnippet) {
      wrappedCode = `const __snippet__ = ${code}`;
      unwrapPattern = /const __snippet__ = /;
    }
    
    const result = babel.transformSync(wrappedCode, {
      filename: inputPath,
      plugins: [awaiterToAsyncPlugin()],
      generatorOpts: {
        compact: false,
        concise: false
      }
    });
    
    let transformedCode = result.code;
    
    // Unwrap the snippet if it was wrapped
    if (isSnippet && unwrapPattern) {
      transformedCode = transformedCode.replace(unwrapPattern, '');
    }
    
    if (outputPath) {
      fs.writeFileSync(outputPath, transformedCode, 'utf-8');
      console.log(`✓ Transformed: ${inputPath} -> ${outputPath}`);
    }
    
    return transformedCode;
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Batch process all snippets
 */
function processDirectory(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.js'));
  
  console.log(`Processing ${files.length} files from ${inputDir}`);
  
  const results = {
    total: files.length,
    success: 0,
    failed: 0,
    details: []
  };
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, `transformed_${file}`);
    
    const result = processFile(inputPath, outputPath);
    
    if (result) {
      results.success++;
      results.details.push({ file, status: 'success' });
    } else {
      results.failed++;
      results.details.push({ file, status: 'failed' });
    }
  }
  
  return results;
}

// Export for use as Babel plugin
module.exports = awaiterToAsyncPlugin;
module.exports.processFile = processFile;
module.exports.processDirectory = processDirectory;
module.exports.transformAwaiter = transformAwaiter;
module.exports.buildCFG = buildCFG;
module.exports.reconstructControlFlow = reconstructControlFlow;
module.exports.parseCaseBody = parseCaseBody;

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node awaiter_transform.js <input_file> [output_file]');
    console.log('  node awaiter_transform.js --dir <input_dir> <output_dir>');
    process.exit(1);
  }
  
  if (args[0] === '--dir') {
    const inputDir = args[1];
    const outputDir = args[2];
    
    if (!inputDir || !outputDir) {
      console.error('Error: Both input and output directories required');
      process.exit(1);
    }
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const results = processDirectory(inputDir, outputDir);
    console.log('\n=== Summary ===');
    console.log(`Total: ${results.total}`);
    console.log(`Success: ${results.success}`);
    console.log(`Failed: ${results.failed}`);
  } else {
    const inputFile = args[0];
    const outputFile = args[1];
    
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: File not found: ${inputFile}`);
      process.exit(1);
    }
    
    processFile(inputFile, outputFile);
  }
}
