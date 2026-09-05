function (e, t, n) {
  return __awaiter(this, void 0, void 0, function () {
    var i, r, o, subpath, s, state, eState, u, h;
    return __generator(this, function (p) {
      switch (p.label) {
        case 0:
          i = this.app;
          p.label = 1;
        case 1:
          p.trys.push([1, 6,, 7]);
          n = n || {};
          r = parseLinktext(e);
          o = r.path;
          subpath = r.subpath;
          s = i.metadataCache.getFirstLinkpathDest(o, t);
          state = n.state || {};
          eState = n.eState || {};
          return s ? (subpath && (eState.subpath = subpath), [3, 4]) : [3, 2];
        case 2:
          u = null;
          o.contains("/") || (u = i.fileManager.getNewFileParent(t, e));
          return [4, i.fileManager.createNewFile(u, o)];
        case 3:
          s = p.sent();
          state.mode = "source";
          p.label = 4;
        case 4:
          n.state = state;
          n.eState = eState;
          return [4, this.openFile(s, n)];
        case 5:
          p.sent();
          return [3, 7];
        case 6:
          h = p.sent();
          new Notice(h.message);
          console.error(h);
          return [2];
        case 7:
          return [2];
      }
    });
  });
}