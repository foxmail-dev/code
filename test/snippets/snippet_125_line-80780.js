function (e) {
  return __awaiter(this, arguments, void 0, function (e, t) {
    var n;
    void 0 === t && (t = !1);
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return i.trys.push([0, 2,, 3]), [4, this.unloadPlugin(e, t)];
        case 1:
          return i.sent(), [3, 3];
        case 2:
          return n = i.sent(), new Notice(i18nProxy.setting.thirdPartyPlugin.msgFailedToDisablePlugin({
            id: e
          })), console.error("Plugin failure: " + e, n), [3, 3];
        case 3:
          return [2];
      }
    });
  });
}