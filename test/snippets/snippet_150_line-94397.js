function (o, s) {
  return __awaiter(node, void 0, void 0, function () {
    var n, l, c, h, f, m, g, v;
    return __generator(this, function (y) {
      switch (y.label) {
        case 0:
          return u = !0, n = i.posFromEvt(e), o ? (c = parseLinktext(o), h = c.path, f = c.subpath, (m = r.getFirstLinkpathDest(h, s)) ? [3, 2] : (g = parseLinktext(o).path, v = t.fileManager.getNewFileParent(o, g), [4, t.fileManager.createNewMarkdownFile(v, g)])) : [3, 3];
        case 1:
          m = y.sent();
          y.label = 2;
        case 2:
          return d(m, f), [3, 4];
        case 3:
          l = i.createTextNode({
            pos: n,
            position: sidea0
          });
          p(l);
          y.label = 4;
        case 4:
          return [2];
      }
    });
  });
}