function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          return (t = this.csscache).has(e) ? [2, t.get(e)] : [4, (n = this.app.vault.adapter).exists(e)];
        case 1:
          return r.sent() ? [4, n.read(e)] : [3, 3];
        case 2:
          i = r.sent();
          t.set(e, i);
          return [2, i];
        case 3:
          return [2, null];
      }
    });
  });
}