function () {
  return __awaiter(n, void 0, void 0, function () {
    var n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          n = this.getFullPath(e);
          return recursive ? [4, this.fsPromises.rm(n, {
            maxRetries: 5,
            recursive: recursive
          })] : [3, 2];
        case 1:
          i.sent();
          return [3, 4];
        case 2:
          return [4, this.fsPromises.rmdir(n, {
            maxRetries: 5
          })];
        case 3:
          i.sent();
          i.label = 4;
        case 4:
          return [4, this.reconcileInternalFile(e)];
        case 5:
          i.sent();
          return [2];
      }
    });
  });
}