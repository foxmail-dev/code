function () {
  return __awaiter(n, void 0, void 0, function () {
    var e = this;
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          return Platform.isPhone ? (this.backButtonEl = this.titleEl.createDiv("modal-setting-back-button", function (t) {
            t.addEventListener("click", e.returnToGridView);
            t.createSpan("modal-setting-back-button-icon", function (e) {
              setIcon(e, "lucide-arrow-left");
            });
          }), saveScrollPositions(this.sidebarEl), animateChildrenReplacement(this.contentEl, i, "right")) : i.createDiv("modal-setting-nav-bar", function (t) {
            t.createDiv("clickable-icon", function (t) {
              setTooltip(t, i18nProxy.interface.startScreen.buttonBack());
              setIcon(t, "lucide-chevron-left");
              t.addEventListener("click", e.returnToGridView);
            });
          }), [4, this.showItem(a)];
        case 1:
          return t.sent(), [2];
      }
    });
  });
}