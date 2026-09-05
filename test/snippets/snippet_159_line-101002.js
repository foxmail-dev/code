function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i, path, o, a, paths0, l, c, data;
    return __generator(this, function (h) {
      switch (h.label) {
        case 0:
          return e && e instanceof TFile && ("md" === e.extension || "canvas" === e.extension || "base" === e.extension) ? (n = (t = this).db, i = t.tsCache, n ? (path = e.path, o = i[path], a = null, i.hasOwnProperty(path) ? [3, 2] : [4, this.getLastVersionByPath(path)]) : [2]) : [2];
        case 1:
          a = h.sent();
          o = a ? a.ts : 0;
          i[path] = o;
          h.label = 2;
        case 2:
          paths0 = Date.now();
          l = paths0 - o;
          c = this.options.intervalMinutes;
          (isNaN(c) || c < 0) && (c = 5);
          return l < 60 * c * 1e3 ? (this.pendingFiles.add(path), [2]) : [4, this.app.vault.cachedRead(e)];
        case 3:
          data = h.sent();
          return a ? [3, 5] : [4, this.getLastVersionByPath(path)];
        case 4:
          a = h.sent();
          h.label = 5;
        case 5:
          return a && a.data === data ? [2] : [4, n.add("backups", {
            path: path,
            ts: paths0,
            data: data
          })];
        case 6:
          h.sent();
          i[path] = paths0;
          return [2];
      }
    });
  });
}