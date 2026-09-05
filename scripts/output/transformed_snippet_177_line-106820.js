function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t,
      n,
      i,
      r,
      o,
      a,
      s = this;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          e.preventDefault();
          t = new Menu();
          n = this.diff;
          i = n.type;
          r = n.path;
          o = this.section.publish.app;
          return [4, this.section.publish.getCurrentSlug()];
        case 1:
          a = l.sent();
          "changed" !== i && "deleted" !== i && "to-delete" !== i || t.addItem(function (e) {
            return e.setIcon("lucide-globe").setTitle(i18nProxy.plugins.publish.labelOpenInLiveSite()).onClick(function () {
              window.open(PUBLISH_BASE_URL + "/" + a + "/" + encodePathSegments(getMarkdownPath(r)));
            });
          });
          "changed" !== i && "new" !== i && "to-delete" !== i || t.addItem(function (e) {
            return e.setIcon("lucide-folder-open").setTitle(i18nProxy.plugins.publish.labelOpenFile()).onClick(function () {
              var e = o.workspace.getLeaf(),
                t = o.vault.getAbstractFileByPath(r);
              if (t && t instanceof TFile) {
                e.openFile(t, {
                  active: !0
                });
                s.section.publish.modal.close();
              }
            });
          });
          "changed" === i && t.addItem(function (e) {
            return e.setIcon("lucide-columns").setTitle(i18nProxy.plugins.publish.labelCompareWithLive()).onClick(function () {
              new CompareWithLiveModal(o, s.section.publish, s.path).open();
            });
          });
          "changed" !== i && "deleted" !== i || t.addItem(function (e) {
            return e.setIcon("lucide-pencil").setTitle(i18nProxy.plugins.publish.buttonUseLiveVersion()).onClick(function () {
              return __awaiter(s, void 0, void 0, function () {
                var e, t, n, i;
                return __generator(this, function (a) {
                  switch (a.label) {
                    case 0:
                      return [4, this.section.publish.apiDownloadFile(r)];
                    case 1:
                      e = a.sent();
                      return (t = o.vault.getAbstractFileByPath(r)) && t instanceof TFile ? (new ConfirmOverrideModal(o, t, this.section.publish.modal, e).open(), [3, 9]) : [3, 2];
                    case 2:
                      n = getDirectoryName(r);
                      return (i = n) ? [4, o.vault.exists(n)] : [3, 4];
                    case 3:
                      i = !a.sent();
                      a.label = 4;
                    case 4:
                      return i ? [4, o.vault.createFolder(n)] : [3, 6];
                    case 5:
                      a.sent();
                      a.label = 6;
                    case 6:
                      return [4, o.vault.createBinary(r, e)];
                    case 7:
                      a.sent();
                      new Notice(i18nProxy.plugins.publish.messageSuccessfullyUsedLiveVersion());
                      return [4, this.section.publish.modal.reviewChangesSection.show()];
                    case 8:
                      a.sent();
                      a.label = 9;
                    case 9:
                      return [2];
                  }
                });
              });
            });
          });
          t.showAtMouseEvent(e);
          return [2];
      }
    });
  });
}