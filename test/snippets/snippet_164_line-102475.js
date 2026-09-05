function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n, i, r, o, a, s, l, c, u;
    return __generator(this, function (h) {
      switch (h.label) {
        case 0:
          n = this.app;
          i = this.editor.getSelection();
          r = Keymap.isModifier(t, "Mod");
          a = this.currentFile;
          h.label = 1;
        case 1:
          h.trys.push([1, 7,, 8]);
          return !r && e ? [3, 3] : [4, n.fileManager.createNewMarkdownFileFromLinktext(this.inputEl.value, a.path)];
        case 2:
          o = h.sent();
          return [3, 6];
        case 3:
          return "unresolved" !== e.type ? [3, 5] : [4, n.fileManager.createNewMarkdownFileFromLinktext(e.linktext, a.path)];
        case 4:
          o = h.sent();
          return [3, 6];
        case 5:
          "file" !== e.type && "alias" !== e.type || (o = e.file);
          h.label = 6;
        case 6:
          return [3, 8];
        case 7:
          s = h.sent();
          new Notice(s.toString());
          return [2];
        case 8:
          return [4, this.composer.applyTemplate(i, a.basename, o.basename)];
        case 9:
          l = h.sent();
          return [4, n.fileManager.insertIntoFile(o, l, t.shiftKey ? "prepend" : "append")];
        case 10:
          h.sent();
          c = n.fileManager.generateMarkdownLink(o, a.path);
          if ("embed" === (u = this.composer.options.replacementText)) {
            this.editor.replaceSelection("!" + c);
          } else {
            "none" === u ? this.editor.replaceSelection("") : this.editor.replaceSelection(c);
          }
          return [2];
      }
    });
  });
}