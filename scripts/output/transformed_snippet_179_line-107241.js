function () {
  return __awaiter(this, void 0, void 0, function () {
    var t,
      n,
      i,
      r,
      o,
      a,
      s,
      l,
      c,
      u,
      h,
      p,
      d,
      f = this;
    return __generator(this, function (m) {
      switch (m.label) {
        case 0:
          t = this.parentModal;
          this.pathToDiffMap = {};
          t.plugin.getCurrentSlug().then(function (e) {
            return f.setCurrentSiteName(e);
          });
          n = [];
          m.label = 1;
        case 1:
          m.trys.push([1, 3,, 4]);
          return [4, t.plugin.scanForChanges()];
        case 2:
          n = m.sent();
          this.noChangesEl.toggle(0 === n.length);
          return [3, 4];
        case 3:
          i = m.sent();
          t.handleError(i);
          return [2];
        case 4:
          for (o = (r = this).sectionChanged, a = r.sectionUnchanged, s = r.sectionNew, o.clear(), a.clear(), s.clear(), l = 0, c = n; l < c.length; l++) {
            u = c[l];
            this.pathToDiffMap[u.path] = u;
            if ("changed" === (h = u.type) || "deleted" === h) {
              o.createItem(u);
            } else {
              "new" === h ? s.createItem(u) : "to-delete" === h && a.createItem(u);
            }
          }
          if (this.filterComponent.onChange(function (e) {
            e = e.trim().toLowerCase();
            o.applyQuery(e);
            a.applyQuery(e);
            s.applyQuery(e);
          }), o.children.length > 0) {
            for (d in a.setCollapsed(!0, !1), s.setCollapsed(!0, !1), o.files) o.files.hasOwnProperty(d) && "deleted" !== (p = o.files[d]).diff.type && p.setChecked(!0);
            for (d in o.folders) o.folders.hasOwnProperty(d) && o.folders[d].updateChecked();
          } else {
            o.setCollapsed(!0, !1);
            a.setCollapsed(!0, !1);
          }
          o.render();
          a.collapseAll();
          a.render();
          s.collapseAll();
          s.render();
          return [2, e.prototype.show.call(this)];
      }
    });
  });
}