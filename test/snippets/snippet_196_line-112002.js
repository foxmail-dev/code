function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n,
      i,
      r,
      o = this;
    return __generator(this, function (a) {
      n = e.workspace;
      this.registerEvents();
      t.addSettingTab(this.settingTab);
      t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
      n.onLayoutReady(async function () {
        await this.loadData();
        this.initialized = !0;
        this.dataLoaded = !0;
        this.requestSync();
        this.requestStatusBarUpdate();
        return;
      });
      this.timer = window.setInterval(this.requestSync.bind(this), 3e4);
      this.on("status-change", function () {
        return o.requestStatusBarUpdate();
      });
      if (Platform.isMobile) {
        n.onLayoutReady(function () {
          var e = n.rightSplit;
          o.statusIconEl = e.addHeaderButton("sync-small", o.openStatusIconMenu.bind(o));
          o.statusIconEl.addEventListener("contextmenu", o.openStatusIconMenu.bind(o));
          o.statusIconEl.addClass("sync-status-icon");
        });
      } else {
        (i = t.statusBarEl) && (r = i.createDiv("status-bar-item-segment"), this.statusIconEl = r.createSpan("status-bar-item-icon sync-status-icon"), i.addEventListener("click", this.openStatusIconMenu.bind(this)), i.addEventListener("contextmenu", this.openStatusIconMenu.bind(this)));
      }
      return [2];
    });
  });
}