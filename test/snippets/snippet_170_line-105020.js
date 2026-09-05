function t(t) {
  var n = e.call(this, t) || this;
  n.setTitle("Startup time");
  n.modalEl.addClass("mod-lg", "mod-scrollable-content", "mod-plugin-debug");
  var i = createNumberFormatter({
      maximumFractionDigits: 0
    }),
    r = function (e) {
      return i.format(e) + "ms";
    },
    o = n.contentEl.createDiv("startup-stat-list"),
    a = new StartupStatRow(o).addLabel("Device"),
    s = new StartupStatRow(o).addLabel("Operating system"),
    l = new StartupStatRow(o).addLabel("Obsidian");
  if (Platform.isMobileApp) __awaiter(n, void 0, void 0, function () {
    var e, t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return [4, devicePlugin.getInfo()];
        case 1:
          e = n.sent();
          a.addValue("".concat(e.manufacturer, " ").concat(e.model));
          s.addValue("".concat((i = e.platform, "ios" === i.toLowerCase() ? "iOS" : "android" === i.toLowerCase() ? "Android" : i), " ").concat(e.osVersion));
          return [4, appPlugin.getInfo()];
        case 2:
          t = n.sent();
          l.addDesc("v" + t.version);
          l.addLabel("Build");
          l.addDesc(t.build);
          return [2];
      }
      var i;
    });
  });else if (Platform.isDesktopApp) {
    a.containerEl.hide();
    s.addValue(operatingSystemName);
    var c = electron.ipcRenderer.sendSync("version"),
      u = electron.remote.app.getVersion();
    l.addDesc("v" + c);
    l.addLabel("Installer");
    l.addDesc("v" + u);
  }
  var h = n.contentEl.createDiv("startup-timing-list");
  new StartupStatRow(h).setHeading(!0).addLabel("Total app startup").addValue(r(getTimingDuration()));
  new StartupStatRow(h).addLabel("Initialization").addValue(r(getTimingDuration("initialization")));
  new StartupStatRow(h).addLabel("Vault").addDesc(i18nProxy.nouns.fileWithCount({
    count: t.vault.getRoot().getFileCount()
  })).addValue(r(getTimingDuration("vault")));
  new StartupStatRow(h).addLabel("Workspace").addDesc("".concat(viewCounts.views, " tabs (").concat(viewCounts.deferredViews, " deferred)")).addValue(r(getTimingDuration("workspace")));
  new StartupStatRow(h).addLabel("Core plugins").addDesc(i18nProxy.nouns.pluginActiveWithCount({
    count: t.internalPlugins.getEnabledPlugins().length
  })).addValue(r(getTimingDuration("corePlugins")));
  var p = n.contentEl.createDiv("startup-timing-list"),
    d = getTimingNode("communityPlugins");
  if (d) {
    for (var count = Object.keys(t.plugins.plugins).length, m = [], g = 0, v = Object.values(d.children); g < v.length; g++) {
      var w = v[g];
      m.push({
        id: w.key,
        time: w.duration
      });
    }
    new StartupStatRow(p).setHeading(!0).addLabel("Community plugins").addDesc(i18nProxy.nouns.pluginActiveWithCount({
      count: count
    })).addValue(r(getTimingDuration("communityPlugins")));
    m.sort(function (e, t) {
      return t.time - e.time;
    });
    for (var k = 0, C = m; k < C.length; k++) {
      var E = C[k],
        S = E.id,
        M = E.time,
        x = n.app.plugins.manifests[S];
      new StartupStatRow(p).addLabel(x ? x.name : S).addDesc(x ? "v" + x.version : "").addValue(r(M));
    }
  }
  n.addButton("mod-secondary", i18nProxy.interface.labelCopy(), async function () {
    var e = await getStartupBreakdown(t);
    await navigator.clipboard.writeText(e);
    new Notice(i18nProxy.interface.copied({
      context: "generic"
    }));
    return !0;
  }).addButton("mod-cancel", i18nProxy.dialogue.buttonDone(), function () {});
  return n;
}