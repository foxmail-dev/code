function () {
  return __awaiter(L, void 0, void 0, function () {
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          return x ? [4, n.plugins.disablePluginAndSave(r)] : [3, 2];
        case 1:
          t.sent();
          return [3, 4];
        case 2:
          return [4, n.plugins.enablePluginAndSave(r)];
        case 3:
          t.sent();
          t.label = 4;
        case 4:
          return [4, this.selectItem(e.id)];
        case 5:
          t.sent();
          return [2];
      }
    });
  });
}