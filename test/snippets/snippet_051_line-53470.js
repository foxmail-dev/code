function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var lastSavedData, i, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return e.saving ? [4, this.app.vault.cachedRead(e)] : [3, 2];
        case 1:
          lastSavedData = o.sent();
          return [3, 4];
        case 2:
          return [4, this.app.vault.read(e)];
        case 3:
          lastSavedData = o.sent();
          o.label = 4;
        case 4:
          if (i = this.lastSavedData, this.lastSavedData = lastSavedData, !t && i) {
            if (i === lastSavedData) return [2];
            if (this.dirty) {
              if ((r = this.getViewData()) === lastSavedData) return [2];
              if (r !== i && this.isPlaintext) {
                lastSavedData = applyPatch(i, r, lastSavedData);
                new Notice(i18nProxy.interface.msgFileChanged({
                  file: e.path
                }));
              }
            }
          }
          this.setData(lastSavedData, t);
          return [2];
      }
    });
  });
}