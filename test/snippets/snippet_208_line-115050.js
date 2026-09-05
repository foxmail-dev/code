function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i, title, o, a, folderOption, l, c, u, template, p, d, f, m;
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          if (n = (t = this).app, i = t.options, !(title = this.getUniquePath())) return [2];
          if (o = this.app.workspace.getLeaf(Keymap.isModEvent(e || this.app.lastEvent)), (folderOption = i.folder) && String.isString(folderOption)) {
            if (l = normalizePath(replaceNonBreakingSpaces(folderOption).normalize("NFC")), !((c = n.vault.getAbstractFileByPath(l)) instanceof TFolder)) {
              new Notice(i18nProxy.plugins.uniqueNoteCreator.msgFolderNotFound({
                folderOption: folderOption
              }));
              return [2];
            }
            a = c;
          } else a = n.fileManager.getNewFileParent("", title);
          g.label = 1;
        case 1:
          g.trys.push([1, 7,, 8]);
          return (template = i.template) ? (p = n.metadataCache.getFirstLinkpathDest(template, "")) ? [4, n.vault.cachedRead(p)] : (new Notice(i18nProxy.plugins.uniqueNoteCreator.msgTemplateFileNotFound({
            template: template
          })), [2]) : [3, 4];
        case 2:
          d = g.sent();
          f = replaceTemplateVariables(d, {
            title: title
          }, {});
          return [4, n.fileManager.createNewMarkdownFile(a, title, f)];
        case 3:
          u = g.sent();
          return [3, 6];
        case 4:
          return [4, n.fileManager.createNewMarkdownFile(a, title)];
        case 5:
          u = g.sent();
          g.label = 6;
        case 6:
          return [3, 8];
        case 7:
          m = g.sent();
          new Notice(m.toString());
          return [2];
        case 8:
          return [4, o.openFile(u, {
            active: !0,
            state: {
              mode: "source"
            },
            eState: {
              rename: "end"
            }
          })];
        case 9:
          g.sent();
          return [2];
      }
    });
  });
}