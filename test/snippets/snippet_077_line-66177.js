function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          n = normalizePathSlashes("" === e ? t.name : e + "/" + t.name);
          i = normalizePath(n);
          this.trigger("raw", i);
          return isHiddenPath(i) ? [4, this.reconcileDeletion(n, i)] : [3, 2];
        case 1:
          return [2, r.sent()];
        case 2:
          return "file" !== t.type ? [3, 3] : (this.reconcileFileChanged(n, i, t), [3, 5]);
        case 3:
          return "directory" !== t.type ? [3, 5] : [4, this.reconcileFolderCreation(n, i)];
        case 4:
          r.sent();
          r.label = 5;
        case 5:
          return [2];
      }
    });
  });
}