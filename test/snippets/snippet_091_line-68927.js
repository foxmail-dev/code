function () {
  return __awaiter(n, void 0, void 0, function () {
    var e,
      n,
      i,
      r,
      a = this;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          return "local" !== (e = o.getValue()) ? [3, 6] : hasStoragePermission ? [3, 2] : [4, new Promise(function (e) {
            return a.controller.goTo(new AllowFileAccessScreen(e));
          })];
        case 1:
          s.sent();
          s.label = 2;
        case 2:
          return hasStoragePermission ? [4, filesystemPlugin.choose()] : [2];
        case 3:
          return (n = s.sent()) && n.path ? n.isRoot ? (new Notice("Please choose a different folder than the root folder of your device."), [2]) : (i = n.path, [4, this.controller.isDirectory(i)]) : [3, 5];
        case 4:
          if (s.sent()) {
            this.controller.openVault(i, !0);
          } else {
            new Notice("Failed to load external vault.");
          }
          s.label = 5;
        case 5:
          return [3, 11];
        case 6:
          return "obsidian-sync" !== e ? [3, 10] : account.token ? [4, withModLoadingClass(t.buttonEl, function () {
            return listVaults(account.token);
          })] : [3, 8];
        case 7:
          if ((r = s.sent()).vaults.length > 0 || r.shared.length > 0) {
            this.controller.goTo(new RemoteVaultOptionsScreen(r));
          } else {
            this.controller.goTo(new CreateVaultScreen("obsidian-sync"));
          }
          return [3, 9];
        case 8:
          this.controller.goTo(new SignInScreen());
          s.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if ("icloud" === e) {
            Platform.isIosApp ? this.controller.goTo(new IcloudMissingScreen()) : this.controller.goTo(new IcloudUnsupportedScreen());
          } else {
            this.controller.goTo(new SyncOtherScreen());
          }
          s.label = 11;
        case 11:
          return [2];
      }
    });
  });
}