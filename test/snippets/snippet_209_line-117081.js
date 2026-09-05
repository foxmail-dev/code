function (n) {
  return __awaiter(s, void 0, void 0, function () {
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return n ? [4, l.enablePluginAndSave(e.id)] : [3, 2];
        case 1:
          i.sent() || t.setValue(!1);
          return [3, 4];
        case 2:
          return [4, l.disablePluginAndSave(e.id)];
        case 3:
          i.sent();
          i.label = 4;
        case 4:
          p();
          n && setTimeout(p, 100);
          return [2];
      }
    });
  });
}