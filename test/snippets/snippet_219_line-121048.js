function (e) {
  var t = this;
  if (Platform.isDesktopApp) {
    var n = this.vault.adapter;
    if (n instanceof FileSystemAdapter) {
      var path = n.getFullPath(e);
      __awaiter(t, void 0, void 0, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, n.exists(e)];
            case 1:
              if (t.sent()) {
                showItemInFolder(path);
              } else {
                new Notice(i18nProxy.dialogue.msgFileOrFolderNotFound({
                  path: path
                }));
              }
              return [2];
          }
        });
      });
    }
  }
}