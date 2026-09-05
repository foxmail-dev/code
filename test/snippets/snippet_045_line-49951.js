function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, i, r, o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          if (!(e = window.preloadOptions)) return [3, 6];
          a.label = 1;
        case 1:
          a.trys.push([1, 5,, 6]);
          delete window.preloadOptions;
          return [4, e];
        case 2:
          return (t = a.sent()).ok && isObsidianFetchResponse(t) ? (n = this, [4, t.json()]) : [3, 4];
        case 3:
          n.options = a.sent();
          return [2];
        case 4:
          return [3, 6];
        case 5:
          a.sent();
          return [3, 6];
        case 6:
          a.trys.push([6, 8,, 9]);
          i = {
            withCredentials: !0,
            url: this.host + "/options/" + encodeURIComponent(this.id)
          };
          return [4, ajaxPromise(i)];
        case 7:
          r = a.sent();
          return isObsidianResponse(i.req) ? (this.options = JSON.parse(r), [3, 9]) : [2];
        case 8:
          o = a.sent();
          console.error("Failed to load options", o);
          return [3, 9];
        case 9:
          return [2];
      }
    });
  });
}