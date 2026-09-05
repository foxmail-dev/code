function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, i, r, o, a, s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          if (t = (e = this).parentModal, n = e.slugInputEl, i = t.plugin, t.hideError(), r = n.value.toLowerCase(), !/^[a-z0-9\-]+$/.test(r)) {
            t.showError(i18nProxy.plugins.publish.msgInvalidSiteId());
            return [2];
          }
          l.label = 1;
        case 1:
          l.trys.push([1, 3,, 13]);
          return [4, i.apiCheckSlug(r)];
        case 2:
          l.sent();
          t.showError(i18nProxy.plugins.publish.msgSiteIdInUse());
          return [3, 13];
        case 3:
          if (!((o = l.sent()) instanceof PublishRequestError && "NOTFOUND" === o.code)) return [3, 11];
          l.label = 4;
        case 4:
          l.trys.push([4, 9,, 10]);
          return [4, (tokenc0 = account.token, apiRequest("/publish/create", {
            token: tokenc0
          }))];
        case 5:
          a = l.sent();
          return [4, i.apiSetSlug(a.id, a.host, r)];
        case 6:
          l.sent();
          return [4, i.setup(a.id, a.host)];
        case 7:
          l.sent();
          return [4, t.openReviewChanges()];
        case 8:
          l.sent();
          return [3, 10];
        case 9:
          s = l.sent();
          t.handleError(s);
          return [3, 10];
        case 10:
          return [3, 12];
        case 11:
          t.handleError(o);
          l.label = 12;
        case 12:
          return [3, 13];
        case 13:
          return [2];
      }
      var tokenc0;
    });
  });
}