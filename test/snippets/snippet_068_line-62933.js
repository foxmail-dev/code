function () {
  var e = this,
    t = this.inputEl.value,
    n = this.getSuggestions(t),
    i = function (t) {
      if (t && 0 !== t.length) {
        var n = e.limit;
        n && n > 0 && (t = t.slice(0, n));
        e.chooser.setSuggestions(t);
      } else e.onNoSuggestion();
    };
  if (Array.isArray(n)) {
    i(n);
  } else {
    __awaiter(e, void 0, void 0, function () {
      var e;
      return __generator(this, function (t) {
        switch (t.label) {
          case 0:
            e = i;
            return [4, n];
          case 1:
            e.apply(void 0, [t.sent()]);
            return [2];
        }
      });
    });
  }
}