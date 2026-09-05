function (currentMode) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, scroll, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return currentMode && this.currentMode !== currentMode ? (n = (t = this).currentMode, scroll = t.scroll, "source" !== n.type ? [3, 2] : [4, this.save()]) : [2, !1];
        case 1:
          o.sent();
          o.label = 2;
        case 2:
          r = n.getFoldInfo();
          this.app.foldManager.save(this.file, r);
          n.hide();
          this.currentMode = currentMode;
          currentMode.show();
          null !== this.data && currentMode.set(this.data, !1);
          currentMode.onResize();
          null !== scroll && currentMode.setEphemeralState({
            scroll: scroll
          });
          currentMode.applyFoldInfo(r);
          this.metadataEditor.setCollapse(!!r && r.folds.some(function (e) {
            return 0 === e.from;
          }), !1);
          this.updateButtons();
          this.containerEl.setAttribute("data-mode", this.getMode());
          return [2, !0];
      }
    });
  });
}