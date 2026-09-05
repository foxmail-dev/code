function (e, t, n) {
  if ("file" === t.type || "files" === t.type || "link" === t.type || "bookmarks" === t.type) {
    var r = i.getTabInsertLocation(e.clientX),
      o = r.rect,
      a = r.index,
      s = r.droppedIndex;
    if ("link" === t.type) {
      if (null !== s) if ((l = i.children[s]).canNavigate()) {
        if (!n) {
          i.workspace.setActiveLeaf(l);
          l.openLinkText(t.linktext, t.sourcePath, {
            active: !0
          });
        }
        return {
          hoverEl: l.tabHeaderEl,
          hoverClass: "is-highlighted",
          action: i18nProxy.interface.dragAndDrop.openInThisTab(),
          dropEffect: "move"
        };
      }
      if (!n) {
        var l = new WorkspaceLeaf(i.app);
        i.insertChild(a, l);
        l.openLinkText(t.linktext, t.sourcePath, {
          active: !0
        });
      }
    } else if ("bookmarks" === t.type) {
      var c = i.app.internalPlugins.getEnabledPluginById("bookmarks"),
        u = t.items.map(function (e) {
          return e.item;
        }).filter(function (e) {
          return "file" === e.type || "graph" === e.type;
        });
      if (c) {
        if (null !== s) {
          if (1 !== u.length) return;
          if ((l = i.children[s]).canNavigate()) {
            if (!n) {
              i.workspace.setActiveLeaf(l);
              c.openBookmarkInLeaf(u[0], l, {
                active: !0
              });
            }
            return {
              hoverEl: l.tabHeaderEl,
              hoverClass: "is-highlighted",
              action: i18nProxy.interface.dragAndDrop.openInThisTab(),
              dropEffect: "move"
            };
          }
        } else if (0 === u.length) return;
        if (!n) {
          for (var h = [], p = 0; p < u.length; p++) {
            var d = new WorkspaceLeaf(i.app);
            i.insertChild(a, d);
            a++;
            h.push(d);
          }
          __awaiter(i, void 0, void 0, function () {
            var e, t;
            return __generator(this, function (n) {
              switch (n.label) {
                case 0:
                  e = 0;
                  n.label = 1;
                case 1:
                  return e < u.length ? (t = h[e], [4, c.openBookmarkInLeaf(u[e], t, {
                    active: !0
                  })]) : [3, 4];
                case 2:
                  n.sent();
                  n.label = 3;
                case 3:
                  e++;
                  return [3, 1];
                case 4:
                  this.workspace.setActiveLeaf(h.last(), {
                    focus: !0
                  });
                  return [2];
              }
            });
          });
        }
      }
    } else {
      var f = ("files" === t.type ? t.files : [t.file]).filter(function (e) {
        return e instanceof TFile;
      });
      if (0 === f.length) return;
      if (1 === f.length && null !== s) if ((l = i.children[s]).canNavigate()) {
        if (!n) {
          i.workspace.setActiveLeaf(l);
          l.openFile(f[0], {
            active: !0
          });
        }
        return {
          hoverEl: l.tabHeaderEl,
          hoverClass: "is-highlighted",
          action: i18nProxy.interface.dragAndDrop.openInThisTab(),
          dropEffect: "move"
        };
      }
      if (!n) {
        var m = [];
        for (p = 0; p < f.length; p++) {
          d = new WorkspaceLeaf(i.app);
          i.insertChild(a, d);
          a++;
          m.push(d);
        }
        __awaiter(i, void 0, void 0, function () {
          var e;
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                e = 0;
                t.label = 1;
              case 1:
                return e < f.length ? [4, m[e].openFile(f[e], {
                  active: !1
                })] : [3, 4];
              case 2:
                t.sent();
                t.label = 3;
              case 3:
                e++;
                return [3, 1];
              case 4:
                this.workspace.setActiveLeaf(m.last(), {
                  focus: !0
                });
                return [2];
            }
          });
        });
      }
    }
    i.app.dragManager.showOverlay(e.doc, o);
    return {
      action: i18nProxy.interface.dragAndDrop.openAsTab(),
      dropEffect: "copy"
    };
  }
}