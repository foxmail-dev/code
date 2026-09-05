function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, i, r, o, a, s, l;
    return __generator(this, function (c) {
      switch (c.label) {
        case 0:
          if (t = (e = this).emailEl, n = e.passwordEl, i = e.mfaEl, this.errorEl.hide(), r = t.value, o = n.value, a = i.value, "" === r) {
            this.showError(i18nProxy.setting.account.messageEmptyEmail());
            return [2];
          }
          if (-1 === r.indexOf("@")) {
            this.showError(i18nProxy.setting.account.messageInvalidEmail());
            return [2];
          }
          if ("" === o) {
            this.showError(i18nProxy.setting.account.messageEmptyPassword());
            return [2];
          }
          if ("" !== a && !/^\d{6}$/.test(a)) {
            this.showError(i18nProxy.setting.account.mfaWrongFormat());
            return [2];
          }
          this.loadingEl.show();
          this.contentEl.hide();
          c.label = 1;
        case 1:
          c.trys.push([1, 3,, 4]);
          return [4, signIn(account, r, o, a)];
        case 2:
          c.sent();
          this.close();
          return [3, 4];
        case 3:
          if ((s = c.sent()) instanceof ApiError) {
            (l = s.error).contains("2FA code is incorrect") ? this.showError(i18nProxy.setting.account.mfaVerificationFailed()) : l.contains("2FA code") ? (this.emailSectionEl.hide(), this.passwordSectionEl.hide(), this.mfaSectionEl.show()) : this.showError(l);
          } else {
            this.showError(i18nProxy.setting.account.messageLoginFailed());
          }
          this.loadingEl.hide();
          this.contentEl.show();
          return [3, 4];
        case 4:
          return [2];
      }
    });
  });
}