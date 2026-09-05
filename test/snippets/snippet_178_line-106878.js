function () {
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
}