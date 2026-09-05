function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n, i, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          n = normalizePathSlashes("" === e ? t : e + "/" + t);
          i = normalizePath(n);
          this.trigger("raw", i);
          return isHiddenPath(i) ? [4, this.reconcileDeletion(n, i)] : [3, 2];
        case 1:
          return [2, o.sent()];
        case 2:
          o.trys.push([2, 4,, 8]);
          return [4, this.reconcileFileInternal(n, i)];
        case 3:
          o.sent();
          return [3, 8];
        case 4:
          return "ENOENT" !== (r = o.sent()).code ? [3, 6] : [4, this.reconcileDeletion(n, i, !0)];
        case 5:
          o.sent();
          return [3, 7];
        case 6:
          throw r;
        case 7:
          return [3, 8];
        case 8:
          return [2];
      }
    });
  });
}