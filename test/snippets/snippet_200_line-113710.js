function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n, i, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return [4, this.getServer()];
        case 1:
          n = o.sent();
          return t ? [3, 3] : [4, n.restore(e)];
        case 2:
          o.sent();
          return [2];
        case 3:
          r = arrayBufferToString;
          return [4, n.pull(e)];
        case 4:
          i = r.apply(void 0, [o.sent()]);
          return [2, this.vault.adapter.write(t, i)];
      }
    });
  });
}