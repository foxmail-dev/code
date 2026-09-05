function (e) {
  return __awaiter(n, void 0, void 0, function () {
    var n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          if (e.preventDefault(), "" === email) {
            this.controller.showError(i18nProxy.setting.account.messageEmptyEmail());
            return [2];
          }
          if (-1 === email.indexOf("@")) {
            this.controller.showError(i18nProxy.setting.account.messageInvalidEmail());
            return [2];
          }
          (n = o.buttonEl).addClass("mod-loading");
          r.label = 1;
        case 1:
          r.trys.push([1, 3, 4, 5]);
          return [4, forgetPassword(email)];
        case 2:
          r.sent();
          new Notice(mobileStartScreenI18n.msgPasswordReset({
            email: email
          }));
          this.controller.backToLogin();
          return [3, 5];
        case 3:
          if ((i = r.sent()) instanceof ApiError) {
            this.controller.showError(i.error);
          } else {
            this.controller.showError(i18nProxy.setting.account.messageLoginFailed());
          }
          return [3, 5];
        case 4:
          n.removeClass("mod-loading");
          return [7];
        case 5:
          return [2];
      }
    });
  });
}