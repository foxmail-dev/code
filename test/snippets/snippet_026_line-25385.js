function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, error, y, w, k, C;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          n = this.app.metadataCache;
          i = this.getSourcePath();
          r = this.app.vault.getAbstractFileByPath(i);
          o = t.toLowerCase().split(" ");
          a = [];
          b.label = 1;
        case 1:
          b.trys.push([1, 6, 7, 12]);
          s = !0;
          l = __asyncValues(createBatchedAsyncGenerator(n.blockCache.getAll(e), {
            batchSize: 1,
            maxDelay: 0
          }));
          b.label = 2;
        case 2:
          return [4, l.next()];
        case 3:
          if (c = b.sent(), y = c.done) return [3, 5];
          if (C = c.value, s = !1, u = C, e.isCancelled()) return [3, 5];
          if (h = u.file, p = u.content, "md" !== h.extension) return [3, 4];
          for (d = 0, f = u.blocks; d < f.length; d++) {
            m = f[d];
            (g = this.matchBlock(r, h, m, null, p, o)) && a.push(g);
          }
          b.label = 4;
        case 4:
          s = !0;
          return [3, 2];
        case 5:
          return [3, 12];
        case 6:
          error = b.sent();
          w = {
            error: error
          };
          return [3, 12];
        case 7:
          b.trys.push([7,, 10, 11]);
          return s || y || !(k = l.return) ? [3, 9] : [4, k.call(l)];
        case 8:
          b.sent();
          b.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if (w) throw w.error;
          return [7];
        case 11:
          return [7];
        case 12:
          return [2, a];
      }
    });
  });
}