function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          t = this.app;
          return 0 !== (n = t.workspace.getLeavesOfType(FILE_EXPLORER_VIEW_TYPE)).length ? [3, 2] : [4, (i = t.workspace.getLeftLeaf(!1)).setViewState({
            type: "file-explorer"
          })];
        case 1:
          r.sent();
          return [3, 3];
        case 2:
          i = n[0];
          r.label = 3;
        case 3:
          return [4, t.workspace.revealLeaf(i)];
        case 4:
          r.sent();
          this.app.workspace.setActiveLeaf(i, {
            focus: !0
          });
          i.view.revealInFolder(e);
          return [2];
      }
    });
  });
}