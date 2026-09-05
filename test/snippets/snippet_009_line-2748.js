function (e, t) {
  return __awaiter(this, arguments, Promise, function (e, t, n) {
    var i, r, o, a, s;
    void 0 === n && (n = !0);
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          return this.trigger("raw", t), isHiddenPath(t) ? [4, this.reconcileDeletion(e, t, n)] : [3, 2];
        case 1:
          return [2, l.sent()];
        case 2:
          return (i = getDirectoryName(t)) && "/" !== i ? this.files[t] ? [3, 4] : [4, this.reconcileFile(getDirectoryName(e), i, n)] : [3, 4];
        case 3:
          l.sent();
          l.label = 4;
        case 4:
          return l.trys.push([4, 9,, 13]), r = this.getFullRealPath(e), this.insensitive ? (o = this.path.dirname(r), a = this.path.basename(t), [4, this.fsPromises.readdir(o)]) : [3, 7];
        case 5:
          return -1 !== l.sent().map(function (e) {
            return replaceNonBreakingSpaces(e).normalize("NFC");
          }).indexOf(a) ? [3, 7] : [4, this.reconcileDeletion(e, t, n)];
        case 6:
          return [2, l.sent()];
        case 7:
          return [4, this.reconcileFileInternal(e, t)];
        case 8:
          return l.sent(), [3, 13];
        case 9:
          return "ENOENT" !== (s = l.sent()).code ? [3, 11] : [4, this.reconcileDeletion(e, t, n)];
        case 10:
          return l.sent(), [3, 12];
        case 11:
          console.error(s);
          l.label = 12;
        case 12:
          return [3, 13];
        case 13:
          return [2];
      }
    });
  });
}