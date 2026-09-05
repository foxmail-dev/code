function () {
  return __awaiter(A, void 0, void 0, function () {
    var e;
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          return h && u ? (u.copy(), [3, 3]) : [3, 1];
        case 1:
          return e = r.getSelection(), [4, navigator.clipboard.writeText(e)];
        case 2:
          t.sent();
          t.label = 3;
        case 3:
          return [2];
      }
    });
  });
}