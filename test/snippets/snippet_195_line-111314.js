function () {
  return __awaiter(this, void 0, void 0, function () {
    var e,
      t,
      n,
      i,
      r,
      shareItemEls,
      a,
      s,
      l,
      c,
      u,
      h,
      p,
      d = this;
    return __generator(this, function (f) {
      switch (f.label) {
        case 0:
          t = (e = this).contentEl;
          n = e.sharesContainerEl;
          f.label = 1;
        case 1:
          f.trys.push([1, 3,, 4]);
          return [4, withLoader(this.contentEl, function () {
            return tokene0 = account.token, vault_uid = d.vaultId, apiRequest("/vault/share/list", {
              token: tokene0,
              vault_uid: vault_uid
            });
            var tokene0, vault_uid;
          })];
        case 2:
          i = f.sent();
          this.shares = i.shares;
          return [3, 4];
        case 3:
          r = f.sent();
          t.empty();
          t.createEl("p", {
            cls: "mod-warning",
            text: r.message
          });
          return [2];
        case 4:
          if (this.shares.length > 0) {
            for (shareItemEls = {}, a = function (e) {
              shareItemEls[e.uid] = null !== (p = s.shareItemEls[e.uid]) && void 0 !== p ? p : n.createDiv("list-item", function (t) {
                if (e.name) {
                  t.createDiv({
                    cls: "list-item-part",
                    text: e.name
                  });
                  t.createDiv({
                    cls: "list-item-part mod-extended",
                    text: "<".concat(e.email, ">")
                  });
                } else {
                  t.createDiv({
                    cls: "list-item-part mod-extended",
                    text: e.email
                  });
                }
                e.accepted || t.createDiv({
                  cls: "list-item-part"
                }, function (e) {
                  e.createSpan({
                    cls: "u-muted",
                    text: i18nProxy.plugins.publish.labelInvitePending()
                  });
                });
                t.createDiv("list-item-part clickable-icon", function (n) {
                  setIcon(n, "lucide-x");
                  setTooltip(n, i18nProxy.plugins.publish.tooltipRemoveUser());
                  n.addEventListener("click", async function () {
                    var n,
                      i = this;
                    t.hide();
                    try {
                      await withLoadingClass(this.contentEl, function () {
                        return removeVaultShare(account.token, i.vaultId, e.uid);
                      });
                    } catch (error) {
                      new Notice(error.message);
                    }
                    await this.loadShareItems();
                    return;
                  });
                });
              });
            }, s = this, l = 0, c = this.shares; l < c.length; l++) {
              u = c[l];
              a(u);
            }
            n.setChildrenInPlace(Object.values(shareItemEls));
            this.shareItemEls = shareItemEls;
          } else this.sharesContainerEl.setChildrenInPlace([createEl("p", {
            cls: "u-muted",
            text: i18nProxy.plugins.sync.labelNotSharing()
          })]);
          h = this.emailTextComponent.inputEl;
          this.addButtonComponent.buttonEl.ariaDisabled = void 0;
          h.ariaDisabled = void 0;
          h.value = "";
          h.focus();
          return [2];
      }
    });
  });
}