function (e, last) {
  return __awaiter(this, void 0, Promise, function () {
    var n = this;
    return __generator(this, function (i) {
      return [2, this.queue.queue(async function () {
        var path, i, r, o, a, s, l, c, relatedpath;
        path = await this.encryptionProvider.deterministicEncodeStr(e);
        i = await this.request({
          op: "history",
          path: path,
          last: last
        });
        r = i.items;
        o = 0;
        a = r;
        while (o < a.length) {
          s = a[o];
          l = s;
          l.path = await this.encryptionProvider.deterministicDecodeStr(s.path);
          c = s;
          if (relatedpath = s.relatedpath) {
            relatedpath = await this.encryptionProvider.deterministicDecodeStr(s.relatedpath);
          }
          c.relatedpath = relatedpath;
          o++;
        }
        return i;
      })];
    });
  });
}