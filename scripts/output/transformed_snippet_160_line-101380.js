function () {
  return __awaiter(this, void 0, void 0, function () {
    var e,
      t = this;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          e = this.contentEl;
          return [4, withLoadingClass(this.contentEl, async function () {
            var t, n, i, r, o, a;
            t = this.plugin.db;
            n = t.transaction("backups", "readonly");
            i = await n.store.index("path").openCursor(null, "nextunique");
            r = [];
            while (i) {
              r.push(i.value.path);
              i = await i.continue();
            }
            r.sort(collatorCompare);
            if (0 === r.length) {
              this.titleEl.setText(i18nProxy.plugins.fileRecovery.name());
              e.createEl("p", {
                text: i18nProxy.plugins.fileRecovery.labelNoHistoryFound()
              });
              return;
            }
            o = this.searchComponent.inputEl;
            a = new FileRecoveryPathSuggest(this.app, o, r, this);
            setTimeout(function () {
              o.value || (o.focus({
                preventScroll: !0
              }), a.onInputChange());
            });
            return;
          })];
        case 1:
          n.sent();
          return [2];
      }
    });
  });
}