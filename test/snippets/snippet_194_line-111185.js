function () {
  return __awaiter(r, void 0, void 0, function () {
    var r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          o.trys.push([0, 2,, 3]);
          return [4, withModLoadingClass(i, function () {
            return updateVaultAccess(e.id, password, e.salt, e.host, e.encryption_version);
          })];
        case 1:
          o.sent();
          e.password = password;
          n.resolve();
          return [3, 3];
        case 2:
          r = o.sent();
          console.error(r);
          if (r instanceof XMLHttpRequest) {
            this.showError(i18nProxy.plugins.publish.msgNetworkError());
          } else {
            this.showError(r.message);
          }
          return [3, 3];
        case 3:
          return [2];
      }
    });
  });
}