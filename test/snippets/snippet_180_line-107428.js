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
      h = this;
    return __generator(this, function (p) {
      switch (p.label) {
        case 0:
          e = this.parentModal;
          t = e.app;
          n = e.plugin;
          i = this.runnable = new Runnable({
            onStop: async function () {
              var e, t;
              this.doneButton.removeClass("mod-warning");
              this.doneButton.setText(i18nProxy.plugins.publish.buttonDone());
              t = PUBLISH_BASE_URL + "/";
              e = t + (await n.getCurrentSlug());
              this.siteLinkEl.setText(e);
              this.siteLinkEl.setAttribute("href", e);
              this.successMessageEl.show();
              this.changesContainer.addClass("is-finished");
              this.runnable === i && (this.runnable = null);
              return;
            }
          });
          i.start();
          r = 0;
          o = this.changes;
          p.label = 1;
        case 1:
          if (!(r < o.length)) return [3, 10];
          if (a = o[r], s = this.pathToEl[a.path], l = s.find(".flair"), i.isCancelled()) {
            l.setText(i18nProxy.plugins.publish.labelStatusCancelled());
            s.addClass("mod-failed", "mod-completed");
            return [3, 9];
          }
          p.label = 2;
        case 2:
          p.trys.push([2, 7,, 8]);
          l.setText(i18nProxy.plugins.publish.labelStatusUploading());
          return "deleted" !== a.type && "to-delete" !== a.type ? [3, 4] : [4, n.apiRemoveFile(a.path)];
        case 3:
          p.sent();
          l.setText(i18nProxy.plugins.publish.labelStatusDeleted());
          return [3, 6];
        case 4:
          return (c = t.vault.getAbstractFileByPath(a.path)) && c instanceof TFile ? [4, n.apiUploadFile(c)] : [3, 6];
        case 5:
          p.sent();
          l.setText(i18nProxy.plugins.publish.labelStatusPublished());
          p.label = 6;
        case 6:
          s.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
          return [3, 8];
        case 7:
          u = p.sent();
          this.parentModal.handleError(u);
          l.setText(i18nProxy.plugins.publish.labelStatusFailed());
          s.addClass("mod-failed");
          return [3, 8];
        case 8:
          s.addClass("mod-completed");
          p.label = 9;
        case 9:
          r++;
          return [3, 1];
        case 10:
          i.stop();
          return [2];
      }
    });
  });
}