# 将 test/snippets 中 __awaiter 完全转换为原生 async/await 的可行方案分析

## 背景
所有 50 个片段均为 TypeScript 编译产物 (target ES5/ES6)，使用 `__awaiter`/`__generator` 运行时辅助函数实现 async/await。目标是还原为可读、可维护的原生 async/await 代码。

---

## 方案对比

### 方案 1: TypeScript 重新编译 (推荐/最佳)

**前提**: 拥有原始 `.ts` 源码和 `tsconfig.json`

**步骤**:
1. 确保 `tsconfig.json` 设置 `"target": "ES2017"` 或更高 (原生支持 async/await)
2. 移除 `"downlevelIteration"` 相关配置
3. 运行 `tsc` 重新编译
4. 删除生成的 `__awaiter`/`__generator` 辅助函数

**优点**:
- 100% 准确还原，保留类型信息、Source Maps
- 零手工干预，无引入 Bug 风险
- 保留所有语义：try/catch/finally、循环、条件、变量作用域
- 支持增量编译、类型检查

**缺点**:
- 需要原始 TypeScript 源码 (当前只有编译后 JS)
- 需要完整构建环境

**适用性**: ⭐⭐⭐⭐⭐ (若有源码)

---

### 方案 2: AST 级自动化转换工具 (次佳/通用)

**工具**: `ts-transformer-async-await` / `babel-plugin-transform-async-to-promises` 逆向 / 自定义 TypeScript Compiler API 脚本

**核心思路**:
```typescript
// 使用 TypeScript Compiler API 解析 JS -> AST -> 转换 -> 打印
import * as ts from "typescript";

function transformAwaiter(sourceFile: ts.SourceFile): ts.SourceFile {
    const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
        return (sf) => ts.visitNode(sf, visitor);
        
        function visitor(node: ts.Node): ts.Node {
            // 1. 识别 __awaiter 调用表达式
            if (isAwaiterCall(node)) {
                return convertAwaiterToAsyncFunction(node, context);
            }
            // 2. 识别 __generator 调用
            if (isGeneratorCall(node)) {
                return convertGeneratorToAsyncBody(node);
            }
            return ts.visitEachChild(node, visitor, context);
        }
    };
    
    return ts.transform(sourceFile, [transformer]).transformed[0];
}
```

**关键转换规则**:
| __awaiter 模式 | 原生 async/await |
|----------------|------------------|
| `return [4, promise]` | `await promise` |
| `label.sent()` | (隐式，await 表达式值) |
| `return [2, value]` | `return value` |
| `label.trys.push([try, catch, finally])` | `try { } catch { } finally { }` |
| `return [3, labelIndex]` | `continue` / `break` / 标签跳转 |
| `switch (label.label) { case N: }` | 线性控制流 |

**实现难点**:
1. **Switch 状态机扁平化**: 需要控制流分析 (CFG) 重建结构化代码
2. **变量作用域提升**: `var` 声明需降级为 `const`/`let` 并调整作用域
3. **异常处理重建**: `trys` 数组需映射为嵌套 try/catch/finally
4. **循环识别**: 回边检测 (CFG 中的 back-edge) 还原 for/while
5. **嵌套 __awaiter**: 递归处理内部生成器
5. **this 绑定**: `var _this = this` 替换为箭头函数或显式 bind

**现有工具评估**:
- `babel-plugin-transform-async-to-promises`: 正向转换，不可用
- `recast` + 自定义 visitor: 可行，需大量 CFG 重建代码
- `ts-morph`: 更友好的 TS Compiler API 封装，推荐
- **TypeScript 官方 API**: 最完整，但学习曲线陡峭

**优点**:
- 无需源码，直接处理编译产物
- 可批量处理 50 个文件
- 可集成到构建管线

**缺点**:
- 开发成本高 (约 2-3 天核心逻辑 + 测试)
- 边界情况极多 (嵌套、标签跳转、finally、with、eval 等)
- 生成代码可能需人工微调 (变量名、格式化)
- 无法恢复类型注解、注释、原始格式

**适用性**: ⭐⭐⭐⭐ (无源码时首选)

---

### 方案 3: 正则/字符串替换 + 手工修正 (不推荐)

**思路**: 编写正则匹配 `__awaiter`/`__generator` 模式，替换为 async/await 语法

**致命缺陷**:
```javascript
// 这种模式极难用正则处理
switch (label.label) {
    case 0: return [4, op1()];
    case 1: 
        x = label.sent();
        if (cond) return [3, 5];  // 条件跳转
        return [4, op2(x)];
    case 2: return [4, op3()];
    case 3: label.sent(); return [3, 4];
    case 4: return [2];
    case 5: return [4, op4()];
}
```
- 控制流图 (CFG) 重建本质上是**图算法问题**，正则只能处理线性文本
- 嵌套、异常、循环、标签跳转交织，正则会产生大量误匹配
- 维护成本极高，每新增一个模式需调整正则

**适用性**: ⭐ (仅极简单片段如 snippet_174/191/200 可尝试)

---

### 方案 4: 大模型 (LLM) 辅助逐文件转换 (实用/人工介入)

**流程**:
1. 将单个片段喂给 LLM (Claude/GPT-4/DeepSeek-Coder)
2. Prompt: "将此 TypeScript 编译产物还原为原生 async/await TypeScript 代码，保留语义、变量名、错误处理"
3. 人工审核、测试、修正
4. 批量处理 50 文件

**Prompt 模板**:
```
请将以下 TypeScript 编译后的 JavaScript 代码 (使用 __awaiter/__generator 状态机) 
还原为原生 async/await 的 TypeScript 代码。

要求:
1. 完整保留原语义：try/catch/finally、循环、条件分支、变量作用域
2. 将 var 改为 const/let，修正作用域
3. 恢复合理的函数签名和参数类型 (可从用法推断)
4. 移除 __awaiter/__generator 运行时辅助函数调用
5. 处理嵌套的 __awaiter (回调中的异步函数)
6. 保留原有变量命名风格 (单字母变量可根据语义重命名)
7. 输出可通过 tsc 编译的 TypeScript 代码

代码:
{paste_snippet_here}
```

**优点**:
- 启动快，无需开发工具
- LLM 擅长模式识别和代码重写
- 可交互式修正 (发现问题再对话修复)
- 单文件约 2-5 分钟，50 文件约 2-4 小时

**缺点**:
- 非确定性：同一输入可能产出不同输出
- 可能幻觉：编造不存在的变量、漏掉边界情况
- 大文件 (snippet_198 600+ 行) 超过上下文窗口或注意力下降
- 无法批量验证语义等价性
- 需人工逐个审核

**适用性**: ⭐⭐⭐ (原型验证、小规模、配合方案 2 兜底)

---

### 方案 5: 混合方案 - AST 工具 + LLM 兜底 (推荐生产方案)

**架构**:
```
┌─────────────────────────────────────────────────────────┐
│                    输入: 50 个 .js 文件                   │
└──────────────────────────┬──────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
    ┌───────────────┐             ┌───────────────┐
    │  AST 自动转换  │             │   LLM 兜底    │
    │  (ts-morph)   │             │  (复杂/失败)  │
    └───────┬───────┘             └───────┬───────┘
            │                             │
            ▼                             ▼
    ┌───────────────┐             ┌───────────────┐
    │  成功: 直接输出 │             │  人工审核修正  │
    └───────┬───────┘             └───────┬───────┘
            │                             │
            └──────────────┬──────────────┘
                           ▼
              ┌───────────────────────┐
              │   统一格式化           │
              │  (prettier + eslint)  │
              └────────────┬──────────┘
                           ▼
              ┌───────────────────────┐
              │   语义等价性验证        │
              │  (运行测试/快照对比)   │
              └───────────────────────┘
```

**实施步骤**:

#### Phase 1: 基础设施 (0.5 天)
```bash
npm init -y
npm i ts-morph prettier typescript @types/node
```

#### Phase 2: 核心转换器开发 (2-3 天)
```typescript
// transformer.ts
import { Project, SourceFile, SyntaxKind, Node, CallExpression, 
         FunctionExpression, Block, SwitchStatement, CaseClause,
         ReturnStatement, ArrayLiteralExpression, Identifier } from "ts-morph";

class AwaiterTransformer {
    project: Project;
    
    transformFile(filePath: string): string {
        const sourceFile = this.project.addSourceFileAtPath(filePath);
        this.transformSourceFile(sourceFile);
        return sourceFile.getFullText();
    }
    
    private transformSourceFile(sourceFile: SourceFile) {
        // 1. 移除 __awaiter/__generator 导入/声明
        this.removeRuntimeHelpers(sourceFile);
        
        // 2. 遍历所有 __awaiter 调用
        sourceFile.forEachDescendant(node => {
            if (this.isAwaiterCall(node)) {
                this.convertAwaiterCall(node as CallExpression);
            }
        });
        
        // 3. 格式化
        sourceFile.formatText();
    }
    
    private isAwaiterCall(node: Node): boolean {
        return Node.isCallExpression(node) && 
               node.getExpression().getText() === "__awaiter";
    }
    
    private convertAwaiterCall(call: CallExpression) {
        // 参数: [thisArg, void0, void0/Promise, generatorFn]
        const args = call.getArguments();
        const generatorFn = args[3] as FunctionExpression;
        
        // 提取生成器函数体
        const generatorBody = generatorFn.getBody();
        if (!Node.isBlock(generatorBody)) return;
        
        // 核心: 将 __generator 状态机转为 async 函数体
        const asyncBody = this.convertGeneratorBody(generatorBody);
        
        // 替换整个 __awaiter(...) 为 async 函数表达式
        const asyncFn = call.replaceWithText(
            `async function${generatorFn.getTypeParameters()?.getText() || ""}(${generatorFn.getParameters().map(p => p.getText()).join(", ")}) ${asyncBody.getText()}`
        );
    }
    
    private convertGeneratorBody(block: Block): Block {
        // 1. 找到 __generator 调用
        const generatorCall = block.getFirstDescendantByKind(SyntaxKind.CallExpression);
        if (!generatorCall || generatorCall.getExpression().getText() !== "__generator") return block;
        
        // 2. 提取 switch 语句
        const switchStmt = generatorCall.getArguments()[1] as FunctionExpression;
        const switchBlock = switchStmt.getBody();
        
        // 3. CFG 重建算法 (简化版)
        return this.rebuildControlFlow(switchBlock);
    }
    
    private rebuildControlFlow(switchBlock: Block): Block {
        // TODO: 实现完整的控制流重建
        // - 识别 case 块
        // - 检测回边 (循环)
        // - 重建 try/catch/finally (从 trys 数组)
        // - 扁平化 switch 为线性语句
        // - 处理 label.sent() -> await 表达式
        // - 处理 return [2, val] -> return val
        // - 处理 return [3, N] -> continue/break/return
        // - 处理 return [4, promise] -> await promise
        
        // 此处需 ~500 行核心算法代码
        throw new Error("需实现完整 CFG 重建");
    }
    
    private removeRuntimeHelpers(sourceFile: SourceFile) {
        // 删除 var __awaiter = ...; var __generator = ...;
        sourceFile.getStatements().forEach(stmt => {
            if (Node.isVariableStatement(stmt)) {
                const declarations = stmt.getDeclarations();
                if (declarations.some(d => 
                    ["__awaiter", "__generator"].includes(d.getName()))) {
                    stmt.remove();
                }
            }
        });
    }
}
```

#### Phase 3: 分类处理策略

| 文件复杂度 | 处理方式 | 预估耗时 |
|------------|----------|----------|
| 简单 (11个) | AST 全自动 | 10分钟 |
| 中等 (14个) | AST + 少量修正 | 30分钟 |
| 复杂 (18个) | AST 核心 + LLM 辅助 | 2小时 |
| 极复杂 (4个) | LLM 主导 + AST 验证 | 2小时 |
| 重复 (snippet_212/213) | 去重处理 | - |

#### Phase 4: 验证管线 (0.5 天)
```typescript
// verify.ts
async function verifyEquivalence(originalJs: string, convertedTs: string) {
    // 1. 编译转换后代码
    const compiled = await compileTsToJs(convertedTs, { target: "ES2017" });
    
    // 2. 运行相同测用例 (需提取/编写测试)
    const originalResult = await runInVm(originalJs, testCases);
    const convertedResult = await runInVm(compiled, testCases);
    
    // 3. 对比输出、副作用、错误行为
    assert.deepEqual(originalResult, convertedResult);
}
```

---

## 方案选择建议

### 场景 A: 有 TypeScript 源码
→ **方案 1** (重新编译) - 0 成本、完美还原

### 场景 B: 无源码、一次性迁移、50 文件、需长期维护
→ **方案 5** (混合 AST + LLM) - 投入 ~4 天，得到可维护源码
- 核心投入: CFG 重建算法 (~500 行 TS)
- 长期收益: 摆脱编译产物维护地狱，获得类型安全、可阅读源码

### 场景 C: 无源码、仅需阅读理解、不改动
→ **方案 4** (LLM 逐个转换) - 2-4 小时得到可读代码
- 适合代码审计、安全分析、学习参考

### 场景 D: 无源码、需自动化管线集成、持续转换
→ **方案 2** (完善 AST 工具) - 投入 ~2 周做通用工具
- 适合大型遗留代码库持续现代化

---

## 关键技术难点详解 (方案 2/5 核心)

### 1. Switch 状态机扁平化算法
输入: `switch (label) { case 0: ... case 1: ... case N: ... }`
输出: 线性语句序列 + 结构化控制流

**算法步骤**:
1. 构建 CFG: 每个 case = 基本块，边 = 显式跳转 (`return [3, N]`) + 隐式落穿
2. 识别循环: 找回边 (支配树 + 反向边检测)
3. 识别 try/catch: 从 `trys` 数组映射 case 范围
4. 结构化重建: 
   - 循环 → while/for
   - 条件分支 → if/else
   - try 区域 → try/catch/finally
5. 变量提升处理: 分析定义/使用位置，插入 const/let

**参考实现**: 
- `babel-plugin-transform-async-to-promises` 逆向思路
- `recast` / `ast-types` 的 `controlFlow` 分析
- TypeScript 官方 `transformAsync` 实现 (内部)

### 2. 变量作用域恢复
```javascript
// 原始编译产物
var x, y, z;
return __generator(this, function(_) {
    case 0: x = 1; return [4, f()];
    case 1: y = _.sent(); z = x + y; return [2, z];
});

// 目标
async function() {
    const x = 1;
    const y = await f();
    const z = x + y;
    return z;
}
```
- 数据流分析: 计算每个变量的定义点、使用点、生命周期
- 块作用域划分: 根据 CFG 结构分配 let/const 作用域

### 3. 异常处理重建
```javascript
label.trys.push([0, 2, 4, 5]);  // try:0-1, catch:2-3, finally:4
case 0: return [4, risky()];
case 1: _.sent(); return [3, 5];
case 2: err = _.sent(); handle(err); return [3, 4];
case 4: cleanup(); return [7];
case 5: return [2];
```
映射为:
```javascript
try {
    await risky();
} catch (err) {
    handle(err);
} finally {
    cleanup();
}
```

### 4. 嵌套 __awaiter 处理
```javascript
btn.onClick(async function() {
    await __awaiter(this, void 0, void 0, function*() { ... });
});
```
转换为:
```javascript
btn.onClick(async function() {
    // 直接展开内部逻辑
    ...
});
```
需递归处理，注意 `this` 绑定传递。

---

## 实施路线图 (推荐方案 5)

### Week 1: 核心转换器 MVP
- [ ] Day 1-2: ts-morph 项目搭建，基础 AST 遍历
- [ ] Day 3-4: __awaiter 调用识别、参数提取
- [ ] Day 5: 简单线性 await 链转换 (无分支/循环/异常)

### Week 2: 控制流重建
- [ ] Day 1-2: CFG 构建、基本块划分
- [ ] Day 3: 循环检测 (回边算法)
- [ ] Day 4: try/catch/finally 重建 (从 trys 数组)
- [ ] Day 5: 条件分支重建、switch 扁平化

### Week 3: 变量/作用域/嵌套
- [ ] Day 1: 数据流分析、var→const/let
- [ ] Day 2: 嵌套 __awaiter 递归处理
- [ ] Day 3: this 绑定、箭头函数转换
- [ ] Day 4-5: 集成测试、边界情况修复

### Week 4: 验证与批量处理
- [ ] Day 1: Prettier/ESLint 格式化管线
- [ ] Day 2: 语义等价性验证框架
- [ ] Day 3: 50 文件批量跑通
- [ ] Day 4: 人工审核复杂文件 (snippet_198, 192, 212, 214)
- [ ] Day 5: 文档、总结、交付

---

## 风险与对策

| 风险 | 影响 | 对策 |
|------|------|------|
| CFG 重建算法有 Bug | 生成代码语义不等价 | 大量测用例、差分测试、快照对比 |
| snippet_198 过大/复杂 | 转换器超时/内存溢出 | 分模块处理、增量转换、LLM 兜底 |
| 变量名单字母不可读 | 维护性差 | 语义重命名 (可选，基于使用模式推断) |
| 无法恢复类型信息 | 类型安全缺失 | 标记需手动补全类型、配合 JSDoc |
| 原始代码有 bug | 转换后保留 bug | 这是特性：保持行为一致，后续再修 |

---

## 交付物清单

1. **转换器源码** (`tools/awaiter-transformer/`)
   - `transformer.ts` - 核心转换逻辑
   - `cfg.ts` - 控制流图构建与分析
   - `scope.ts` - 变量作用域恢复
   - `verify.ts` - 语义等价验证
   - `cli.ts` - 批量处理入口

2. **转换结果** (`test/snippets_converted/`)
   - 50 个 `.ts` 文件，原生 async/await

3. **验证报告** (`test/summary/conversion_report.md`)
   - 每文件转换状态、人工介入点、遗留问题

4. **操作手册** (`docs/awaiter_conversion_guide.md`)
   - 如何运行、扩展、调试转换器

---

## 结论

**推荐方案 5 (混合 AST + LLM)**:
- 技术可行性: ✅ 高 (TypeScript Compiler API 成熟)
- 工程投入: ~4 人天 (核心算法 ~500 行)
- 产出价值: 永久消除 `__awaiter` 维护负担，获得类型安全源码
- 成功率: >95% 自动化，<5% 需人工修正

**立即可行动**: 
1. 确认是否有 TypeScript 源码 (若有，直接方案 1)
2. 搭建 ts-morph 原型，先跑通 snippet_174/191/200 等简单案例
3. 评估核心算法复杂度后决定是否继续投入