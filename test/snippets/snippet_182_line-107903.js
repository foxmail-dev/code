function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, i, r, o, a, s, l, c, u, h;
    return __generator(this, function (p) {
      switch (p.label) {
        case 0:
          t = (e = this).app;
          n = e.path;
          i = e.publish;
          r = t.vault.getAbstractFileByPath(n);
          return [4, this.publish.apiDownloadFile(n)];
        case 1:
          o = p.sent();
          a = getFileExtension(getFileName(n));
          s = new ConfirmationModal(t);
          this.setTitle(i18nProxy.plugins.publish.labelCompareWithLive());
          this.contentEl.style.overflow = "auto";
          return markdownExtensions.contains(a) ? (l = arrayBufferToString(o), c = "", r && r instanceof TFile ? [4, t.vault.cachedRead(r)] : [3, 3]) : [3, 4];
        case 2:
          c = p.sent();
          p.label = 3;
        case 3:
          this.contentEl.appendChild(renderDiffView(l, c));
          return [3, 8];
        case 4:
          return imageExtensions.contains(a) ? r && r instanceof TFile ? [4, loadImageElement(this.contentEl, t.vault.getResourcePath(r))] : [3, 6] : [3, 8];
        case 5:
          p.sent();
          p.label = 6;
        case 6:
          u = new Blob([new Uint8Array(o)], {
            type: "image/" + a
          });
          h = URL.createObjectURL(u);
          return [4, loadImageElement(this.contentEl, h)];
        case 7:
          p.sent();
          URL.revokeObjectURL(h);
          p.label = 8;
        case 8:
          r instanceof TFile && this.addButton("", i18nProxy.plugins.publish.buttonUseLiveVersion(), function () {
            new ConfirmOverrideModal(t, r, i.modal, o).open();
          });
          this.addButton("mod-cta", i18nProxy.plugins.publish.buttonDone(), function () {
            return s.close();
          });
          return [2];
      }
    });
  });
}