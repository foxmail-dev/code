function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i, r, o, a, s, l, c, u, h, p, d, f, m;
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          t = [];
          n = new Notice(i18nProxy.interface.mobile.msgImporting(), 0);
          i = 0;
          r = this.app.vault;
          o = 0;
          a = e;
          g.label = 1;
        case 1:
          if (!(o < a.length)) return [3, 12];
          s = a[o];
          g.label = 2;
        case 2:
          g.trys.push([2, 10,, 11]);
          e.length > 1 && n.setMessage(i18nProxy.interface.mobile.msgImporting() + " (".concat(i, "/").concat(e.length, ")"));
          return [4, fetch(CapacitorCore.Capacitor.convertFileSrc(s.uri))];
        case 3:
          return [4, g.sent().arrayBuffer()];
        case 4:
          l = g.sent();
          c = s.name || getFileName(s.uri);
          u = getFileNameWithoutExtension(c);
          h = getFileExtension(c);
          p = void 0;
          return "md" === h ? [3, 6] : [4, r.getAvailablePathForAttachments(u, h, this.app.workspace.getActiveFile())];
        case 5:
          p = g.sent();
          return [3, 8];
        case 6:
          return [4, r.getAvailablePath(u, h)];
        case 7:
          p = g.sent();
          g.label = 8;
        case 8:
          return [4, r.createBinary(p, l)];
        case 9:
          d = g.sent();
          t.push(d);
          i++;
          return [3, 11];
        case 10:
          f = g.sent();
          n.hide();
          new Notice(i18nProxy.interface.mobile.msgFailedToImportFile({
            filename: s.name
          }));
          new Notice(f.toString());
          return [2];
        case 11:
          o++;
          return [3, 1];
        case 12:
          n.hide();
          (m = new Menu().addItem(function (e) {
            return e.setTitle(i18nProxy.interface.mobile.msgImportSuccess()).removeIcon().setIsLabel(!0);
          }).addSeparator()).addItem(function (e) {
            return e.setTitle(i18nProxy.dialogue.buttonDone()).setIcon("lucide-check").onClick(function () {
              return null;
            });
          });
          this.app.workspace.trigger("receive-files-menu", m, t);
          m.showAtPosition({
            x: 0,
            y: 0
          });
          return [2];
      }
    });
  });
}