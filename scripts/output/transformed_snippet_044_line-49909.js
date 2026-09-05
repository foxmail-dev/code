function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, i, r, o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          if (!(e = window.preloadCache)) return [3, 7];
          a.label = 1;
        case 1:
          a.trys.push([1, 6,, 7]);
          delete window.preloadCache;
          return [4, e];
        case 2:
          return (t = a.sent()).ok && isObsidianFetchResponse(t) ? (i = (n = this.cache).load, [4, t.json()]) : [3, 5];
        case 3:
          return [4, i.apply(n, [a.sent()])];
        case 4:
          a.sent();
          return [2];
        case 5:
          return [3, 7];
        case 6:
          a.sent();
          return [3, 7];
        case 7:
          r = {
            withCredentials: !0,
            url: this.host + "/cache/" + encodeURIComponent(this.id) + this.getPathSuffix()
          };
          return [4, ajaxPromise(r)];
        case 8:
          o = a.sent();
          return isObsidianResponse(r.req) ? [4, this.cache.load(JSON.parse(o))] : [2];
        case 9:
          a.sent();
          return [2];
      }
    });
  });
}