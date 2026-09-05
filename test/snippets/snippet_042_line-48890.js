function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, i, query, o, queryWords, s, l, c, u, h, p, d, f, m, g, v, path, w, k;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          for (t = (e = this).resultEl, n = e.inputEl, i = e.chooser, query = n.value, t.empty(), this.renderQueue.clear(), this.query = query, o = query.toLowerCase().split('"'), queryWords = [], s = 0; s < o.length; s++) if (s % 2 == 0) {
            queryWords.push.apply(queryWords, o[s].split(" "));
          } else {
            queryWords.push(o[s]);
          }
          queryWords = queryWords.map(function (e) {
            return e.trim();
          }).filter(function (e) {
            return !!e;
          });
          this.queryWords = queryWords;
          return query ? (sortSearchResults(l = this.getCachedResults()), l = l.slice(0, 30), i.setSuggestions(l.slice()), document.body.appendChild(t), c = "rtl" === getComputedStyle(n).direction, (u = function () {
            positionPopup(n.getBoundingClientRect(), t, {
              gap: 5,
              horizontalAlignment: c ? "right" : "left",
              preventOverlap: !0
            });
          })(), h = createDeferred(), p = i.addMessage("Searching..."), this.runFullSearch(query, queryWords, h), [4, h.promise]) : (this.inputEl.removeClass("has-no-results"), t.detach(), [2]);
        case 1:
          if (d = b.sent()) for (f = new Set(l.filter(function (e) {
            return "file" === e.type;
          }).map(function (e) {
            return e.path;
          })), m = 0, g = d; m < g.length && (v = g[m], !(l.length >= 30)); m++) {
            path = getPathWithoutExtension(v);
            if (!f.has(path)) {
              w = {
                type: "file",
                path: path,
                match: {
                  score: 0,
                  matches: []
                }
              };
              l.push(w);
              i.addSuggestion(w);
            }
          }
          k = 0 === l.length;
          n.toggleClass("has-no-results", k);
          if (k) {
            p.setText("No results found.");
          } else {
            p.detach();
          }
          u();
          return [2];
      }
    });
  });
}