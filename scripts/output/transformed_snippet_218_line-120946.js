function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n, i, r, o, a, s, l, c, u, h, p;
    return __generator(this, function (d) {
      switch (d.label) {
        case 0:
          if (0 === e.length) return [2, []];
          n = this.vault;
          i = [];
          r = 0;
          d.label = 1;
        case 1:
          return r < e.length ? (o = e[r], a = o.name, s = o.extension, l = o.filepath, c = o.data, l && (h = n.resolveFilePath(l)) ? (i.push(h), [3, 7]) : [4, c]) : [3, 8];
        case 2:
          return (u = d.sent()) ? ("Pasted image" === a && (a += " " + window.moment().format("YYYYMMDDHHmmss")), h = void 0, t ? (p = n.getAvailablePath(t.getParentPrefix() + a, s), [4, n.createBinary(p, u)]) : [3, 4]) : [3, 7];
        case 3:
          h = d.sent();
          return [3, 6];
        case 4:
          return [4, this.saveAttachment(a, s, u)];
        case 5:
          h = d.sent();
          d.label = 6;
        case 6:
          i.push(h);
          d.label = 7;
        case 7:
          r++;
          return [3, 1];
        case 8:
          return [2, i];
      }
    });
  });
}