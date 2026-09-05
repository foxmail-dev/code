function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, url, title, i, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return this.inProgressPageLoad ? (e = this.inProgressPageLoad, url = e.url, title = e.title, i = e.navigate, this.inProgressPageLoad = null, url === BLANK_PAGE_URL ? [2] : (i && this.webviewFirstLoadFinished ? this.pushViewStackHistory(url) : this.webviewFirstLoadFinished || (this.webviewFirstLoadFinished = !0), this.url = url, this.addressBar.setValue(url), title ? (this.title = title, [3, 3]) : [3, 1])) : [2];
        case 1:
          return [4, this.storeCurrentPageTitle()];
        case 2:
          o.sent();
          o.label = 3;
        case 3:
          if (this.title !== BLANK_PAGE_URL) {
            this.leaf.tabHeaderInnerTitleEl.setText(this.title);
            this.plugin.db.addHistoryItem(this.url, this.title);
          }
          (r = this.app.internalPlugins.getEnabledPluginById("bookmarks")) && r.updateTabHeaders();
          if (!this.hasConfiguredWebContents) {
            this.hasConfiguredWebContents = !0;
            this.configureWebContents();
          }
          if ("reader" === this.mode) {
            this.displayReaderView();
          } else {
            this.webview.executeJavaScript("document.querySelectorAll('[target=\"_blank\"]').forEach(el => { el.removeAttribute('target')})");
          }
          this.app.workspace.requestSaveLayout();
          return [2];
      }
    });
  });
}