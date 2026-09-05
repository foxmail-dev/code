function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n,
      i,
      r,
      o,
      a,
      s,
      l,
      c,
      u,
      h,
      p,
      d,
      f,
      m = this;
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          if (n = this.app, i = this.inputEl.value, !Keymap.isModifier(t, "Mod") && e && "unresolved" !== e.type) return [3, 5];
          o = i;
          e && "unresolved" === e.type && (o = e.linktext);
          a = n.fileManager.getNewFileParent(this.currentFile.path, o);
          g.label = 1;
        case 1:
          g.trys.push([1, 3,, 4]);
          return [4, n.fileManager.createNewMarkdownFile(a, o)];
        case 2:
          r = g.sent();
          return [3, 4];
        case 3:
          s = g.sent();
          new Notice(s.toString());
          return [2];
        case 4:
          return [3, 6];
        case 5:
          if ("bookmark" === e.type) {
            "file" === e.item.type && (l = n.vault.getAbstractFileByPath(e.item.path)) instanceof TFile && (r = l);
          } else {
            r = e.file;
          }
          g.label = 6;
        case 6:
          return r && r !== this.currentFile ? (c = this.currentFile, u = this.composer, h = !1, p = async function () {
            if (h) {
              u.options.askBeforeMerging = !1;
              u.pluginInstance.saveData(u.options);
            }
            await this.mergeFile(r, c, t.shiftKey ? "prepend" : "append");
            return;
          }, u.options.askBeforeMerging ? ((d = document.createDocumentFragment()).createEl("p", {
            text: i18nProxy.plugins.noteComposer.labelConfirmFileMerge({
              file: c.basename,
              destination: r.basename
            })
          }), f = new ConfirmationModal(n).setTitle(i18nProxy.plugins.noteComposer.labelMergeFile()).setContent(d), Platform.isMobile ? f.addButton("mod-warning", i18nProxy.dialogue.buttonDeleteDoNotAskAgain(), async function () {
            return p();
          }) : f.addCheckbox(i18nProxy.dialogue.labelDoNotAskAgain(), function (e) {
            h = e.target.checked;
          }), f.addButton("mod-warning", i18nProxy.plugins.noteComposer.buttonMerge(), function () {
            return p();
          }).addCancelButton().open()) : p(), [2]) : [2];
      }
    });
  });
}