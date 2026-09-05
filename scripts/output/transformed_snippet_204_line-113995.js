function (e, t, foldern0, deleted, ctime, mtime, hash, s) {
  return __awaiter(this, void 0, Promise, function () {
    var l = this;
    return __generator(this, function (c) {
      return [2, this.queue.queue(function () {
        return __awaiter(l, void 0, void 0, function () {
          var path, relatedpath, u, extension, size, d, pieces, m, g, v;
          return __generator(this, function (y) {
            switch (y.label) {
              case 0:
                this.lastNetworkRequestTs = Date.now();
                return [4, this.encryptionProvider.deterministicEncodeStr(e)];
              case 1:
                path = y.sent();
                return t ? [4, this.encryptionProvider.deterministicEncodeStr(t)] : [3, 3];
              case 2:
                u = y.sent();
                return [3, 4];
              case 3:
                u = null;
                y.label = 4;
              case 4:
                relatedpath = u;
                extension = foldern0 ? "" : getFileExtension(getFileName(e));
                return foldern0 || deleted ? (this.justPushed = {
                  path: path,
                  folder: foldern0,
                  deleted: deleted,
                  mtime: 0,
                  hash: ""
                }, [4, this.request({
                  op: "push",
                  path: path,
                  relatedpath: relatedpath,
                  extension: extension,
                  hash: "",
                  ctime: 0,
                  mtime: 0,
                  folder: foldern0,
                  deleted: deleted
                })]) : [3, 6];
              case 5:
                y.sent();
                return [2];
              case 6:
                return s.byteLength > 0 ? [4, this.encryptionProvider.encrypt(s)] : [3, 8];
              case 7:
                s = y.sent();
                y.label = 8;
              case 8:
                return hash ? [4, this.encryptionProvider.deterministicEncodeStr(hash)] : [3, 10];
              case 9:
                hash = y.sent();
                y.label = 10;
              case 10:
                size = s.byteLength;
                d = 2097152;
                pieces = Math.ceil(size / d);
                this.justPushed = {
                  path: path,
                  folder: foldern0,
                  deleted: deleted,
                  mtime: mtime,
                  hash: hash
                };
                return [4, this.request({
                  op: "push",
                  path: path,
                  relatedpath: relatedpath,
                  extension: extension,
                  hash: hash,
                  ctime: ctime,
                  mtime: mtime,
                  folder: foldern0,
                  deleted: deleted,
                  size: size,
                  pieces: pieces
                })];
              case 11:
                if ("ok" === y.sent().res) {
                  this.justPushed = null;
                  return [2];
                }
                m = 0;
                y.label = 12;
              case 12:
                return m < pieces ? (g = m * d, v = Math.min(d, size - g), this.sendBinary(new Uint8Array(s, g, v)), [4, this.response()]) : [3, 15];
              case 13:
                y.sent();
                y.label = 14;
              case 14:
                m++;
                return [3, 12];
              case 15:
                this.justPushed = null;
                return [2];
            }
          });
        });
      })];
    });
  });
}