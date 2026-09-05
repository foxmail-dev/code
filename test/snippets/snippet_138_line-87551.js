function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t = this;
    return __generator(this, function (n) {
      new Menu().addItem(function (t) {
        return t.setTitle(createFragment(function (t) {
          for (var n = 0, i = e; n < i.length; n++) {
            var r = i[n];
            t.createDiv({
              text: r.name
            });
          }
        })).removeIcon().setIsLabel(!0).titleEl.addClass("u-muted", "u-small");
      }).addSeparator().addItem(function (n) {
        return n.setTitle(i18nProxy.interface.mobile.actionImport()).setIcon("lucide-files").onClick(function () {
          return t.importFiles(e);
        });
      }).addItem(function (e) {
        return e.setTitle(i18nProxy.dialogue.buttonCancel()).setIcon("lucide-x").onClick(function () {
          return null;
        });
      }).showAtPosition({
        x: 0,
        y: 0
      });
      return [2];
    });
  });
}