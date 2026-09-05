function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i, r, o, a, s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          e.preventDefault();
          t = [];
          n = this.tree;
          i = n.focusedItem;
          if ((r = n.selectedDoms).size > 0) {
            t = Array.from(r).map(function (e) {
              return e.file;
            });
          } else {
            i instanceof FileExplorerTreeItem && t.push(i.file);
          }
          o = 0;
          a = t;
          l.label = 1;
        case 1:
          return o < a.length ? (s = a[o]) === this.app.vault.getRoot() ? [3, 4] : [4, this.app.vault.exists(s.path)] : [3, 5];
        case 2:
          return l.sent() ? [4, this.app.fileManager.promptForDeletion(s)] : [3, 4];
        case 3:
          l.sent();
          l.label = 4;
        case 4:
          o++;
          return [3, 1];
        case 5:
          return [2];
      }
    });
  });
}