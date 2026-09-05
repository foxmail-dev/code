function executeSearch(e, t, n, i, r) {
  return __awaiter(this, void 0, Promise, function () {
    var o;
    var a;
    var s;
    var l;
    var c;
    var u;
    var h;
    var p;
    var error;
    var f;
    var m;
    var g;
    var v;
    return __generator(this, function (y) {
      switch (y.label) {
        case 0:
          o = createBatchedAsyncGenerator(n.generator(), r);
          y.label = 1;
        case 1:
          y.trys.push([1, 11, 12, 17]);
          a = !0;
          s = __asyncValues(o);
          y.label = 2;
        case 2:
          return [4, s.next()];
        case 3:
          if (l = y.sent(), f = l.done) return [3, 10];
          if (v = l.value, a = !1, c = v, e.metadataCache.isUserIgnored(c.path)) return [3, 9];
          if (!e.metadataCache.isSupportedFile(c)) return [3, 9];
          if (u = "md" === c.extension || "canvas" === c.extension, h = "", !u || !t.content) return [3, 7];
          y.label = 4;
        case 4:
          y.trys.push([4, 6,, 7]);
          return [4, e.vault.cachedRead(c)];
        case 5:
          h = y.sent();
          return [3, 7];
        case 6:
          p = y.sent();
          console.error(p);
          return [3, 7];
        case 7:
          return n.runnable.isCancelled() ? [2] : [4, i(c, h)];
        case 8:
          y.sent();
          y.label = 9;
        case 9:
          a = !0;
          return [3, 2];
        case 10:
          return [3, 17];
        case 11:
          error = y.sent();
          m = {
            error: error
          };
          return [3, 17];
        case 12:
          y.trys.push([12,, 15, 16]);
          return a || f || !(g = s.return) ? [3, 14] : [4, g.call(s)];
        case 13:
          y.sent();
          y.label = 14;
        case 14:
          return [3, 16];
        case 15:
          if (m) throw m.error;
          return [7];
        case 16:
          return [7];
        case 17:
          return [2];
      }
    });
  });
}