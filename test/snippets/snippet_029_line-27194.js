function () {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          n = (t = this).bgEl;
          i = t.suggestEl;
          return Platform.isPhone ? n.isShown() ? [4, popUpAnimation(i, n)] : [3, 2] : [3, 3];
        case 1:
          r.sent();
          r.label = 2;
        case 2:
          i.detach();
          n.detach();
          return [3, 4];
        case 3:
          e.prototype.detachDom.call(this);
          r.label = 4;
        case 4:
          return [2];
      }
    });
  });
}