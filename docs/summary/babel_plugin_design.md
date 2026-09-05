# 方案一：Babel 自定义插件详细设计

## 1. 概述

本方案设计一个 Babel 插件，用于将 TypeScript/JavaScript 中由编译器生成的 `__awaiter` 和 `__generator` 辅助函数调用还原为原生的 `async/await` 语法。该方案适合集成到现代构建流程中，具有高度的可定制性和可扩展性。

---

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    输入：ES5/ES6 降级代码                      │
│              (包含 __awaiter, __generator 调用)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Babel Parser                            │
│              (@babel/parser - 解析为 AST)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               AwaitGenerator 插件核心                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. 识别阶段 (Identification)                          │  │
│  │    - 检测 __awaiter 和 __generator 调用                │  │
│  │    - 提取生成器函数体                                 │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 2. 分析阶段 (Analysis)                                │  │
│  │    - 解析状态机 switch 结构                           │  │
│  │    - 提取 case 分支中的 await 点                       │  │
│  │    - 追踪变量依赖和控制流                             │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 3. 转换阶段 (Transformation)                          │  │
│  │    - 重构为 async 函数                                │  │
│  │    - 插入 await 表达式                                │  │
│  │    - 优化控制流                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 4. 清理阶段 (Cleanup)                                 │  │
│  │    - 移除 __awaiter/__generator 定义                  │  │
│  │    - 移除未使用的辅助函数                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Babel Generator                           │
│              (@babel/generator - 生成代码)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    输出：async/await 代码                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 模块划分

```
babel-plugin-await-generator/
├── src/
│   ├── index.js                 # 插件入口
│   ├── visitor/
│   │   ├── CallExpression.js    # 处理 __awaiter 调用
│   │   ├── SwitchStatement.js   # 处理状态机 switch
│   │   └── helpers.js           # 辅助函数
│   ├── analyzer/
│   │   ├── stateMachine.js      # 状态机分析器
│   │   ├── controlFlow.js       # 控制流分析
│   │   └── dependency.js        # 依赖追踪
│   ├── transformer/
│   │   ├── asyncFunction.js     # async 函数生成
│   │   ├── awaitExpression.js   # await 表达式插入
│   │   └── blockOptimizer.js    # 代码块优化
│   └── utils/
│       ├── astHelpers.js        # AST 操作工具
│       ├── codegen.js           # 代码生成辅助
│       └── logger.js            # 日志和调试
├── test/
│   ├── fixtures/                # 测试用例
│   └── plugin.test.js           # 单元测试
├── package.json
└── README.md
```

---

## 3. 核心算法设计

### 3.1 状态机解析算法

#### 3.1.1 状态图提取

```javascript
/**
 * 从 __generator 函数中提取状态转移图
 * @param {NodePath} generatorFunc - __generator 的回调函数
 * @returns {Map<number, StateNode>} 状态节点映射
 */
function extractStateMachine(generatorFunc) {
  const states = new Map();
  const switchStmt = findSwitchStatement(generatorFunc);
  
  // 遍历所有 case 分支
  switchStmt.cases.forEach(caseNode => {
    const stateId = caseNode.test.value;
    const statements = caseNode.consequent;
    
    const stateNode = {
      id: stateId,
      statements: [],
      awaits: [],      // await 点列表
      jumps: [],       // 跳转目标 (i.label = x)
      returns: null,   // 返回语句
      throws: null,    // 抛出语句
      nextStates: []   // 可能的下一个状态
    };
    
    // 分析每个语句
    statements.forEach(stmt => {
      if (isAwaitPoint(stmt)) {
        // return [4, promiseExpr] 或 return [2, value]
        const awaitInfo = parseAwaitPoint(stmt);
        stateNode.awaits.push(awaitInfo);
      } else if (isLabelAssignment(stmt)) {
        // i.label = x
        const target = getLabelTarget(stmt);
        stateNode.jumps.push(target);
        stateNode.nextStates.push(target);
      } else if (isReturn(stmt)) {
        stateNode.returns = parseReturn(stmt);
      } else if (isThrow(stmt)) {
        stateNode.throws = parseThrow(stmt);
      } else {
        stateNode.statements.push(stmt);
      }
    });
    
    states.set(stateId, stateNode);
  });
  
  return states;
}
```

#### 3.1.2 控制流重建

```javascript
/**
 * 基于状态机重建线性控制流
 * @param {Map} states - 状态节点映射
 * @param {number} startState - 起始状态 ID
 * @returns {Array<TransformedBlock>} 转换后的代码块序列
 */
function reconstructControlFlow(states, startState = 0) {
  const blocks = [];
  const visited = new Set();
  const queue = [startState];
  
  while (queue.length > 0) {
    const currentStateId = queue.shift();
    
    if (visited.has(currentStateId)) continue;
    visited.add(currentStateId);
    
    const state = states.get(currentStateId);
    if (!state) continue;
    
    const block = {
      id: currentStateId,
      leadingStatements: state.statements.filter(s => !isAfterAwait(s)),
      awaits: [],
      trailingStatements: state.statements.filter(s => isAfterAwait(s)),
      nextBlock: state.nextStates[0],
      isTerminal: state.returns !== null || state.throws !== null
    };
    
    // 处理 await 点
    state.awaits.forEach((awaitPoint, idx) => {
      const awaitBlock = {
        type: 'await',
        expression: awaitPoint.promiseExpr,
        resultVar: awaitPoint.resultVar,
        continuationState: state.nextStates[idx + 1] || state.returns
      };
      block.awaits.push(awaitBlock);
    });
    
    blocks.push(block);
    
    // 添加后续状态到队列
    state.nextStates.forEach(nextId => {
      if (!visited.has(nextId)) {
        queue.push(nextId);
      }
    });
  }
  
  return blocks;
}
```

### 3.2 Await 点识别规则

| 模式 | AST 结构 | 语义 | 转换后 |
|------|---------|------|--------|
| `return [4, expr]` | `ReturnStatement` → `ArrayExpression[4, expr]` | `await expr` | `const result = await expr;` |
| `return [2, value]` | `ReturnStatement` → `ArrayExpression[2, value]` | `return value` | `return value;` |
| `i.sent()` | `CallExpression` (callee: `i.sent`) | 获取上一个 await 结果 | (直接使用变量) |
| `return [5, innerAwaiter]` | `ReturnStatement` → `ArrayExpression[5, __awaiter(...)]` | 嵌套 await | 递归处理 |

### 3.3 变量作用域处理

```javascript
/**
 * 分析和提升变量声明到正确的作用域
 */
function analyzeVariableScope(blocks) {
  const scopeVars = new Set();
  const blockScopedVars = new Map();
  
  blocks.forEach((block, idx) => {
    // 收集所有变量声明
    block.trailingStatements.forEach(stmt => {
      if (t.isVariableDeclaration(stmt)) {
        stmt.declarations.forEach(decl => {
          if (t.isIdentifier(decl.id)) {
            const varName = decl.id.name;
            // 如果变量在多个块中使用，提升为块级变量
            if (isUsedInMultipleBlocks(varName, blocks, idx)) {
              scopeVars.add(varName);
              blockScopedVars.set(varName, {
                name: varName,
                declaredAt: idx,
                kind: stmt.kind // let/const/var
              });
            }
          }
        });
      }
    });
  });
  
  return { scopeVars, blockScopedVars };
}
```

---

## 4. Babel 插件实现

### 4.1 插件入口 (src/index.js)

```javascript
const t = require('@babel/types');
const { extractStateMachine } = require('./analyzer/stateMachine');
const { reconstructControlFlow } = require('./analyzer/controlFlow');
const { transformToAsyncFunction } = require('./transformer/asyncFunction');
const { removeHelperFunctions } = require('./utils/astHelpers');

module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'transform-await-generator',
    visitor: {
      Program: {
        enter(path, state) {
          state.awaiters = [];
          state.generators = [];
        },
        exit(path, state) {
          // 清理未使用的辅助函数
          if (state.opts.cleanupHelpers !== false) {
            removeHelperFunctions(path, state);
          }
        }
      },
      
      CallExpression(path, state) {
        const { node } = path;
        
        // 检测 __awaiter 调用
        if (
          t.isIdentifier(node.callee, { name: '__awaiter' }) ||
          t.isMemberExpression(node.callee) && 
          t.isIdentifier(node.callee.property, { name: '__awaiter' })
        ) {
          state.awaiters.push(path);
          
          // 验证调用结构
          if (!isValidAwaiterCall(node)) {
            path.skip();
            return;
          }
          
          // 提取生成器函数
          const generatorFunc = node.arguments[node.arguments.length - 1];
          
          if (!t.isFunction(generatorFunc)) {
            path.skip();
            return;
          }
          
          // 查找 __generator 调用
          const generatorCall = findGeneratorCall(generatorFunc.body);
          
          if (!generatorCall) {
            path.skip();
            return;
          }
          
          try {
            // 执行转换
            const asyncFunc = transformToAsyncFunction(
              path,
              node,
              generatorCall,
              t,
              state.opts
            );
            
            if (asyncFunc) {
              // 替换原调用
              path.replaceWith(asyncFunc);
              state.transformedCount = (state.transformedCount || 0) + 1;
            }
          } catch (error) {
            // 转换失败，保留原代码
            if (state.opts.verbose) {
              console.warn('转换失败:', error.message);
            }
            path.skip();
          }
        }
      }
    }
  };
};

function isValidAwaiterCall(node) {
  // 至少需要 4 个参数：thisArg, arg2, PromiseCtor, generatorFunc
  return node.arguments.length >= 4;
}

function findGeneratorCall(body) {
  if (!body) return null;
  
  // 处理 BlockStatement
  const statements = t.isBlockStatement(body) ? body.body : [body];
  
  for (const stmt of statements) {
    if (t.isReturnStatement(stmt) && stmt.argument) {
      return extractGeneratorCall(stmt.argument);
    }
    if (t.isExpressionStatement(stmt) && stmt.expression) {
      const genCall = extractGeneratorCall(stmt.expression);
      if (genCall) return genCall;
    }
  }
  
  return null;
}

function extractGeneratorCall(expr) {
  // return __generator(this, function*(i) { ... })
  if (
    t.isCallExpression(expr) &&
    t.isIdentifier(expr.callee, { name: '__generator' })
  ) {
    return expr;
  }
  
  // return [4, __awaiter(...)] 嵌套情况
  if (t.isArrayExpression(expr)) {
    for (const elem of expr.elements) {
      const genCall = extractGeneratorCall(elem);
      if (genCall) return genCall;
    }
  }
  
  return null;
}
```

### 4.2 状态机分析器 (src/analyzer/stateMachine.js)

```javascript
const t = require('@babel/types');

/**
 * 提取并分析状态机
 */
function extractStateMachine(generatorCall, t) {
  const generatorFunc = generatorCall.arguments[1];
  if (!generatorFunc || !t.isFunction(generatorFunc)) {
    throw new Error('Invalid generator function');
  }
  
  // 找到 switch(i.label) 语句
  const switchStmt = findSwitchStatement(generatorFunc.body);
  if (!switchStmt) {
    throw new Error('No switch statement found in generator');
  }
  
  // 解析所有状态
  const states = new Map();
  const paramNames = generatorFunc.params.map(p => p.name);
  const iteratorParam = paramNames[0] || 'i';
  
  switchStmt.cases.forEach(caseNode => {
    if (!caseNode.test || !t.isNumericLiteral(caseNode.test)) {
      return;
    }
    
    const stateId = caseNode.test.value;
    const stateData = parseStateCase(caseNode, iteratorParam, t);
    states.set(stateId, stateData);
  });
  
  return { states, switchStmt, iteratorParam };
}

function findSwitchStatement(body) {
  const statements = t.isBlockStatement(body) ? body.body : [body];
  
  for (const stmt of statements) {
    if (t.isSwitchStatement(stmt)) {
      // 验证是 switch(i.label)
      if (
        t.isMemberExpression(stmt.discriminant) &&
        t.isIdentifier(stmt.discriminant.object) &&
        t.isIdentifier(stmt.discriminant.property, { name: 'label' })
      ) {
        return stmt;
      }
    }
    // 递归查找嵌套块
    if (t.isBlockStatement(stmt) || t.isIfStatement(stmt)) {
      const nested = findSwitchStatement(stmt);
      if (nested) return nested;
    }
  }
  
  return null;
}

function parseStateCase(caseNode, iteratorParam, t) {
  const statements = caseNode.consequent;
  const state = {
    id: caseNode.test.value,
    regularStatements: [],
    awaits: [],
    labelAssignments: [],
    returnStmt: null,
    throwStmt: null,
    nextStates: []
  };
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    
    // return [4, promiseExpr] - await 点
    if (t.isReturnStatement(stmt) && t.isArrayExpression(stmt.argument)) {
      const arr = stmt.argument;
      if (arr.elements.length >= 2 && t.isNumericLiteral(arr.elements[0])) {
        const opcode = arr.elements[0].value;
        
        if (opcode === 4 || opcode === 1) {
          // await 操作
          const promiseExpr = arr.elements[1];
          const resultVar = findSentUsage(statements, i + 1, iteratorParam, t);
          state.awaits.push({
            expression: promiseExpr,
            resultVar: resultVar,
            index: state.awaits.length
          });
        } else if (opcode === 2) {
          // return 操作
          state.returnStmt = arr.elements[1] || t.identifier('undefined');
        } else if (opcode === 5) {
          // 嵌套 __awaiter
          state.nestedAwaiter = arr.elements[1];
        } else if (opcode === 3) {
          // throw 操作
          state.throwStmt = arr.elements[1];
        }
      }
      continue;
    }
    
    // i.label = x - 状态跳转
    if (
      t.isExpressionStatement(stmt) &&
      t.isAssignmentExpression(stmt.expression) &&
      t.isMemberExpression(stmt.expression.left) &&
      t.isIdentifier(stmt.expression.left.object, { name: iteratorParam }) &&
      t.isIdentifier(stmt.expression.left.property, { name: 'label' })
    ) {
      const target = stmt.expression.right.value;
      state.labelAssignments.push(target);
      state.nextStates.push(target);
      continue;
    }
    
    // i.sent() - 获取 await 结果（通常在 await 之后）
    if (
      t.isExpressionStatement(stmt) &&
      t.isCallExpression(stmt.expression) &&
      t.isMemberExpression(stmt.expression.callee) &&
      t.isIdentifier(stmt.expression.callee.object, { name: iteratorParam }) &&
      t.isIdentifier(stmt.expression.callee.property, { name: 'sent' })
    ) {
      // 标记为已处理的 sent 调用
      state.hasSentCall = true;
      continue;
    }
    
    // 普通语句
    state.regularStatements.push(stmt);
  }
  
  // 如果没有显式的 nextStates，推断下一个状态
  if (state.nextStates.length === 0 && caseNode.test.value < switchStmt.cases.length - 1) {
    const nextCase = switchStmt.cases.find(c => 
      c.test && c.test.value === caseNode.test.value + 1
    );
    if (nextCase) {
      state.nextStates.push(caseNode.test.value + 1);
    }
  }
  
  return state;
}

function findSentUsage(statements, startIndex, iteratorParam, t) {
  // 查找 i.sent() 的使用位置
  for (let i = startIndex; i < statements.length; i++) {
    const stmt = statements[i];
    
    // 变量赋值：var x = i.sent()
    if (
      t.isVariableDeclaration(stmt) &&
      stmt.declarations.some(decl => 
        t.isCallExpression(decl.init) &&
        t.isMemberExpression(decl.init.callee) &&
        t.isIdentifier(decl.init.callee.object, { name: iteratorParam }) &&
        t.isIdentifier(decl.init.callee.property, { name: 'sent' })
      )
    ) {
      return stmt.declarations[0].id;
    }
    
    // 直接赋值：x = i.sent()
    if (
      t.isExpressionStatement(stmt) &&
      t.isAssignmentExpression(stmt.expression) &&
      t.isCallExpression(stmt.expression.right) &&
      t.isMemberExpression(stmt.expression.right.callee) &&
      t.isIdentifier(stmt.expression.right.callee.object, { name: iteratorParam }) &&
      t.isIdentifier(stmt.expression.right.callee.property, { name: 'sent' })
    ) {
      return stmt.expression.left;
    }
  }
  
  return null;
}

module.exports = { extractStateMachine, parseStateCase };
```

### 4.3 转换器 (src/transformer/asyncFunction.js)

```javascript
const t = require('@babel/types');
const { extractStateMachine } = require('../analyzer/stateMachine');

/**
 * 将 __awaiter/__generator 结构转换为 async 函数
 */
function transformToAsyncFunction(path, awaiterCall, generatorCall, t, opts = {}) {
  const { states, iteratorParam } = extractStateMachine(generatorCall, t);
  
  // 获取 this 上下文和参数
  const thisArg = awaiterCall.arguments[0];
  const secondArg = awaiterCall.arguments[1];
  
  // 确定函数参数
  let funcParams = [];
  if (t.isIdentifier(secondArg, { name: 'arguments' })) {
    // 使用 arguments，需要从外层函数继承参数
    const outerFunc = path.findParent(p => p.isFunction());
    if (outerFunc && outerFunc.node.params) {
      funcParams = outerFunc.node.params.map(p => t.cloneNode(p));
    }
  } else {
    // 从生成器函数的闭包中推断参数
    funcParams = inferFunctionParams(path, t);
  }
  
  // 构建 async 函数体
  const asyncBody = buildAsyncFunctionBody(states, t, opts);
  
  // 创建 async 函数表达式
  const asyncFunc = t.functionExpression(
    null, // 匿名函数
    funcParams,
    t.blockStatement(asyncBody),
    false, // 不是生成器
    true   // 是 async 函数
  );
  
  // 如果需要保持 this 上下文
  if (!t.isThisExpression(thisArg) || opts.forceBind) {
    return t.callExpression(
      t.memberExpression(asyncFunc, t.identifier('bind')),
      [thisArg]
    );
  }
  
  return asyncFunc;
}

function buildAsyncFunctionBody(states, t, opts) {
  const statements = [];
  const processedStates = new Set();
  const pendingStates = [0]; // 从状态 0 开始
  
  // 收集需要提升的变量
  const hoistedVars = new Set();
  const allAwaits = [];
  
  // 第一遍：收集所有变量和 await 点
  states.forEach((state, id) => {
    state.regularStatements.forEach(stmt => {
      collectVariableDeclarations(stmt, hoistedVars, t);
    });
    state.awaits.forEach(awaitPt => {
      allAwaits.push(awaitPt);
    });
  });
  
  // 添加提升的变量声明
  hoistedVars.forEach(varName => {
    statements.push(
      t.variableDeclaration('let', [
        t.variableDeclarator(t.identifier(varName))
      ])
    );
  });
  
  // 第二遍：按控制流顺序生成代码
  while (pendingStates.length > 0) {
    const stateId = pendingStates.shift();
    
    if (processedStates.has(stateId)) continue;
    processedStates.add(stateId);
    
    const state = states.get(stateId);
    if (!state) continue;
    
    // 添加普通语句
    state.regularStatements.forEach(stmt => {
      statements.push(t.cloneNode(stmt, true));
    });
    
    // 添加 await 表达式
    state.awaits.forEach(awaitPt => {
      let awaitExpr;
      
      if (awaitPt.resultVar) {
        // 有接收变量的情况
        awaitExpr = t.variableDeclaration('let', [
          t.variableDeclarator(
            t.cloneNode(awaitPt.resultVar),
            t.awaitExpression(t.cloneNode(awaitPt.expression, true))
          )
        ]);
      } else {
        // 无接收变量，仅等待
        awaitExpr = t.expressionStatement(
          t.awaitExpression(t.cloneNode(awaitPt.expression, true))
        );
      }
      
      statements.push(awaitExpr);
    });
    
    // 处理返回
    if (state.returnStmt !== null) {
      statements.push(
        t.returnStatement(t.cloneNode(state.returnStmt, true))
      );
      break; // 终止
    }
    
    // 处理抛出
    if (state.throwStmt !== null) {
      statements.push(
        t.throwStatement(t.cloneNode(state.throwStmt, true))
      );
      break; // 终止
    }
    
    // 处理嵌套 awaiter
    if (state.nestedAwaiter) {
      const nestedResult = transformNestedAwaiter(state.nestedAwaiter, t, opts);
      statements.push(nestedResult);
    }
    
    // 添加到下一个状态
    state.nextStates.forEach(nextId => {
      if (!processedStates.has(nextId)) {
        pendingStates.push(nextId);
      }
    });
  }
  
  // 隐式返回 undefined（如果没有显式返回）
  if (statements.length === 0 || !statements.some(s => t.isReturnStatement(s))) {
    statements.push(t.returnStatement(t.identifier('undefined')));
  }
  
  return statements;
}

function collectVariableDeclarations(stmt, vars, t) {
  if (t.isVariableDeclaration(stmt)) {
    stmt.declarations.forEach(decl => {
      if (t.isIdentifier(decl.id)) {
        vars.add(decl.id.name);
      }
    });
  }
  
  // 递归处理块
  if (t.isBlockStatement(stmt) || t.isIfStatement(stmt)) {
    const body = t.isBlockStatement(stmt) ? stmt.body : [stmt.consequent, stmt.alternate];
    (Array.isArray(body) ? body : [body]).forEach(s => {
      if (s) collectVariableDeclarations(s, vars, t);
    });
  }
}

function inferFunctionParams(path, t) {
  // 尝试从上下文中推断函数参数
  const enclosingFunc = path.findParent(p => p.isFunction());
  if (enclosingFunc && enclosingFunc.node.params) {
    return enclosingFunc.node.params.map(p => t.cloneNode(p));
  }
  return [];
}

function transformNestedAwaiter(nestedAwaiter, t, opts) {
  // 递归处理嵌套的 __awaiter
  if (t.isCallExpression(nestedAwaiter) && 
      t.isIdentifier(nestedAwaiter.callee, { name: '__awaiter' })) {
    // 这里可以递归调用 transformToAsyncFunction
    // 简化处理：直接返回 await 调用
    return t.expressionStatement(
      t.awaitExpression(nestedAwaiter)
    );
  }
  return t.expressionStatement(nestedAwaiter);
}

module.exports = { transformToAsyncFunction, buildAsyncFunctionBody };
```

### 4.4 辅助函数清理 (src/utils/astHelpers.js)

```javascript
const t = require('@babel/types');

/**
 * 移除未使用的辅助函数定义
 */
function removeHelperFunctions(programPath, state) {
  const helperNames = ['__awaiter', '__generator', '__rest', '__extends'];
  
  programPath.traverse({
    FunctionDeclaration(path) {
      if (helperNames.includes(path.node.id.name)) {
        // 检查是否还有引用
        const binding = path.scope.getBinding(path.node.id.name);
        if (!binding || binding.referencePaths.length === 0) {
          path.remove();
          if (state.opts.verbose) {
            console.log(`移除未使用的辅助函数：${path.node.id.name}`);
          }
        }
      }
    },
    
    VariableDeclaration(path) {
      path.node.declarations.forEach((decl, idx) => {
        if (decl.id && t.isIdentifier(decl.id) && 
            helperNames.includes(decl.id.name)) {
          const binding = path.scope.getBinding(decl.id.name);
          if (!binding || binding.referencePaths.length === 0) {
            path.node.declarations.splice(idx, 1);
            if (state.opts.verbose) {
              console.log(`移除未使用的辅助变量：${decl.id.name}`);
            }
          }
        }
      });
      
      // 如果没有声明了，移除整个声明
      if (path.node.declarations.length === 0) {
        path.remove();
      }
    }
  });
}

module.exports = { removeHelperFunctions };
```

---

## 5. 配置选项

### 5.1 插件配置

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['transform-await-generator', {
      // 是否清理未使用的辅助函数
      cleanupHelpers: true,
      
      // 是否保持 this 绑定
      forceBind: false,
      
      // 详细日志
      verbose: false,
      
      // 严格模式：遇到无法转换的代码时报错
      strict: false,
      
      // 最小化代码生成
      compact: false,
      
      // 保留注释
      retainComments: true
    }]
  ]
};
```

### 5.2 CLI 使用

```bash
# 转换单个文件
npx babel input.js --plugins transform-await-generator --out-file output.js

# 转换整个目录
npx babel src/ --plugins transform-await-generator --out-dir dist/

# 带配置选项
npx babel src/ \
  --plugins "['transform-await-generator', {'cleanupHelpers': true, 'verbose': true}]" \
  --out-dir dist/
```

---

## 6. 测试策略

### 6.1 单元测试结构

```javascript
// test/plugin.test.js
const babel = require('@babel/core');
const plugin = require('../src/index');
const fs = require('fs');
const path = require('path');

describe('transform-await-generator', () => {
  const transform = (code, opts = {}) => {
    const result = babel.transformSync(code, {
      plugins: [[plugin, opts]],
      filename: 'test.js',
      sourceMaps: false
    });
    return result.code;
  };
  
  describe('基本转换', () => {
    it('应该转换简单的 await 模式', () => {
      const input = fs.readFileSync(path.join(__dirname, 'fixtures/simple-await.js'), 'utf8');
      const expected = fs.readFileSync(path.join(__dirname, 'fixtures/simple-await.expected.js'), 'utf8');
      expect(transform(input)).toBe(expected);
    });
    
    it('应该转换多个 await 的顺序执行', () => {
      // ...
    });
    
    it('应该转换并行 await (Promise.all)', () => {
      // ...
    });
  });
  
  describe('控制流', () => {
    it('应该正确处理条件分支', () => {
      // ...
    });
    
    it('应该正确处理 try-catch-finally', () => {
      // ...
    });
    
    it('应该正确处理循环中的 await', () => {
      // ...
    });
  });
  
  describe('边界情况', () => {
    it('应该处理没有 await 的 __awaiter', () => {
      // ...
    });
    
    it('应该处理嵌套的 __awaiter 调用', () => {
      // ...
    });
    
    it('应该在转换失败时保留原代码（非严格模式）', () => {
      // ...
    });
  });
});
```

### 6.2 测试用例示例

```javascript
// test/fixtures/simple-await.js (输入)
return __awaiter(this, void 0, Promise, function () {
  var result;
  return __generator(this, function (i) {
    switch (i.label) {
      case 0:
        return [4, fetchData()];
      case 1:
        result = i.sent();
        return [2, result];
    }
  });
});

// test/fixtures/simple-await.expected.js (期望输出)
return async () => {
  var result;
  result = await fetchData();
  return result;
};
```

---

## 7. 性能优化

### 7.1 缓存机制

```javascript
// 缓存已分析的状态机
const stateMachineCache = new WeakMap();

function getCachedStateMachine(generatorFunc) {
  if (stateMachineCache.has(generatorFunc)) {
    return stateMachineCache.get(generatorFunc);
  }
  const sm = extractStateMachine(generatorFunc);
  stateMachineCache.set(generatorFunc, sm);
  return sm;
}
```

### 7.2 增量转换

对于大型文件，可以采用增量转换策略：

```javascript
// 只转换修改过的函数
function incrementalTransform(ast, changedRanges) {
  const targets = findAwaitersInRanges(ast, changedRanges);
  targets.forEach(path => {
    // 只转换受影响的 __awaiter 调用
    transformToAsyncFunction(path, ...);
  });
}
```

---

## 8. 错误处理与调试

### 8.1 错误分类

| 错误类型 | 原因 | 处理策略 |
|---------|------|---------|
| `INVALID_GENERATOR` | 找不到有效的 `__generator` 函数 | 跳过转换，保留原代码 |
| `MISSING_SWITCH` | 生成器中没有 switch 语句 | 跳过转换 |
| `UNRECOGNIZED_OPCODE` | 遇到未知的状态码（如 6, 7...） | 警告并跳过该状态 |
| `CIRCULAR_STATE` | 状态机存在循环依赖 | 检测并中断，防止死循环 |
| `SCOPE_CONFLICT` | 变量作用域冲突 | 提升到最近共同作用域 |

### 8.2 调试输出

```javascript
// 启用详细日志
{
  plugins: [
    ['transform-await-generator', {
      verbose: true,
      debug: {
        printAST: true,      // 打印 AST
        printStates: true,   // 打印状态机
        printControlFlow: true // 打印控制流
      }
    }]
  ]
}
```

---

## 9. 与其他工具的集成

### 9.1 Webpack 集成

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['transform-await-generator', { cleanupHelpers: true }]
            ]
          }
        }
      }
    ]
  }
};
```

### 9.2 Rollup 集成

```javascript
// rollup.config.js
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: [
        ['transform-await-generator', { cleanupHelpers: true }]
      ]
    })
  ]
};
```

### 9.3 ESLint 规则

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['await-generator'],
  rules: {
    // 警告未转换的 __awaiter 调用
    'await-generator/no-raw-awaiter': 'warn',
    // 要求清理辅助函数
    'await-generator/cleanup-helpers': 'error'
  }
};
```

---

## 10. 实施路线图

### 阶段一：核心功能（2-3 周）
- [x] 实现基本的 `__awaiter` 识别
- [ ] 实现状态机解析算法
- [ ] 实现简单的线性控制流转换
- [ ] 编写基础单元测试

### 阶段二：复杂场景（2-3 周）
- [ ] 支持条件分支和循环
- [ ] 支持 try-catch-finally
- [ ] 支持嵌套 `__awaiter` 调用
- [ ] 变量作用域优化

### 阶段三：生产就绪（1-2 周）
- [ ] 错误处理和边界情况
- [ ] 性能优化和缓存
- [ ] 文档和示例
- [ ] CI/CD 集成

### 阶段四：生态建设（持续）
- [ ] ESLint 插件
- [ ] IDE 扩展
- [ ] 在线演示工具
- [ ] 社区反馈和优化

---

## 11. 参考资料

1. **Babel Plugin Handbook**: https://github.com/jamiebuilds/babel-handbook
2. **@babel/types API**: https://babeljs.io/docs/en/babel-types
3. **TypeScript Compiler Source**: https://github.com/microsoft/TypeScript/blob/main/src/compiler/emitter.ts
4. **Async/Await Spec**: https://tc39.es/ecma262/#sec-async-function-definitions
5. **Generator Functions**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator

---

## 附录 A：完整转换示例

### 输入代码
```javascript
function fetchData() {
  return __awaiter(this, void 0, Promise, function () {
    var user, posts, result;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return [4, getUser()];
        case 1:
          user = i.sent();
          if (!user) return [3, 3];
          return [4, getPosts(user.id)];
        case 2:
          posts = i.sent();
          result = { user: user, posts: posts };
          return [3, 4];
        case 3:
          result = null;
          i.label = 4;
        case 4:
          return [2, result];
      }
    });
  });
}
```

### 输出代码
```javascript
async function fetchData() {
  var user, posts, result;
  user = await getUser();
  if (!user) {
    result = null;
  } else {
    posts = await getPosts(user.id);
    result = { user: user, posts: posts };
  }
  return result;
}
```

---

**文档版本**: 1.0  
**最后更新**: 2024  
**作者**: Babel Plugin Design Team
