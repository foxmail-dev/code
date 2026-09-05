function (namee0, widget) {
  return __awaiter(this, void 0, Promise, function () {
    var n;
    var i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          n = namee0.toLowerCase();
          if (i = this.assignedWidgets[n]) {
            i.widget = widget;
          } else {
            this.assignedWidgets[n] = {
              name: namee0,
              widget: widget
            };
          }
          return [4, this.save()];
        case 1:
          r.sent();
          this.trigger("changed", n);
          return [2];
      }
    });
  });
}