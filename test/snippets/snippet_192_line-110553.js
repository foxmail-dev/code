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
      l,
      c,
      u,
      h,
      p,
      d,
      f,
      m,
      g,
      v = this;
    return __generator(this, function (w) {
      switch (w.label) {
        case 0:
          t = (e = this).errorEl;
          n = e.vaultsEl;
          i = this.plugin.getRemoteVaultId();
          w.label = 1;
        case 1:
          w.trys.push([1, 3,, 4]);
          return [4, listVaults(account.token)];
        case 2:
          if ("error" in (r = w.sent())) throw new Error("Failed to fetch remote vaults!");
          return [3, 4];
        case 3:
          w.sent();
          this.stopLoading();
          t.empty();
          t.createDiv({
            cls: "error-text",
            text: i18nProxy.plugins.sync.msgErrorFailedToFetch()
          });
          (o = t.createEl("button", {
            text: i18nProxy.plugins.sync.buttonRetry()
          })).addEventListener("click", function () {
            withModLoadingClass(o, function () {
              return v.loadRemoteVaults();
            });
          });
          t.show();
          return [2];
        case 4:
          if (a = r.limit, s = r.vaults, l = r.shared, t.hide(), n.empty(), 0 === a) n.createDiv("vault-empty-state", function (e) {
            e.createEl("p", {
              text: i18nProxy.plugins.sync.labelNoSubscription()
            });
            e.createEl("p", {}, function (e) {
              e.createSpan({
                text: i18nProxy.plugins.sync.labelPleaseVisit() + " "
              });
              e.createEl("a", {
                cls: "mod-cta",
                text: "obsidian.md/sync",
                href: "https://obsidian.md/sync",
                attr: {
                  target: "_blank"
                }
              });
              e.createSpan({
                text: "."
              });
            });
          });else if (0 === s.length) n.createDiv("vault-empty-state", function (e) {
            e.createEl("p", {
              text: i18nProxy.plugins.sync.labelNotRemoteVaults()
            });
          });else for (p = n.createDiv("list-container vault-list"), c = function (e) {
            p.createDiv("list-item vault-list-item", function (t) {
              var n = i === e.id;
              n && e.name !== v.plugin.getRemoteVaultName() && v.plugin.setVaultName(e.name);
              t.createDiv("list-item-part mod-extended", function (t) {
                t.createDiv("vault-list-item-title", function (t) {
                  t.toggleClass("is-connected", n);
                  t.createDiv("vault-list-item-icon list-item-part", function (e) {
                    setIcon(e, n ? "open-vault" : "vault");
                  });
                  t.createSpan({
                    text: e.name
                  });
                });
                t.createDiv("list-item-desc vault-list-item-desc", function (t) {
                  e.hasOwnProperty("region") && "" !== e.region && t.createDiv({
                    cls: "list-item-part",
                    text: e.region
                  });
                  t.createDiv({
                    cls: "list-item-part",
                    text: formatFileSize(e.size)
                  });
                  t.createDiv({
                    cls: "list-item-part mod-extended",
                    text: i18nProxy.plugins.sync.labelVaultCreatedTime({
                      time: window.moment(e.created).fromNow()
                    })
                  });
                });
              });
              t.createDiv("list-item-actions", function (t) {
                n || t.createDiv("list-item-part clickable-icon", function (t) {
                  setIcon(t, "lucide-trash-2");
                  setTooltip(t, i18nProxy.plugins.sync.tooltipDeleteRemoteVault());
                  t.addEventListener("click", function () {
                    var t = createFragment();
                    t.createEl("p", {
                      text: i18nProxy.plugins.sync.labelConfirmDeleteRemoteVaultQuestion({
                        name: e.name
                      })
                    });
                    t.createEl("p", {
                      text: i18nProxy.plugins.sync.labelConfirmDeleteRemoteVaultResult()
                    });
                    t.createEl("p", {
                      cls: "mod-warning",
                      text: i18nProxy.plugins.sync.labelConfirmDeleteRemoteVaultWarning()
                    });
                    var n = new ConfirmationModal(v.app);
                    n.setTitle(i18nProxy.plugins.sync.labelConfirmDeleteRemoteVault()).setContent(t).addButton("mod-warning", "Delete", async function () {
                      var t;
                      this.startLoading();
                      n.close();
                      try {
                        await (tokenr0 = account.token, vault_uid = e.id, apiRequest("/vault/delete", {
                          token: tokenr0,
                          vault_uid: vault_uid
                        }));
                        new Notice(i18nProxy.plugins.sync.msgRemoteVaultDeleted({
                          name: e.name
                        }));
                        this.open();
                      } catch (error) {
                        new Notice(error.message);
                      } finally {
                        this.onOpen();
                      }
                      return;
                    }).addCancelButton().open();
                  });
                });
                t.createDiv("list-item-part clickable-icon", function (t) {
                  setIcon(t, "lucide-edit-3");
                  setTooltip(t, i18nProxy.plugins.sync.tooltipRenameRemoteVault());
                  var i = async function (t) {
                    var i;
                    if ("" === t || t === e.name) {
                      return;
                    }
                    this.startLoading();
                    try {
                      await renameVault(account.token, e.id, t);
                    } catch (error) {
                      new Notice(error.message);
                      return;
                    } finally {
                      this.stopLoading();
                    }
                    if (n) {
                      await this.plugin.setRemoteVaultName(t);
                    }
                    this.onOpen();
                    return;
                  };
                  t.addEventListener("click", function () {
                    new RenameRemoteVaultModal(v.app, e.name, i).open();
                  });
                });
                t.createDiv("list-item-part clickable-icon", function (t) {
                  setIcon(t, "lucide-users");
                  setTooltip(t, i18nProxy.plugins.sync.tooltipManageSharing({
                    name: e.name
                  }));
                  t.addEventListener("click", function () {
                    new ManageVaultSharingModal(v.app, e.name, e.id).open();
                  });
                });
                i || t.createEl("button", {
                  cls: "list-item-part vault-list-item-button",
                  text: i18nProxy.plugins.sync.buttonConnectToRemoteVault()
                }, function (t) {
                  t.addEventListener("click", async function () {
                    var n,
                      i = this;
                    n = await withModLoadingClass(t, function () {
                      return listSubscriptions(account.token);
                    });
                    if ("error" in n) {
                      return;
                    }
                    if (n.sync) {
                      new ConnectToVaultModal(this.app, this.plugin).connect(e, function () {
                        return i.close();
                      }).open();
                      return;
                    }
                    this.errorEl.setText(i18nProxy.plugins.sync.labelRequireSubscriptionToConnect());
                    this.errorEl.show();
                    return;
                  });
                });
              });
            });
          }, u = 0, h = s; u < h.length; u++) {
            g = h[u];
            c(g);
          }
          if (s.length < a ? n.createDiv("modal-button-container", function (e) {
            e.createEl("button", {
              cls: "mod-cta js-create-vault",
              text: i18nProxy.plugins.sync.buttonCreateNewRemoteVault()
            }, function (e) {
              e.addEventListener("click", function () {
                v.close();
                new CreateRemoteVaultModal(v.app, v.plugin).open();
              });
            });
          }) : a > 0 && n.createEl("p", {
            cls: "u-small u-muted",
            text: i18nProxy.plugins.sync.msgRemoteVaultLimitHit()
          }), l.length > 0) for (new Setting(n).setName(i18nProxy.plugins.sync.labelVaultsSharedWithYou()).setHeading(), p = n.createDiv("list-container vault-list"), d = function (e) {
            p.createDiv("list-item vault-list-item", function (t) {
              var n = i === e.id;
              n && e.name !== v.plugin.getRemoteVaultName() && v.plugin.setVaultName(e.name);
              t.createDiv("list-item-part mod-extended", function (t) {
                t.createDiv("vault-list-item-title", function (t) {
                  t.toggleClass("is-connected", n);
                  t.createDiv("vault-list-item-icon list-item-part", function (e) {
                    setIcon(e, n ? "open-vault" : "vault");
                  });
                  t.createSpan({
                    text: e.name
                  });
                });
                t.createDiv("list-item-desc vault-list-item-desc", function (t) {
                  e.hasOwnProperty("region") && "" !== e.region && t.createDiv({
                    cls: "list-item-part",
                    text: e.region
                  });
                  t.createDiv({
                    cls: "list-item-part",
                    text: formatFileSize(e.size)
                  });
                  t.createDiv({
                    cls: "list-item-part mod-extended",
                    text: i18nProxy.plugins.sync.labelVaultCreatedTime({
                      time: window.moment(e.created).fromNow()
                    })
                  });
                });
              });
              t.createDiv("list-item-actions", function (t) {
                if (n) {
                  t.createEl("button", {
                    cls: "list-item-part vault-list-item-button",
                    text: i18nProxy.plugins.sync.buttonDisconnectFromRemoteVault()
                  }).addEventListener("click", async function () {
                    this.startLoading();
                    await this.plugin.unsetup();
                    this.open();
                    return;
                  });
                } else {
                  i || t.createEl("button", {
                    cls: "list-item-part vault-list-item-button",
                    text: i18nProxy.plugins.sync.buttonConnectToRemoteVault()
                  }, function (t) {
                    t.addEventListener("click", async function () {
                      var n,
                        i = this;
                      n = await withModLoadingClass(t, function () {
                        return listSubscriptions(account.token);
                      });
                      if ("error" in n) {
                        return;
                      }
                      if (n.sync) {
                        new ConnectToVaultModal(this.app, this.plugin).connect(e, function () {
                          return i.close();
                        }).open();
                        return;
                      }
                      this.errorEl.setText(i18nProxy.plugins.sync.labelRequireSubscriptionToConnect());
                      this.errorEl.show();
                      return;
                    });
                  });
                }
                t.createDiv("clickable-icon", function (t) {
                  setIcon(t, "lucide-x");
                  setTooltip(t, i18nProxy.plugins.sync.tooltipLeaveVaultSharing());
                  t.addEventListener("click", function () {
                    var t = createFragment();
                    t.createEl("p", {
                      cls: "setting-message mod-warning",
                      text: i18nProxy.plugins.sync.labelLeaveVaultConfirmationDetails()
                    });
                    t.createEl("p", {
                      text: i18nProxy.plugins.sync.labelLeaveVaultConfirmationDetails()
                    });
                    new ConfirmationModal(v.app).setTitle(i18nProxy.plugins.sync.labelLeaveVaultConfirmation({
                      vault: e.name
                    })).setContent(t).addButton("mod-warning", i18nProxy.plugins.sync.buttonLeave(), function () {
                      v.deleteVaultShare(e.id, e.share_uid);
                    }).addCancelButton().open();
                  });
                });
              });
            });
          }, f = 0, m = l; f < m.length; f++) {
            g = m[f];
            d(g);
          }
          this.stopLoading();
          return [2];
      }
    });
  });
}