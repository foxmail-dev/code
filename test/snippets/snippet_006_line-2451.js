function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n, i, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return t ? (n = t.ctime, i = t.mtime, r = t.immediate, n && this.btime && this.btime.btime(e, n), i ? [4, this.fsPromises.utimes(e, i / 1e3, i / 1e3)] : [3, 2]) : [2];
        case 1:
          o.sent();
          o.label = 2;
        case 2:
          r && r();
          return [2];
      }
    });
  });
}