/**
 * 边界条件测试用例 1: 基本 async/await
 * 测试最简单的 await 表达式转换
 */
async function basicAwait(): Promise<number> {
    const result = await Promise.resolve(42);
    return result;
}

/**
 * 边界条件测试用例 2: 多个 await 顺序执行
 * 测试连续 await 的转换
 */
async function sequentialAwaits(): Promise<string> {
    const a = await Promise.resolve('hello');
    const b = await Promise.resolve(' ');
    const c = await Promise.resolve('world');
    return a + b + c;
}

/**
 * 边界条件测试用例 3: await 在条件分支中
 * 测试 if/else 中包含 await
 */
async function conditionalAwait(flag: boolean): Promise<number> {
    if (flag) {
        return await Promise.resolve(1);
    } else {
        return await Promise.resolve(0);
    }
}

/**
 * 边界条件测试用例 4: await 在循环中
 * 测试 for 循环中包含 await
 */
async function loopAwait(items: number[]): Promise<number[]> {
    const results: number[] = [];
    for (const item of items) {
        const result = await Promise.resolve(item * 2);
        results.push(result);
    }
    return results;
}

/**
 * 边界条件测试用例 5: try-catch-finally 中的 await
 * 测试异常处理中的 await
 */
async function tryCatchAwait(): Promise<string> {
    try {
        const result = await Promise.resolve('success');
        return result;
    } catch (error) {
        return 'error: ' + (error as Error).message;
    } finally {
        console.log('cleanup');
    }
}

/**
 * 边界条件测试用例 6: 嵌套 async/await
 * 测试 async 函数调用 async 函数
 */
async function innerAsync(): Promise<number> {
    return await Promise.resolve(100);
}

async function outerAsync(): Promise<number> {
    const inner = await innerAsync();
    const outer = await Promise.resolve(inner + 50);
    return outer;
}

/**
 * 边界条件测试用例 7: await Promise.all
 * 测试并行 await
 */
async function parallelAwait(): Promise<number[]> {
    const [a, b, c] = await Promise.all([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3)
    ]);
    return [a, b, c];
}

/**
 * 边界条件测试用例 8: async 箭头函数
 * 测试箭头函数语法
 */
const asyncArrow = async (x: number): Promise<number> => {
    return await Promise.resolve(x * 2);
};

/**
 * 边界条件测试用例 9: async 方法在类中
 * 测试类方法中的 async/await
 */
class AsyncClass {
    async methodOne(): Promise<number> {
        return await Promise.resolve(1);
    }

    async methodTwo(): Promise<number> {
        const val = await this.methodOne();
        return val + 1;
    }
}

/**
 * 边界条件测试用例 10: 提前返回
 * 测试函数中有多个 return 语句
 */
async function earlyReturn(condition: boolean): Promise<number> {
    if (condition) {
        return await Promise.resolve(0);
    }
    
    const mid = await Promise.resolve(50);
    if (mid > 40) {
        return mid;
    }
    
    return await Promise.resolve(100);
}

export {
    basicAwait,
    sequentialAwaits,
    conditionalAwait,
    loopAwait,
    tryCatchAwait,
    outerAsync,
    parallelAwait,
    asyncArrow,
    AsyncClass,
    earlyReturn
};
