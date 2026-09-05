function (e, t, n, i) {
  __awaiter(this, void 0, void 0, function () {
    var r, o, a, s, l, c, u, h, p;
    return __generator(this, function (d) {
      switch (d.label) {
        case 0:
          i = null != i ? i : generateRandomHex(6);
          r = t.editor;
          o = t.file;
          return [4, t.app.metadataCache.blockCache.getForFile(e, o)];
        case 1:
          for (a = d.sent(), s = 0, l = a.blocks; s < l.length; s++) if (c = l[s], (u = c.node.position) && u.start.line - 1 <= n.line && u.end.line - 1 >= n.line) {
            h = {
              content: a.content,
              node: c.node
            };
            p = getBlockAdditionInfo(h, i);
            r.cm.dispatch({
              changes: {
                from: p.blockEnd,
                insert: p.addition
              }
            });
            return [2];
          }
          return [2];
      }
    });
  });
}