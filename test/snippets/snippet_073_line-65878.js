function batchGetAll(e, t, n) {
  return __awaiter(this, void 0, void 0, function () {
    var i;
    var r;
    var o;
    var a;
    var s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          return [4, e.getAllKeys()];
        case 1:
          i = l.sent();
          r = 0;
          l.label = 2;
        case 2:
          return r < i.length ? (o = i[r], [4, e.getAll(IDBKeyRange.lowerBound(o), t)]) : [3, 4];
        case 3:
          a = l.sent();
          return 0 === (s = a.length) ? [3, 4] : (n(i.slice(r, r + s), a), r += s, [3, 2]);
        case 4:
          return [2];
      }
    });
  });
}