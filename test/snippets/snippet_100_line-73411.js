function (e, n) {
  var r = i.commandBeingCustomized,
    o = t.hotkeyManager;
  if (r) {
    var a = function (e) {
      var t = Keymap.decompileModifiers(e.modifiers),
        n = e.vkey;
      return 0 !== t.length || /^F[0-9]+$/i.test(n) ? 1 === t.length && /^[a-zA-Z]$/i.test(n) && "Shift" === t[0] ? null : buildHotkey(t, n) : null;
    }(n);
    if (a) {
      var s = o.getHotkeys(r.id) || o.getDefaultHotkeys(r.id) || [];
      if (!((s = s.slice()).filter(function (e) {
        return formatHotkey(e) === formatHotkey(a);
      }).length > 0)) {
        s.push(a);
        o.setHotkeys(r.id, s);
        __awaiter(i, void 0, void 0, function () {
          return __generator(this, function (e) {
            switch (e.label) {
              case 0:
                return [4, o.save()];
              case 1:
                e.sent();
                return [2];
            }
          });
        });
      }
      i.finishCustomizingHotkey();
    }
    e.preventDefault();
    e.stopPropagation();
  }
}