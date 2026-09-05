export interface TransformOptions {
  /** 输出目标语言版本 */
  target?: "ES2017" | "ES2018" | "ES2019" | "ES2020" | "ES2021" | "ES2022" | "ESNext";
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

export interface TransformStats {
  awaiterCallsFound: number;
  awaiterCallsTransformed: number;
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
  stats: TransformStats;
}
