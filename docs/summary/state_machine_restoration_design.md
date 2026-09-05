# 状态机还原为原生代码详细设计

## 1. 概述

本文档详细描述如何将 TypeScript/JavaScript 编译器生成的 `switch-case` 状态机代码（通常由 `__awaiter` 和 `__generator` 辅助函数生成）还原为原生的 `async/await` 或 `yield` 语法结构。

### 1.1 目标输入与输出

**输入示例 (State Machine):**
```javascript
return __generator(this, function (_a) {
    switch (_a.label) {
        case 0:
            return [4 /*yield*/, fetchData()];
        case 1:
            result = _a.sent();
            if (!result) return [3 /*break*/, 3];
            return [4 /*yield*/, process(result)];
        case 2:
            _a.sent();
            return [3 /*break*/, 4];
        case 3:
            throw new Error("No data");
        case 4:
            return [2 /*return*/];
    }
});
```

**输出示例 (Native Async/Await):**
```javascript
(async () => {
    const result = await fetchData();
    if (!result) {
        throw new Error("No data");
    }
    await process(result);
})();
```

---

## 2. 核心数据结构定义

为了准确还原代码，我们需要构建中间表示（IR）。

### 2.1 基本单元定义

```typescript
// 状态节点类型
enum NodeType {
  YIELD_AWAIT = 'yield_await',      // [4 /*yield*/, expr]
  YIELD_STAR = 'yield_star',        // [5 /*yield-star*/, expr]
  RETURN = 'return',                // [2 /*return*/, value]
  THROW = 'throw',                  // [0 /*throw*/, error] (较少见，通常是 case 内直接 throw)
  BREAK = 'break',                  // [3 /*break*/, label]
  CONTINUE = 'continue',            // [3 /*continue*/, label] (循环场景)
  ASSIGN_SENT = 'assign_sent',      // var = _a.sent()
  CONDITIONAL = 'conditional',      // if/ternary logic
  BLOCK = 'block'                   // 普通语句块
}

interface StateNode {
  id: number;               // case label 编号
  type: NodeType;
  expression?: any;         // AST 节点：yield 后的表达式
  targetLabel?: number;     // break/jump 的目标 label
  nextLabel?: number;       // 自然 fall-through 的下一个 label
  sentVar?: string;         // _a.sent() 赋值给的变量名
  children?: StateNode[];   // 复杂逻辑的子节点
  rawStatements?: any[];    // 原始 AST 语句列表
}

interface ControlFlowGraph {
  entry: number;
  nodes: Map<number, StateNode>;
  loops: LoopInfo[];        // 识别出的循环结构
}
```

---

## 3. 边界条件语句转换矩阵

这是本设计的核心部分，列举所有可能的 `switch` 内部模式及其对应的原生代码转换规则。

### 3.1 基础操作转换表

| 状态机模式 (Switch Case Body) | 语义分析 | 原生代码转换 | 备注 |
| :--- | :--- | :--- | :--- |
| `return [4 /*yield*/, expr];` | 暂停并等待 Promise | `await expr;` | 最基础模式 |
| `return [5 /*yield-star*/, expr];` | 委托给另一个 Generator | `yield* expr;` | 仅用于 Generator 函数 |
| `return [2 /*return*/, val];` | 返回结果 | `return val;` | 若 val 缺失则 `return;` |
| `throw expr;` | 抛出异常 | `throw expr;` | 通常在 case 内部直接出现 |
| `_a.sent()` | 获取上一个 yield 的值 | `(await_result)` | 需结合前一个 yield 节点处理 |
| `return [3 /*break*/, N];` | 跳转到 label N | `goto N` (逻辑跳转) | 需重构为结构化控制流 |

### 3.2 复杂控制流转换表 (边界条件)

#### A. 顺序执行 (Fall-through)
**模式:** Case N 执行完后没有 break/return，直接进入 Case N+1。
```javascript
case 0:
    console.log("start"); // 无 return [...]
case 1:
    return [4 /*yield*/, api()];
```
**转换策略:** 合并语句块。
**输出:**
```javascript
console.log("start");
await api();
```

#### B. 条件分支 (Conditional Jump)
**模式:** 基于条件判断跳转到不同 label。
```javascript
case 1:
    x = _a.sent();
    if (!x) return [3 /*break*/, 4]; // False -> Jump to 4
    return [4 /*yield*/, process(x)]; // True -> Fall through to 2
case 2:
    ...
case 4:
    return [2 /*return*/];
```
**转换策略:** 转换为 `if-else` 结构。注意逻辑取反（因为 break 是在条件满足时跳过后续代码）。
**输出:**
```javascript
x = await previous(); // 假设前面有 yield
if (!x) {
    // Jump to 4 logic
    return; 
} else {
    await process(x);
    // Fall through logic
}
```
*注：如果跳转目标是函数末尾，通常转为 `return`；如果是中间某处，可能需要 `continue` (在 while(true) 包装中) 或重构为 `if/else` 块。*

#### C. 循环结构 (Loops)
**模式:** 向后跳转 (Backward Jump)。
```javascript
case 0:
    i = 0;
case 1:
    if (!(i < 5)) return [3 /*break*/, 4]; // Exit condition
    return [4 /*yield*/, tick(i)];
case 2:
    _a.sent();
    i++;
    return [3 /*break*/, 1]; // Jump back to 1
case 4:
    return [2 /*return*/];
```
**转换策略:** 识别“检查->Yield->更新->回跳”模式，重构为 `while` 或 `for` 循环。
**输出:**
```javascript
let i = 0;
while (i < 5) {
    await tick(i);
    i++;
}
```

#### D. Try-Catch-Finally 块
**模式:** `__generator` 通常通过特殊的 label 范围或外部 try-catch 包裹 switch 来处理异常。
```javascript
try {
    switch (_a.label) {
        case 0:
             op = _a.trys[0]; // 标记 try 开始
             ...
        case 1: 
             // normal flow
             return [3 /*break*/, 3];
        case 2: 
             // catch block entry (jumped from error)
             e = _a.sent(); 
             ...
        case 3:
             // finally
    }
} catch (e) {
    // 某些实现会将错误捕获逻辑放在这里并跳转回 switch 的特定 label
    _a.label = 2; 
    continue; 
}
```
**转换策略:** 
1. 识别 `trys` 数组定义的 label 范围 `[start, end, finallyLabel]`。
2. 将范围内的代码包裹在 `try { ... }`。
3. 将跳转至 `finallyLabel` 的逻辑放入 `finally { ... }`。
4. 将捕获错误的逻辑放入 `catch (e) { ... }`。

**输出:**
```javascript
try {
    await normalOp();
} catch (e) {
    handleError(e);
} finally {
    cleanup();
}
```

#### E. 嵌套条件与多重跳转
**模式:** 复杂的 `if-else if-else` 链被扁平化为多个 jump。
```javascript
case 1:
    if (type === 'A') return [3, 5];
    if (type === 'B') return [3, 8];
    return [3, 10];
case 5: ...
case 8: ...
case 10: ...
```
**转换策略:** 递归构建 `if-else if-else` 树。
**输出:**
```javascript
if (type === 'A') {
    // ... case 5 logic
} else if (type === 'B') {
    // ... case 8 logic
} else {
    // ... case 10 logic
}
```

#### F. `continue` 的模拟
**模式:** 在循环内部跳转到循环条件检查处。
```javascript
// Inside a loop structure identified previously
if (skip) return [3 /*break*/, checkLabel]; 
```
**转换策略:** 转换为 `continue`。
**输出:** `if (skip) continue;`

#### G. 提前返回 (Early Return)
**模式:** 跳转到函数末尾的 return label。
```javascript
if (error) return [3 /*break*/, 99]; // 99 is `return [2, undefined]`
```
**转换策略:** 直接转换为 `return` (如果后面没代码) 或 `if` 包裹剩余逻辑。
**输出:** `if (error) return;`

---

## 4. 算法流程设计

### 4.1 第一阶段：CFG 构建 (Control Flow Graph Construction)

遍历 `switch` 语句的所有 `CaseClause`。

1.  **提取 Label**: 获取 `case N:` 中的 N。
2.  **解析语句**: 读取该 case 下的所有语句。
3.  **识别跳转**:
    *   查找 `return [3, target]` 提取 `target` (Jump Target)。
    *   查找 `return [4, expr]` 标记为 `AwaitPoint`，隐式 next 为 `N+1`。
    *   查找 `return [2, val]` 标记为 `ExitPoint`。
4.  **建立边**:
    *   如果有显式 jump: `Edge(N, target)`。
    *   如果没有显式 jump/return: `Edge(N, N+1)` (Fall-through)。
5.  **特殊处理 `_a.sent()`**: 记录哪些变量接收了 `sent()` 的值，将其绑定到前一个 `AwaitPoint` 的结果。

### 4.2 第二阶段：结构识别 (Structure Identification)

在 CFG 上运行支配树 (Dominator Tree) 或区间分析算法来识别高级结构。

1.  **循环识别**:
    *   寻找后向边 (Back-edge): `N -> M` 其中 `M <= N`。
    *   确定循环头 (Header) 和循环体 (Body)。
2.  **If-Else 识别**:
    *   寻找分叉点 (Split): 一个节点有两个出度。
    *   寻找汇合点 (Join): 两条路径重新汇聚到的节点。
3.  **Try-Catch 识别**:
    *   分析 `trys` 元数据（如果存在）或通过异常控制流边识别。

### 4.3 第三阶段：代码生成 (Code Generation)

采用递归下降的方式生成代码。

```pseudo
function generateCode(nodeId, visited):
    if visited.has(nodeId): return "" // 防止死循环，应由结构识别处理
    
    node = graph.getNode(nodeId)
    
    switch node.type:
        case AWAIT:
            lhs = findSentVariable(node.next) // 查找下一个节点谁用了 _a.sent()
            if lhs:
                emit "${lhs} = await ${node.expr};"
            else:
                emit "await ${node.expr};"
            return generateCode(node.nextLabel, visited)
            
        case CONDITIONAL_JUMP:
            // 模式: if (cond) goto T else goto F (or fallthrough)
            trueBlock = generateCode(node.targetTrue, visited)
            falseBlock = generateCode(node.targetFalse, visited)
            emit "if (${node.cond}) { ${trueBlock} } else { ${falseBlock} }"
            
        case LOOP_HEADER:
            body = generateCode(node.loopStart, visited)
            condition = node.loopCondition
            emit "while (${condition}) { ${body} }"
            return generateCode(node.loopExit, visited)
            
        case RETURN:
            emit "return ${node.value};"
            return ""
            
        case FALLTHROUGH_BLOCK:
            emit node.rawStatements
            return generateCode(node.nextLabel, visited)
```

### 4.4 第四阶段：清理与优化

1.  **临时变量消除**: 如果生成的代码中有 `const _temp = await x; return _temp;`，简化为 `return await x;`。
2.  **冗余括号移除**: 移除不必要的 `{}`。
3.  **格式化**: 使用 Prettier 或 Babel Generator 进行代码格式化。

---

## 5. 边界情况处理细节

### 5.1 丢失的 Fall-through
有些编译器生成的代码可能显式跳转到 `N+1` 而不是依赖 fall-through。
*   **检测**: `case N: ... return [3, N+1]; case N+1: ...`
*   **处理**: 视为普通的顺序执行，忽略显式 jump。

### 5.2 多重入口 (Irreducible CFG)
虽然现代编译器很少生成，但如果存在 `goto` 跳转到循环中间的情况。
*   **处理**: 无法完美转换为结构化代码。策略是保留 `while(true)` 包装器和 `switch`，或者引入标志变量模拟程序计数器 (PC)。
    ```javascript
    // 降级方案
    let pc = 0;
    while(true) {
        switch(pc) {
           case 0: ... pc = 1; break;
           case 1: ... if(cond) pc=5; else pc=2; break;
           // ...
        }
    }
    ```

### 5.3 `_a.sent()` 的作用域
`_a.sent()` 必须紧跟在 `yield` resume 之后。
*   **问题**: 如果控制流从 `yield` (Case N) 跳到 Case N+1，而 Case N+1 的第一句是 `x = _a.sent()`。
*   **解决**: 在生成 `await` 语句时，直接将结果赋值给 `x`，不再保留 `_a.sent()` 调用。即 `x = await expr`。

### 5.4 异步迭代器 (`yield*`)
*   **模式**: `return [5, iterable]`。
*   **转换**: `for await (const item of iterable) { ... }` 或者简单的 `yield* iterable` (如果在 generator 中)。如果是 async 函数，通常展开为循环。

---

## 6. 实施路线图

1.  **原型开发**: 使用 Babel Parser 解析包含 `__generator` 的文件，提取 Switch 节点。
2.  **CFG 构建器**: 实现 JS 版本的 CFG 构建逻辑，能够打印出节点和边。
3.  **模式匹配器**: 针对上述“转换矩阵”中的每种模式编写单元测试，验证识别准确率。
4.  **转换器实现**: 编写 `convertToAsyncAwait` 函数，输出 AST。
5.  **集成测试**: 使用 `test/snippets` 中的 221 个文件作为测试集，对比转换前后的行为一致性（通过注入 Mock 验证执行流程）。
6.  **边缘案例修复**: 处理不可归约图 (Irreducible Graph) 和复杂的 Try-Catch 嵌套。

---

## 7. 总结

将 `switch` 状态机还原为原生代码的核心在于**控制流分析 (Control Flow Analysis)**。关键不是逐行翻译，而是识别出隐藏在跳转指令背后的结构化逻辑（循环、条件、顺序）。

**成功标准:**
1.  生成的代码不包含 `switch`、`label`、`goto` (break/continue 除外)。
2.  生成的代码完全使用 `async/await`。
3.  异常处理逻辑 (`try/catch/finally`) 位置正确。
4.  变量作用域符合 JavaScript 块级作用域规则。

此设计方案覆盖了从简单顺序执行到复杂循环嵌套的所有边界条件，可作为开发 Babel 插件的理论基石。
