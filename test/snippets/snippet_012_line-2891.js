function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n, resolvedPath, r, o, a, s, l;
    return __generator(this, function (c) {
      switch (c.label) {
        case 0:
          n = this.getFullRealPath(e);
          c.label = 1;
        case 1:
          c.trys.push([1, 3,, 4]);
          return [4, this.fsPromises.realpath(n)];
        case 2:
          resolvedPath = c.sent();
          return [3, 4];
        case 3:
          c.sent();
          return [2];
        case 4:
          if (r = this.path.sep, (o = this.watchers).hasOwnProperty(t)) o[t].resolvedPath = resolvedPath;else for (a in o) if (o.hasOwnProperty(a) && a !== t && (s = o[a].resolvedPath, resolvedPath === s || s.startsWith(resolvedPath + r) || resolvedPath.startsWith(s + r))) return [2];
          return [4, this.fsPromises.stat(n)];
        case 5:
          return (l = c.sent()).isFile() ? [4, this.reconcileFileCreation(e, t, l)] : [3, 7];
        case 6:
          c.sent();
          return [3, 11];
        case 7:
          return l.isDirectory() ? recursive ? [4, this.startWatchPath(t)] : [3, 9] : [3, 11];
        case 8:
          c.sent();
          c.label = 9;
        case 9:
          return [4, this.reconcileFolderCreation(e, t)];
        case 10:
          c.sent();
          c.label = 11;
        case 11:
          return [2];
      }
    });
  });
}