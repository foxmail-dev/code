function (e, t) {
  return __awaiter(this, arguments, void 0, function (resolvedFile, t, n) {
    var i,
      r,
      o,
      a,
      s = this;
    void 0 === n && (n = "append");
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          return i = this.app, r = i.fileManager, [4, i.vault.read(t)];
        case 1:
          return o = l.sent(), [4, this.composer.applyTemplate(o, t.basename, resolvedFile.basename)];
        case 2:
          return a = l.sent(), [4, r.runAsyncLinkUpdate(async function (i) {
            var o, s, l;
            await r.insertIntoFile(resolvedFile, a, n);
            await r.trashFile(t);
            if (i) {
              for (o = 0, s = i; o < s.length; o++) (l = s[o]).resolvedFile === t && (l.resolvedFile = resolvedFile, l.resolvedPaths = []);
            }
            return;
          })];
        case 3:
          return l.sent(), [4, i.workspace.getLeaf().openFile(resolvedFile)];
        case 4:
          return l.sent(), [2];
      }
    });
  });
}