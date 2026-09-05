function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return e.startsWith("[[") ? ((n = this.manager.runnable) && n.cancel(), n = this.manager.runnable = new Runnable(), i = void 0, (r = this.inputEl.win.getSelection()) && r.rangeCount > 0 && (i = r.getRangeAt(0).startOffset), e = e.slice(2, i), [4, this.manager.getSuggestionsAsync(n, e)]) : [3, 2];
        case 1:
          return !(t = o.sent()) || n.isCancelled() ? [2, []] : (0 === t.length && (t = [EMPTY_SEARCH_RESULT]), t.sort(compareSearchScores), [3, 3]);
        case 2:
          t = function (e, t, n) {
            n = n.toLowerCase();
            for (var i = [], r = [n], o = e.metadataCache.getFrontmatterPropertyValuesForKey(t), a = 0, s = o; a < s.length; a++) {
              var textl0 = s[a];
              if ("" === n) i.push({
                type: "text",
                text: textl0,
                score: 0,
                matches: null
              });else {
                var matches = findSimpleMatches(r, textl0.toLowerCase());
                matches && i.push({
                  type: "text",
                  text: textl0,
                  score: calculateFuzzyScore(matches, n.length, textl0.length, 0),
                  matches: matches
                });
              }
            }
            i.sort(function (e, t) {
              return t.score - e.score;
            });
            return i;
          }(this.app, this.context.key, e);
          o.label = 3;
        case 3:
          return this.suggestionFilter ? [2, t.filter(this.suggestionFilter)] : [2, t];
      }
    });
  });
}