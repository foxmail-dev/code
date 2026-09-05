function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return e !== this.file ? [3, 8] : this.allowNoFile ? [4, this.loadFile(null)] : [3, 2];
        case 1:
          n.sent();
          return [3, 7];
        case 2:
          return (t = this.leaf).history.backHistory.length > 0 ? [4, t.history.back()] : [3, 4];
        case 3:
          n.sent();
          return [3, 6];
        case 4:
          return [4, t.open(null)];
        case 5:
          n.sent();
          n.label = 6;
        case 6:
          this.leaf.view instanceof EmptyView && t.parent.children.length > 1 && t.detach();
          n.label = 7;
        case 7:
          this.app.workspace.onLayoutChange();
          n.label = 8;
        case 8:
          return [2];
      }
    });
  });
}