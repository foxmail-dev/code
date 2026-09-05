function (e) {
  return __awaiter(this, arguments, Promise, function (e, t) {
    void 0 === t && (t = !1);
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return e ? e === this.root ? [2] : e instanceof TFile ? [4, this.adapter.remove(e.path)] : [3, 2] : [3, 4];
        case 1:
          return n.sent(), [3, 4];
        case 2:
          return e instanceof TFolder ? [4, this.adapter.rmdir(e.path, t)] : [3, 4];
        case 3:
          n.sent();
          n.label = 4;
        case 4:
          return [2];
      }
    });
  });
}