/**
 * Type definitions for the awaiter transformer
 */

export interface TransformOptions {
  /**
   * Target ECMAScript version for output
   * @default "ES2020"
   */
  target?: "ES2017" | "ES2018" | "ES2019" | "ES2020" | "ES2021" | "ES2022" | "ESNext";
  
  /**
   * Preserve original variable names (var -> var instead of const/let)
   * @default false
   */
  preserveVariableNames?: boolean;
  
  /**
   * Enable semantic renaming of variables based on usage patterns
   * @default true
   */
  semanticRenaming?: boolean;
  
  /**
   * Remove __awaiter/__generator runtime helper declarations
   * @default true
   */
  removeRuntimeHelpers?: boolean;
  
  /**
   * Format output code using built-in formatter
   * @default true
   */
  format?: boolean;
  
  /**
   * Allow fallback machine dispatch for complex cases
   * @default true
   */
  allowDispatchFallback?: boolean;
}

export interface TransformResult {
  success: boolean;
  code: string;
  issues: TransformIssue[];
  errors: TransformError[];
  warnings: TransformWarning[];
  stats: TransformStats;
}

export type TransformIssue = TransformError | TransformWarning;

export interface TransformError {
  severity: "error";
  file: string;
  line?: number;
  column?: number;
  message: string;
}

export interface TransformWarning {
  severity: "warning";
  file: string;
  line?: number;
  column?: number;
  message: string;
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

export interface AwaiterCallInfo {
  callExpression: any; // CallExpression from ts-morph
  thisArg: any; // Expression
  arg2: any; // Expression (usually void 0)
  promiseCtor: any; // Expression (usually Promise or void 0)
  generatorFn: any; // FunctionExpression or ArrowFunction
}

export interface GeneratorInfo {
  functionNode: any; // FunctionExpression
  bodyBlock: any; // Block
  switchStatement?: any; // SwitchStatement
  trysArray?: any; // Array literal for exception handling
}

export interface ControlFlowGraph {
  blocks: Map<number, ControlFlowBlock>;
  entryBlock: number;
  exitBlocks: number[];
  loops: LoopInfo[];
  tryCatchFinally: TryCatchFinallyInfo[];
}

export interface ControlFlowBlock {
  id: number;
  caseValue: number;
  statements: any[]; // Statement[]
  successors: number[];
  predecessors: number[];
  isTryBlock: boolean;
  isCatchBlock: boolean;
  isFinallyBlock: boolean;
}

export interface LoopInfo {
  startBlock: number;
  endBlock: number;
  backEdgeFrom: number;
  backEdgeTo: number;
  loopType: "for" | "while" | "do-while";
}

export interface TryCatchFinallyInfo {
  tryBlocks: number[];
  catchBlocks: number[];
  finallyBlocks: number[];
}

export interface VariableScopeInfo {
  name: string;
  declarationBlock?: number;
  firstUseBlock?: number;
  lastUseBlock?: number;
  isCapturedInClosure: boolean;
  suggestedKind: "const" | "let" | "var";
}
