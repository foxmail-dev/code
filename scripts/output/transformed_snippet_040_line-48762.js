function (e, query, i) {
  return __awaiter(t, void 0, void 0, function () {
    var t, r, o, a, s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          t = this.inputEl;
          r = {
            url: this.publish.site.host + "/search",
            method: "POST",
            withCredentials: !0,
            data: {
              id: this.publish.site.id,
              query: query
            }
          };
          a = 1;
          l.label = 1;
        case 1:
          if (!(a <= 3)) return [3, 7];
          if (t.value !== e) return [2];
          l.label = 2;
        case 2:
          l.trys.push([2, 4,, 6]);
          return [4, ajaxPromise(r)];
        case 3:
          o = l.sent();
          return [3, 7];
        case 4:
          s = l.sent();
          console.error(s);
          return [4, sleep(5e3 * a)];
        case 5:
          l.sent();
          return [3, 6];
        case 6:
          a++;
          return [3, 1];
        case 7:
          t.value !== e || i.resolve(o ? JSON.parse(o).results : null);
          return [2];
      }
    });
  });
}