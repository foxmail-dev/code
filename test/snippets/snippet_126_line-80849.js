function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i, r, o, a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          if (localStorage.setItem("enable-plugin-" + this.app.appId, e ? "true" : "false"), e) return [3, 5];
          t = Object.keys(this.plugins);
          n = 0;
          i = t;
          s.label = 1;
        case 1:
          return n < i.length ? (a = i[n], [4, this.disablePlugin(a)]) : [3, 4];
        case 2:
          s.sent();
          s.label = 3;
        case 3:
          n++;
          return [3, 1];
        case 4:
          return [3, 9];
        case 5:
          r = 0;
          o = Array.from(this.enabledPlugins);
          s.label = 6;
        case 6:
          return r < o.length ? (a = o[r], [4, this.enablePlugin(a)]) : [3, 9];
        case 7:
          s.sent();
          s.label = 8;
        case 8:
          r++;
          return [3, 6];
        case 9:
          return [2];
      }
    });
  });
}