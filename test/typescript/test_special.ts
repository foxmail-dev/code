/**
 * 边界条件特殊场景测试用例
 * 测试各种特殊的 async/await 模式
 */

/**
 * 特殊测试 1: this 上下文绑定
 */
class ThisContextTest {
  private value: number = 42;

  async getValue(): Promise<number> {
    return await Promise.resolve(this.value);
  }

  async processValue(multiplier: number): Promise<number> {
    const base = await this.getValue();
    return await Promise.resolve(base * multiplier);
  }
}

/**
 * 特殊测试 2: 闭包中的 await
 */
function closureWithAwait() {
  const outer = "outer";

  return async function inner(x: number): Promise<string> {
    const awaited = await Promise.resolve("awaited");
    return `${outer}-${awaited}-${x}`;
  };
}

/**
 * 特殊测试 3: IIFE (立即调用函数表达式) 中的 async/await
 */
async function iifePattern(): Promise<number> {
  const result = await (async (): Promise<number> => {
    const val = await Promise.resolve(10);
    return val * 2;
  })();
  return result;
}

/**
 * 特殊测试 4: 可选链与 await
 */
interface Data {
  value?: {
    nested?: number;
  };
}

async function optionalChainAwait(data: Data | null): Promise<number> {
  const nested = data?.value?.nested;
  if (nested !== undefined) {
    return await Promise.resolve(nested);
  }
  return await Promise.resolve(0);
}

/**
 * 特殊测试 5: 空值合并运算符与 await
 */
async function nullishCoalescingAwait(
  value: number | null | undefined,
): Promise<number> {
  const result = value ?? (await Promise.resolve(-1));
  return result;
}

/**
 * 特殊测试 6: 解构赋值与 await
 */
async function destructuringAwait(): Promise<{ a: number; b: string }> {
  const { x, y } = await Promise.resolve({ x: 1, y: "hello" });
  return { a: x, b: y };
}

/**
 * 特殊测试 7: 展开运算符与 await
 */
async function spreadAwait(): Promise<number[]> {
  const base = await Promise.resolve([1, 2, 3]);
  const extra = await Promise.resolve([4, 5]);
  return [...base, ...extra];
}

/**
 * 特殊测试 8: 模板字符串中的 await
 */
async function templateStringAwait(name: string): Promise<string> {
  const greeting = await Promise.resolve("Hello");
  return `${greeting}, ${name}!`;
}

/**
 * 特殊测试 9: 三元运算符与 await
 */
async function ternaryAwait(condition: boolean): Promise<number> {
  return condition ? await Promise.resolve(1) : await Promise.resolve(0);
}

/**
 * 特殊测试 10: 逻辑运算符短路中的 await
 */
async function logicalOperatorAwait(flag: boolean): Promise<string> {
  // AND 短路
  const andResult = flag && (await Promise.resolve("truthy"));

  // OR 短路
  const orResult = !flag || (await Promise.resolve("also truthy"));

  return String(andResult) + "-" + String(orResult);
}

/**
 * 特殊测试 11: for...in 循环中的 await
 */
async function forInAwait(obj: Record<string, number>): Promise<number[]> {
  const results: number[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = await Promise.resolve(obj[key] * 2);
      results.push(value);
    }
  }
  return results;
}

/**
 * 特殊测试 12: do-while 循环中的 await
 */
async function doWhileAwait(limit: number): Promise<number> {
  let count = 0;
  let sum = 0;

  do {
    sum += await Promise.resolve(count);
    count++;
  } while (count < limit);

  return sum;
}

/**
 * 特殊测试 13: labeled statement 与 await (模拟 goto)
 */
async function labeledStatementAwait(): Promise<string> {
  outerLoop: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === 1 && j === 1) {
        break outerLoop;
      }
      const val = await Promise.resolve(`${i}-${j}`);
      console.log(val);
    }
  }
  return "completed";
}

/**
 * 特殊测试 14: generator-like 模式（不使用 yield）
 */
async function generatorLikePattern(items: number[]): Promise<number[]> {
  const results: number[] = [];
  let index = 0;

  while (index < items.length) {
    const item = items[index];
    const processed = await Promise.resolve(item * 2);
    results.push(processed);
    index++;
  }

  return results;
}

/**
 * 特殊测试 15: 递归 async 函数
 */
async function recursiveAsync(n: number): Promise<number> {
  if (n <= 1) {
    return await Promise.resolve(1);
  }
  const prev = await recursiveAsync(n - 1);
  const prev2 = await recursiveAsync(n - 2);
  return prev + prev2;
}

/**
 * 特殊测试 16: 异步工厂模式（get/set 不能使用 async）
 */
class AsyncAccessorTest {
  private _value: number = 0;

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = v * 2;
  }

  async getValueAsync(): Promise<number> {
    return await Promise.resolve(this._value);
  }

  async setValueAsync(v: number): Promise<void> {
    this._value = await Promise.resolve(v * 2);
  }
}

/**
 * 特殊测试 17: 异步工厂模式
 */
async function asyncFactory(
  type: string,
): Promise<{ type: string; created: boolean }> {
  const config = await Promise.resolve({ initialized: true });

  if (!config.initialized) {
    throw new Error("Not initialized");
  }

  return {
    type,
    created: true,
  };
}

/**
 * 特殊测试 18: 链式调用中的 await
 */
interface Chainable {
  value: number;
  multiply(n: number): Promise<Chainable>;
  add(n: number): Promise<Chainable>;
  getResult(): Promise<number>;
}

async function chainPattern(start: number): Promise<number> {
  let current = start;

  current = await Promise.resolve(current * 2);
  current = await Promise.resolve(current + 10);
  current = await Promise.resolve(current / 2);

  return current;
}

/**
 * 特殊测试 19: 错误传播测试
 */
async function errorPropagation(shouldThrow: boolean): Promise<string> {
  if (shouldThrow) {
    throw await Promise.reject(new Error("Async error"));
  }
  return "no error";
}

/**
 * 特殊测试 20: finally 中抛出异常
 */
async function finallyThrows(): Promise<string> {
  try {
    return await Promise.resolve("try block");
  } finally {
    await Promise.resolve("cleanup");
    throw new Error("Finally error");
  }
}

export {
  ThisContextTest,
  closureWithAwait,
  iifePattern,
  optionalChainAwait,
  nullishCoalescingAwait,
  destructuringAwait,
  spreadAwait,
  templateStringAwait,
  ternaryAwait,
  logicalOperatorAwait,
  forInAwait,
  doWhileAwait,
  labeledStatementAwait,
  generatorLikePattern,
  recursiveAsync,
  AsyncAccessorTest,
  asyncFactory,
  chainPattern,
  errorPropagation,
  finallyThrows,
};
