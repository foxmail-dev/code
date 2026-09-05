function () {
  return __awaiter(this, void 0, Promise, function () {
    var e,
      t = this;
    return __generator(this, function (n) {
      (e = this.titleEl).tabIndex = -1;
      if (Platform.isMobileApp) {
        e.addEventListener("touchstart", function () {
          e.contentEditable = "true";
        });
      } else {
        e.contentEditable = "true";
      }
      e.addEventListener("focus", this.onTitleFocus.bind(this));
      e.addEventListener("blur", this.onTitleBlur.bind(this));
      e.addEventListener("input", function () {
        return t.onTitleChange(e);
      });
      e.addEventListener("paste", function (n) {
        return t.onTitlePaste(e, n);
      });
      e.addEventListener("keydown", this.onTitleKeydown.bind(this));
      return [2];
    });
  });
}