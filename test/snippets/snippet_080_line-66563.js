function (handler) {
  return __awaiter(this, void 0, Promise, function () {
    var t = this;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return [4, this.stopWatch()];
        case 1:
          n.sent();
          this.handler = handler;
          return [4, filesystemPlugin.addListener("change", function (e) {
            var n = normalizePathSlashes(e.path),
              i = normalizePathSlashes(n.substr(t.basePath.length));
            t.onFileChange(i);
          })];
        case 2:
          n.sent();
          return [2, this.queue(function () {
            return t.watchAndList();
          })];
      }
    });
  });
}