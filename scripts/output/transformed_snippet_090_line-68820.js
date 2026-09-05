function () {
  return __awaiter(t, void 0, void 0, function () {
    var e, t;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          if ("obsidian-sync" !== (e = r.getValue())) return [3, 10];
          if (!account.token) return [3, 8];
          t = void 0;
          i.label = 1;
        case 1:
          i.trys.push([1, 3,, 4]);
          return [4, withModLoadingClass(n.buttonEl, function () {
            return listVaults(account.token);
          })];
        case 2:
          t = i.sent();
          return [3, 4];
        case 3:
          i.sent();
          new Notice(i18nProxy.plugins.sync.msgErrorFailedToFetch());
          return [2];
        case 4:
          return 0 !== t.limit ? [3, 6] : [4, syncSignupMobile(account.token)];
        case 5:
          i.sent();
          this.controller.goTo(new EmailVerificationScreen(account.email));
          return [3, 7];
        case 6:
          if (t.vaults.length > 0 || t.shared.length > 0) {
            this.controller.goTo(new RemoteVaultOptionsScreen(t));
          } else {
            this.controller.goTo(new CreateVaultScreen("obsidian-sync"));
          }
          i.label = 7;
        case 7:
          return [3, 9];
        case 8:
          this.controller.goTo(new SignInOrSignUpScreen());
          i.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if ("icloud" === e) {
            this.controller.goTo(new CreateVaultScreen("icloud"));
          } else {
            this.controller.goTo(new SyncOtherScreen());
          }
          i.label = 11;
        case 11:
          return [2];
      }
    });
  });
}