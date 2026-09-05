function () {
  return __awaiter(P, void 0, void 0, function () {
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          return [4, r.checkForUpdate(e)];
        case 1:
          return t.sent() ? [3, 2] : (new Notice(i18nProxy.plugins.customCss.msgNoUpdatesFound()), [3, 4]);
        case 2:
          return [4, this.selectItem(texto0)];
        case 3:
          t.sent();
          t.label = 4;
        case 4:
          return [2];
      }
    });
  });
}