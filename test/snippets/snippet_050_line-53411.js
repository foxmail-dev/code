function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t, n, i, r, data, lastSavedData, s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          if (this.dirty = !1, n = (t = this).file, i = t.app, r = i.vault, !n || n.deleted) return [2];
          if (this.saving) {
            e || (this.saveAgain = !0);
            return [2];
          }
          if (this.saveAgain = !1, data = this.getViewData(), this.lastSavedData === data || null === this.lastSavedData) return [3, 6];
          lastSavedData = this.lastSavedData;
          if (e) {
            this.data = null;
            this.lastSavedData = null;
            this.clear();
          } else {
            this.data = data;
            this.lastSavedData = data;
          }
          this.saving = !0;
          l.label = 1;
        case 1:
          l.trys.push([1, 4, 5, 6]);
          return [4, resolvePromise(r.adapter.promise)];
        case 2:
          l.sent();
          return [4, r.modify(n, data)];
        case 3:
          l.sent();
          return [3, 6];
        case 4:
          throw s = l.sent(), this.lastSavedData = lastSavedData, console.error(s), new Notice(i18nProxy.interface.msgFailToSaveFile({
            filepath: n.path,
            message: s.message
          }), 0), this.app.fileManager.storeTextFileBackup(n.path, data), s;
        case 5:
          this.saving = !1;
          this.saveAgain && !e && this.save();
          return [7];
        case 6:
          return [2];
      }
    });
  });
}