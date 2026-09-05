function animateAttachment(e, t, n, i) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          return n ? i ? [4, slideUpAnimation(e)] : [3, 2] : [3, 3];
        case 1:
          r.sent();
          r.label = 2;
        case 2:
          e.detach();
          return [3, 5];
        case 3:
          e.show();
          t.appendChild(e);
          return i ? [4, slideDownAnimation(e)] : [3, 5];
        case 4:
          r.sent();
          r.label = 5;
        case 5:
          return [2];
      }
    });
  });
}