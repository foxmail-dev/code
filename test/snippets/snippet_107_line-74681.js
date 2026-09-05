function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var namen0, i, r, o, a, s, l, c, u, h, p, d, f;
    return __generator(this, function (m) {
      switch (m.label) {
        case 0:
          namen0 = e.name;
          i = e.repo;
          (r = new Notice(i18nProxy.plugins.customCss.msgInstallingTheme({
            name: namen0
          }), 0)).containerEl.addClass("is-loading");
          try {
            o = [];
            if (a = localStorage.getItem("local-themes")) {
              o = JSON.parse(a);
              Array.isArray(o) || (o = []);
            }
            if (!o.contains(namen0)) {
              o.push(namen0);
              localStorage.setItem("local-themes", JSON.stringify(o));
              ajax({
                method: "POST",
                url: "https://releases.obsidian.md/stats/theme/".concat(encodeURIComponent(namen0), "/download")
              });
            }
          } catch (e) {
            console.error(e);
          }
          return t ? [3, 2] : [4, this.installLegacyTheme(e)];
        case 1:
          m.sent();
          delete this.updates[namen0];
          r.hide();
          return [2];
        case 2:
          m.trys.push([2, 5,, 13]);
          return [4, requestLazy(getGithubReleaseUrl(i, t, MANIFEST_JSON_FILENAME)).text];
        case 3:
          s = m.sent();
          return [4, requestLazy(getGithubReleaseUrl(i, t, THEME_CSS_FILENAME)).text];
        case 4:
          l = m.sent();
          return [3, 13];
        case 5:
          if (c = m.sent(), s || !(c instanceof RequestError) || 404 !== c.status) return [3, 11];
          m.label = 6;
        case 6:
          m.trys.push([6, 9,, 10]);
          return [4, requestLazy(getRawGithubUrl(i, MANIFEST_JSON_FILENAME)).text];
        case 7:
          s = m.sent();
          return [4, requestLazy(getRawGithubUrl(i, THEME_CSS_FILENAME)).text];
        case 8:
          l = m.sent();
          return [3, 10];
        case 9:
          u = m.sent();
          console.error(u);
          r.containerEl.removeClass("is-loading");
          r.containerEl.addClass("mod-error");
          r.setMessage(i18nProxy.plugins.customCss.msgFailedToInstallTheme({
            name: namen0
          }));
          setTimeout(function () {
            return r.hide();
          }, 3e3);
          return [2];
        case 10:
          return [3, 12];
        case 11:
          console.error(c);
          r.containerEl.removeClass("is-loading");
          r.containerEl.addClass("mod-error");
          r.setMessage(i18nProxy.plugins.customCss.msgFailedToInstallTheme({
            name: namen0
          }));
          setTimeout(function () {
            return r.hide();
          }, 3e3);
          return [2];
        case 12:
          return [3, 13];
        case 13:
          return JSON.parse(s).name !== namen0 ? (r.containerEl.removeClass("is-loading"), r.setMessage(i18nProxy.plugins.customCss.msgFailedToInstallTheme({
            name: namen0
          }) + " Theme name mismatch."), setTimeout(function () {
            return r.hide();
          }, 3e3), [2]) : (h = this.app.vault.adapter, p = this.getThemeFolder(), [4, h.exists(p)]);
        case 14:
          return m.sent() ? [3, 16] : [4, h.mkdir(p)];
        case 15:
          m.sent();
          m.label = 16;
        case 16:
          d = p + "/" + namen0;
          return [4, h.exists(d)];
        case 17:
          return m.sent() ? [3, 19] : [4, h.mkdir(d)];
        case 18:
          m.sent();
          m.label = 19;
        case 19:
          return [4, h.write(d + "/" + MANIFEST_JSON_FILENAME, s)];
        case 20:
          m.sent();
          return [4, h.write(d + "/" + THEME_CSS_FILENAME, l)];
        case 21:
          m.sent();
          f = "".concat(p, "/").concat(namen0, ".css");
          return [4, h.exists(f)];
        case 22:
          return m.sent() ? [4, h.remove(f)] : [3, 24];
        case 23:
          m.sent();
          m.label = 24;
        case 24:
          r.setMessage(i18nProxy.plugins.customCss.msgSuccessfullyInstalledTheme({
            name: namen0
          }));
          r.containerEl.removeClass("is-loading");
          r.containerEl.addClass("mod-success");
          setTimeout(function () {
            return r.hide();
          }, 3e3);
          delete this.updates[namen0];
          return [4, this.readThemes()];
        case 25:
          m.sent();
          return [2];
      }
    });
  });
}