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
          this.contentEl.empty();
          c.label = 1;
        case 1:
          c.trys.push([1, 3,, 4]);
          return [4, withLoader(this.contentEl, function () {
            return tokene0 = account.token, site_uid = l.siteId, apiRequest("/publish/share/list", {
              token: tokene0,
              site_uid: site_uid
            });
            var tokene0, site_uid;
          })];
        case 2:
          e = c.sent();
          this.shares = e.shares;
          return [3, 4];
        case 3:
          t = c.sent();
          new Notice(t.message);
          return [2];
        case 4:
          if (this.shares.length > 0) for (this.contentEl.createEl("p", {
            cls: "u-muted",
            text: i18nProxy.plugins.publish.labelSharingWithUsers()
          }), n = this.contentEl.createDiv(), i = function (e) {
            n.createDiv("list-item", function (t) {
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
              t.createDiv("list-item-part", function (t) {
                setIcon(t, "lucide-x");
                setTooltip(t, i18nProxy.plugins.publish.tooltipRemoveUser());
                t.addEventListener("click", async function () {
                  var t,
                    n = this;
                  try {
                    await withLoader(this.contentEl, function () {
                      return removePublishShare(account.token, n.siteId, e.uid);
                    });
                  } catch (error) {
                    new Notice(error.message);
                  }
                  await this.display();
                  return;
                });
              });
            });
          }, r = 0, o = this.shares; r < o.length; r++) {
            a = o[r];
            i(a);
          } else this.contentEl.createEl("p", {
            cls: "u-muted",
            text: i18nProxy.plugins.publish.labelNotSharing()
          });
          s = null;
          new Setting(this.contentEl).setName(i18nProxy.plugins.publish.optionInviteUser()).addText(function (e) {
            return e.setPlaceholder(i18nProxy.plugins.publish.placeholderInviteUser()).then(function (e) {
              s = e;
              e.inputEl.addEventListener("keydown", function (t) {
                t.isComposing || "Enter" === t.key && l.inviteToSite(e.getValue());
              });
            });
          }).addButton(function (e) {
            return e.setButtonText(i18nProxy.interface.buttonAdd()).setCta().onClick(function () {
              l.inviteToSite(s.getValue());
            });
          });
          return [2];
      }
    });
  });
}