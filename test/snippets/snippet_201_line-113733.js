function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return [4, this.getServer()];
        case 1:
          return [4, n.sent().listDeleted()];
        case 2:
          (t = n.sent()).reverse();
          if (e) {
            new SyncModalHeaderModal(this.app, this, t).open();
          } else {
            new DeletedFilesModal(this.app, this, i18nProxy.plugins.sync.labelDeletedFiles(), t).open();
          }
          return [2];
      }
    });
  });
}