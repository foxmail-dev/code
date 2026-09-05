function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i, r, o, a, s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          if (n = (t = this).owner, i = t.item, "string" != typeof (r = i.dest)) return [3, 5];
          l.label = 1;
        case 1:
          l.trys.push([1, 3,, 4]);
          return [4, n.pdfDocument.getDestination(r)];
        case 2:
          o = l.sent();
          return e !== n.pdfDocument ? [2, null] : o && Array.isArray(o) && "number" == typeof (null === (s = o[0]) || void 0 === s ? void 0 : s.num) ? [2, o] : [3, 4];
        case 3:
          a = l.sent();
          console.error(a);
          return [2, null];
        case 4:
          return [3, 6];
        case 5:
          if (Array.isArray(r)) return [2, r];
          l.label = 6;
        case 6:
          return [2, null];
      }
    });
  });
}