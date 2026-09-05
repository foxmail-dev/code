function (e, t, n) {
  return __awaiter(this, void 0, Promise, function () {
    var i, r, o, a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          i = this.getConfig("attachmentFolderPath");
          r = "." === i || "./" === i;
          o = null;
          i.startsWith("./") && (o = i.slice(2));
          if (r) {
            i = n ? n.parent.path : "";
          } else {
            o && (i = (n ? n.parent.getParentPrefix() : "") + o);
          }
          i = normalizePath(i);
          e = normalizePath(e);
          return (a = this.getAbstractFileByPathInsensitive(i)) ? [3, 2] : [4, this.createFolder(i)];
        case 1:
          a = s.sent();
          s.label = 2;
        case 2:
          return a instanceof TFolder ? [2, this.getAvailablePath(a.getParentPrefix() + e, t)] : [2, this.getAvailablePath(e, t)];
      }
    });
  });
}