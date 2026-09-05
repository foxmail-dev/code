function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i, title, format, a, folderOption, l, c, u, h, p, template, f, m, g, v;
    return __generator(this, function (y) {
      switch (y.label) {
        case 0:
          n = (t = this).app;
          i = t.options;
          null != e || (e = window.moment());
          title = null;
          format = this.getFormat();
          try {
            title = e.format(format);
          } catch (e) {
            new Notice(i18nProxy.plugins.dailyNotes.msgFailFormat({
              format: format
            }));
            console.error(e);
            return [2];
          }
          if (title && (title = title.trim()), (folderOption = i.folder) && String.isString(folderOption)) {
            if (l = normalizePath(folderOption), !((c = n.vault.getAbstractFileByPath(l)) instanceof TFolder)) {
              new Notice(i18nProxy.plugins.dailyNotes.msgFailFolder({
                folderOption: folderOption
              }));
              return [2, null];
            }
            a = c;
          } else a = n.fileManager.getNewFileParent("");
          if (u = a.getParentPrefix() + title + ".md", (h = n.vault.getAbstractFileByPathInsensitive(u)) && !(h instanceof TFile)) return [2, null];
          if (p = h) return [3, 8];
          y.label = 1;
        case 1:
          y.trys.push([1, 7,, 8]);
          return (template = i.template) ? (f = n.metadataCache.getFirstLinkpathDest(template, "")) ? [4, n.vault.cachedRead(f)] : (new Notice(i18nProxy.plugins.dailyNotes.msgFailTemplateFile({
            template: template
          })), [2]) : [3, 4];
        case 2:
          m = y.sent();
          g = replaceTemplateVariables(m, {
            title: title
          }, {});
          return [4, n.fileManager.createNewMarkdownFile(a, title, g)];
        case 3:
          p = y.sent();
          return [3, 6];
        case 4:
          return [4, n.fileManager.createNewMarkdownFile(a, title)];
        case 5:
          p = y.sent();
          y.label = 6;
        case 6:
          return [3, 8];
        case 7:
          v = y.sent();
          new Notice(v.toString());
          return [2];
        case 8:
          return [2, p];
      }
    });
  });
}