function (e) {
  return __awaiter(this, arguments, Promise, function (loadingPluginId, t) {
    var n, i;
    void 0 === t && (t = !1);
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          if (!(n = this.manifests[loadingPluginId])) return [2, !1];
          if (this.isDeprecated(n) || "cmdr" === n.id && compareVersion(n.version, "0.5.4") || "obsidian-image-toolkit" === n.id && compareVersion(n.version, "1.4.3")) return new Notice("Unable to load plugin ".concat(n.name, " v").concat(n.version, ". This version has been reported to cause issues. Please check for a newer version of the plugin.")), [2, !1];
          if ("better-pdf-plugin" === n.id && "1.4.0" === n.version) return new Notice("Better PDF Plugin is no longer functional. We recommend uninstalling it.", 6e3), [2, !1];
          if (!Platform.isDesktopApp && n.isDesktopOnly) return [2, !1];
          r.label = 1;
        case 1:
          return r.trys.push([1, 3, 4, 5]), this.loadingPluginId = loadingPluginId, [4, this.loadPlugin(loadingPluginId, t)];
        case 2:
          return r.sent(), this.loadingPluginId = null, [3, 5];
        case 3:
          return i = r.sent(), this.loadingPluginId = null, new Notice(i18nProxy.interface.msgFailedToLoadPlugin({
            plugin: loadingPluginId
          })), console.error("Plugin failure: " + loadingPluginId, i), [2, !1];
        case 4:
          return startTiming("communityPlugins.".concat(loadingPluginId)), [7];
        case 5:
          return [2, !0];
      }
    });
  });
}