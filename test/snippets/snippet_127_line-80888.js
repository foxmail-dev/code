function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, i, r, o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          if (0 === Object.keys(this.plugins).length) return [2];
          a.label = 1;
        case 1:
          a.trys.push([1, 3,, 4]);
          return [4, requestLazy(COMMUNITY_PLUGIN_DEPRECATION_URL).json];
        case 2:
          deprecatedPluginVersions = a.sent();
          return [3, 4];
        case 3:
          a.sent();
          return [3, 4];
        case 4:
          for (n in e = this.plugins, t = [], e) t.push(n);
          i = 0;
          a.label = 5;
        case 5:
          return i < t.length ? (n = t[i]) in e ? (r = n, this.plugins.hasOwnProperty(r) ? (o = this.manifests[r] || this.plugins[r].manifest, this.isDeprecated(o) ? [4, this.disablePluginAndSave(r)] : [3, 7]) : [3, 7]) : [3, 7] : [3, 8];
        case 6:
          a.sent();
          new Notice("The plugin ".concat(o.name, " v").concat(o.version, " has been disabled. This version has been reported to cause issues. Please check for a newer version of the plugin."), 0);
          a.label = 7;
        case 7:
          i++;
          return [3, 5];
        case 8:
          return [2];
      }
    });
  });
}