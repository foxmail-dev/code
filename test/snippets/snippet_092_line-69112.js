function () {
  return __awaiter(n, void 0, void 0, function () {
    var e, n;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          if ("" === t) {
            this.controller.showError(i18nProxy.setting.account.messageEmptyEmail());
            return [2];
          }
          (e = i.buttonEl).addClass("mod-loading");
          a.label = 1;
        case 1:
          a.trys.push([1, 3, 4, 5]);
          return [4, signUp(t, o, r, "buy_sync")];
        case 2:
          a.sent();
          this.controller.goTo(new EmailVerificationScreen(t));
          return [3, 5];
        case 3:
          n = a.sent();
          console.error(n);
          if (n instanceof ApiError) {
            this.controller.showError(n.error);
          } else {
            this.controller.showError(i18nProxy.setting.account.messageSignupFailed());
          }
          return [3, 5];
        case 4:
          e.removeClass("mod-loading");
          return [7];
        case 5:
          return [2];
      }
    });
  });
}