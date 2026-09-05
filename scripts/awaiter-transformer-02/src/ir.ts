/**
 * Intermediate Representation for async/await transformation
 * 
 * This module defines IR nodes that represent the transformed AST
 * before being converted back to TypeScript code.
 */

import { ControlFlowGraph, ControlFlowBlock, TryCatchFinallyInfo, LoopInfo } from "./types";

export interface IRAwaiterFunction {
  kind: "awaiterFunction";
  name?: string;
  parameters: IRParameter[];
  typeParameters?: IRTypeParameter[];
  body: IRAsyncBody;
  isAsync: true;
  thisArg?: string;
}

export interface IRParameter {
  name: string;
  typeAnnotation?: string;
  initializer?: string;
  isOptional: boolean;
}

export interface IRTypeParameter {
  name: string;
  constraint?: string;
  default?: string;
}

export interface IRAsyncBody {
  kind: "asyncBody";
  statements: IRStatement[];
  hasReturn: boolean;
  returnType?: string;
}

export type IRStatement = 
  | IRExpressionStatement
  | IRReturnStatement
  | IRAwaitStatement
  | IRVariableDeclaration
  | IRIfStatement
  | IRForStatement
  | IRWhileStatement
  | IRDoWhileStatement
  | IRSwitchStatement
  | IRBreakStatement
  | IRContinueStatement
  | IRTryStatement
  | IRBlockStatement
  | IRThrowStatement;

export interface IRExpressionStatement {
  kind: "expressionStatement";
  expression: string;
}

export interface IRReturnStatement {
  kind: "returnStatement";
  expression?: string;
}

export interface IRAwaitStatement {
  kind: "awaitStatement";
  expression: string;
  variableName?: string;
}

export interface IRVariableDeclaration {
  kind: "variableDeclaration";
  name: string;
  initializer?: string;
  kind2: "const" | "let" | "var";
}

export interface IRIfStatement {
  kind: "ifStatement";
  condition: string;
  thenBranch: IRStatement[];
  elseBranch?: IRStatement[];
}

export interface IRForStatement {
  kind: "forStatement";
  initializer?: string;
  condition?: string;
  incrementor?: string;
  body: IRStatement[];
}

export interface IRWhileStatement {
  kind: "whileStatement";
  condition: string;
  body: IRStatement[];
}

export interface IRDoWhileStatement {
  kind: "doWhileStatement";
  body: IRStatement[];
  condition: string;
}

export interface IRSwitchStatement {
  kind: "switchStatement";
  discriminant: string;
  cases: IRSwitchCase[];
}

export interface IRSwitchCase {
  test?: string; // undefined for default case
  consequent: IRStatement[];
}

export interface IRBreakStatement {
  kind: "breakStatement";
  label?: string;
}

export interface IRContinueStatement {
  kind: "continueStatement";
  label?: string;
}

export interface IRTryStatement {
  kind: "tryStatement";
  block: IRStatement[];
  handler?: {
    param: string;
    body: IRStatement[];
  };
  finalizer?: IRStatement[];
}

export interface IRBlockStatement {
  kind: "blockStatement";
  statements: IRStatement[];
}

export interface IRThrowStatement {
  kind: "throwStatement";
  argument: string;
}

/**
 * Converts a ControlFlowGraph to IR statements
 */
export function cfgToIR(cfg: ControlFlowGraph): IRStatement[] {
  const statements: IRStatement[] = [];
  
  // Start from entry block and traverse
  const visited = new Set<number>();
  const queue: number[] = [cfg.entryBlock];
  
  while (queue.length > 0) {
    const blockId = queue.shift()!;
    if (visited.has(blockId)) continue;
    visited.add(blockId);
    
    const block = cfg.blocks.get(blockId);
    if (!block) continue;
    
    // Convert block statements to IR
    for (const stmt of block.statements) {
      const irStmt = statementToIR(stmt);
      if (irStmt) {
        statements.push(irStmt);
      }
    }
    
    // Add successors to queue
    for (const successorId of block.successors) {
      if (!visited.has(successorId)) {
        queue.push(successorId);
      }
    }
  }
  
  return statements;
}

function statementToIR(stmt: any): IRStatement | null {
  // Placeholder - actual implementation will convert ts-morph nodes to IR
  return {
    kind: "expressionStatement",
    expression: stmt.getText ? stmt.getText() : String(stmt),
  };
}
