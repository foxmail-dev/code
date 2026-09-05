function () {
  var e = this;
  if (this.textInputEl.isActiveElement()) {
    var t = this.getValue(),
      n = this.getSuggestions(t);
    if (Array.isArray(n)) this.showSuggestions(n);else {
      if (!n) return;
      __awaiter(e, void 0, void 0, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e = this.showSuggestions;
              return [4, n];
            case 1:
              e.apply(this, [t.sent()]);
              return [2];
          }
        });
      });
    }
  }
}