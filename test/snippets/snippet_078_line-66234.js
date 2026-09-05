function () {
  return __awaiter(t, void 0, void 0, function () {
    var t, n, i, r, o, a, s, l;
    return __generator(this, function (c) {
      switch (c.label) {
        case 0:
          t = this.getFullPath(e);
          n = this.getFullPath(".trash");
          c.label = 1;
        case 1:
          c.trys.push([1, 3,, 4]);
          return [4, this.fs.mkdir(n)];
        case 2:
          c.sent();
          return [3, 4];
        case 3:
          if ("Directory exists" !== (i = c.sent()).message) throw i;
          return [3, 4];
        case 4:
          r = getFileName(t);
          o = getPathWithoutExtension(r);
          a = getFileExtension(r);
          s = n + "/" + o;
          a && (s = s + "." + a);
          l = 1;
          c.label = 5;
        case 5:
          return [4, this._exists(s)];
        case 6:
          return c.sent() ? (l++, s = n + "/" + o + " " + l, a && (s = s + "." + a), [3, 5]) : [3, 7];
        case 7:
          return [4, this.fs.rename(t, s)];
        case 8:
          c.sent();
          return [4, this.reconcileInternalFile(e)];
        case 9:
          c.sent();
          return [2];
      }
    });
  });
}