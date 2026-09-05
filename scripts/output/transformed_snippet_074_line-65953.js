function (path) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          return [4, wrapFileError(this.stat(path))];
        case 1:
          return t.sent().size < maxFileSize ? [4, wrapFileError(filesystemPlugin.readFile({
            directory: this.dir,
            path: path
          }))] : [3, 3];
        case 2:
          return [2, base64ToArrayBuffer(t.sent().data)];
        case 3:
          return [4, fetch(this.getUri(path))];
        case 4:
          return [2, t.sent().arrayBuffer()];
      }
    });
  });
}