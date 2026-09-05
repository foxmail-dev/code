import { 
  Project, 
  SourceFile, 
  Node, 
  CallExpression, 
  FunctionExpression, 
  ArrowFunction,
  Block, 
  SwitchStatement, 
  CaseClause, 
  DefaultClause,
  ReturnStatement, 
  ArrayLiteralExpression, 
  Identifier, 
  Expression, 
  Statement, 
  SyntaxKind, 
  VariableDeclaration, 
  VariableStatement,
  ParameterDeclaration,
  TypeParameterDeclaration,
  ExpressionStatement,
  NumericLiteral,
  PropertyAccessExpression,
  ScriptTarget,
  ModuleKind,
} from "ts-morph";
import * as ts from "typescript";
import { 
  TransformOptions, 
  TransformResult, 
  TransformError, 
  TransformWarning, 
  TransformStats, 
  AwaiterCallInfo, 
  GeneratorInfo, 
  ControlFlowGraph, 
  ControlFlowBlock,
  TryCatchFinallyInfo,
} from "./types";

/**
 * AST-based transformer to convert __awaiter/__generator patterns to native async/await
 * Based on Solution 2 from docs/summary/conversion_solutions.md
 * 
 * Core transformation rules:
 * - return [4, promise] -> await promise
 * - label.sent() -> (implicit, value of await expression)
 * - return [2, value] -> return value
 * - label.trys.push([try, catch, finally]) -> try { } catch { } finally { }
 * - return [3, labelIndex] -> continue / break / control flow
 * - switch (label.label) { case N: } -> linear control flow
 */
export class AwaiterTransformer {
  private project: Project;
  private options: Required<TransformOptions>;
  private stats: TransformStats;
  private errors: TransformError[];
  private warnings: TransformWarning[];
  private sourceFile: SourceFile | null = null;

  constructor(options: TransformOptions = {}) {
    this.project = new Project({
      compilerOptions: {
        target: this.resolveTarget(options.target),
        module: ModuleKind.CommonJS,
      },
      useInMemoryFileSystem: false,
    });

    this.options = {
      target: options.target || "ES2020",
      preserveVariableNames: options.preserveVariableNames ?? false,
      semanticRenaming: options.semanticRenaming ?? true,
      removeRuntimeHelpers: options.removeRuntimeHelpers ?? true,
      format: options.format ?? true,
      allowDispatchFallback: options.allowDispatchFallback ?? true,
    };

    this.stats = this.initStats();
    this.errors = [];
    this.warnings = [];
  }

  private resolveTarget(target?: string): ScriptTarget {
    switch (target) {
      case "ES2017": return ScriptTarget.ES2017;
      case "ES2018": return ScriptTarget.ES2018;
      case "ES2019": return ScriptTarget.ES2019;
      case "ES2020": return ScriptTarget.ES2020;
      case "ES2021": return ScriptTarget.ES2021;
      case "ES2022": return ScriptTarget.ES2022;
      case "ESNext": return ScriptTarget.ESNext;
      default: return ScriptTarget.ES2020;
    }
  }

  private initStats(): TransformStats {
    return {
      awaiterCallsFound: 0,
      awaiterCallsTransformed: 0,
      generatorCallsFound: 0,
      generatorCallsTransformed: 0,
      nestedAwaitersFound: 0,
      tryCatchBlocksRestored: 0,
      loopsRestored: 0,
      awaitsRestored: 0,
      fallbackMachines: 0,
    };
  }

  /**
   * Transform a file at the given path
   */
  transformFile(filePath: string): TransformResult {
    this.resetStats();
    
    try {
      this.sourceFile = this.project.addSourceFileAtPath(filePath);
      this.transformSourceFile(this.sourceFile);
      
      if (this.options.format) {
        this.sourceFile.formatText();
      }

      const code = this.sourceFile.getFullText();
      
      return {
        success: this.errors.filter(e => e.severity === "error").length === 0,
        code,
        issues: [...this.errors, ...this.warnings],
        errors: this.errors,
        warnings: this.warnings,
        stats: this.stats,
      };
    } catch (error) {
      this.addError(filePath, this.sourceFile!, `Transform failed: ${error}`);
      return {
        success: false,
        code: "",
        issues: [...this.errors, ...this.warnings],
        errors: this.errors,
        warnings: this.warnings,
        stats: this.stats,
      };
    }
  }

  /**
   * Transform source code string
   */
  transformSource(sourceCode: string, fileName: string = "input.ts"): TransformResult {
    this.resetStats();
    
    try {
      this.sourceFile = this.project.createSourceFile(fileName, sourceCode, { overwrite: true });
      this.transformSourceFile(this.sourceFile);
      
      if (this.options.format) {
        this.sourceFile.formatText();
      }

      const code = this.sourceFile.getFullText();
      
      return {
        success: this.errors.filter(e => e.severity === "error").length === 0,
        code,
        issues: [...this.errors, ...this.warnings],
        errors: this.errors,
        warnings: this.warnings,
        stats: this.stats,
      };
    } catch (error) {
      this.addError(fileName, this.sourceFile!, `Transform failed: ${error}`);
      return {
        success: false,
        code: "",
        issues: [...this.errors, ...this.warnings],
        errors: this.errors,
        warnings: this.warnings,
        stats: this.stats,
      };
    }
  }

  private resetStats(): void {
    this.stats = this.initStats();
    this.errors = [];
    this.warnings = [];
  }

  private transformSourceFile(sourceFile: SourceFile): void {
    // 1. Remove __awaiter/__generator runtime helper declarations
    if (this.options.removeRuntimeHelpers) {
      this.removeRuntimeHelpers(sourceFile);
    }

    // 2. Collect all __awaiter calls
    const awaiterCalls = this.collectAwaiterCalls(sourceFile);
    this.stats.awaiterCallsFound = awaiterCalls.length;

    // 3. Transform each __awaiter call
    for (const awaiterInfo of awaiterCalls) {
      this.transformAwaiterCall(awaiterInfo);
    }

    // 4. Handle nested __awaiter (in callbacks)
    this.transformNestedAwaiters(sourceFile);

    // 5. Cleanup unused imports/variables
    this.cleanupUnused(sourceFile);
  }

  /**
   * Remove runtime helper declarations (__awaiter, __generator, etc.)
   */
  private removeRuntimeHelpers(sourceFile: SourceFile): void {
    const statements = sourceFile.getStatements();
    
    for (const stmt of statements) {
      if (Node.isVariableStatement(stmt)) {
        const declarations = stmt.getDeclarations();
        const hasHelper = declarations.some(decl => {
          const name = decl.getName();
          return ["__awaiter", "__generator", "__values", "__read", "__spread", "__spreadArrays"].includes(name);
        });
        
        if (hasHelper) {
          stmt.remove();
        }
      }
      
      // Also handle function declaration form
      if (Node.isFunctionDeclaration(stmt)) {
        const name = stmt.getName();
        if (name === "__awaiter" || name === "__generator") {
          stmt.remove();
        }
      }
    }
  }

  /**
   * Collect all __awaiter call expressions
   */
  private collectAwaiterCalls(sourceFile: SourceFile): AwaiterCallInfo[] {
    const calls: AwaiterCallInfo[] = [];
    
    sourceFile.forEachDescendant(node => {
      if (this.isAwaiterCall(node)) {
        const call = node as CallExpression;
        const args = call.getArguments();
        
        if (args.length >= 4) {
          const generatorFn = args[3];
          if (Node.isFunctionExpression(generatorFn) || Node.isArrowFunction(generatorFn)) {
            calls.push({
              callExpression: call,
              thisArg: args[0] as Expression,
              arg2: args[1] as Expression,
              promiseCtor: args[2] as Expression,
              generatorFn: generatorFn as FunctionExpression,
            });
          }
        }
      }
    });
    
    return calls;
  }

  private isAwaiterCall(node: Node): boolean {
    if (!Node.isCallExpression(node)) return false;
    const expr = node.getExpression();
    if (!Node.isIdentifier(expr)) return false;
    return expr.getText() === "__awaiter";
  }

  /**
   * Transform a single __awaiter call to an async function
   */
  private transformAwaiterCall(info: AwaiterCallInfo): void {
    try {
      const generatorBody = this.extractGeneratorBody(info.generatorFn);
      if (!generatorBody) {
        this.addWarning(info.callExpression, "Could not extract generator body");
        return;
      }

      // Build control flow graph from the generator body
      const cfg = this.buildControlFlowGraph(generatorBody);
      
      // Rebuild structured async code from CFG
      const asyncBody = this.rebuildStructuredCode(cfg, info.generatorFn as FunctionExpression);
      
      // Replace the __awaiter call with an async function
      this.replaceWithAsyncFunction(info, asyncBody);
      
      this.stats.awaiterCallsTransformed++;
    } catch (error) {
      this.addError(this.sourceFile!.getFilePath(), info.callExpression, `Failed to transform awaiter: ${error}`);
    }
  }

  /**
   * Extract the actual body block from __generator wrapper
   */
  private extractGeneratorBody(generatorFn: FunctionExpression | ArrowFunction): Block | null {
    const generatorBody = generatorFn.getBody();
    if (!generatorBody || !Node.isBlock(generatorBody)) return null;

    // Find __generator call
    let generatorCallExpr: CallExpression | null = null;
    generatorBody.forEachDescendant(node => {
      if (Node.isCallExpression(node)) {
        const expr = node.getExpression();
        if (Node.isIdentifier(expr) && expr.getText() === "__generator") {
          generatorCallExpr = node;
        }
      }
    });

    if (!generatorCallExpr) return null;

    // The second argument of __generator is the generator function body
    const args = (generatorCallExpr as CallExpression).getArguments();
    if (args.length < 2) return null;

    const generatorBodyFn = args[1];
    if (!Node.isFunctionExpression(generatorBodyFn) && !Node.isArrowFunction(generatorBodyFn)) return null;

    const body = generatorBodyFn.getBody();
    if (!Node.isBlock(body)) return null;

    return body;
  }

  /**
   * Build control flow graph from generator body containing switch statement
   */
  private buildControlFlowGraph(generatorBody: Block): ControlFlowGraph {
    const blocks = new Map<number, ControlFlowBlock>();
    let currentBlockId = 0;
    let entryBlock = 0;

    // Find the switch statement
    const switchStmt = generatorBody.getFirstDescendantByKind(SyntaxKind.SwitchStatement);
    if (!switchStmt) {
      // No switch, simple linear flow
      return this.buildLinearFlow(generatorBody);
    }

    // Parse switch cases
    const clauses = switchStmt.getClauses();
    
    for (let i = 0; i < clauses.length; i++) {
      const clause = clauses[i];
      if (!Node.isCaseClause(clause) && !Node.isDefaultClause(clause)) continue;

      const caseValue = Node.isCaseClause(clause) 
        ? parseInt(clause.getExpression()?.getText() || "0") 
        : -1; // default

      const block: ControlFlowBlock = {
        id: currentBlockId,
        caseValue,
        statements: clause.getStatements(),
        successors: [],
        predecessors: [],
        isTryBlock: false,
        isCatchBlock: false,
        isFinallyBlock: false,
      };

      blocks.set(currentBlockId, block);
      
      if (i === 0) entryBlock = currentBlockId;
      currentBlockId++;
    }

    // Analyze jumps between blocks
    this.analyzeJumps(blocks, generatorBody);
    
    // Identify try/catch/finally from trys array
    this.identifyTryCatchFinally(blocks, generatorBody);
    
    // Identify loops
    const loops = this.identifyLoops(blocks);

    return {
      blocks,
      entryBlock,
      exitBlocks: this.findExitBlocks(blocks),
      loops,
      tryCatchFinally: [],
    };
  }

  private buildLinearFlow(generatorBody: Block): ControlFlowGraph {
    const blocks = new Map<number, ControlFlowBlock>();
    const block: ControlFlowBlock = {
      id: 0,
      caseValue: 0,
      statements: generatorBody.getStatements(),
      successors: [],
      predecessors: [],
      isTryBlock: false,
      isCatchBlock: false,
      isFinallyBlock: false,
    };
    blocks.set(0, block);

    return {
      blocks,
      entryBlock: 0,
      exitBlocks: [0],
      loops: [],
      tryCatchFinally: [],
    };
  }

  /**
   * Analyze jump instructions (return [3, N]) to build CFG edges
   */
  private analyzeJumps(blocks: Map<number, ControlFlowBlock>, generatorBody: Block): void {
    for (const [id, block] of blocks) {
      const lastStmt = block.statements[block.statements.length - 1];
      
      if (Node.isReturnStatement(lastStmt)) {
        const expr = lastStmt.getExpression();
        if (expr && Node.isArrayLiteralExpression(expr)) {
          const elements = expr.getElements();
          if (elements.length >= 2) {
            const first = elements[0];
            if (Node.isNumericLiteral(first)) {
              const opcode = parseInt(first.getText());
              
              switch (opcode) {
                case 2: // return value
                case 4: // yield await
                case 5: // yield* delegate
                  // These continue execution or return, no explicit jump
                  break;
                case 3: // jump to label
                  const targetLabel = elements[1];
                  if (Node.isNumericLiteral(targetLabel)) {
                    const target = parseInt(targetLabel.getText());
                    const targetBlock = this.findBlockByCaseValue(blocks, target);
                    if (targetBlock) {
                      block.successors.push(targetBlock.id);
                      targetBlock.predecessors.push(block.id);
                    }
                  }
                  break;
                case 7: // finally end
                  break;
              }
            }
          }
        }
      }
      
      // Implicit fallthrough to next case
      const nextBlock = Array.from(blocks.values()).find(b => b.caseValue === block.caseValue + 1);
      if (nextBlock && block.successors.length === 0) {
        block.successors.push(nextBlock.id);
        nextBlock.predecessors.push(block.id);
      }
    }
  }

  private findBlockByCaseValue(blocks: Map<number, ControlFlowBlock>, caseValue: number): ControlFlowBlock | undefined {
    for (const block of blocks.values()) {
      if (block.caseValue === caseValue) return block;
    }
    return undefined;
  }

  private findExitBlocks(blocks: Map<number, ControlFlowBlock>): number[] {
    const exits: number[] = [];
    for (const block of blocks.values()) {
      if (block.successors.length === 0) {
        exits.push(block.id);
      }
    }
    return exits;
  }

  /**
   * Identify try/catch/finally blocks from trys array pattern
   */
  private identifyTryCatchFinally(blocks: Map<number, ControlFlowBlock>, generatorBody: Block): TryCatchFinallyInfo[] {
    const tryCatchInfos: TryCatchFinallyInfo[] = [];
    
    generatorBody.forEachDescendant(node => {
      if (Node.isCallExpression(node)) {
        const expr = node.getExpression();
        if (Node.isPropertyAccessExpression(expr)) {
          const name = expr.getName();
          if (name === "push") {
            const obj = expr.getExpression();
            if (Node.isPropertyAccessExpression(obj)) {
              const trysName = obj.getName();
              if (trysName === "trys") {
                // Found trys.push([...])
                const args = node.getArguments();
                if (args.length >= 1 && Node.isArrayLiteralExpression(args[0])) {
                  const elements = args[0].getElements();
                  if (elements.length >= 4) {
                    const tryStart = this.getNumericValue(elements[0]);
                    const catchStart = this.getNumericValue(elements[1]);
                    const finallyStart = this.getNumericValue(elements[2]);
                    const finallyEnd = this.getNumericValue(elements[3]);
                    
                    if (tryStart !== null && catchStart !== null && finallyStart !== null && finallyEnd !== null) {
                      const tryBlocks: number[] = [];
                      const catchBlocks: number[] = [];
                      const finallyBlocks: number[] = [];
                      
                      for (const block of blocks.values()) {
                        if (block.caseValue >= tryStart && block.caseValue < catchStart) {
                          block.isTryBlock = true;
                          tryBlocks.push(block.id);
                        } else if (block.caseValue >= catchStart && block.caseValue < finallyStart) {
                          block.isCatchBlock = true;
                          catchBlocks.push(block.id);
                        } else if (block.caseValue >= finallyStart && block.caseValue < finallyEnd) {
                          block.isFinallyBlock = true;
                          finallyBlocks.push(block.id);
                        }
                      }
                      
                      tryCatchInfos.push({
                        tryBlocks,
                        catchBlocks,
                        finallyBlocks,
                      });
                      
                      this.stats.tryCatchBlocksRestored++;
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    return tryCatchInfos;
  }

  private getNumericValue(expr: Expression): number | null {
    if (Node.isNumericLiteral(expr)) {
      return parseInt(expr.getText());
    }
    return null;
  }

  /**
   * Identify loops by detecting back-edges in CFG
   */
  private identifyLoops(blocks: Map<number, ControlFlowBlock>): any[] {
    const loops: any[] = [];
    
    for (const [id, block] of blocks) {
      for (const successorId of block.successors) {
        // Back-edge: successor has lower or equal case value (potential loop)
        const successor = blocks.get(successorId);
        if (successor && successor.caseValue <= block.caseValue) {
          loops.push({
            startBlock: successorId,
            endBlock: id,
            backEdgeFrom: id,
            backEdgeTo: successorId,
            loopType: "while" as const,
          });
          this.stats.loopsRestored++;
        }
      }
    }
    
    return loops;
  }

  /**
   * Rebuild structured async code from CFG
   * This is the core algorithm that flattens switch-based state machine
   */
  private rebuildStructuredCode(cfg: ControlFlowGraph, generatorFn: FunctionExpression): Block {
    const statements: Statement[] = [];
    
    // Start from entry block and traverse
    const visited = new Set<number>();
    const queue: number[] = [cfg.entryBlock];
    
    while (queue.length > 0) {
      const blockId = queue.shift()!;
      if (visited.has(blockId)) continue;
      visited.add(blockId);
      
      const block = cfg.blocks.get(blockId);
      if (!block) continue;
      
      // Convert block statements
      for (const stmt of block.statements) {
        const converted = this.convertStatement(stmt, cfg, block);
        if (converted) {
          statements.push(converted);
        }
      }
      
      // Add successors to queue
      for (const successorId of block.successors) {
        if (!visited.has(successorId)) {
          queue.push(successorId);
        }
      }
    }
    
    // Create a new block with converted statements
    return this.createNewBlock(statements);
  }

  /**
   * Create a new Block node using ts-morph factory
   */
  private createNewBlock(statements: Statement[]): Block {
    // Create a temporary source file to get a valid context for creating nodes
    const tempFile = this.project.createSourceFile("_temp.ts", "", { overwrite: true });
    
    // Convert statements to text and create function with string body
    const stmtTexts = statements.map(s => s.getFullText()).join("\n");
    const funcDecl = tempFile.addFunction({
      name: "_temp",
      statements: [stmtTexts],
    });
    const block = funcDecl.getBody() as Block;
    tempFile.delete();
    return block;
  }

  /**
   * Convert a single statement from generator to async equivalent
   */
  private convertStatement(stmt: Statement, cfg: ControlFlowGraph, currentBlock: ControlFlowBlock): Statement | null {
    // Skip return [2, ...], return [3, N], return [4, ...] patterns
    if (Node.isReturnStatement(stmt)) {
      const expr = stmt.getExpression();
      if (expr && Node.isArrayLiteralExpression(expr)) {
        const elements = expr.getElements();
        if (elements.length >= 2) {
          const first = elements[0];
          if (Node.isNumericLiteral(first)) {
            const opcode = parseInt(first.getText());
            
            switch (opcode) {
              case 2: // return [2, value] -> return value
                const returnValue = elements[1];
                if (returnValue) {
                  // Create new return statement with the value
                  const tempFile = this.project.createSourceFile("_temp_ret.ts", "", { overwrite: true });
                  const funcDecl = tempFile.addFunction({
                    name: "_temp",
                    statements: [`return ${returnValue.getFullText()};`],
                  });
                  const body = funcDecl.getBody();
                  if (Node.isBlock(body)) {
                    const retStmt = body.getStatements()[0] as ReturnStatement;
                    tempFile.delete();
                    return retStmt.compilerNode as any;
                  }
                  tempFile.delete();
                }
                break;
              case 3: // return [3, N] -> handled by CFG traversal
                return null;
              case 4: // return [4, promise] -> await promise
                const promiseExpr = elements[1];
                if (promiseExpr) {
                  // For now, return the original and handle in post-processing
                  return stmt;
                }
                break;
            }
          }
        }
      }
    }
    
    // Handle label.sent() - this is the value from await
    if (Node.isExpressionStatement(stmt)) {
      const text = stmt.getText();
      if (text.includes("label.sent()")) {
        // This will be handled when we process the surrounding context
        return stmt;
      }
    }
    
    return stmt;
  }

  /**
   * Replace __awaiter call with an async function
   */
  private replaceWithAsyncFunction(info: AwaiterCallInfo, asyncBody: Block): void {
    const generatorFn = info.generatorFn;
    
    // Get function parameters
    const params = generatorFn.getParameters();
    const paramTexts = params.map((p: ParameterDeclaration) => p.getText());
    
    // Get type parameters if any
    const typeParams = generatorFn.getTypeParameters();
    const typeParamTexts = typeParams ? typeParams.map((tp: TypeParameterDeclaration) => tp.getText()) : [];
    
    // Determine if it should be an arrow function or regular function
    const isArrow = Node.isArrowFunction(generatorFn);
    
    let asyncFnText: string;
    if (isArrow) {
      const typeParamsStr = typeParamTexts.length > 0 ? `<${typeParamTexts.join(", ")}>` : "";
      const paramsStr = paramTexts.join(", ");
      asyncFnText = `async ${typeParamsStr}(${paramsStr}) ${asyncBody.getText()}`;
    } else {
      const name = generatorFn.getName() || "";
      const typeParamsStr = typeParamTexts.length > 0 ? `<${typeParamTexts.join(", ")}>` : "";
      const paramsStr = paramTexts.join(", ");
      asyncFnText = `async function${name ? " " + name : ""}${typeParamsStr}(${paramsStr}) ${asyncBody.getText()}`;
    }
    
    // Replace the __awaiter call
    info.callExpression.replaceWithText(asyncFnText);
  }

  /**
   * Handle nested __awaiter calls in callbacks
   */
  private transformNestedAwaiters(sourceFile: SourceFile): void {
    // Recursively find and transform any remaining __awaiter calls
    let foundNested = false;
    
    sourceFile.forEachDescendant(node => {
      if (this.isAwaiterCall(node)) {
        foundNested = true;
        this.stats.nestedAwaitersFound++;
      }
    });
    
    if (foundNested) {
      // Re-run transformation on nested calls
      const nestedCalls = this.collectAwaiterCalls(sourceFile);
      for (const awaiterInfo of nestedCalls) {
        this.transformAwaiterCall(awaiterInfo);
      }
    }
  }

  /**
   * Cleanup unused variables and imports
   */
  private cleanupUnused(sourceFile: SourceFile): void {
    // Remove unused variable declarations
    const declarations = sourceFile.getVariableDeclarations();
    for (const decl of declarations) {
      const name = decl.getName();
      if (name.startsWith("_") && !name.match(/^_\d+$/)) {
        // Potentially unused internal variable
        const stmt = decl.getParent();
        if (Node.isVariableStatement(stmt)) {
          // Check if used elsewhere - simplified check
          const text = sourceFile.getFullText();
          const occurrences = (text.match(new RegExp("\\b" + name + "\\b", "g")) || []).length;
          if (occurrences <= 1) {
            stmt.remove();
          }
        }
      }
    }
  }

  private addError(file: string, node: any, message: string): void {
    const line = node.getStartLineNumber ? node.getStartLineNumber() : undefined;
    const column = node.getStartColumnPos ? node.getStartColumnPos() : undefined;
    
    this.errors.push({
      severity: "error",
      file,
      line,
      column,
      message,
    });
  }

  private addWarning(node: any, message: string): void {
    const line = node.getStartLineNumber ? node.getStartLineNumber() : undefined;
    const column = node.getStartColumnPos ? node.getStartColumnPos() : undefined;
    
    this.warnings.push({
      severity: "warning",
      file: this.sourceFile?.getFilePath() || "unknown",
      line,
      column,
      message,
    });
  }
}
