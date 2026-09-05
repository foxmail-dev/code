function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t,
      n,
      i,
      r,
      texto0,
      texta0,
      s,
      l,
      c,
      u,
      h,
      version,
      d,
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
      P,
      L = this;
    return __generator(this, function (I) {
      switch (I.label) {
        case 0:
          n = (t = this).app;
          i = t.detailsEl;
          r = e.id;
          texto0 = e.name;
          texta0 = e.description;
          s = e.repo;
          l = getRawGithubUrl(s, PLUGIN_MANIFEST_JSON);
          c = getRawGithubUrl(s, "README.md");
          u = null;
          I.label = 1;
        case 1:
          I.trys.push([1, 3,, 4]);
          return [4, requestLazy(l).json];
        case 2:
          return (u = I.sent()).id && u.id === r ? [3, 4] : (new Notice("Plugin ID mismatch."), [2]);
        case 3:
          h = I.sent();
          console.error(h);
          new Notice(i18nProxy.setting.thirdPartyPlugin.msgFailedToLoadManifest());
          return [2];
        case 4:
          return [4, getLatestCompatibleVersion(s, u)];
        case 5:
          version = I.sent() || u.version;
          d = i.createDiv("community-modal-info");
          f = d.createDiv({
            cls: "community-modal-info-name",
            text: texto0
          });
          (m = n.plugins.manifests[r]) && f.createSpan({
            cls: "flair mod-pop",
            text: i18nProxy.setting.thirdPartyPlugin.labelInstalled()
          });
          e.downloads && d.createDiv("community-modal-info-downloads", function (t) {
            t.createSpan({}, function (e) {
              setIcon(e, "lucide-download-cloud");
            });
            t.createSpan({
              cls: "community-modal-info-downloads-text",
              text: e.downloads.toLocaleString()
            });
          });
          if (version) {
            g = d.createDiv({
              cls: "community-modal-info-version",
              text: i18nProxy.setting.thirdPartyPlugin.labelVersion({
                version: version
              })
            });
            m && m.version && g.appendText(i18nProxy.setting.thirdPartyPlugin.labelCurrentlyInstalledVersion({
              version: m.version
            }));
          }
          if (textv0 = e.author || u.author) {
            w = d.createDiv({
              cls: "community-modal-info-author",
              text: i18nProxy.setting.thirdPartyPlugin.labelByAuthor()
            });
            if (u.authorUrl) {
              w.createEl("a", {
                href: u.authorUrl,
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
          k = d.createDiv({
            cls: "community-modal-info-repo",
            text: i18nProxy.setting.thirdPartyPlugin.labelRepository()
          });
          href = getGithubRepoUrl(s);
          k.createEl("a", {
            href: href,
            text: href,
            attr: {
              target: "_blank",
              rel: "noopener"
            }
          });
          0 !== e.updated && d.createDiv({
            cls: "community-modal-info-repo",
            text: i18nProxy.setting.thirdPartyPlugin.labelLastUpdate()
          }, function (t) {
            t.createEl("a", {
              href: href + "/releases/latest",
              text: window.moment(e.updated).fromNow(),
              attr: {
                target: "_blank",
                rel: "noopener"
              }
            }, function (e) {
              return setTooltip(e, i18nProxy.setting.thirdPartyPlugin.tooltipViewLastUpdate());
            });
          });
          texta0 && d.createDiv({
            cls: "community-modal-info-desc",
            text: texta0
          });
          (E = !Platform.isDesktopApp && u.isDesktopOnly) && d.createDiv({
            cls: "mod-warning",
            text: i18nProxy.setting.thirdPartyPlugin.labelUnsupported()
          });
          S = d.createDiv("community-modal-button-container");
          (M = S.createEl("button", {
            cls: "mod-cta",
            text: i18nProxy.setting.thirdPartyPlugin.buttonInstall()
          })).addEventListener("click", async function () {
            var t,
              n = this;
            if (E) {
              new Notice(i18nProxy.setting.thirdPartyPlugin.labelUnsupported());
              return;
            }
            t = await getLatestCompatibleVersion(s, u);
            if (t) {
              await withModLoadingClass(M, function () {
                return n.app.plugins.installPlugin(s, t, u);
              });
            } else {
              new Notice("No appropriate version found.");
              return;
            }
            this.update();
            await this.selectItem(e.id);
            return;
          });
          if (m) {
            if (compareVersion(m.version, version)) {
              M.setText(i18nProxy.setting.thirdPartyPlugin.buttonUpdate());
            } else {
              M.detach();
            }
            if (x = n.plugins.getPlugin(r)) {
              T = this.app.setting;
              n.setting.pluginTabs.some(function (e) {
                return e.id === r;
              }) && S.createEl("button", {
                text: i18nProxy.setting.options()
              }).addEventListener("click", function () {
                L.close();
                T.open();
                T.openTabById(u.id);
              });
              Object.keys(n.commands.commands).some(function (e) {
                return e.startsWith(r + ":");
              }) && S.createEl("button", {
                text: i18nProxy.setting.hotkeys.name()
              }).addEventListener("click", function () {
                L.close();
                T.open();
                var e = T.openTabById("hotkeys");
                e instanceof HotkeysSettingTab && e.setQuery(u.id);
              });
            }
            S.createEl("button", {
              cls: x ? "mod-destructive" : "mod-cta",
              text: i18nProxy.setting.thirdPartyPlugin(x ? "button-disable" : "button-enable")
            }).addEventListener("click", function () {
              return __awaiter(L, void 0, void 0, function () {
                return __generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return x ? [4, n.plugins.disablePluginAndSave(r)] : [3, 2];
                    case 1:
                      t.sent();
                      return [3, 4];
                    case 2:
                      return [4, n.plugins.enablePluginAndSave(r)];
                    case 3:
                      t.sent();
                      t.label = 4;
                    case 4:
                      return [4, this.selectItem(e.id)];
                    case 5:
                      t.sent();
                      return [2];
                  }
                });
              });
            });
            S.createEl("button", {
              cls: "mod-destructive",
              text: i18nProxy.setting.thirdPartyPlugin.labelUninstall()
            }).addEventListener("click", async function () {
              await n.plugins.uninstallPlugin(r);
              this.update();
              await this.selectItem(e.id);
              return;
            });
          }
          S.createEl("button", {
            text: i18nProxy.setting.thirdPartyPlugin.buttonCopyShareLink()
          }).addEventListener("click", async function () {
            await navigator.clipboard.writeText("obsidian://show-plugin?id=" + encodeURIComponent(r));
            new Notice(i18nProxy.interface.copied());
            return;
          });
          u.fundingUrl && S.createEl("button", {
            text: i18nProxy.setting.thirdPartyPlugin.buttonDonate()
          }).addEventListener("click", function () {
            new DonateModal(n, e.name, u.fundingUrl).open();
          });
          I.label = 6;
        case 6:
          I.trys.push([6, 8,, 9]);
          return [4, requestLazy(c).text];
        case 7:
          D = I.sent();
          return [3, 9];
        case 8:
          I.sent();
          D = i18nProxy.setting.thirdPartyPlugin.labelNoReadme();
          return [3, 9];
        case 9:
          d.createEl("hr");
          A = d.createDiv("community-modal-readme markdown-rendered");
          P = compileMarkdown(parseMarkdown(D));
          A.appendChild(sanitizeHTMLToDom(P));
          processReleaseNotesImages(A, s);
          this.scrollIntoView(r);
          return [2];
      }
    });
  });
}