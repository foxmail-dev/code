function (e, t) {
  return __awaiter(this, arguments, Promise, function (e, t, n) {
    var i, r, o, a, s, l, c;
    void 0 === n && (n = !0);
    return __generator(this, function (u) {
      switch (u.label) {
        case 0:
          return this.trigger("raw", t), isHiddenPath(t) ? [4, this.reconcileDeletion(e, t, n)] : [3, 2];
        case 1:
          return [2, u.sent()];
        case 2:
          return (i = getDirectoryName(t)) && "/" !== i ? this.files[t] ? [3, 4] : [4, this.reconcileFile(getDirectoryName(e), i, n)] : [3, 4];
        case 3:
          u.sent();
          u.label = 4;
        case 4:
          return u.trys.push([4, 12,, 16]), r = this.getFullRealPath(e), this.insensitive ? (o = getDirectoryName(r), a = getFileName(t), [4, this.fs.readdir(o)]) : [3, 7];
        case 5:
          return s = u.sent(), -1 !== s.map(function (e) {
            return replaceNonBreakingSpaces(e.name).normalize("NFC");
          }).indexOf(a) ? [3, 7] : [4, this.reconcileDeletion(e, t, n)];
        case 6:
          return [2, u.sent()];
        case 7:
          return [4, this.fs.stat(r)];
        case 8:
          return "file" !== (l = u.sent()).type ? [3, 9] : (this.reconcileFileChanged(e, t, l), [3, 11]);
        case 9:
          return "directory" !== l.type ? [3, 11] : [4, this.reconcileFolderCreation(e, t)];
        case 10:
          u.sent();
          u.label = 11;
        case 11:
          return [3, 16];
        case 12:
          return "ENOENT" !== (c = u.sent()).code ? [3, 14] : [4, this.reconcileDeletion(e, t, n)];
        case 13:
          return u.sent(), [3, 15];
        case 14:
          console.error(c);
          u.label = 15;
        case 15:
          return [3, 16];
        case 16:
          return [2];
      }
    });
  });
}