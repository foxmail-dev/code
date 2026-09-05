function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return e ? e === this.root ? [2] : t ? [4, this.adapter.trashSystem(e.path)] : [3, 2] : [2];
        case 1:
          if (n.sent()) return [2];
          n.label = 2;
        case 2:
          return [4, this.adapter.trashLocal(e.path)];
        case 3:
          n.sent();
          return [2];
      }
    });
  });
}