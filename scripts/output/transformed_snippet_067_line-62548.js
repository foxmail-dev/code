function (t) {
  return __awaiter(this, arguments, void 0, function (t, n) {
    var lastSavedData, r, o, a, s, l, c, u, h, lastSavedDatap0, d;
    void 0 === n && (n = !1);
    return __generator(this, function (f) {
      switch (f.label) {
        case 0:
          if (e.prototype.save.call(this, t, n), this.subpathNotFound) return [2];
          if (lastSavedData = t, o = (r = this).before, a = r.after, s = r.heading, lastSavedData && s && !s.endsWith("\n") && (s += "\n"), lastSavedData = this.data = o + s + this.applyIndent(lastSavedData) + a, this.app.workspace.onQuickPreview(this.file, lastSavedData), !n) return [3, 6];
          if (this.dirty = !1, c = (l = this).file, u = l.app, h = u.vault, !c || c.deleted) return [2];
          if (this.saving) return this.saveAgain = !0, [2];
          if (this.lastSavedData === lastSavedData || null === this.lastSavedData) return [3, 6];
          lastSavedDatap0 = this.lastSavedData;
          this.lastSavedData = lastSavedData;
          this.saving = !0;
          f.label = 1;
        case 1:
          return f.trys.push([1, 4, 5, 6]), [4, resolvePromise(h.adapter.promise)];
        case 2:
          return f.sent(), [4, h.modify(c, lastSavedData)];
        case 3:
          return f.sent(), [3, 6];
        case 4:
          throw d = f.sent(), this.lastSavedData = lastSavedDatap0, console.error(d), new Notice(i18nProxy.interface.msgFailToSaveFile({
            filepath: c.path,
            message: d.message
          }), 0), this.app.fileManager.storeTextFileBackup(c.path, lastSavedData), d;
        case 5:
          return this.saving = !1, this.saveAgain && this.save(this.text), [7];
        case 6:
          return [2];
      }
    });
  });
}