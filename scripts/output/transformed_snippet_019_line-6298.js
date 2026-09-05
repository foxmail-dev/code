function (e, t, n) {
  return __awaiter(this, void 0, Promise, function () {
    var saving, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          saving = e.saving;
          e.saving = !0;
          o.label = 1;
        case 1:
          o.trys.push([1, 3, 4, 5]);
          (n = n || {}).immediate = function () {
            return e.cache(t);
          };
          return [4, this.adapter.write(e.path, t, n)];
        case 2:
          o.sent();
          return [3, 5];
        case 3:
          throw r = o.sent(), e.cache(null), r;
        case 4:
          e.saving = saving;
          return [7];
        case 5:
          return [2];
      }
    });
  });
}