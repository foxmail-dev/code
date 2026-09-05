function (e) {
  return __awaiter(r, void 0, void 0, function () {
    var r, o, h, d;
    return __generator(this, function (f) {
      switch (f.label) {
        case 0:
          if (e.preventDefault(), "" === t) {
            this.controller.showError(i18nProxy.setting.account.messageEmptyEmail());
            return [2];
          }
          if (-1 === t.indexOf("@")) {
            this.controller.showError(i18nProxy.setting.account.messageInvalidEmail());
            return [2];
          }
          if ("" === a) {
            this.controller.showError(i18nProxy.setting.account.messageEmptyPassword());
            return [2];
          }
          if ("" !== s && !/^\d{6}$/.test(s)) {
            this.controller.showError(i18nProxy.setting.account.mfaWrongFormat());
            return [2];
          }
          (r = p.buttonEl).addClass("mod-loading");
          f.label = 1;
        case 1:
          f.trys.push([1, 7, 8, 9]);
          return [4, signIn(account, t, a, s)];
        case 2:
          return [4, listVaults(f.sent().token)];
        case 3:
          return 0 !== (o = f.sent()).limit ? [3, 5] : [4, syncSignupMobile(account.token)];
        case 4:
          f.sent();
          this.controller.goTo(new EmailVerificationScreen(t));
          return [3, 6];
        case 5:
          if (o.vaults.length > 0 || o.shared.length > 0) {
            this.controller.goTo(new RemoteVaultOptionsScreen(o));
          } else {
            this.controller.goTo(new CreateVaultScreen("obsidian-sync"));
          }
          f.label = 6;
        case 6:
          i.setValue("");
          n.setValue("");
          return [3, 9];
        case 7:
          if ((h = f.sent()) instanceof ApiError) {
            (d = h.error).contains("2FA code is incorrect") ? this.controller.showError(i18nProxy.setting.account.mfaVerificationFailed()) : d.contains("2FA code") ? (l.containerEl.hide(), c.containerEl.hide(), u.containerEl.show()) : this.controller.showError(d);
          } else {
            this.controller.showError(i18nProxy.setting.account.messageLoginFailed());
          }
          return [3, 9];
        case 8:
          r.removeClass("mod-loading");
          return [7];
        case 9:
          return [2];
      }
    });
  });
}