function () {
  return __awaiter(this, void 0, Promise, function () {
    var e, t, n, i, linktext;
    return __generator(this, function (o) {
      t = (e = this).containerEl;
      n = e.ctx;
      i = n.app;
      linktext = n.linktext;
      t.addClass("file-embed");
      if (i.fileManager.canCreateFileWithExt(getFileExtension(linktext))) {
        t.addClass("mod-empty");
        t.appendText(i18nProxy.plugins.pagePreview.labelEmptyNote({
          linktext: linktext
        }));
        t.addEventListener("click", this.onClick);
      } else {
        t.addClass("mod-empty-attachment");
        t.appendText(i18nProxy.plugins.pagePreview.labelEmptyAttachment({
          linktext: linktext
        }));
      }
      return [2];
    });
  });
}