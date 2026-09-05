function (e) {
  var t = this;
  this.renderer.set(e);
  this.view.onInternalDataChange();
  __awaiter(t, void 0, void 0, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          return [4, this.view.save()];
        case 1:
          e.sent();
          return [2];
      }
    });
  });
}