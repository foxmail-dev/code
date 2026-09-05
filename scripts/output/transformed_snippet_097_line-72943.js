function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i, r, o, a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          n = (t = this).app;
          return (i = t.files) && 0 !== i.length ? e ? [3, 2] : (r = this.inputEl.value, [4, n.vault.createFolder(r)]) : [2];
        case 1:
          s.sent();
          (o = n.vault.getAbstractFileByPathInsensitive(r)) instanceof TFolder && (e = o);
          s.label = 2;
        case 2:
          return (a = getMovableItems(i, e)).length > 0 ? [4, executeAsyncLinkUpdate(n, a, e)] : [3, 4];
        case 3:
          s.sent();
          s.label = 4;
        case 4:
          return [2];
      }
    });
  });
}