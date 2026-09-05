function (t) {
  var n = e.workspace.getActiveFile();
  if (n) {
    t || __awaiter(e, void 0, void 0, function () {
      var e, t;
      return __generator(this, function (i) {
        switch (i.label) {
          case 0:
            e = this.vault.getAvailablePath(getPathWithoutExtension(n.path), n.extension);
            return [4, this.vault.copy(n, e)];
          case 1:
            t = i.sent();
            this.workspace.getLeaf("tab").openFile(t, {
              active: !0,
              eState: {
                rename: "all"
              }
            });
            return [2];
        }
      });
    });
    return !0;
  }
}