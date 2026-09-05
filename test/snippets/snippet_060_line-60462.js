function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          t = this.owner;
          return [4, this.getExplicitDestination()];
        case 1:
          if (!(n = o.sent())) return [2, null];
          if (i = null, "object" != typeof (r = n[0]) || null === r) return [3, 6];
          if (null !== (i = e.cachedPageNumber(r))) return [3, 5];
          o.label = 2;
        case 2:
          o.trys.push([2, 4,, 5]);
          return [4, t.pdfDocument.getPageIndex(r)];
        case 3:
          i = o.sent() + 1;
          return e !== t.pdfDocument ? [2, null] : [3, 5];
        case 4:
          o.sent();
          return [3, 5];
        case 5:
          return [3, 7];
        case 6:
          if (!Number.isInteger(r)) return [2, null];
          i = r + 1;
          o.label = 7;
        case 7:
          return [2, i];
      }
    });
  });
}