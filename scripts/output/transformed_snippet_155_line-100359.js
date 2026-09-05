function (e, t, n) {
  return __awaiter(this, void 0, void 0, function () {
    var i, r, o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          i = this.app;
          r = null;
          a.label = 1;
        case 1:
          a.trys.push([1, 6,, 7]);
          return "file" !== e ? [3, 3] : [4, i.fileManager.createNewMarkdownFile(t)];
        case 2:
          r = a.sent();
          return [3, 5];
        case 3:
          return "folder" !== e ? [3, 5] : [4, i.fileManager.createNewFolder(t)];
        case 4:
          r = a.sent();
          a.label = 5;
        case 5:
          return [3, 7];
        case 6:
          o = a.sent();
          new Notice(o.toString());
          return [2];
        case 7:
          this.afterCreate(r, n);
          return [2];
      }
    });
  });
}