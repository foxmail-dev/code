function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          n = this.canvas.index.refNodeIds;
          r.label = 1;
        case 1:
          r.trys.push([1, 3,, 4]);
          return [4, this.app.vault.process(e, function (e) {
            for (var i = JSON.parse(e), r = new MultiMapClass(), o = 0, a = t; o < a.length; o++) {
              var s = a[o],
                l = n.get(s.reference);
              l && r.add(l, s);
            }
            for (var c = 0, u = i.nodes; c < u.length; c++) {
              var h = u[c];
              if ("text" === h.type) {
                var p = r.get(h.id);
                p && (h.text = applyLinkUpdates(h.text, p));
              }
            }
            return serializeJson(i);
          })];
        case 2:
          r.sent();
          return [3, 4];
        case 3:
          i = r.sent();
          console.error(i);
          return [3, 4];
        case 4:
          return [2];
      }
    });
  });
}