function (realpath, t) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return this.files.hasOwnProperty(t) ? [3, 4] : (this.files[t] = {
            type: "folder",
            realpath: realpath
          }, this.trigger("folder-created", t), recursive ? [3, 2] : [4, this.startWatchPath(t)]);
        case 1:
          n.sent();
          n.label = 2;
        case 2:
          return [4, this.listRecursive(realpath)];
        case 3:
          n.sent();
          return [3, 5];
        case 4:
          this.files[t].realpath = realpath;
          n.label = 5;
        case 5:
          return [2];
      }
    });
  });
}