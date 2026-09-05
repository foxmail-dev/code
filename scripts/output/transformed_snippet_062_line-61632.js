function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v, y, w, k, C, E;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          n = e.annotationLayer.annotationLayer.getAnnotation(t);
          return (null == (i = null === (E = n.data) || void 0 === E ? void 0 : E.quadPoints) ? void 0 : i.length) ? (r = e.textLayer).renderingDone ? [3, 2] : [4, r.textLayer.renderingTask.promise] : [2, null];
        case 1:
          b.sent();
          b.label = 2;
        case 2:
          for (o = "", a = 0, s = i.length; a < s; a += 8) {
            l = i.slice(a, a + 8);
            c = l[0];
            u = l[1];
            h = l[2];
            p = l[3];
            d = l[4];
            f = l[5];
            m = l[6];
            g = l[7];
            v = Math.min(c, h, d, m);
            y = Math.max(c, h, d, m);
            w = Math.min(u, p, f, g);
            k = Math.max(u, p, f, g);
            (C = this.getTextByRect(e, [v, w, y, k])) && "" !== o && (o += " ");
            o += C;
          }
          return [2, o.trim() || null];
      }
    });
  });
}