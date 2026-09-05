function () {
  return __awaiter(t, void 0, void 0, function () {
    var t, n, i, r, o, a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          t = this.getFullPath(e);
          n = this.getFullPath(".trash");
          return [4, this.fsPromises.mkdir(n, {
            recursive: !0
          })];
        case 1:
          s.sent();
          i = this.path.extname(t);
          r = this.path.basename(t, i);
          o = this.path.join(n, r + i);
          a = 1;
          s.label = 2;
        case 2:
          return [4, this._exists(o)];
        case 3:
          return s.sent() ? (a++, o = this.path.join(n, r + " " + a + i), [3, 2]) : [3, 4];
        case 4:
          return [4, this.fsPromises.rename(t, o)];
        case 5:
          s.sent();
          return [4, this.reconcileInternalFile(e)];
        case 6:
          s.sent();
          return [2];
      }
    });
  });
}