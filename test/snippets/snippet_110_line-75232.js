function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t,
      n,
      i,
      r,
      texto0,
      a,
      s,
      l,
      c,
      u,
      versionh0,
      p,
      version,
      f,
      m,
      g,
      textv0,
      w,
      k,
      href,
      E,
      S,
      M,
      x,
      T,
      D,
      A,
      P = this;
    return __generator(this, function (L) {
      switch (L.label) {
        case 0:
          n = (t = this).app;
          i = t.detailsEl;
          r = n.customCss;
          texto0 = e.name;
          a = e.repo;
          s = "" === texto0;
          l = r.isThemeInstalled(texto0);
          c = r.theme === texto0 && (s || l);
          u = r.oldThemes.contains(texto0) && !r.themes.hasOwnProperty(texto0);
          s && (texto0 = i18nProxy.setting.appearance.labelDefaultTheme());
          versionh0 = "";
          r.themes.hasOwnProperty(e.name) && (versionh0 = r.themes[e.name].version || "");
          return [4, r.getManifest(e.repo)];
        case 1:
          p = L.sent();
          version = "";
          return p ? [4, getLatestCompatibleVersion(a, p)] : [3, 3];
        case 2:
          version = L.sent() || p.version;
          L.label = 3;
        case 3:
          f = i.createDiv("community-modal-info");
          m = f.createDiv({
            cls: "community-modal-info-name",
            text: texto0
          });
          l && m.createSpan({
            cls: "flair mod-pop",
            text: u ? i18nProxy.plugins.customCss.labelLegacy() : i18nProxy.setting.thirdPartyPlugin.labelInstalled()
          });
          e.downloads && f.createDiv("community-modal-info-downloads", function (t) {
            t.createSpan({}, function (e) {
              setIcon(e, "lucide-download-cloud");
            });
            t.createSpan({
              cls: "community-modal-info-downloads-text",
              text: e.downloads.toLocaleString()
            });
          });
          if (version) {
            g = f.createDiv({
              cls: "community-modal-info-version",
              text: i18nProxy.setting.thirdPartyPlugin.labelVersion({
                version: version
              })
            });
            l && versionh0 && g.appendText(i18nProxy.setting.thirdPartyPlugin.labelCurrentlyInstalledVersion({
              version: versionh0
            }));
          }
          if (textv0 = e.author || p && p.author) {
            w = f.createDiv({
              cls: "community-modal-info-author",
              text: i18nProxy.setting.thirdPartyPlugin.labelByAuthor()
            });
            if (p && p.authorUrl) {
              w.createEl("a", {
                href: p.authorUrl,
                text: textv0,
                attr: {
                  target: "_blank",
                  rel: "noopener"
                }
              });
            } else {
              w.appendText(textv0);
            }
          }
          if (a && !s) {
            k = f.createDiv({
              cls: "community-modal-info-repo",
              text: i18nProxy.setting.thirdPartyPlugin.labelRepository()
            });
            href = getGithubRepoUrl(a);
            k.createEl("a", {
              href: href,
              text: href,
              attr: {
                target: "_blank",
                rel: "noopener"
              }
            });
          }
          E = async function (t) {
            var n,
              i = this;
            n = null;
            if (p) {
              n = await getLatestCompatibleVersion(a, p);
              if (!n) {
                new Notice("No appropriate version found.");
                return;
              }
            }
            await withLoadingClass(t, async function () {
              return r.installTheme(e, n);
            });
            this.update();
            await this.selectItem(texto0);
            return;
          };
          S = f.createDiv("community-modal-button-container");
          if (c) {
            s ? S.createEl("button", {
              text: i18nProxy.setting.appearance.labelCurrentlyActive(),
              attr: {
                disabled: !0
              }
            }) : S.createEl("button", {
              text: i18nProxy.plugins.customCss.labelStopUse()
            }).addEventListener("click", async function () {
              r.setTheme("");
              this.update();
              await this.selectItem(texto0);
              return;
            });
          } else {
            (M = S.createEl("button", {
              cls: "mod-cta",
              text: s || l ? i18nProxy.plugins.customCss.labelUse() : i18nProxy.plugins.customCss.labelInstallAndUse()
            })).addEventListener("click", async function () {
              if (!(s || l)) {
                await E(M);
              }
              r.setTheme(e.name);
              this.update();
              await this.selectItem(texto0);
              return;
            });
          }
          !s && l && (r.updates.hasOwnProperty(e.name) || compareVersion(versionh0, version) ? (x = S.createEl("button", {
            cls: "mod-cta",
            text: i18nProxy.plugins.customCss.labelUpdate()
          })).addEventListener("click", async function () {
            await E(x);
            this.update();
            await this.selectItem(texto0);
            return;
          }) : p || S.createEl("button", {
            text: i18nProxy.setting.appearance.buttonCheckForUpdates()
          }).addEventListener("click", function () {
            return __awaiter(P, void 0, void 0, function () {
              return __generator(this, function (t) {
                switch (t.label) {
                  case 0:
                    return [4, r.checkForUpdate(e)];
                  case 1:
                    return t.sent() ? [3, 2] : (new Notice(i18nProxy.plugins.customCss.msgNoUpdatesFound()), [3, 4]);
                  case 2:
                    return [4, this.selectItem(texto0)];
                  case 3:
                    t.sent();
                    t.label = 4;
                  case 4:
                    return [2];
                }
              });
            });
          }));
          r.isThemeInstalled(texto0) && S.createEl("button", {
            text: i18nProxy.setting.thirdPartyPlugin.labelUninstall()
          }).addEventListener("click", async function () {
            await r.removeTheme(texto0);
            this.update();
            await this.selectItem(texto0);
            new Notice(i18nProxy.plugins.customCss.msgDeletedTheme({
              title: texto0
            }));
            return;
          });
          return s ? (T = "\nA simple theme designed to feel intuitive across all platforms. Supports light and dark mode.\n", [3, 7]) : [3, 4];
        case 4:
          L.trys.push([4, 6,, 7]);
          return [4, requestLazy(getRawGithubUrl(a, "README.md")).text];
        case 5:
          T = L.sent();
          return [3, 7];
        case 6:
          L.sent();
          T = i18nProxy.plugins.customCss.labelNoReadme();
          return [3, 7];
        case 7:
          f.createEl("hr");
          D = f.createDiv("community-modal-readme markdown-rendered");
          A = compileMarkdown(parseMarkdown(T));
          D.appendChild(sanitizeHTMLToDom(A));
          processReleaseNotesImages(D, a);
          e.el && !Platform.isPhone && e.el.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
          return [2];
      }
    });
  });
}