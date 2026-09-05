import {
  Node,
  Statement,
  Expression,
  Block,
  FunctionExpression,
  ArrowFunction,
  CallExpression,
  ArrayLiteralExpression,
  SyntaxKind,
  CaseClause,
  DefaultClause,
} from "ts-morph";

/** 终结符: 状态机 case 的控制转移 */
export type Term =
  | { kind: "return"; value?: string }
  | { kind: "goto"; target: number }
  | { kind: "await"; expr: string }
  | { kind: "delegate"; expr: string }
  | { kind: "endfinally" }
  | { kind: "next" }; // 落入下一个 case

export interface BranchArm {
  /** 分支内的副作用语句文本 */
  pre: string[];
  term: AnyTerm;
}

export interface BranchTerm {
  kind: "branch";
  cond: string;
  then: BranchArm;
  else: BranchArm;
}

export type AnyTerm = Term | BranchTerm;

export interface TryRegion {
  tryStart: number;
  catchStart?: number;
  finallyStart?: number;
  follow: number;
}

export interface CaseIR {
  label: number;
  /** 普通语句 (不含 state.label= / trys.push / 尾部终结语句) */
  stmts: Statement[];
  /** 尾部控制结构 */
  term: AnyTerm;
  /** 语句中间内嵌的跳转目标 (用于 CFG 构建) */
  embeddedGotos: number[];
  /** 该 case 是否以 throw 结束 (最后一个语句是 throw) */
  endsWithThrow: boolean;
}

export interface MachineIR {
  cases: Map<number, CaseIR>;
  labels: number[];
  regions: TryRegion[];
  stateParam: string;
  /** 生成器函数顶层的变量声明文本 (需要保留) */
  hoisted: string[];
}

export class Unsupported extends Error {
  constructor(message: string) {
    super(message);
  }
}

/** 从 __awaiter 的第4个参数 (函数表达式) 中提取机器体 */
export function parseAwaiterInner(
  innerFn: FunctionExpression | ArrowFunction
): { machineBody: Block; hoisted: string[]; innerParams: string[] } {
  const body = innerFn.getBody();
  if (!Node.isBlock(body)) {
    throw new Unsupported("awaiter inner is not a block body");
  }

  const hoisted: string[] = [];
  let machineBody: Block | null = null;

  for (const stmt of body.getStatements()) {
    if (Node.isVariableStatement(stmt)) {
      hoisted.push(stmt.getText());
      continue;
    }
    if (Node.isReturnStatement(stmt)) {
      const expr = stmt.getExpression();
      if (expr && Node.isCallExpression(expr)) {
        const callee = expr.getExpression();
        if (Node.isIdentifier(callee) && callee.getText() === "__generator") {
          const args = expr.getArguments();
          if (args.length >= 2) {
            const genFn = args[1];
            if (
              Node.isFunctionExpression(genFn) ||
              Node.isArrowFunction(genFn)
            ) {
              const gb = genFn.getBody();
              if (Node.isBlock(gb)) {
                machineBody = gb;
                // 生成器体函数开头的变量声明也要收集
                for (const s of gb.getStatements()) {
                  if (Node.isVariableStatement(s)) {
                    hoisted.push(s.getText());
                  }
                }
                continue;
              }
            }
          }
        }
      }
    }
    // switch 后面偶尔还有变量声明 (TS 提升)
    throw new Unsupported(
      "unexpected statement in awaiter inner body: " + stmt.getKindName()
    );
  }

  // switch 之后可能跟随变量声明 (如 `var tokenA0;` 在 __generator 回调末尾)
  // 这些位于机器体 block 内的非 switch 语句
  if (machineBody) {
    for (const s of machineBody.getStatements()) {
      if (Node.isVariableStatement(s)) {
        hoisted.push(s.getText());
      }
    }
  }

  if (!machineBody) {
    throw new Unsupported("no __generator machine found in awaiter inner");
  }

  return {
    machineBody,
    hoisted,
    innerParams: innerFn.getParameters().map((p) => p.getText()),
  };
}

/** 从机器体 (含 switch 的 Block) 解析出 MachineIR */
export function parseMachine(machineBody: Block): MachineIR {
  // 找到 switch 语句 (机器体的顶层语句, 可能被 return 包裹)
  let switchStmt = null;
  let stateParam = "state";

  for (const stmt of machineBody.getStatements()) {
    if (Node.isSwitchStatement(stmt)) {
      switchStmt = stmt;
    } else if (Node.isReturnStatement(stmt)) {
      // 机器体可能是 { return __generator(this, function(state) { switch... }) }
      // 但 parseAwaiterInner 已经下钻到生成器体, 这里应该是 switch 直接出现
      // 有些形态是 { switch... } 之外还有别的, 跳过
    }
  }

  if (!switchStmt) {
    // 机器体没有 switch: 把整个块当作单个 case 0 (线性)
    const cases = new Map<number, CaseIR>();
    const stmts = machineBody.getStatements();
    cases.set(0, {
      label: 0,
      stmts,
      term: { kind: "return" },
      embeddedGotos: [],
      endsWithThrow: false,
    });
    return {
      cases,
      labels: [0],
      regions: [],
      stateParam,
      hoisted: [],
    };
  }

  // 找生成器体的 state 参数名: 向上找包含此 switch 的函数
  const fn = switchStmt.getFirstAncestor(
    (a) => Node.isFunctionExpression(a) || Node.isArrowFunction(a)
  ) as FunctionExpression | ArrowFunction | undefined;
  if (fn && fn.getParameters().length > 0) {
    stateParam = fn.getParameters()[0].getName();
  }

  const cases = new Map<number, CaseIR>();
  const regions: TryRegion[] = [];

  for (const clause of switchStmt.getClauses()) {
    if (Node.isDefaultClause(clause)) {
      throw new Unsupported("default clause in state machine switch");
    }
    const cc = clause as CaseClause;
    const labelExpr = cc.getExpression();
    if (!labelExpr || !Node.isNumericLiteral(labelExpr)) {
      throw new Unsupported("non-numeric case label");
    }
    const label = Math.floor(labelExpr.getLiteralValue());
    const ir = parseCase(
      label,
      cc.getStatements(),
      stateParam,
      regions
    );
    cases.set(label, ir);
  }

  const labels = Array.from(cases.keys()).sort((a, b) => a - b);

  return { cases, labels, regions, stateParam, hoisted: [] };
}

interface ParsedTail {
  /** tail 语句之前的普通语句 */
  pre: Statement[];
  term: AnyTerm;
}

function parseCase(
  label: number,
  statements: Statement[],
  stateParam: string,
  regions: TryRegion[]
): CaseIR {
  const plain: Statement[] = [];
  const embeddedGotos: number[] = [];
  let term: AnyTerm | null = null;
  let endsWithThrow = false;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const isLast = i === statements.length - 1;

    // state.label = N;  → 簿记, 丢弃
    if (isLabelAssignment(stmt, stateParam)) {
      continue;
    }

    // state.trys.push([...]) → 记录区域, 丢弃
    const region = tryExtractRegion(stmt, stateParam);
    if (region) {
      regions.push(region);
      continue;
    }

    // state.trys.pop() → 丢弃 (由 try 结构自动处理)
    if (isTrysPop(stmt, stateParam)) {
      continue;
    }

    if (isLast) {
      // 尝试解析为尾部控制结构
      const tail = parseTail(stmt, stateParam, embeddedGotos);
      if (tail) {
        plain.push(...tail.pre);
        term = tail.term;
        continue;
      }
      // 以 throw 结尾
      if (Node.isThrowStatement(stmt)) {
        plain.push(stmt);
        endsWithThrow = true;
        term = { kind: "return", value: undefined };
        // 用特殊标记: throw 由 endsWithThrow 表达; 这里 term 不会被发射
        term = { kind: "throwMarker" } as any;
        continue;
      }
      // 普通语句结尾 → 落入下一个 case
      plain.push(stmt);
      term = { kind: "next" };
      continue;
    }

    // 非尾部语句: 收集内嵌跳转用于 CFG
    collectEmbeddedGotos(stmt, stateParam, embeddedGotos);
    plain.push(stmt);
  }

  if (term === null) {
    term = { kind: "next" };
  }

  return {
    label,
    stmts: plain,
    term,
    embeddedGotos,
    endsWithThrow,
  };
}

function isLabelAssignment(stmt: Statement, stateParam: string): boolean {
  if (!Node.isExpressionStatement(stmt)) return false;
  const expr = stmt.getExpression();
  if (!Node.isBinaryExpression(expr)) return false;
  if (expr.getOperatorToken().getKind() !== SyntaxKind.EqualsToken)
    return false;
  const lhs = expr.getLeft();
  if (!Node.isPropertyAccessExpression(lhs)) return false;
  return (
    lhs.getName() === "label" &&
    Node.isIdentifier(lhs.getExpression()) &&
    lhs.getExpression().getText() === stateParam
  );
}

function tryExtractRegion(
  stmt: Statement,
  stateParam: string
): TryRegion | null {
  if (!Node.isExpressionStatement(stmt)) return null;
  const expr = stmt.getExpression();
  if (!Node.isCallExpression(expr)) return null;
  const callee = expr.getExpression();
  if (!Node.isPropertyAccessExpression(callee)) return null;
  if (callee.getName() !== "push") return null;
  const trys = callee.getExpression();
  if (!Node.isPropertyAccessExpression(trys)) return null;
  if (trys.getName() !== "trys") return null;
  if (!Node.isIdentifier(trys.getExpression())) return null;
  if (trys.getExpression().getText() !== stateParam) return null;

  const args = expr.getArguments();
  if (args.length < 1 || !Node.isArrayLiteralExpression(args[0])) return null;
  const els = args[0].getElements();
  if (els.length < 4) return null;

  const nums = els.map((e) => {
    if (Node.isNumericLiteral(e)) return Math.floor(e.getLiteralValue());
    return undefined; // OmittedExpression (空洞)
  });

  const [tryStart, catchStart, finallyStart, follow] = nums;
  if (tryStart === undefined || follow === undefined) return null;

  return { tryStart, catchStart, finallyStart, follow };
}

function isTrysPop(stmt: Statement, stateParam: string): boolean {
  if (!Node.isExpressionStatement(stmt)) return false;
  const expr = stmt.getExpression();
  if (!Node.isCallExpression(expr)) return false;
  const callee = expr.getExpression();
  if (!Node.isPropertyAccessExpression(callee)) return false;
  if (callee.getName() !== "pop") return false;
  const trys = callee.getExpression();
  if (!Node.isPropertyAccessExpression(trys)) return false;
  return (
    trys.getName() === "trys" &&
    Node.isIdentifier(trys.getExpression()) &&
    trys.getExpression().getText() === stateParam
  );
}

/**
 * 解析尾部语句的控制结构。
 * 支持:
 *   return <opcodeExpr>
 *   if (c) return <opcodeExpr>;            (无 else → else 分支为 next)
 *   if (c) {...return <op>;} else {...}
 * 返回 null 表示不是可识别的终结语句。
 */
function parseTail(
  stmt: Statement,
  stateParam: string,
  embeddedGotos: number[]
): ParsedTail | null {
  if (Node.isReturnStatement(stmt)) {
    const expr = stmt.getExpression();
    if (!expr) {
      return { pre: [], term: { kind: "return" } };
    }
    if (isOpcodeExpr(expr, stateParam)) {
      const arm = parseTermArm(expr, stateParam, embeddedGotos);
      return { pre: [], term: arm.term, };
    }
    return null;
  }

  if (Node.isIfStatement(stmt)) {
    const cond = stmt.getExpression();
    const thenStmt = stmt.getThenStatement();
    const elseStmt = stmt.getElseStatement();

    const thenTail = parseTailBlock(thenStmt, stateParam, embeddedGotos);
    if (!thenTail) return null;

    let elseArm: BranchArm;
    if (elseStmt) {
      const elseTail = parseTailBlock(elseStmt, stateParam, embeddedGotos);
      if (!elseTail) return null;
      elseArm = {
        pre: elseTail.pre.map((s) => s.getText()),
        term: elseTail.term,
      };
    } else {
      elseArm = { pre: [], term: { kind: "next" } };
    }

    const thenArm: BranchArm = {
      pre: thenTail.pre.map((s) => s.getText()),
      term: thenTail.term,
    };

    return {
      pre: [],
      term: {
        kind: "branch",
        cond: cond.getText(),
        then: thenArm,
        else: elseArm,
      },
    };
  }

  return null;
}

function parseTailBlock(
  stmt: Statement,
  stateParam: string,
  embeddedGotos: number[]
): ParsedTail | null {
  if (Node.isBlock(stmt)) {
    const stmts = stmt.getStatements();
    if (stmts.length === 0) {
      return { pre: [], term: { kind: "next" } };
    }
    const last = stmts[stmts.length - 1];
    const tail = parseTail(last, stateParam, embeddedGotos);
    if (tail) {
      return {
        pre: [...stmts.slice(0, -1), ...tail.pre],
        term: tail.term,
      };
    }
    // 块没有可识别的终结 → 整个块作为 pre, next
    return { pre: stmts, term: { kind: "next" } };
  }
  return parseTail(stmt, stateParam, embeddedGotos);
}

function isOpcodeExpr(expr: Expression, stateParam: string): boolean {
  try {
    peekTerm(expr, stateParam);
    return true;
  } catch {
    return false;
  }
}

function peekTerm(expr: Expression, stateParam: string): void {
  if (Node.isParenthesizedExpression(expr)) {
    peekTerm(expr.getExpression(), stateParam);
    return;
  }
  if (Node.isArrayLiteralExpression(expr)) {
    const els = expr.getElements();
    if (els.length === 0) throw new Unsupported("empty opcode array");
    const first = els[0];
    if (!Node.isNumericLiteral(first))
      throw new Unsupported("non-numeric opcode");
    return;
  }
  if (Node.isConditionalExpression(expr)) {
    peekTerm(expr.getWhenTrue(), stateParam);
    peekTerm(expr.getWhenFalse(), stateParam);
    return;
  }
  if (Node.isBinaryExpression(expr)) {
    const op = expr.getOperatorToken().getKind();
    if (op === SyntaxKind.CommaToken) {
      peekTerm(expr.getRight(), stateParam);
      return;
    }
  }
  throw new Unsupported("not an opcode expression: " + expr.getKindName());
}

/** 解析一个 opcode 表达式为 BranchArm (可能带副作用前缀) */
function parseTermArm(
  expr: Expression,
  stateParam: string,
  embeddedGotos: number[]
): BranchArm {
  const pre: string[] = [];

  const parse = (e: Expression): AnyTerm => {
    if (Node.isParenthesizedExpression(e)) {
      return parse(e.getExpression());
    }
    if (Node.isBinaryExpression(e)) {
      if (e.getOperatorToken().getKind() === SyntaxKind.CommaToken) {
        pre.push(e.getLeft().getText());
        return parse(e.getRight());
      }
      throw new Unsupported("non-comma binary in opcode");
    }
    if (Node.isConditionalExpression(e)) {
      const cond = e.getCondition().getText();
      const thenArm = parseArmSide(e.getWhenTrue());
      const elseArm = parseArmSide(e.getWhenFalse());
      return { kind: "branch", cond, then: thenArm, else: elseArm };
    }
    if (Node.isArrayLiteralExpression(e)) {
      return parseOpcodeArray(e, embeddedGotos);
    }
    throw new Unsupported("bad opcode expr: " + e.getKindName());
  };

  const parseArmSide = (e: Expression): BranchArm => {
    const saved = pre.length;
    if (Node.isBinaryExpression(e) && e.getOperatorToken().getKind() === SyntaxKind.CommaToken) {
      // 收集副作用直到最后的 opcode
      const sidePre: string[] = [];
      let cur: Expression = e;
      while (
        Node.isBinaryExpression(cur) &&
        cur.getOperatorToken().getKind() === SyntaxKind.CommaToken
      ) {
        sidePre.push(cur.getLeft().getText());
        cur = cur.getRight();
      }
      const t = parse(cur);
      return { pre: sidePre, term: t };
    }
    if (Node.isParenthesizedExpression(e)) {
      return parseArmSide(e.getExpression());
    }
    const t = parse(e);
    return { pre: [], term: t };
  };

  const term = parse(expr);
  return { pre, term };
}

function parseOpcodeArray(
  arr: ArrayLiteralExpression,
  embeddedGotos: number[]
): Term {
  const els = arr.getElements();
  const first = els[0];
  if (!Node.isNumericLiteral(first))
    throw new Unsupported("non-numeric opcode");
  const op = Math.floor(first.getLiteralValue());

  switch (op) {
    case 2: {
      const value = els[1] ? els[1].getText() : undefined;
      return { kind: "return", value };
    }
    case 3: {
      const tgt = els[1];
      if (!tgt || !Node.isNumericLiteral(tgt))
        throw new Unsupported("goto target not numeric");
      const target = Math.floor(tgt.getLiteralValue());
      embeddedGotos.push(target);
      return { kind: "goto", target };
    }
    case 4: {
      if (!els[1]) throw new Unsupported("await without expression");
      return { kind: "await", expr: els[1].getText() };
    }
    case 5: {
      if (!els[1]) throw new Unsupported("delegate without expression");
      return { kind: "delegate", expr: els[1].getText() };
    }
    case 7:
      return { kind: "endfinally" };
    default:
      throw new Unsupported("unknown opcode " + op);
  }
}

/** 收集中间语句里的跳转目标 (if (c) return [3, N]; 等) */
function collectEmbeddedGotos(
  stmt: Statement,
  stateParam: string,
  out: number[]
): void {
  stmt.forEachDescendant((node) => {
    if (Node.isReturnStatement(node)) {
      const expr = node.getExpression();
      if (expr && looksLikeOpcode(expr)) {
        walkOpcodeForGotos(expr, out);
      }
    }
  });
}

function looksLikeOpcode(expr: Expression): boolean {
  if (Node.isArrayLiteralExpression(expr)) {
    const els = expr.getElements();
    return els.length > 0 && Node.isNumericLiteral(els[0]);
  }
  if (Node.isConditionalExpression(expr)) {
    return looksLikeOpcode(expr.getWhenTrue()) || looksLikeOpcode(expr.getWhenFalse());
  }
  if (Node.isParenthesizedExpression(expr)) {
    return looksLikeOpcode(expr.getExpression());
  }
  if (Node.isBinaryExpression(expr) && expr.getOperatorToken().getKind() === SyntaxKind.CommaToken) {
    return looksLikeOpcode(expr.getRight());
  }
  return false;
}

function walkOpcodeForGotos(expr: Expression, out: number[]): void {
  if (Node.isArrayLiteralExpression(expr)) {
    const els = expr.getElements();
    if (els.length >= 2 && Node.isNumericLiteral(els[0])) {
      const op = Math.floor(els[0].getLiteralValue());
      if (op === 3 && Node.isNumericLiteral(els[1])) {
        out.push(Math.floor(els[1].getLiteralValue()));
      }
    }
    return;
  }
  if (Node.isConditionalExpression(expr)) {
    walkOpcodeForGotos(expr.getWhenTrue(), out);
    walkOpcodeForGotos(expr.getWhenFalse(), out);
    return;
  }
  if (Node.isParenthesizedExpression(expr)) {
    walkOpcodeForGotos(expr.getExpression(), out);
    return;
  }
  if (Node.isBinaryExpression(expr) && expr.getOperatorToken().getKind() === SyntaxKind.CommaToken) {
    walkOpcodeForGotos(expr.getRight(), out);
    return;
  }
}
