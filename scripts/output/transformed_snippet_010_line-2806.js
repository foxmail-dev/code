function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          n = this.getFullRealPath(e);
          return [4, this.fsPromises.lstat(n)];
        case 1:
          return (i = r.sent()).isFile() ? [4, this.reconcileFileCreation(e, t, i)] : [3, 3];
        case 2:
          r.sent();
          return [3, 7];
        case 3:
          return i.isDirectory() ? [4, this.reconcileFolderCreation(e, t)] : [3, 5];
        case 4:
          r.sent();
          return [3, 7];
        case 5:
          return i.isSymbolicLink() ? [4, this.reconcileSymbolicLinkCreation(e, t)] : [3, 7];
        case 6:
          r.sent();
          r.label = 7;
        case 7:
          return [2];
      }
    });
  });
}