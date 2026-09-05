import { Node, CallExpression, FunctionExpression, ArrowFunction, Expression, Block } from "ts-morph";

export interface TransformOptions {
  /** 输出目标语言版本 */
  target?: "ES2017" | "ES2018" | "ES2019" | "ES2020" | "ES2021" | "ES2022" | "ESNext";
  /** 是否保留原始变量名 (单字母) */
  preserveVariableNames?: boolean;
  /** 是否使用语义重命名 */
  semanticRenaming?: boolean;
  /** 是否移除运行时辅助函数声明 (__awaiter/__generator 等) */
  removeRuntimeHelpers?: boolean;
  /** 是否格式化输出 */
  format?: boolean;
  /** 无法结构化重建时，是否允许退化为内联 while/switch 状态机 (仍使用原生 await) */
  allowDispatchFallback?: boolean;
}

export interface TransformIssue {
  file: string;
  message: string;
  severity: "error" | "warning";
  location?: string;
}

export interface TransformError extends TransformIssue {
  node?: Node;
}

export interface TransformWarning extends TransformIssue {
  node?: Node;
}

export interface TransformStats {
  awaiterCallsFound: number;
  awaiterCallsTransformed: number;
  generatorCallsFound: number;
  generatorCallsTransformed: number;
  nestedAwaitersFound: number;
  tryCatchBlocksRestored: number;
  loopsRestored: number;
  awaitsRestored: number;
  fallbackMachines: number;
}

export interface TransformResult {
  success: boolean;
  code: string;
  issues: TransformIssue[];
  errors: TransformError[];
  warnings: TransformWarning[];
  stats: TransformStats;
}

export interface AwaiterCallInfo {
  callExpression: CallExpression;
  thisArg: Expression;
  arg2: Expression;
  promiseCtor: Expression;
  generatorFn: FunctionExpression | ArrowFunction;
}

export interface GeneratorInfo {
  callExpression: CallExpression;
  thisArg: Expression;
  stateParam: string;
  body: Block;
}

export interface ControlFlowBlock {
  id: number;
  caseValue: number;
  statements: any[];
  successors: number[];
  predecessors: number[];
  isTryBlock: boolean;
  isCatchBlock: boolean;
  isFinallyBlock: boolean;
}

export interface ControlFlowGraph {
  blocks: Map<number, ControlFlowBlock>;
  entryBlock: number;
  exitBlocks: number[];
  loops: LoopInfo[];
  tryCatchFinally: TryCatchFinallyInfo[];
}

export interface LoopInfo {
  header: number;
  body: number[];
  latch: number[];
  type: "while" | "for" | "do-while";
}

export interface TryCatchFinallyInfo {
  tryBlocks: number[];
  catchBlocks: number[];
  finallyBlocks: number[];
}

export interface VariableScopeInfo {
  name: string;
  declarationBlock: number;
  firstUseBlock: number;
  kind: "var" | "let" | "const";
}
