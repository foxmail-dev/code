function () {
  return __awaiter(r, void 0, void 0, function () {
    var i, r, o, a, s, l;
    return __generator(this, function (c) {
      switch (c.label) {
        case 0:
          (i = null === (l = this.opts) || void 0 === l ? void 0 : l.displayMode) && (n.pdfViewer._scrollMode = 3, n.pdfViewer._spreadMode = 0);
          c.label = 1;
        case 1:
          return c.trys.push([1, 5,, 6]), r = this.containerEl, t && this.applySubpath(t), [4, n.open({
            url: this.app.vault.getResourcePath(filee0),
            ownerDocument: r.doc
          })];
        case 2:
          return c.sent(), this.file = filee0, i ? [4, (o = n.pdfViewer)._pagesCapability.promise] : [3, 4];
        case 3:
          if (c.sent(), !(a = o.getPageView(o._currentPageNumber - 1)).canvas) return [2];
          a.canvas.setCssStyles({
            maxWidth: "".concat(a.width, "px"),
            zoom: ""
          });
          r.createDiv("canvasWrapper").append(a.canvas);
          "auto" !== n.height && "page" !== n.height || r.setCssStyles({
            height: "auto"
          });
          c.label = 4;
        case 4:
          return [3, 6];
        case 5:
          return s = c.sent(), console.error(s), [3, 6];
        case 6:
          return [2];
      }
    });
  });
}