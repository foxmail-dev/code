function () {
  var e = this,
    t = createBatchedAsyncGenerator((this.linkResolverQueue = new AsyncGeneratorQueue({
      onStop: function () {
        return e.trigger("resolved");
      },
      onCancel: function () {
        e.linkResolverQueue = null;
      }
    })).generator());
  __awaiter(e, void 0, void 0, function () {
    var e, n, i, r, error, a, s, l, c;
    return __generator(this, function (u) {
      switch (u.label) {
        case 0:
          u.trys.push([0, 5, 6, 11]);
          e = !0;
          n = __asyncValues(t);
          u.label = 1;
        case 1:
          return [4, n.next()];
        case 2:
          if (i = u.sent(), a = i.done) return [3, 4];
          if (c = i.value, e = !1, !(r = c) || "md" !== r.extension) return [3, 3];
          this.resolveLinks(r.path);
          this.trigger("resolve", r);
          u.label = 3;
        case 3:
          e = !0;
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          error = u.sent();
          s = {
            error: error
          };
          return [3, 11];
        case 6:
          u.trys.push([6,, 9, 10]);
          return e || a || !(l = n.return) ? [3, 8] : [4, l.call(n)];
        case 7:
          u.sent();
          u.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (s) throw s.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return [2];
      }
    });
  });
}