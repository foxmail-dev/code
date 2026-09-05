function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, config, r, o, a, s, l, c, u, h;
    return __generator(this, function (p) {
      switch (p.label) {
        case 0:
          t = (e = this).app;
          n = e.plugins;
          config = {};
          return [4, t.vault.readConfigJson("core-plugins")];
        case 1:
          return (r = p.sent()) ? Array.isArray(r) ? [4, t.vault.readConfigJson("core-plugins-migration")] : [3, 3] : [3, 4];
        case 2:
          for ((o = p.sent()) && "object" == typeof o && (config = o), a = new Set(r), s = 0, l = CORE_PLUGIN_IDS; s < l.length; s++) {
            u = l[s];
            n.hasOwnProperty(u) && (config[u] = a.has(u));
          }
          return [3, 4];
        case 3:
          "object" == typeof r && (config = r);
          p.label = 4;
        case 4:
          for (u in c = [], n) if (n.hasOwnProperty(u)) {
            h = n[u];
            if (config.hasOwnProperty(u)) {
              config[u] && c.push(h.enable(!1));
            } else {
              h.instance.defaultOn && c.push(h.enable(!1));
              this.requestSaveConfig();
            }
          }
          return [4, Promise.all(c)];
        case 5:
          p.sent();
          this.config = config;
          return [2];
      }
    });
  });
}