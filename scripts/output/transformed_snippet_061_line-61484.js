function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v, y, w;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          return Platform.isDesktopApp ? (t = e.target, (n = t.closest(".page")) && n.instanceOf(HTMLElement) ? (i = parseInt(n.dataset.pageNumber), Number.isNaN(i) ? [2] : (r = !0, a = !1, (s = Platform.isDesktopApp && e.win.electron) && e.isTrusted ? [4, getElectronContextMenu(e)] : [3, 2])) : [2]) : [2];
        case 1:
          return !(l = b.sent()) || e.defaultPrevented ? [2] : (o = s.remote.webContents.fromId(l.webContentsId), r = (l.editFlags || {}).canCopy, [3, 3]);
        case 2:
          a = !0;
          b.label = 3;
        case 3:
          c = this.getPage(i);
          u = e.view.getSelection();
          h = u.toString();
          p = new Menu().addSections(["action", "selection", "annotation"]);
          h && (h = pdfjsViewer.removeNullCharacters(pdfjsLib.normalizeUnicode(h.replace(/[\n\r]+/g, " "))));
          Platform.isMacOS && s && h && p.addItem(function (e) {
            return e.setSection("action").setTitle(i18nProxy.interface.menu.lookupSelection({
              selection: truncateString(h, 25)
            })).setIcon("lucide-library").onClick(function () {
              s.remote.getCurrentWebContents().showDefinitionForSelection();
            });
          });
          d = this.getAnnotationFromEvt(c, e);
          f = null;
          m = null;
          return d && "Widget" !== d.data.subtype ? (f = d.data.id, [4, this.getAnnotatedText(c, f)]) : [3, 5];
        case 4:
          m = b.sent();
          b.label = 5;
        case 5:
          h && p.addItem(function (e) {
            return e.setSection("selection").setTitle(i18nProxy.interface.menu.copy()).setIcon("lucide-copy").setDisabled(!r).onClick(function () {
              if (s && o) {
                o.copy();
              } else {
                navigator.clipboard.writeText(h);
              }
            });
          });
          if (g = this.getTextSelectionRangeStr(n)) {
            v = this.getMarkdownLink("#page=".concat(i, "&selection=").concat(g), this.getPageLinkAlias(i));
            p.addItem(function (e) {
              return e.setSection("selection").setTitle(PdfI18n4.actionCopyQuote()).setIcon("lucide-copy").onClick(function () {
                navigator.clipboard.writeText("> ".concat(h.replace(/[\r\n]+/g, " "), "\n\n").concat(v));
              });
            });
            p.addItem(function (e) {
              return e.setSection("selection").setTitle(PdfI18n4.actionCopySelectionLink()).setIcon("lucide-copy").onClick(function () {
                navigator.clipboard.writeText(v);
              });
            });
          }
          if (f) {
            y = this.getMarkdownLink("#page=".concat(i, "&annotation=").concat(f), this.getPageLinkAlias(i));
            m && p.addItem(function (e) {
              return e.setSection("annotation").setTitle(PdfI18n4.actionCopyAnnotation()).setIcon("lucide-copy").onClick(function () {
                navigator.clipboard.writeText("> ".concat(m, "\n\n").concat(y));
              });
            });
            p.addItem(function (e) {
              return e.setSection("annotation").setTitle(PdfI18n4.actionCopyAnnotLink()).setIcon("lucide-copy").onClick(function () {
                navigator.clipboard.writeText(y);
              });
            });
          }
          this.clearEphemeralUI();
          p.showAtMouseEvent(e);
          ((null === (w = this.opts) || void 0 === w ? void 0 : w.isEmbed) || a) && e.preventDefault();
          return [2];
      }
    });
  });
}