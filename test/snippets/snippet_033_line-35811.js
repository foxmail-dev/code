function (e) {
  var t = this;
  if (e.focusMetadata) this.view.metadataEditor.focusPropertyAtIndex(0);else if (e.focus) {
    var n = this.renderer.previewEl;
    n.tabIndex = -1;
    n.focus({
      preventScroll: !0
    });
  }
  e.hasOwnProperty("scroll") && this.renderer.applyScrollDelayed(e.scroll);
  var i = function () {
    return t.view.syncScroll();
  };
  if (void 0 !== e.line && e.line >= 0 && this.renderer.applyScrollDelayed(e.line, {
    highlight: !0
  }, i), void 0 !== e.propertyMatches) {
    var r = e.propertyMatches;
    r.length > 0 && this.view.canShowProperties() && __awaiter(t, void 0, void 0, function () {
      var e;
      return __generator(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, ensureMetadataEditor(this.app)];
          case 1:
            (e = t.sent()) && runWhenVisible(e.containerEl, function () {
              e.focusProperty(r[0].key);
            });
            return [2];
        }
      });
    });
  } else if (void 0 !== e.match) {
    var o = e.match,
      a = o.content,
      s = o.matches;
    if (s.length > 0) {
      var l = countNewlines(a, s[0][0]);
      this.renderer.applyScrollDelayed(l, {
        center: !0,
        highlight: !0
      }, i);
    }
  }
}