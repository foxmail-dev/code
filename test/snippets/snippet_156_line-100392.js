function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n,
      i,
      r = this;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return e ? (n = this.app, e instanceof TFile ? (i = n.workspace, [4, i.getLeaf(t).openFile(e, {
            active: !0,
            state: {
              mode: "source"
            },
            eState: {
              rename: "all"
            }
          })]) : [3, 2]) : [2];
        case 1:
          o.sent();
          return [3, 3];
        case 2:
          n.nextFrame(function () {
            r.sort();
            r.startRenameFile(e);
            var t = r.fileItems[e.path];
            t && r.tree.infinityScroll.scrollIntoView(t, 4);
          });
          o.label = 3;
        case 3:
          return [2];
      }
    });
  });
}