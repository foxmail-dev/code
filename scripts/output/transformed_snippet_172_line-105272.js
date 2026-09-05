function (v) {
  switch (v.label) {
    case 0:
      (e = this.containerEl).empty();
      t = function () {
        var appVersion = i18nProxy.setting.about.labelUnknownVersion(),
          installerVersion = i18nProxy.setting.about.labelUnknownVersion(),
          update = "",
          checking = !1,
          updateDisabled = !1;
        withElectron(function (o) {
          var a = o.remote.app.getVersion();
          installerVersion = "v" + a;
          appVersion = "v" + o.ipcRenderer.sendSync("version");
          update = o.ipcRenderer.sendSync("update");
          checking = o.ipcRenderer.sendSync("check-update");
          updateDisabled = o.ipcRenderer.sendSync("disable-update");
        });
        return {
          appVersion: appVersion,
          installerVersion: installerVersion,
          update: update,
          checking: checking,
          updateDisabled: updateDisabled
        };
      }();
      n = t.appVersion;
      version = t.installerVersion;
      r = t.update;
      o = t.updateDisabled;
      a = t.checking;
      s = this.app.setting;
      if (Platform.isDesktopApp) {
        a && (l = function () {
          withElectron(function (e) {
            a = e.ipcRenderer.sendSync("check-update");
          });
          if (a) {
            setTimeout(l, 1e3);
          } else {
            g.display();
          }
        }, setTimeout(l, 300));
        new Setting(e).setName(i18nProxy.setting.about.labelApp()).setHeading();
        c = new Setting(e).setName(i18nProxy.setting.about.labelCurrentVersion() + n).setDesc(createFragment(function (e) {
          e.appendText(i18nProxy.setting.about.labelInstallVersion({
            version: version
          }));
          e.createEl("br");
          if ("update-downloaded" === r) {
            e.appendText(i18nProxy.setting.about.labelNewVersionReady());
            e.createEl("br");
            e.createEl("a", {
              text: i18nProxy.setting.about.labelReadChangelog(),
              attr: {
                href: "https://obsidian.md/changelog",
                target: "_blank",
                rel: "noopener"
              }
            });
          } else {
            "update-manual-required" === r || compareVersion(currentElectronVersion, REQUIRED_ELECTRON_VERSION) ? (e.createEl("b", {
              text: i18nProxy.setting.about.labelManualUpdateRequired()
            }), e.appendText(" "), e.createEl("a", {
              text: i18nProxy.dialogue.buttonDownload(),
              attr: {
                href: getDownloadUrl(),
                target: "_blank",
                rel: "noopener"
              }
            })) : (e.appendText(i18nProxy.setting.about.labelUpToDate()), e.createEl("br"), e.createEl("a", {
              text: i18nProxy.setting.about.labelReadChangelog(),
              attr: {
                href: "https://obsidian.md/changelog",
                target: "_blank",
                rel: "noopener"
              }
            }));
          }
        }));
        "update-downloaded" === r ? c.addButton(function (e) {
          return e.setCta().setButtonText(i18nProxy.setting.about.buttonRelaunch()).onClick(function () {
            withElectron(function (e) {
              e.ipcRenderer.sendSync("relaunch");
            });
          });
        }) : c.addButton(function (e) {
          return e.setCta().setButtonText(i18nProxy.setting.about.buttonCheckForUpdates()).setLoading(a).onClick(function () {
            withElectron(async function (e) {
              e.ipcRenderer.send("check-update", !0);
              this.display();
              return;
            });
          });
        });
        new Setting(e).setName(i18nProxy.setting.about.optionAutoUpdate()).setDesc(i18nProxy.setting.about.optionAutoUpdateDescription()).addToggle(function (e) {
          return e.setValue(!o).onChange(function (e) {
            withElectron(function (t) {
              t.ipcRenderer.sendSync("disable-update", !e);
              setTimeout(function () {
                return g.display();
              }, 500);
            });
          });
        });
        account.license && Platform.isDesktopApp && (u = !1, withElectron(function (e) {
          u = e.ipcRenderer.sendSync("insider-build", null);
        }), new Setting(e).setName(i18nProxy.setting.about.optionInsiderBuild()).setDesc(i18nProxy.setting.about.optionInsiderBuildDescription()).addToggle(function (e) {
          return e.setValue(u).onChange(function (e) {
            withElectron(function (t) {
              t.ipcRenderer.sendSync("insider-build", e);
            });
          });
        }));
      } else {
        isNativeApp && (h = i18nProxy.setting.about.labelCurrentVersion() + apiVersion, p = new Setting(e).setName(h), __awaiter(g, void 0, void 0, function () {
          var e;
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                return [4, appPlugin.getInfo()];
              case 1:
                e = t.sent();
                p.setName(h + " (".concat(e.build, ")"));
                return [2];
            }
          });
        }));
      }
      d = getLanguage();
      f = d;
      new Setting(e).setName(i18nProxy.setting.about.optionLanguage()).setDesc(createFragment(function (e) {
        e.appendText(i18nProxy.setting.about.optionLanguageDescription());
        e.createEl("br");
        e.createEl("a", {
          text: i18nProxy.setting.about.labelAddOwnLanguage(),
          attr: {
            href: "https://help.obsidian.md/Translations",
            target: "_blank",
            rel: "noopener"
          }
        });
      })).addButton(function (e) {
        m = e;
        e.setCta().setButtonText(i18nProxy.setting.about.buttonRelaunch()).onClick(function () {
          if (f === fallbackLng) {
            localStorage.removeItem(languageStorageKey);
          } else {
            localStorage.setItem(languageStorageKey, f);
          }
          window.location.reload();
        });
        e.buttonEl.hide();
      }).addDropdown(function (e) {
        e.onChange(function (e) {
          f = e;
          m.buttonEl.toggle(d !== f);
        });
        for (var t = 0, n = sortedLanguageKeys; t < n.length; t++) {
          var i = n[t];
          e.addOption(i, languageNamesMap[i]);
        }
        e.setValue(d);
      });
      new Setting(e).setName(i18nProxy.setting.about.optionGetHelp()).setDesc(i18nProxy.setting.about.optionGetHelpDescription()).addButton(function (e) {
        return e.setButtonText(i18nProxy.setting.about.buttonOpen()).onClick(function () {
          s.close();
          g.app.openHelp();
        });
      });
      new Setting(e).setName(i18nProxy.setting.account.name()).setHeading();
      this.accountSetting = new Setting(e);
      this.catalystSetting = new Setting(e);
      this.commercialLicenseSetting = new Setting(e);
      new Setting(e).setHeading().setName(i18nProxy.setting.about.optionAdvanced());
      new Setting(e).setName(i18nProxy.setting.about.optionCheckSlowStartup()).setDesc(i18nProxy.setting.about.optionCheckSlowStartupDescription()).addExtraButton(function (e) {
        return e.setIcon("lucide-timer").setTooltip(i18nProxy.setting.about.buttonCheckStartup()).onClick(function () {
          new StartupTimeDebugModal(g.app).open();
        });
      }).addToggle(function (e) {
        return e.setValue(g.app.loadLocalStorage("slow-startup-check")).onChange(function (e) {
          if (e) {
            g.app.saveLocalStorage("slow-startup-check", "1");
          } else {
            g.app.saveLocalStorage("slow-startup-check", null);
          }
        });
      });
      this.updateAccountSettings();
      v.label = 1;
    case 1:
      v.trys.push([1,, 4, 5]);
      return [4, getUserInfo(account)];
    case 2:
      v.sent();
      return [4, validateBusinessKey(account)];
    case 3:
      v.sent();
      return [3, 5];
    case 4:
      this.updateAccountSettings();
      return [7];
    case 5:
      return [2];
  }
}