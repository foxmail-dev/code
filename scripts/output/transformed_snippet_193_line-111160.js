function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var password,
      n,
      i,
      r = this;
    return __generator(this, function (o) {
      this.contentEl.empty();
      this.buttonContainerEl.empty();
      this.setTitle(i18nProxy.plugins.sync.labelUnlockEncryptedVault());
      this.contentEl.createEl("p", {
        text: i18nProxy.plugins.sync.labelEncryptionPasswordExplanation({
          name: e.name
        })
      });
      password = "";
      new Setting(this.contentEl).setName(i18nProxy.plugins.sync.optionEncryptionPassword()).addText(function (e) {
        e.inputEl.type = "password";
        e.onChange(function (e) {
          password = e;
          r.showError("");
        }).setPlaceholder(i18nProxy.plugins.sync.optionEncryptionPasswordPlaceholder());
      });
      n = createDeferred();
      (i = this.buttonContainerEl.createEl("button", {
        cls: "mod-cta",
        text: i18nProxy.plugins.sync.buttonUnlockVault()
      })).addEventListener("click", function () {
        return __awaiter(r, void 0, void 0, function () {
          var r;
          return __generator(this, function (o) {
            switch (o.label) {
              case 0:
                o.trys.push([0, 2,, 3]);
                return [4, withModLoadingClass(i, function () {
                  return updateVaultAccess(e.id, password, e.salt, e.host, e.encryption_version);
                })];
              case 1:
                o.sent();
                e.password = password;
                n.resolve();
                return [3, 3];
              case 2:
                r = o.sent();
                console.error(r);
                if (r instanceof XMLHttpRequest) {
                  this.showError(i18nProxy.plugins.publish.msgNetworkError());
                } else {
                  this.showError(r.message);
                }
                return [3, 3];
              case 3:
                return [2];
            }
          });
        });
      });
      this.addCancelButton(function () {
        return n.reject();
      });
      return [2, n.promise];
    });
  });
}