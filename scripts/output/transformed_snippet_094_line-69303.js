function (e) {
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
}