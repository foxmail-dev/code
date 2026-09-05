function e(_createVault, _openVault, _fs) {
  var i = this;
  this.previousScreens = [];
  this.errorNotice = null;
  this._createVault = _createVault;
  this._openVault = _openVault;
  this._fs = _fs;
  var r = this.containerEl = document.body.createDiv("mobile-onboarding"),
    o = r.createDiv("mobile-onboarding-navbar");
  this.backButtonEl = o.createDiv({
    cls: "back-button u-pop tappable",
    text: i18nProxy.interface.startScreen.buttonBack()
  }, function (e) {
    e.toggleVisibility(!1);
    e.addEventListener("click", function () {
      return i.back();
    });
  });
  var a = this.currentScreen = new StartScreen();
  a.controller = this;
  r.append(a.contentEl);
  appPlugin && __awaiter(i, void 0, void 0, function () {
    var e,
      t,
      n = this;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          e = this;
          return [4, appPlugin.addListener("appUrlOpen", function (e) {
            return __awaiter(n, void 0, void 0, function () {
              var t, n, i;
              return __generator(this, function (r) {
                switch (r.label) {
                  case 0:
                    if (!(t = parseCallbackUrl(e.url)) || !t.hasOwnProperty("sync-setup")) return [3, 4];
                    if (!(n = t.token)) return [2];
                    (i = new Notice(mobileStartScreenI18n.msgLoginPending())).containerEl.addClass("is-loading");
                    r.label = 1;
                  case 1:
                    return r.trys.push([1, 3,, 4]), [4, authToken(account, n)];
                  case 2:
                    return r.sent(), this.goTo(new CreateVaultScreen("obsidian-sync")), [3, 4];
                  case 3:
                    return r.sent(), i.containerEl.removeClass("is-loading"), i.setMessage("Failed went wrong."), i.containerEl.addClass("mod-error"), [3, 4];
                  case 4:
                    return [2];
                }
              });
            });
          })];
        case 1:
          e.appUrlOpenListener = i.sent();
          t = this;
          return [4, appPlugin.addListener("backButton", function (e) {
            n.back();
          })];
        case 2:
          t.androidBackButtonListener = i.sent();
          return [2];
      }
    });
  });
}