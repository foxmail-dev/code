function (realpath, t) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return this.files.hasOwnProperty(t) ? [3, 2] : (this.files[t] = {
            type: "folder",
            realpath: realpath
          }, this.trigger("folder-created", t), [4, this.listRecursive(realpath)]);
        case 1:
          n.sent();
          return [3, 3];
        case 2:
          this.files[t].realpath = realpath;
          n.label = 3;
        case 3:
          return [2];
      }
    });
  });
}