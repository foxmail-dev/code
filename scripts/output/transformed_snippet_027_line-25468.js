function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n, i, r, o, a, s, l, c, u, h, filep0, downranked, alias, m, error, v, y, w, k;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          if (n = this.app.metadataCache, (i = this.fileSuggestions) || (i = this.fileSuggestions = n.getLinkSuggestions()), r = [], "" === t) {
            for (o = 0, a = i; o < a.length; o++) if (h = a[o], filep0 = h.file) {
              if (n.isUserIgnored(filep0.path)) continue;
              if (alias = h.alias) {
                r.push({
                  type: "alias",
                  alias: alias,
                  file: filep0,
                  path: h.path,
                  score: filep0.stat.mtime,
                  matches: null
                });
              } else {
                r.push({
                  type: "file",
                  file: filep0,
                  path: h.path,
                  score: filep0.stat.mtime,
                  matches: null
                });
              }
            } else r.push({
              type: "linktext",
              path: h.path,
              score: 0,
              matches: null
            });
            return [2, r.sort(compareSearchScores)];
          }
          s = i.length < 1e4 ? prepareFuzzySearch(t) : prepareSimpleSearch(t);
          b.label = 1;
        case 1:
          b.trys.push([1, 6, 7, 12]);
          l = !0;
          c = __asyncValues(createBatchedAsyncGenerator(asyncGeneratorFromArray(i), {
            maxDelay: 0
          }));
          b.label = 2;
        case 2:
          return [4, c.next()];
        case 3:
          if (u = b.sent(), v = u.done) return [3, 5];
          if (k = u.value, l = !1, h = k, e.isCancelled()) return [3, 5];
          if (filep0 = h.file) {
            downranked = n.isUserIgnored(filep0.path);
            (alias = h.alias) ? (m = s(alias)) && r.push({
              type: "alias",
              alias: alias,
              file: h.file,
              path: h.path,
              score: m.score + (downranked ? -10 : 0),
              matches: m.matches,
              downranked: downranked
            }) : (m = scoreFilePath(s, h.path)) && r.push({
              type: "file",
              file: h.file,
              path: h.path,
              score: m.score + (downranked ? -10 : 0),
              matches: m.matches,
              downranked: downranked
            });
          } else {
            (m = s(h.path)) && r.push({
              type: "linktext",
              path: h.path,
              score: m.score,
              matches: m.matches
            });
          }
          b.label = 4;
        case 4:
          l = !0;
          return [3, 2];
        case 5:
          return [3, 12];
        case 6:
          error = b.sent();
          y = {
            error: error
          };
          return [3, 12];
        case 7:
          b.trys.push([7,, 10, 11]);
          return l || v || !(w = c.return) ? [3, 9] : [4, w.call(c)];
        case 8:
          b.sent();
          b.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if (y) throw y.error;
          return [7];
        case 11:
          return [7];
        case 12:
          return [2, r];
      }
    });
  });
}