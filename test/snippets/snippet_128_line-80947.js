function (e, t, n) {
  return __awaiter(this, void 0, Promise, function () {
    var i, namer0, o, a, s, l, c, u, h, p, d, f, m;
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          i = n.id;
          namer0 = n.name;
          (o = new Notice(i18nProxy.setting.thirdPartyPlugin.msgInstallingPlugin({
            name: namer0
          }), 0)).containerEl.addClass("is-loading");
          a = null;
          g.label = 1;
        case 1:
          g.trys.push([1, 3,, 4]);
          return [4, requestLazy(getGithubReleaseUrl(e, t, PLUGIN_MANIFEST_JSON)).text];
        case 2:
          a = g.sent();
          return (s = JSON.parse(a)).id && s.id === i ? [3, 4] : (o.containerEl.removeClass("is-loading"), o.setMessage("Plugin ID mismatch."), setTimeout(function () {
            return o.hide();
          }, 3e3), [2]);
        case 3:
          l = g.sent();
          console.error(l);
          o.containerEl.removeClass("is-loading");
          o.setMessage(i18nProxy.setting.thirdPartyPlugin.msgFailedToInstallPlugin({
            name: namer0
          }));
          setTimeout(function () {
            return o.hide();
          }, 3e3);
          return [2];
        case 4:
          c = this.app.vault;
          u = this.getPluginFolder();
          return [4, c.exists(u)];
        case 5:
          return g.sent() ? [3, 7] : [4, c.createFolder(u)];
        case 6:
          g.sent();
          g.label = 7;
        case 7:
          h = u + "/" + i;
          return [4, c.exists(h)];
        case 8:
          return g.sent() ? [3, 10] : [4, c.createFolder(h)];
        case 9:
          g.sent();
          g.label = 10;
        case 10:
          return [4, (p = c.adapter).write(h + "/" + PLUGIN_MANIFEST_JSON, a)];
        case 11:
          g.sent();
          g.label = 12;
        case 12:
          g.trys.push([12, 15,, 16]);
          return [4, requestLazy(getGithubReleaseUrl(e, t, PLUGIN_MAIN_SCRIPT)).text];
        case 13:
          d = g.sent();
          f = d.replace(SOURCE_MAP_PATTERN, "") + NO_SOURCEMAP_MARKER;
          return [4, p.write(h + "/" + PLUGIN_MAIN_SCRIPT, f)];
        case 14:
          g.sent();
          return [3, 16];
        case 15:
          g.sent();
          console.log("".concat(namer0, ": ").concat(PLUGIN_MAIN_SCRIPT, " not found"));
          return [3, 16];
        case 16:
          g.trys.push([16, 19,, 20]);
          return [4, requestLazy(getGithubReleaseUrl(e, t, PLUGIN_STYLES_CSS)).text];
        case 17:
          m = g.sent();
          return [4, p.write(h + "/" + PLUGIN_STYLES_CSS, m)];
        case 18:
          g.sent();
          return [3, 20];
        case 19:
          g.sent();
          console.log("".concat(namer0, ": ").concat(PLUGIN_STYLES_CSS, " not found"));
          return [3, 20];
        case 20:
          delete this.updates[i];
          o.containerEl.removeClass("is-loading");
          o.containerEl.addClass("mod-success");
          o.setMessage(i18nProxy.setting.thirdPartyPlugin.msgSuccessfullyInstalledPlugin({
            name: namer0
          }));
          setTimeout(function () {
            return o.hide();
          }, 3e3);
          return [4, this.loadManifest(h)];
        case 21:
          g.sent();
          return this.plugins.hasOwnProperty(i) ? [4, this.disablePlugin(i)] : [3, 24];
        case 22:
          g.sent();
          return [4, this.enablePlugin(i, !0)];
        case 23:
          g.sent();
          g.label = 24;
        case 24:
          return [2];
      }
    });
  });
}