function (e) {
  if (e.view instanceof MobileOnboardingController) return "continue";
  var t = e.getViewState();
  __awaiter(i, void 0, void 0, function () {
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return [4, e.open(new EmptyView(e))];
        case 1:
          n.sent();
          return [4, e.setViewState(t)];
        case 2:
          n.sent();
          return [2];
      }
    });
  });
}