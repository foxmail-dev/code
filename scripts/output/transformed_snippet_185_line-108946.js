function () {
  var e = this,
    t = this,
    n = t.app,
    i = t.sync,
    r = t.containerEl;
  if (r.empty(), Platform.supportsIndexedDb) {
    if (i.initialized) {
      var o = i.getRemoteVaultId(),
        namea0 = i.getRemoteVaultName();
      if (account.token) {
        var service = "",
          l = n.vault.adapter;
        if (l instanceof FileSystemAdapter) {
          if ((c = l.getBasePath().toLowerCase()).contains("dropbox")) {
            service = "Dropbox";
          } else {
            c.contains("com~apple~clouddocs") || c.contains("icloud~") ? service = "iCloud" : c.contains("onedrive") && (service = "OneDrive");
          }
        } else l instanceof CapacitorAdapter && "ICLOUD" === l.fs.dir && (service = "iCloud");
        if (service) new Setting(r).setName(i18nProxy.plugins.sync.labelThirdPartySyncWarning()).setDesc(createFragment(function (e) {
          e.createSpan({
            cls: "mod-warning",
            text: i18nProxy.plugins.sync.labelThirdPartySyncWarningDesc({
              service: service
            })
          });
          e.createEl("br");
          e.createEl("a", {
            href: "https://help.obsidian.md/sync/switch",
            text: i18nProxy.interface.buttonLearnMore(),
            attr: {
              target: "_blank"
            }
          });
        }));else if (Platform.isMacOS && l instanceof FileSystemAdapter) {
          var c = l.getBasePath().toLowerCase(),
            u = window.electron.ipcRenderer.sendSync("documents-dir"),
            h = window.electron.ipcRenderer.sendSync("desktop-dir");
          (c.startsWith(u.toLowerCase()) || c.startsWith(h.toLowerCase())) && new Setting(r).setDesc(createFragment(function (e) {
            e.createSpan({
              text: i18nProxy.plugins.sync.labelIcloudDriveWarning()
            });
            e.createEl("br");
            e.createEl("a", {
              href: "https://help.obsidian.md/sync/switch",
              text: i18nProxy.interface.buttonLearnMore(),
              attr: {
                target: "_blank"
              }
            });
          }));
        }
        if (!o && !account.token) {
          var p = createSpinnerLoader(r);
          __awaiter(e, void 0, void 0, function () {
            var e,
              t = this;
            return __generator(this, function (n) {
              switch (n.label) {
                case 0:
                  n.trys.push([0, 2,, 3]);
                  return [4, getUserInfo(account)];
                case 1:
                  n.sent();
                  this.display();
                  return [2];
                case 2:
                  e = n.sent();
                  p.hide();
                  return "Not logged in" === e.message ? (this.displayRequireLogin(), [2]) : (r.createEl("p", {
                    text: i18nProxy.plugins.publish.msgNetworkError()
                  }).createDiv("modal-button-container", function (e) {
                    e.createEl("button", {
                      cls: "mod-cta",
                      text: i18nProxy.plugins.sync.buttonRetry()
                    }, function (e) {
                      e.addEventListener("click", function () {
                        t.display();
                      });
                    });
                  }), [3, 3]);
                case 3:
                  return [2];
              }
            });
          });
        }
        var d = new Setting(r).setName(i18nProxy.plugins.sync.optionRemoteVault());
        if (namea0 ? (d.setDesc(i18nProxy.plugins.sync.optionRemoteVaultDescConnected({
          name: namea0
        })), d.addButton(function (t) {
          return t.setButtonText(i18nProxy.plugins.sync.buttonDisconnectFromRemoteVault()).setClass("mod-destructive").onClick(async function () {
            await this.sync.unsetup();
            await this.display();
            return;
          });
        })) : d.setDesc(i18nProxy.plugins.sync.optionRemoteVaultDescNotConnected()), d.addButton(function (e) {
          return e.setButtonText(i18nProxy.plugins.sync(o ? "button-manage-remote-vault" : "button-choose-remote-vault")).onClick(function () {
            i.openChooseRemoteVaultModal();
          });
        }), o) {
          var f;
          if (i.getPause()) {
            new Setting(r).setName(i18nProxy.plugins.sync.optionSyncStatus()).setDesc(i18nProxy.plugins.sync.optionSyncStatusDescPaused()).addButton(function (t) {
              return t.setButtonText(i18nProxy.plugins.sync.buttonResume()).setCta().onClick(function () {
                i.setPause(!1);
                i.requestSync();
                e.display();
              });
            });
          } else {
            new Setting(r).setName(i18nProxy.plugins.sync.optionSyncStatus()).setDesc(i18nProxy.plugins.sync.optionSyncStatusDescRunning()).addButton(function (t) {
              return t.setButtonText(i18nProxy.plugins.sync.buttonPause()).onClick(function () {
                i.setPause(!0);
                e.display();
              });
            });
          }
          -1 !== i.encryptionVersion && i.encryptionVersion < 3 && new Setting(r).setName(i18nProxy.plugins.sync.labelUpgradeVaultEncryption()).setDesc(i18nProxy.plugins.sync.labelUpgradeVaultEncryptionDesc()).addButton(function (t) {
            return t.setButtonText(i18nProxy.plugins.sync.labelUpgradeVault()).onClick(function () {
              new UpgradeVaultEncryptionModal(e.app, e.sync).open();
            });
          });
          new Setting(r).setName(i18nProxy.plugins.sync.optionDeviceName()).setDesc(i18nProxy.plugins.sync.optionDeviceNameDesc()).addText(function (e) {
            return e.setPlaceholder(i.getDefaultDeviceName()).setValue(i.deviceName).onChange(function (deviceName) {
              i.deviceName = deviceName;
              i.forceSaveData();
            });
          });
          new Setting(r).setName(i18nProxy.plugins.sync.labelResolveConflicts()).setDesc(i18nProxy.plugins.sync.labelResolveConflictsDesc()).addDropdown(function (e) {
            return e.addOption("merge", i18nProxy.plugins.sync.optionAutomaticMerge()).addOption("conflict", i18nProxy.plugins.sync.optionConflictFile()).setValue(i.conflictAction).onChange(function (conflictAction) {
              if (!(conflictAction === i.conflictAction || "merge" !== conflictAction && "conflict" !== conflictAction)) {
                i.conflictAction = conflictAction;
                i.forceSaveData();
              }
            });
          });
          new Setting(r).setName(i18nProxy.plugins.sync.optionViewDeletedFiles()).setDesc(i18nProxy.plugins.sync.optionViewDeletedFilesDesc()).addButton(function (e) {
            return e.setButtonText(i18nProxy.plugins.sync.buttonView()).onClick(function () {
              return i.showDeletedFiles();
            });
          }).addButton(function (e) {
            return e.setButtonText(i18nProxy.plugins.sync.buttonBulkRestore()).onClick(function () {
              return i.showDeletedFiles(!0);
            });
          });
          new Setting(r).setName(i18nProxy.plugins.sync.optionSyncLog()).setDesc(i18nProxy.plugins.sync.optionSyncLogDesc()).addButton(function (e) {
            return e.setButtonText(i18nProxy.plugins.sync.buttonView()).onClick(function () {
              return i.showSyncLog();
            });
          });
          var m = async function () {
              var e, t, n, r, size, limit, s, l;
              e = await i.size();
              t = e.size;
              n = t > e.limit;
              r = t > 0.95 * e.limit;
              size = t < 0 ? "Unknown" : formatFileSize(t);
              limit = e.limit < 0 ? "Unknown" : formatFileSize(e.limit);
              s = "Unknown" === limit && "Unknown" === size ? i18nProxy.plugins.sync.optionVaultSizeUnknown() : i18nProxy.plugins.sync.optionVaultSizeDesc({
                size: size,
                limit: limit
              });
              r && !n && v.setName(i18nProxy.plugins.sync.optionAlmostOverSize());
              v.setDesc(s);
              g.setDesc(s);
              v.setVisibility(r);
              g.setVisibility(!r);
              if (!r) {
                l = Math.max(1, t / e.limit * 100);
                f.setValue(l);
              }
              return;
            },
            g = new Setting(r).setName(i18nProxy.plugins.sync.optionVaultSize()).setDesc(i18nProxy.plugins.sync.optionVaultSizeLoading()).addProgressBar(function (e) {
              f = e;
            }),
            v = new Setting(r).setName(i18nProxy.plugins.sync.optionOverSize()).setDesc(i18nProxy.plugins.sync.optionVaultSizeLoading()).addButton(function (e) {
              return e.setButtonText(i18nProxy.plugins.sync.buttonUpgradeStorage()).onClick(function () {
                window.open("https://obsidian.md/account#sync");
              });
            }).addButton(function (e) {
              return e.setButtonText(i18nProxy.plugins.sync.msgLargestFiles()).onClick(function () {
                new LargestFilesModal(n, i).open();
              });
            }).addButton(function (t) {
              return t.setWarning().setButtonText(i18nProxy.plugins.sync.buttonPurgeRemote()).setTooltip(i18nProxy.plugins.sync.tooltipPurgeRemote()).onClick(async function () {
                await i.purge();
                new Notice(i18nProxy.plugins.sync.msgPurgeComplete());
                await m();
                return;
              });
            });
          v.settingEl.hide();
          m();
          Platform.isMobileApp && new Setting(r).setName(i18nProxy.plugins.sync.optionPreventSleep()).setDesc(i18nProxy.plugins.sync.optionPreventSleepDesc()).addToggle(function (t) {
            return t.setValue(e.sync.preventSleep).onChange(function (preventSleep) {
              return e.sync.preventSleep = preventSleep;
            });
          });
          new Setting(r).setName(i18nProxy.plugins.sync.optionContactSupport()).setDesc(i18nProxy.plugins.sync.optionContactSupportDesc()).addButton(function (t) {
            return t.setButtonText(i18nProxy.plugins.sync.buttonCopyDebug()).onClick(async function () {
              var e, t;
              t = (e = navigator.clipboard).writeText;
              await t.apply(e, [await this.gatherSyncSystemInfo()]);
              new Notice(i18nProxy.interface.copied_generic());
              return;
            });
          }).addButton(function (t) {
            return t.setButtonText(i18nProxy.plugins.sync.buttonEmailSupport()).onClick(async function () {
              var e, t;
              e = await this.gatherSyncSystemInfo();
              t = encodeURIComponent(e);
              window.open("mailto:support@obsidian.md?subject=Obsidian%20Sync%20Support&body=".concat(t));
              return;
            });
          });
          new Setting(r).setHeading().setName(i18nProxy.plugins.sync.optionSelectiveSync());
          new Setting(r).setName(i18nProxy.plugins.sync.optionExcludedFolders()).setDesc(createFragment(function (t) {
            var n = e.sync.ignoreFolders;
            if (t.appendText(i18nProxy.plugins.sync.optionExcludedFolderDesc()), n.length > 0) {
              t.appendText(i18nProxy.plugins.sync.optionCurrentlyExcludedFolders());
              for (var i = t.createEl("ul"), r = 0, o = n; r < o.length; r++) {
                var texta0 = o[r];
                i.createEl("li", {
                  text: texta0
                });
              }
            }
          })).addButton(function (t) {
            return t.setButtonText(i18nProxy.plugins.sync.buttonManageExcludedFolders()).onClick(function () {
              e.manageExclusions();
            });
          });
          var w = function (e, t) {
            var n = null;
            new Setting(r).setName(i18nProxy("plugins.sync.option-sync-" + e)).setDesc(i18nProxy("plugins.sync.option-sync-" + e + "-desc", t)).addExtraButton(function (e) {
              return e.setIcon("lucide-alert-circle").setTooltip(i18nProxy.plugins.sync.tooltipUpdateSettingOnAllDevices()).then(function (e) {
                n = e;
                e.extraSettingsEl.hide();
              });
            }).addToggle(function (t) {
              return t.setValue(i.allowTypes.has(e)).onChange(function (t) {
                i.setSyncType(e, t);
                n.extraSettingsEl.show();
              });
            });
          };
          w("image", {
            extensions: imageExtensions.join(", ")
          });
          w("audio", {
            extensions: audioExtensions.join(", ")
          });
          w("video", {
            extensions: videoExtensions.join(", ")
          });
          w("pdf");
          w("unsupported");
          var k = function (e) {
            var t = null;
            new Setting(r).setName(i18nProxy("plugins.sync.option-sync-" + e)).setDesc(i18nProxy("plugins.sync.option-sync-" + e + "-desc")).addExtraButton(function (e) {
              return e.setIcon("lucide-alert-circle").setTooltip(i18nProxy.plugins.sync.tooltipUpdateSettingOnAllDevices()).then(function (e) {
                t = e;
                e.extraSettingsEl.hide();
              });
            }).addToggle(function (n) {
              return n.setValue(i.allowSpecialFiles.has(e)).onChange(function (n) {
                i.setAllowSpecialFile(e, n);
                t.extraSettingsEl.show();
              });
            });
          };
          new Setting(r).setHeading().setName(i18nProxy.plugins.sync.optionVaultConfigSync());
          new Setting(r).setName(i18nProxy.plugins.sync.optionViewConfigFiles()).setDesc(i18nProxy.plugins.sync.optionViewConfigFilesDesc()).addButton(function (e) {
            return e.setButtonText(i18nProxy.plugins.sync.buttonView()).onClick(function () {
              return i.showConfigFiles();
            });
          });
          k("app");
          k("appearance");
          k("appearance-data");
          k("hotkey");
          k("core-plugin");
          k("core-plugin-data");
          k("community-plugin");
          k("community-plugin-data");
        }
      } else this.displayRequireLogin();
    } else this.displayInitializing();
  } else new Setting(r).setName(i18nProxy.interface.msgIndexedDbNotSupported()).setDesc(i18nProxy.interface.msgIndexedDbIOS());
}