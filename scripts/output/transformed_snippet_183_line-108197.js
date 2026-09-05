function () {
  return __awaiter(this, void 0, Promise, function () {
    var e, t, n, i, r, o, a, path, l, c, u, h, p, d, f, m;
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          e = this.vault;
          t = [];
          return [4, this.apiList()];
        case 1:
          n = g.sent();
          this.isGuest = !n.owner;
          i = {};
          r = 0;
          o = n.files;
          g.label = 2;
        case 2:
          return r < o.length ? (a = o[r], path = a.path, i[path] = a, (l = e.getAbstractFileByPath(path)) && l instanceof TFile ? !1 === (m = this.getPublishFlag(l)) ? [3, 4] : [4, this.getHash(l)] : [3, 4]) : [3, 6];
        case 3:
          if (g.sent() !== a.hash) {
            t.push({
              path: path,
              ctime: a.ctime,
              mtime: a.mtime,
              size: a.size,
              type: "changed",
              checked: !0 === m
            });
          } else {
            t.push({
              path: path,
              ctime: a.ctime,
              mtime: a.mtime,
              size: a.size,
              type: "to-delete",
              checked: !1
            });
          }
          return [3, 5];
        case 4:
          t.push({
            path: path,
            ctime: a.ctime,
            mtime: a.mtime,
            size: a.size,
            type: "deleted",
            checked: !1
          });
          g.label = 5;
        case 5:
          r++;
          return [3, 2];
        case 6:
          for (c = e.getRoot(), u = [c]; u.length;) if ((h = u.pop()) instanceof TFolder) for (p = 0, d = h.children; p < d.length; p++) {
            f = d[p];
            u.push(f);
          } else if (h instanceof TFile && this.isFileSupported(h) && !i.hasOwnProperty(h.path)) {
            if (!1 === (m = this.getPublishFlag(h))) continue;
            t.push({
              path: h.path,
              ctime: 0,
              mtime: 0,
              size: 0,
              type: "new",
              checked: !0 === m
            });
          }
          return [2, t];
      }
    });
  });
}