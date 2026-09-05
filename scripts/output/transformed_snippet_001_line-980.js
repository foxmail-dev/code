function toggleVisibility(e, t, n) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          stopAnimation(e);
          return t ? n ? [4, slideUpAnimation(e)] : [3, 2] : [3, 3];
        case 1:
          i.sent();
          i.label = 2;
        case 2:
          e.hide();
          return [3, 5];
        case 3:
          e.show();
          return n ? [4, slideDownAnimation(e)] : [3, 5];
        case 4:
          i.sent();
          i.label = 5;
        case 5:
          return [2];
      }
    });
  });
}