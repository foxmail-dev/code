function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i, embeds, caches, a, s, l, c, u, h;
    return __generator(this, function (p) {
      switch (p.label) {
        case 0:
          return [4, this.app.vault.cachedRead(e)];
        case 1:
          if (!(t = p.sent())) return [2, null];
          if (n = JSON.parse(t), !(i = n.nodes) || !Array.isArray(i)) return [2, null];
          embeds = [];
          caches = {};
          a = this.refNodeIds;
          s = function (e) {
            var t, n, i;
            return __generator(this, function (s) {
              switch (s.label) {
                case 0:
                  return "file" !== e.type ? [3, 1] : (embeds.push({
                    file: e.file,
                    subpath: e.subpath
                  }), [3, 6]);
                case 1:
                  return "group" === e.type && e.background ? (embeds.push({
                    file: e.background,
                    subpath: ""
                  }), [3, 6]) : [3, 2];
                case 2:
                  if ("text" !== e.type) return [3, 6];
                  t = e.text;
                  s.label = 3;
                case 3:
                  s.trys.push([3, 5,, 6]);
                  return [4, l.parseText(t)];
                case 4:
                  iterateAllLinks(n = s.sent(), function (t) {
                    a.set(t, e.id);
                  });
                  caches[e.id] = n;
                  return [3, 6];
                case 5:
                  i = s.sent();
                  console.error(i);
                  return [3, 6];
                case 6:
                  return [2];
              }
            });
          };
          l = this;
          c = 0;
          u = i;
          p.label = 2;
        case 2:
          return c < u.length ? (h = u[c], [5, s(h)]) : [3, 5];
        case 3:
          p.sent();
          p.label = 4;
        case 4:
          c++;
          return [3, 2];
        case 5:
          return [2, {
            embeds: embeds,
            caches: caches
          }];
      }
    });
  });
}