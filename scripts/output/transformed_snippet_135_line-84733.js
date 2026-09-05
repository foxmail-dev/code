function (t, n) {
  return __awaiter(e, void 0, void 0, function () {
    var e;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          if (e = searchQuery.match(t, n)) {
            i.addResult(t, e, n);
          } else {
            i.removeResult(t);
          }
          return !s || i.el.isShown() ? [3, 2] : [4, new Promise(function (e) {
            return i.el.onNodeInserted(e, !0);
          })];
        case 1:
          r.sent();
          r.label = 2;
        case 2:
          return [2];
      }
    });
  });
}