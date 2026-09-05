function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          return (t = window.require) ? (n = t("fs"), i = sliceArrayBuffer, [4, n.promises.readFile(e)]) : [3, 2];
        case 1:
          return [2, i.apply(void 0, [r.sent()])];
        case 2:
          return [2, null];
      }
    });
  });
}