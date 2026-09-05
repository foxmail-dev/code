function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i, r, o, a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          t = this.cmacFactory();
          n = new CMAC();
          i = new CMAC();
          return [4, t.update(n.data)];
        case 1:
          s.sent();
          o = (r = i.data).set;
          return [4, t.finish()];
        case 2:
          o.apply(r, [s.sent()]);
          t = this.cmacFactory();
          n.clear();
          return e.length >= CMAC.SIZE ? (a = e.length - CMAC.SIZE, n.data.set(e.subarray(a)), [4, t.update(e.subarray(0, a))]) : [3, 4];
        case 3:
          s.sent();
          return [3, 5];
        case 4:
          n.data.set(e);
          n.data[e.length] = 128;
          i.dbl();
          s.label = 5;
        case 5:
          xorBuffers(n.data, i.data);
          return [4, t.update(n.data)];
        case 6:
          s.sent();
          return [2, t.finish()];
      }
    });
  });
}