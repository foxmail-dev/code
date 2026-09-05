function () {
  return __awaiter(t, void 0, void 0, function () {
    var t, n, i, r, o, a, s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          this.lastNetworkRequestTs = Date.now();
          return [4, this.request({
            op: "pull",
            uid: e
          })];
        case 1:
          if ((t = l.sent()).deleted) return [3, 8];
          n = t.size;
          i = t.pieces;
          r = new ArrayBuffer(n);
          o = 0;
          a = 0;
          l.label = 2;
        case 2:
          return a < i ? [4, this.dataResponse()] : [3, 5];
        case 3:
          s = l.sent();
          new Uint8Array(r, o, s.byteLength).set(new Uint8Array(s));
          o += s.byteLength;
          l.label = 4;
        case 4:
          a++;
          return [3, 2];
        case 5:
          return r.byteLength > 0 ? [4, this.encryptionProvider.decrypt(r)] : [3, 7];
        case 6:
          r = l.sent();
          l.label = 7;
        case 7:
          return [2, r];
        case 8:
          return [2, null];
      }
    });
  });
}