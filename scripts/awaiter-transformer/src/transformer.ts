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
  LoopInfo, 
  TryCatchFinallyInfo, 
  VariableScopeInfo 
} from "./types";

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
    };

    this.stats = this.initStats();
    this.errors = [];
    this.warnings = [];
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
      conditionalsRestored: 0,
    };
  }

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
        errors: this.errors,
        warnings: this.warnings,
        stats: this.stats,
      };
    } catch (error) {
      this.addError(filePath, this.sourceFile!, `Transform failed: ${error}`);
      return {
        success: false,
        code: "",
        errors: this.errors,
        warnings: this.warnings,
        stats: this.stats,
      };
    }
  }

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
        errors: this.errors,
        warnings: this.warnings,
        stats: this.stats,
      };
    } catch (error) {
      this.addError(fileName, this.sourceFile!, `Transform failed: ${error}`);
      return {
        success: false,
        code: "",
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
    // 1. 移除 __awaiter/__generator 运行时辅助函数声明
    if (this.options.removeRuntimeHelpers) {
      this.removeRuntimeHelpers(sourceFile);
    }

    // 2. 收集所有 __awaiter 调用
    const awaiterCalls = this.collectAwaiterCalls(sourceFile);
    this.stats.awaiterCallsFound = awaiterCalls.length;

    // 3. 转换每个 __awaiter 调用
    for (const awaiterInfo of awaiterCalls) {
      this.transformAwaiterCall(awaiterInfo);
    }

    // 4. 处理嵌套的 __awaiter (在回调中)
    this.transformNestedAwaiters(sourceFile);

    // 5. 清理未使用的导入/变量
    this.cleanupUnused(sourceFile);
  }

  private removeRuntimeHelpers(sourceFile: SourceFile): void {
    const statements = sourceFile.getStatements();
    
    for (const stmt of statements) {
      if (Node.isVariableStatement(stmt)) {
        const declarations = stmt.getDeclarations();
        const hasAwaiterOrGenerator = declarations.some(decl => {
          const name = decl.getName();
          return name === "__awaiter" || name === "__generator" || name === "__values" || name === "__read" || name === "__spread" || name === "__spreadArrays";
        });
        
        if (hasAwaiterOrGenerator) {
          stmt.remove();
        }
      }
      
      // 也处理函数声明形式的运行时辅助
      if (Node.isFunctionDeclaration(stmt)) {
        const name = stmt.getName();
        if (name === "__awaiter" || name === "__generator") {
          stmt.remove();
        }
      }
    }
  }

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

  private transformAwaiterCall(info: AwaiterCallInfo): void {
    try {
      const generatorBody = this.extractGeneratorBody(info.generatorFn);
      if (!generatorBody) {
        this.addWarning(info.callExpression, "Could not extract generator body");
        return;
      }

      // 分析控制流图
      const cfg = this.buildControlFlowGraph(generatorBody);
      
      // 重建结构化代码
      const asyncBody = this.rebuildStructuredCode(cfg, info.generatorFn);
      
      // 创建 async 函数表达式替换 __awaiter 调用
      this.replaceWithAsyncFunction(info, asyncBody);
      
      this.stats.awaiterCallsTransformed++;
    } catch (error) {
      this.addError(this.sourceFile!.getFilePath(), info.callExpression, `Failed to transform awaiter: ${error}`);
    }
  }

  private extractGeneratorBody(generatorFn: FunctionExpression): Block | null {
    const generatorBody = generatorFn.getBody();
    if (!generatorBody || !Node.isBlock(generatorBody)) return null;

    // 查找 __generator 调用
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

    // __generator 的第二个参数是生成器函数体
    const args = generatorCallExpr.getArguments();
    if (args.length < 2) return null;

    const generatorBodyFn = args[1];
    if (!Node.isFunctionExpression(generatorBodyFn) && !Node.isArrowFunction(generatorBodyFn)) return null;

    const body = generatorBodyFn.getBody();
    if (!Node.isBlock(body)) return null;

    return body;
  }

  private buildControlFlowGraph(generatorBody: Block): ControlFlowGraph {
    const blocks = new Map<number, ControlFlowBlock>();
    let currentBlockId = 0;
    let entryBlock = 0;

    // 查找 switch 语句
    const switchStmt = generatorBody.getFirstDescendantByKind(SyntaxKind.SwitchStatement);
    if (!switchStmt) {
      // 没有 switch，简单线性流程
      return this.buildLinearFlow(generatorBody);
    }

    // 解析 switch cases
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

    // 分析每个块的跳转目标
    this.analyzeJumps(blocks, generatorBody);
    
    // 识别 try/catch/finally (从 trys 数组)
    this.identifyTryCatchFinally(blocks, generatorBody);
    
    // 识别循环
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
                  // 这些会继续执行或返回，不显式跳转
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
      
      // 隐式落穿到下一个 case
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

  private identifyTryCatchFinally(blocks: Map<number, ControlFlowBlock>, generatorBody: Block): TryCatchFinallyInfo[] {
    // 查找 trys 数组 - 通常在 generator 函数开头
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
                // 找到了 trys.push([...])
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

  private identifyLoops(blocks: Map<number, ControlFlowBlock>): LoopInfo[] {
    const loops: LoopInfo[] = [];
    
    // 简单的回边检测：如果一个块的后继包含其前驱，则可能是循环
    for (const block of blocks.values()) {
      for (const succId of block.successors) {
        const succ = blocks.get(succId);
        if (succ && succ.predecessors.includes(block.id)) {
          // 检查是否已识别
          const existing = loops.find(l => l.header === succId);
          if (!existing) {
            loops.push({
              header: succId,
              body: [block.id],
              latch: [block.id],
              type: "while",
            });
            
            this.stats.loopsRestored++;
          }
        }
      }
    }
    
    return loops;
  }

  private rebuildStructuredCode(cfg: ControlFlowGraph, generatorFn: FunctionExpression): Block {
    // 这里实现核心的控制流重建逻辑
    // 为简化起见，先实现基本的线性转换
    const statements: Statement[] = [];
    
    // 遍历 CFG 按拓扑序生成代码
    const visited = new Set<number>();
    const order = this.topologicalSort(cfg);
    
    for (const blockId of order) {
      if (visited.has(blockId)) continue;
      visited.add(blockId);
      
      const block = cfg.blocks.get(blockId);
      if (!block) continue;
      
      // 转换块内语句
      for (const stmt of block.statements) {
        const transformed = this.transformStatement(stmt, cfg);
        if (transformed) {
          statements.push(transformed);
        }
      }
    }
    
    // 创建新的块
    const newBlock = this.sourceFile!.createBlock(statements, { 
      isAmbient: false 
    });
    
    return newBlock;
  }

  private topologicalSort(cfg: ControlFlowGraph): number[] {
    const visited = new Set<number>();
    const result: number[] = [];
    
    const visit = (blockId: number) => {
      if (visited.has(blockId)) return;
      visited.add(blockId);
      
      const block = cfg.blocks.get(blockId);
      if (!block) return;
      
      for (const succId of block.successors) {
        visit(succId);
      }
      
      result.push(blockId);
    };
    
    visit(cfg.entryBlock);
    return result.reverse();
  }

  private transformStatement(stmt: Statement, cfg: ControlFlowGraph): Statement | null {
    // 处理 return [opcode, ...] 语句
    if (Node.isReturnStatement(stmt)) {
      const expr = stmt.getExpression();
      if (expr && Node.isArrayLiteralExpression(expr)) {
        return this.transformReturnArray(expr);
      }
    }
    
    // 处理 label.trys.push([...]) 等运行时调用
    if (Node.isExpressionStatement(stmt)) {
      const expr = stmt.getExpression();
      if (this.isRuntimeHelperCall(expr)) {
        return null; // 移除运行时辅助调用
      }
    }
    
    // 递归处理子节点
    return stmt;
  }

  private isRuntimeHelperCall(expr: Expression): boolean {
    if (Node.isCallExpression(expr)) {
      const calledExpr = expr.getExpression();
      if (Node.isPropertyAccessExpression(calledExpr)) {
        const name = calledExpr.getName();
        const obj = calledExpr.getExpression();
        if (Node.isIdentifier(obj)) {
          const objName = obj.getText();
          if (objName === "label" || objName === "_" || objName === "l") {
            return name === "push" || name === "pop" || name === "sent";
          }
        }
      }
    }
    return false;
  }

  private transformReturnArray(arrayExpr: ArrayLiteralExpression): Statement | null {
    const elements = arrayExpr.getElements();
    if (elements.length === 0) return null;
    
    const first = elements[0];
    if (!Node.isNumericLiteral(first)) return null;
    
    const opcode = parseInt(first.getText());
    
    switch (opcode) {
      case 2: // return value
        if (elements.length >= 2) {
          const value = elements[1];
          return this.sourceFile!.createReturnStatement(value.getText());
        }
        return this.sourceFile!.createReturnStatement();
        
      case 3: // jump (continue/break/label)
        // 这里需要更复杂的上下文分析来决定是 continue、break 还是 goto
        // 暂时作为注释保留
        return this.sourceFile!.createStatement(`// jump to label ${elements[1]?.getText() || "?"}`);
        
      case 4: // yield await
        if (elements.length >= 2) {
          const awaited = elements[1];
          // 这是 await 表达式，需要包装在赋值或表达式中
          const awaitExpr = this.sourceFile!.createAwaitExpression(awaited.getText());
          return this.sourceFile!.createExpressionStatement(awaitExpr.getText());
        }
        return null;
        
      case 5: // yield* delegate
        return null;
        
      case 7: // finally end
        return null;
        
      default:
        return null;
    }
  }

  private replaceWithAsyncFunction(info: AwaiterCallInfo, asyncBody: Block): void {
    const callExpr = info.callExpression;
    const generatorFn = info.generatorFn;
    
    // 构建 async 函数表达式
    const params = generatorFn.getParameters();
    const paramTexts = params.map(p => p.getText()).join(", ");
    const typeParams = generatorFn.getTypeParameters()?.map(tp => tp.getText()).join(", ") || "";
    const typeParamText = typeParams ? `<${typeParams}>` : "";
    
    const asyncFnText = `async function${typeParamText}(${paramTexts}) ${asyncBody.getText()}`;
    
    callExpr.replaceWithText(asyncFnText);
  }

  private transformNestedAwaiters(sourceFile: SourceFile): void {
    // 查找所有函数表达式/箭头函数中的 __awaiter 调用
    sourceFile.forEachDescendant(node => {
      if (Node.isFunctionExpression(node) || Node.isArrowFunction(node)) {
        const body = node.getBody();
        if (Node.isBlock(body)) {
          body.forEachDescendant(innerNode => {
            if (this.isAwaiterCall(innerNode)) {
              this.stats.nestedAwaitersFound++;
              const call = innerNode as CallExpression;
              const args = call.getArguments();
              if (args.length >= 4) {
                const generatorFn = args[3];
                if (Node.isFunctionExpression(generatorFn) || Node.isArrowFunction(generatorFn)) {
                  const generatorBody = this.extractGeneratorBody(generatorFn as FunctionExpression);
                  if (generatorBody) {
                    const cfg = this.buildControlFlowGraph(generatorBody);
                    const asyncBody = this.rebuildStructuredCode(cfg, generatorFn as FunctionExpression);
                    this.replaceWithAsyncFunction({
                      callExpression: call,
                      thisArg: args[0] as Expression,
                      arg2: args[1] as Expression,
                      promiseCtor: args[2] as Expression,
                      generatorFn: generatorFn as FunctionExpression,
                    }, asyncBody);
                  }
                }
              }
            }
          });
        }
      }
    });
  }

  private cleanupUnused(sourceFile: SourceFile): void {
    // 移除未使用的 label 变量声明
    // 通常形如: var label = this; 或 var _ = this;
    const statements = sourceFile.getStatements();
    
    for (const stmt of statements) {
      if (Node.isVariableStatement(stmt)) {
        const declarations = stmt.getDeclarations();
        for (const decl of declarations) {
          const name = decl.getName();
          if ((name === "label" || name === "_" || name === "__") && decl.getInitializer()?.getText() === "this") {
            // 检查是否被使用
            const usages = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)
              .filter(id => id.getText() === name && id.getParent() !== decl);
            
            if (usages.length === 0) {
              if (declarations.length === 1) {
                stmt.remove();
              } else {
                decl.remove();
              }
            }
          }
        }
      }
    }
  }

  private addError(file: string, node: Node, message: string): void {
    this.errors.push({
      file,
      node,
      message,
      severity: "error",
    });
  }

  private addWarning(node: Node, message: string): void {
    this.warnings.push({
      file: this.sourceFile?.getFilePath() || "unknown",
      node,
      message,
    });
  }

  getProject(): Project {
    return this.project;
  }
}