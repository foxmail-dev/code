function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return e ? [3, 2] : (t = this.canvas.view.file.path, [4, this.app.fileManager.createNewMarkdownFileFromLinktext(this.inputEl.value, t)]);
        case 1:
          n = i.sent();
          this.handleChoose(n);
          return [2];
        case 2:
          "file" !== e.type && "alias" !== e.type || this.handleChoose(e.file);
          return [2];
      }
    });
  });
}