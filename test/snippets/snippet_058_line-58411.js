function () {
  return __awaiter(A, void 0, void 0, function () {
    var e;
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          return h && u ? (u.pasteAndMatchStyle(), [3, 3]) : [3, 1];
        case 1:
          return [4, navigator.clipboard.readText()];
        case 2:
          e = t.sent();
          r.replaceSelection(e);
          t.label = 3;
        case 3:
          return [2];
      }
    });
  });
}