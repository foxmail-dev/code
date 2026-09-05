function () {
  return __awaiter(this, void 0, void 0, function () {
    var e,
      t,
      n,
      i,
      r,
      o,
      a,
      s,
      l = this;
    return __generator(this, function (c) {
      switch (c.label) {
        case 0:
          return [4, (e = this.app).vault.readConfigJson("community-plugins")];
        case 1:
          (t = c.sent()) && Array.isArray(t) || (t = []);
          this.enabledPlugins = new Set(t);
          return [4, this.loadManifests()];
        case 2:
          if (c.sent(), n = this.manifests, 0 === Object.keys(n).length) return [2];
          if (!this.isEnabled()) {
            null === localStorage.getItem("enable-plugin-" + this.app.appId) && new TrustAuthorModal(e).open();
            return [2];
          }
          startTiming("communityPlugins");
          i = function (plugin) {
            var t;
            return __generator(this, function (i) {
              switch (i.label) {
                case 0:
                  return n.hasOwnProperty(plugin) ? (t = window.setTimeout(function () {
                    ProgressBar.instance.setContext(function (t) {
                      t.createDiv({
                        text: i18nProxy.interface.startUp.msgPluginHang({
                          plugin: plugin
                        })
                      });
                      t.createDiv("progress-bar-context-button", function (t) {
                        t.createEl("button", {
                          text: i18nProxy.setting.thirdPartyPlugin.buttonDisable()
                        }, function (t) {
                          t.onClickEvent(async function () {
                            this.enabledPlugins.delete(plugin);
                            await this.saveConfig();
                            window.location.reload();
                            return;
                          });
                        });
                      });
                    });
                  }, 3e3), [4, r.enablePlugin(plugin)]) : [3, 2];
                case 1:
                  i.sent();
                  ProgressBar.instance.clearContext();
                  clearTimeout(t);
                  i.label = 2;
                case 2:
                  return [2];
              }
            });
          };
          r = this;
          o = 0;
          a = t;
          c.label = 3;
        case 3:
          return o < a.length ? (s = a[o], [5, i(s)]) : [3, 6];
        case 4:
          c.sent();
          c.label = 5;
        case 5:
          o++;
          return [3, 3];
        case 6:
          this.requestSaveConfig();
          this.checkForDeprecations();
          setInterval(function () {
            return l.checkForDeprecations();
          }, 432e5);
          return [2];
      }
    });
  });
}