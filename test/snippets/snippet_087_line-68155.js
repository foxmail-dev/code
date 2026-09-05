function () {
  return __awaiter(i, void 0, void 0, function () {
    var e,
      i,
      o,
      s,
      l = this;
    return __generator(this, function (c) {
      switch (c.label) {
        case 0:
          if ("" === r.trim()) {
            new Notice(mobileStartScreenI18n.msgNameRequired());
            return [2];
          }
          if (e = "", !isAndroidApp || "app" === a) return [3, 9];
          c.label = 1;
        case 1:
          c.trys.push([1, 8,, 9]);
          return hasStoragePermission ? [3, 3] : [4, new Promise(function (e) {
            return l.controller.goTo(new AllowFileAccessScreen(e));
          })];
        case 2:
          c.sent();
          c.label = 3;
        case 3:
          return hasStoragePermission ? [4, filesystemPlugin.choose()] : [2];
        case 4:
          return (i = c.sent()) && i.path ? (o = i.path, [4, this.controller.isDirectory(o)]) : [3, 6];
        case 5:
          return c.sent() ? (e = o, [3, 7]) : (new Notice(mobileStartScreenI18n.msgInvalidVault()), [2]);
        case 6:
          return [2];
        case 7:
          return [3, 9];
        case 8:
          (s = c.sent()) && s.message && s.message.contains("canceled") || new Notice(s.toString());
          return [2];
        case 9:
          if ("obsidian-sync" === t) {
            n ? this.controller.goTo(new SyncSettingsScreen(r, e, n)) : this.controller.goTo(new SyncSetupScreen(r, e));
          } else {
            this.controller.createVault(r, e, "icloud" === t);
          }
          return [2];
      }
    });
  });
}