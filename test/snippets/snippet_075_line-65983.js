function (path, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n, i, r, data, a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          return t.byteLength < maxFileSize ? [4, filesystemPlugin.writeFile({
            directory: this.dir,
            path: path,
            data: arrayBufferToBase64(t)
          })] : [3, 2];
        case 1:
          s.sent();
          return [2];
        case 2:
          return [4, filesystemPlugin.writeFile({
            directory: this.dir,
            path: path,
            data: ""
          })];
        case 3:
          s.sent();
          s.label = 4;
        case 4:
          s.trys.push([4, 8,, 10]);
          n = 0;
          s.label = 5;
        case 5:
          return n < t.byteLength ? (i = Math.min(1048576, t.byteLength - n), r = new Uint8Array(t, n, i), data = bytesToBase64(r), [4, filesystemPlugin.appendFile({
            directory: this.dir,
            path: path,
            data: data
          })]) : [3, 7];
        case 6:
          s.sent();
          n += i;
          return [3, 5];
        case 7:
          return [3, 10];
        case 8:
          a = s.sent();
          return [4, filesystemPlugin.deleteFile({
            directory: this.dir,
            path: path
          })];
        case 9:
          throw s.sent(), a;
        case 10:
          return [2];
      }
    });
  });
}