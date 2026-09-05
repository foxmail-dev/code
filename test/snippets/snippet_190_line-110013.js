function () {
  return __awaiter(r, void 0, void 0, function () {
    var e, t, succeeded, i, r, o, a, s, l, c, u, h;
    return __generator(this, function (p) {
      switch (p.label) {
        case 0:
          e = this.checkboxes.filter(function (e) {
            return e.checkboxEl.checked;
          }).map(function (e) {
            return e.historyItem;
          });
          t = new Notice(i18nProxy.plugins.sync.msgRestoring() + " (0/".concat(e.length, ")"), 0);
          succeeded = 0;
          i = 0;
          r = 0;
          o = e;
          p.label = 1;
        case 1:
          if (!(r < o.length)) return [3, 11];
          a = o[r];
          p.label = 2;
        case 2:
          p.trys.push([2, 8,, 9]);
          return [4, this.plugin.getHistory(a.path, null)];
        case 3:
          s = p.sent();
          l = 0;
          c = s.items;
          p.label = 4;
        case 4:
          return l < c.length ? (u = c[l]).deleted ? [3, 6] : [4, this.plugin.restoreVersion(u.uid)] : [3, 7];
        case 5:
          p.sent();
          succeeded++;
          return [3, 7];
        case 6:
          l++;
          return [3, 4];
        case 7:
          i++;
          return [3, 9];
        case 8:
          h = p.sent();
          console.error(h);
          return [3, 9];
        case 9:
          t.setMessage(i18nProxy.plugins.sync.msgRestoring() + " (".concat(i, "/").concat(e.length, ")"));
          p.label = 10;
        case 10:
          r++;
          return [3, 1];
        case 11:
          setTimeout(function () {
            return t.hide();
          }, 4e3);
          new Notice(i18nProxy.plugins.sync.msgRestoringComplete({
            succeeded: succeeded,
            failed: e.length - succeeded
          }));
          return [2];
      }
    });
  });
}