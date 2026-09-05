function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return (t = window.require) ? [4, t("fs").promises.mkdir(e, {
            recursive: !0
          })] : [3, 2];
        case 1:
          return [2, n.sent()];
        case 2:
          return [2, null];
      }
    });
  });
}