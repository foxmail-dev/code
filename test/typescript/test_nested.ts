/**
 * 边界条件嵌套测试用例：复杂控制流
 * 测试多层嵌套的 async/await 结构
 */

/**
 * 嵌套测试 1: 循环中包含条件分支和 try-catch
 */
async function nestedLoopConditionTry(items: number[]): Promise<number[]> {
  const results: number[] = [];
  for (const item of items) {
    if (item > 0) {
      try {
        const result = await Promise.resolve(item * 2);
        results.push(result);
      } catch (e) {
        results.push(-1);
      }
    } else {
      results.push(0);
    }
  }
  return results;
}

/**
 * 嵌套测试 2: 条件分支中包含循环和 await
 */
async function conditionWithLoop(
  flag: boolean,
  count: number,
): Promise<number> {
  let sum = 0;
  if (flag) {
    for (let i = 0; i < count; i++) {
      sum += await Promise.resolve(i);
    }
  } else {
    sum = await Promise.resolve(-1);
  }
  return sum;
}

/**
 * 嵌套测试 3: try-catch-finally 完整结构，包含多层 await
 */
async function complexTryCatchFinally(): Promise<string> {
  let resource: string | null = null;
  try {
    resource = await Promise.resolve("acquired");
    console.log("Resource:", resource);

    const data = await Promise.resolve({ value: 42 });
    if (data.value > 0) {
      return "success: " + data.value;
    }
    return "normal exit";
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown error";
    return "caught: " + msg;
  } finally {
    if (resource) {
      await Promise.resolve("released");
      console.log("Resource released");
    }
  }
}

/**
 * 嵌套测试 4: 多层嵌套的 if-else 与 await
 */
async function deepNestedIfElse(
  a: number,
  b: number,
  c: number,
): Promise<string> {
  if (a > 0) {
    if (b > 0) {
      if (c > 0) {
        return await Promise.resolve("all positive");
      } else {
        return await Promise.resolve("c not positive");
      }
    } else {
      const val = await Promise.resolve("b not positive");
      return val;
    }
  } else {
    return await Promise.resolve("a not positive");
  }
}

/**
 * 嵌套测试 5: while 循环中的复杂逻辑
 */
async function whileLoopComplex(limit: number): Promise<number[]> {
  const results: number[] = [];
  let i = 0;
  while (i < limit) {
    if (i % 2 === 0) {
      const even = await Promise.resolve(i * 2);
      results.push(even);
    } else {
      try {
        const odd = await Promise.resolve(i * 3);
        results.push(odd);
      } catch (e) {
        results.push(-1);
      }
    }
    i++;
  }
  return results;
}

/**
 * 嵌套测试 6: switch-case 模拟（使用 if-else）与 await
 */
async function switchLikeAwait(code: number): Promise<string> {
  if (code === 1) {
    return await Promise.resolve("one");
  } else if (code === 2) {
    const val = await Promise.resolve(2);
    return "two: " + val;
  } else if (code === 3) {
    try {
      return await Promise.resolve("three");
    } catch (e) {
      return "three error";
    }
  } else {
    return await Promise.resolve("default");
  }
}

/**
 * 嵌套测试 7: Promise.all 在循环中
 */
async function promiseAllInLoop(iterations: number): Promise<number[][]> {
  const allResults: number[][] = [];
  for (let i = 0; i < iterations; i++) {
    const batch = await Promise.all([
      Promise.resolve(i),
      Promise.resolve(i * 10),
      Promise.resolve(i * 100),
    ]);
    allResults.push(batch);
  }
  return allResults;
}

/**
 * 嵌套测试 8: 多个连续的 try-catch 块
 */
async function multipleTryCatches(): Promise<string> {
  let result = "";

  try {
    const first = await Promise.resolve("first");
    result += first;
  } catch (e) {
    return "first failed";
  }

  try {
    const second = await Promise.resolve("-second");
    result += second;
  } catch (e) {
    return "second failed";
  }

  try {
    const third = await Promise.resolve("-third");
    result += third;
  } catch (e) {
    return "third failed";
  }

  return result;
}

/**
 * 嵌套测试 9: 异步迭代器模式
 */
async function asyncIteratorPattern(data: number[]): Promise<number[]> {
  const results: number[] = [];
  for (let i = 0; i < data.length; i++) {
    try {
      const processed = await Promise.resolve(data[i] * 2);
      if (processed > 10) {
        results.push(processed);
      } else {
        results.push(-processed);
      }
    } catch (e) {
      results.push(0);
    }
  }
  return results;
}

/**
 * 嵌套测试 10: 最复杂的嵌套场景
 * 循环 + 条件 + try-catch-finally + 多层 await + 提前返回
 */
async function ultraComplexScenario(
  items: number[],
  threshold: number,
  shouldFail: boolean,
): Promise<{ success: boolean; data: number[]; message: string }> {
  const results: number[] = [];
  let processedCount = 0;

  try {
    for (const item of items) {
      if (item < 0) {
        continue;
      }

      if (shouldFail && processedCount >= 2) {
        throw new Error("Intentional failure");
      }

      try {
        const doubled = await Promise.resolve(item * 2);

        if (doubled > threshold) {
          const tripled = await Promise.resolve(doubled * 3);
          results.push(tripled);
        } else {
          results.push(doubled);
        }

        processedCount++;
      } catch (innerError) {
        console.error("Inner error:", innerError);
        results.push(-1);
      }
    }

    return {
      success: true,
      data: results,
      message: `Processed ${processedCount} items`,
    };
  } catch (outerError) {
    return {
      success: false,
      data: results,
      message:
        outerError instanceof Error ? outerError.message : "Unknown error",
    };
  } finally {
    await Promise.resolve("cleanup");
    console.log("Ultra complex scenario completed");
  }
}

export {
  nestedLoopConditionTry,
  conditionWithLoop,
  complexTryCatchFinally,
  deepNestedIfElse,
  whileLoopComplex,
  switchLikeAwait,
  promiseAllInLoop,
  multipleTryCatches,
  asyncIteratorPattern,
  ultraComplexScenario,
};
