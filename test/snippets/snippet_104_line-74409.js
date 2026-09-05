function () {
  return __awaiter(t, void 0, void 0, function () {
    var t, n, i, textContent;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          n = (t = this).styleEl;
          i = t.theme;
          textContent = "";
          return e ? (textContent = e, [3, 3]) : [3, 1];
        case 1:
          return i ? [4, this.loadCss(this.getThemePath(i))] : [3, 3];
        case 2:
          textContent = o.sent();
          o.label = 3;
        case 3:
          if (n.textContent !== textContent) {
            n.textContent = textContent;
            this.app.workspace.trigger("css-change");
            this.app.workspace.trigger("resize");
          }
          return [2];
      }
    });
  });
}