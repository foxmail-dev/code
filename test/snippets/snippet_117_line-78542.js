async function () {
  var e;
  var t;
  var n;
  var i;
  var r;
  var o;
  var a;
  var s;
  var l;
  var c;
  var u;
  var h = this;
  e = this.app.vault;
  t = Platform.isMobile ? WORKSPACE_MOBILE_STATE_FILENAME : WORKSPACE_STATE_FILENAME;
  n = {};
  try {
    r = (i = JSON).parse;
    n = r.apply(i, [await e.adapter.read(e.configDir + "/" + t)]);
  } catch {}
  n.hasOwnProperty("lastOpenFiles") && this.recentFileTracker.load(n.lastOpenFiles);
  await this.setLayout(n);
  if (!(!Platform.isDesktopApp || "Obsidian Sandbox" !== this.app.vault.getName())) {
    if (!((o = this.app.vault.adapter) instanceof FileSystemAdapter) || electron.ipcRenderer.sendSync("get-sandbox-vault-path") !== o.getBasePath()) {
      return;
    }
    for (new Notice(i18nProxy.interface.msgSandboxVault(), 0), a = [], this.iterateLeaves([this.rootSplit, this.floatingSplit], function (e) {
      a.push(e);
    }), s = 0, l = a; s < l.length; s++) l[s].detach();
    this.updateLayout();
    if ((c = this.app.metadataCache.getFirstLinkpathDest("Start Here", "")) && "md" === c.extension) {
      await this.getLeaf().openFile(c, {
        active: !0,
        state: {
          mode: "source",
          source: !1
        }
      });
    }
  }
  this.trigger("layout-ready");
  u = this.onLayoutReadyCallbacks;
  this.onLayoutReadyCallbacks = null;
  __awaiter(h, void 0, void 0, function () {
    var e;
    var t;
    var n;
    var plugin;
    var r;
    var o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          e = 0;
          t = u;
          a.label = 1;
        case 1:
          if (!(e < t.length)) return [3, 6];
          n = t[e];
          plugin = n.pluginId;
          r = n.callback;
          a.label = 2;
        case 2:
          a.trys.push([2, 4,, 5]);
          return [4, sleep(0)];
        case 3:
          a.sent();
          r();
          return [3, 5];
        case 4:
          o = a.sent();
          console.error(o);
          plugin && new Notice(i18nProxy.interface.msgPluginError({
            plugin: plugin
          }));
          return [3, 5];
        case 5:
          e++;
          return [3, 1];
        case 6:
          return [2];
      }
    });
  });
  return;
}