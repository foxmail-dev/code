function () {
  return __awaiter(t, void 0, void 0, function () {
    var o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          return a.trys.push([0, 2,, 3]), [4, __awaiter(t, void 0, void 0, function () {
            var t, o, hash, s, l;
            return __generator(this, function (c) {
              switch (c.label) {
                case 0:
                  return [4, this.vault.readBinary(e)];
                case 1:
                  return t = c.sent(), o = arrayBufferToString(t), [4, computeSha256Hex(t)];
                case 2:
                  if (hash = c.sent(), r.mtime = n.mtime, r.size = n.size, r.hash = hash, this.saveFileCache(i, r), s = this.metadataCache[hash]) return this.linkResolverQueue.add(e), this.trigger("changed", e, o, s), [2];
                  l = setTimeout(function () {
                    new Notice("Indexing taking a long time for " + e.path);
                  }, 1e4);
                  c.label = 3;
                case 3:
                  return c.trys.push([3,, 5, 6]), [4, this.work(t)];
                case 4:
                  return s = c.sent(), [3, 6];
                case 5:
                  return clearTimeout(l), [7];
                case 6:
                  return s ? (this.saveMetaCache(hash, s), this.linkResolverQueue.add(e), this.trigger("changed", e, o, s), [2]) : (console.log("Metadata failed to parse", e), [2]);
              }
            });
          })];
        case 1:
          return a.sent(), [3, 3];
        case 2:
          return o = a.sent(), console.error(o), [3, 3];
        case 3:
          return this.inProgressTaskCount--, 0 === this.inProgressTaskCount && this.didFinish(), [2];
      }
    });
  });
}