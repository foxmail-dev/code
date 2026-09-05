function () {
  return __awaiter(this, void 0, Promise, function () {
    var e, t, n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          return isDevelopment ? [2, !0] : (e = this.app, navigator.onLine ? localStorage.getItem(MOBILE_FEEDBACK_KEY) ? [2, !1] : account.license || (null === (i = e.internalPlugins.getEnabledPluginById("sync")) || void 0 === i ? void 0 : i.getRemoteVaultId()) ? Platform.isIosApp ? [4, appPlugin.isInstalledFromStore()] : [3, 2] : [2] : [2, !1]);
        case 1:
          if (!r.sent()) return [2, !1];
          r.label = 2;
        case 2:
          return e.vault.getRoot().getFileCount() < 50 ? [2, !1] : (t = e.vault.configDir, [4, e.vault.adapter.stat(t)]);
        case 3:
          n = r.sent();
          return Date.now() - n.ctime < 15552e6 ? [2, !1] : [2, !0];
      }
    });
  });
}