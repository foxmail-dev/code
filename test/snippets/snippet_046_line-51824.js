function (t, n) {
  return __awaiter(this, void 0, Promise, function () {
    var i,
      r,
      o = this;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          i = !1;
          return t.hasOwnProperty("file") ? (r = this.app.vault.getAbstractFileByPath(t.file)) instanceof TFile ? [4, this.loadFile(r)] : [3, 2] : [3, 4];
        case 1:
          i = a.sent();
          return [3, 4];
        case 2:
          return [4, this.loadFile(null)];
        case 3:
          i = a.sent();
          a.label = 4;
        case 4:
          this.file || this.allowNoFile || (n.close = !0);
          if (i) {
            n.layout = !0;
            n.history = !0;
          }
          return [4, e.prototype.setState.call(this, t, n)];
        case 5:
          a.sent();
          t.sync || !n.layout && !n.history || (n.done = function () {
            return o.syncState();
          });
          return [2];
      }
    });
  });
}