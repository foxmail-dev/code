function (themeInfo) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i, r, o, a, s, l, c, u, h, version, d, f;
    return __generator(this, function (m) {
      switch (m.label) {
        case 0:
          if (t = this.getThemeFolder(), n = this.updates || {}, i = themeInfo.name, r = themeInfo.repo, !this.isThemeInstalled(i)) return [2];
          o = null === (d = this.themes[i]) || void 0 === d ? void 0 : d.version;
          a = getRawGithubUrl(r, MANIFEST_JSON_FILENAME);
          s = null;
          m.label = 1;
        case 1:
          m.trys.push([1, 3,, 4]);
          return [4, requestLazy(a).json];
        case 2:
          return (s = m.sent()) && s.name && s.name === i ? [3, 4] : [2];
        case 3:
          m.sent();
          return [3, 4];
        case 4:
          return s ? [3, 10] : [4, this.downloadLegacyTheme(themeInfo)];
        case 5:
          l = m.sent();
          c = !!(null === (f = this.themes[themeInfo.name]) || void 0 === f ? void 0 : f.dir);
          u = c ? "".concat(t, "/").concat(i, "/").concat(THEME_CSS_FILENAME) : "".concat(t, "/").concat(i, ".css");
          h = "";
          m.label = 6;
        case 6:
          m.trys.push([6, 8,, 9]);
          return [4, this.app.vault.adapter.read(u)];
        case 7:
          h = m.sent();
          return [3, 9];
        case 8:
          m.sent();
          return [2, !1];
        case 9:
          return l !== h ? (n[i] = {
            themeInfo: themeInfo
          }, [2, !0]) : [2, !1];
        case 10:
          return [4, getLatestCompatibleVersion(r, s)];
        case 11:
          version = m.sent();
          return !o || version && compareVersion(o, version) ? (n[i] = {
            themeInfo: themeInfo,
            version: version
          }, [2, !0]) : [2, !1];
      }
    });
  });
}