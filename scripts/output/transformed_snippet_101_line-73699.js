function () {
  return __awaiter(i, void 0, void 0, function () {
    var n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          if (0 !== (n = r.filter(function (t) {
            return formatHotkey(t) !== formatHotkey(e);
          })).length || u) {
            o.setHotkeys(t, n);
          } else {
            o.removeHotkeys(t);
          }
          return [4, o.save()];
        case 1:
          i.sent();
          this.updateHotkeyVisibility();
          return [2];
      }
    });
  });
}