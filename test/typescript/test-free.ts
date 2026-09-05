async function test(arg1: number) {
  for (const body of [{ name: 1 }, { name: 2 }, { name: 3 }]) {
    console.debug(body);
  }
  for (let index = 0; index < arg1; index++) {
    try {
      for (let i = 0; i < arg1; i++) {
        console.debug(i);
        await Promise.resolve(i.toString());
      }
    } catch (error) {
      for (let i = 0; i < arg1; i++) {
        console.debug(i);
        await Promise.resolve(i.toString());
      }
    } finally {
      for (let i = 0; i < arg1; i++) {
        console.debug(i);
        await Promise.resolve(i.toString());
      }
    }
  }
}

async function* asyncGenerator() {
  yield await new Promise((resolve) => setTimeout(() => resolve(1), 1000));
  yield await new Promise((resolve) => setTimeout(() => resolve(2), 1000));
  yield await new Promise((resolve) => setTimeout(() => resolve(3), 1000));
}

(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num);
  }
})();

test(10);
