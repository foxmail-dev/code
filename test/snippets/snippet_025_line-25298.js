function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n, i, r, o, a, s, filel0, c, u, h, p, d, f, subpath, error, v, y, w, k;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          n = this.app.metadataCache;
          i = [];
          r = prepareQuery(t);
          o = 0;
          a = n.getCachedFiles();
          b.label = 1;
        case 1:
          if (!(o < a.length)) return [3, 14];
          if (s = a[o], e.isCancelled()) return [3, 14];
          if (n.isUserIgnored(s)) return [3, 13];
          if (!((filel0 = this.app.vault.getAbstractFileByPath(s)) instanceof TFile) || "md" !== filel0.extension) return [3, 13];
          if (!(c = n.getCache(s)) || !c.headings || 0 === c.headings.length) return [3, 13];
          b.label = 2;
        case 2:
          b.trys.push([2, 7, 8, 13]);
          u = !0;
          y = void 0;
          h = __asyncValues(createBatchedAsyncGenerator(asyncGeneratorFromArray(c.headings), {
            maxDelay: 0
          }));
          b.label = 3;
        case 3:
          return [4, h.next()];
        case 4:
          if (p = b.sent(), v = p.done) return [3, 6];
          if (k = p.value, u = !1, d = k, e.isCancelled()) return [3, 6];
          if (f = fuzzySearch(r, d.heading)) {
            subpath = "#" + stripHeadingForLink(d.heading);
            i.push({
              type: "heading",
              file: filel0,
              path: null,
              subpath: subpath,
              level: d.level,
              heading: d.heading,
              score: f.score,
              matches: f.matches
            });
          }
          b.label = 5;
        case 5:
          u = !0;
          return [3, 3];
        case 6:
          return [3, 13];
        case 7:
          error = b.sent();
          y = {
            error: error
          };
          return [3, 13];
        case 8:
          b.trys.push([8,, 11, 12]);
          return u || v || !(w = h.return) ? [3, 10] : [4, w.call(h)];
        case 9:
          b.sent();
          b.label = 10;
        case 10:
          return [3, 12];
        case 11:
          if (y) throw y.error;
          return [7];
        case 12:
          return [7];
        case 13:
          o++;
          return [3, 1];
        case 14:
          return [2, i];
      }
    });
  });
}