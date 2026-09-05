function (e, path, subpath) {
  return __awaiter(this, void 0, Promise, function () {
    var i, r, fileo0, a, s, l, c, u, h, p, d, f, m, g, v;
    return __generator(this, function (y) {
      switch (y.label) {
        case 0:
          i = this.app.metadataCache;
          r = this.getSourcePath();
          return (fileo0 = i.getFirstLinkpathDest(path, r)) ? "base" !== fileo0.extension ? [3, 2] : (a = prepareQuery(subpath.slice(1)), s = [], [4, this.app.vault.cachedRead(fileo0)]) : [2, []];
        case 1:
          for (l = y.sent(), c = null === (v = parseYaml(l)) || void 0 === v ? void 0 : v.views, u = [], c && Array.isArray(c) && (u = c.map(function (e) {
            return {
              name: null == e ? void 0 : e.name,
              type: null == e ? void 0 : e.type
            };
          }).filter(function (e) {
            return String.isString(e.name) && String.isString(e.type);
          })), h = 0, p = u; h < p.length; h++) {
            d = p[h];
            (f = fuzzySearch(a, d.name)) && s.push({
              type: "bases-view",
              file: fileo0,
              path: path,
              subpath: "#" + stripHeadingForLink(d.name),
              viewName: d.name,
              viewType: d.type,
              score: f.score,
              matches: f.matches
            });
          }
          return [2, s];
        case 2:
          return "md" !== fileo0.extension ? [2, []] : (m = i.getFileCache(fileo0), [4, searchHeadings(e, fileo0, null == m ? void 0 : m.headings, path, subpath)]);
        case 3:
          return (g = y.sent()).length > 0 ? [2, g] : [2, [{
            type: "heading",
            file: null,
            path: path,
            subpath: subpath,
            score: 0,
            heading: subpath.slice(1),
            level: 0,
            matches: [[0, subpath.length]]
          }]];
      }
    });
  });
}