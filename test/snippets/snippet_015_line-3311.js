function readLocalFileSafe(e) {
  return __awaiter(this, void 0, Promise, function () {
    var t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return (t = safeRequire("fs")) && t.existsSync(e) ? [4, t.promises.readFile(e)] : [3, 2];
        case 1:
          return [2, n.sent()];
        case 2:
          return [2, null];
      }
    });
  });
}