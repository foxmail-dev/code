function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          t = null;
          n = this.app;
          r.label = 1;
        case 1:
          r.trys.push([1, 7,, 8]);
          return e ? [3, 3] : [4, n.fileManager.createNewMarkdownFileFromLinktext(this.inputEl.value, "")];
        case 2:
          t = r.sent();
          return [3, 6];
        case 3:
          return "unresolved" !== e.type ? [3, 5] : [4, n.fileManager.createNewMarkdownFileFromLinktext(e.linktext, "")];
        case 4:
          t = r.sent();
          return [3, 6];
        case 5:
          "file" !== e.type && "alias" !== e.type || (t = e.file);
          r.label = 6;
        case 6:
          return [3, 8];
        case 7:
          i = r.sent();
          new Notice(i.toString());
          return [2];
        case 8:
          return t ? [4, this.app.fileManager.insertIntoFile(t, this.text)] : [3, 11];
        case 9:
          r.sent();
          return [4, this.app.workspace.getLeaf().openFile(t)];
        case 10:
          r.sent();
          r.label = 11;
        case 11:
          return [2];
      }
    });
  });
}