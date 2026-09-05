function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n;
    var i;
    var r;
    var o;
    var a;
    var s;
    var l;
    var c;
    var u;
    var h;
    var p;
    var d;
    var f = this;
    return __generator(this, function (m) {
      switch (m.label) {
        case 0:
          if (n = function (t) {
            return __awaiter(f, void 0, void 0, function () {
              var n;
              var i;
              var r;
              return __generator(this, function (o) {
                switch (o.label) {
                  case 0:
                    n = 0;
                    o.label = 1;
                  case 1:
                    return n < e.children.length ? [4, this.deserializeLayout(e.children[n], null)] : [3, 4];
                  case 2:
                    if (i = o.sent()) {
                      "leaf" !== i.type || "tabs" === t.type || t instanceof MobileDrawer || ((r = new WorkspaceTabs(this)).insertChild(0, i), i = r);
                      t.insertChild(n, i);
                    } else {
                      e.children.splice(n, 1);
                      n--;
                    }
                    o.label = 3;
                  case 3:
                    n++;
                    return [3, 1];
                  case 4:
                    return [2];
                }
              });
            });
          }, "split" !== e.type) return [3, 2];
          if (i = void 0, "root" === t) i = new WorkspaceRoot(this, e.direction, e.id);else if (t) {
            if (Platform.isMobile) return [2, null];
            r = i = new WorkspaceSidedock(this, e.direction, t, e.id);
            e.width && r.setSize(e.width);
            e.collapsed && r.collapse();
          } else i = new WorkspaceSplit(this, e.direction, e.id);
          return [4, n(i)];
        case 1:
          if (m.sent(), 0 === i.children.length && !(i instanceof WorkspaceSidedock)) return [2, null];
          for (s = 0; s < e.children.length; s++) {
            l = e.children[s].dimension;
            i.children[s].setDimension(l);
          }
          i.recomputeChildrenDimensions();
          return [2, i];
        case 2:
          if ("floating" !== e.type) return [3, 4];
          for (o = new WorkspaceFloating(this, e.id), s = 0; s < e.children.length; s++) if ("window" !== e.children[s].type) {
            e.children.splice(s, 1);
            s--;
          }
          return [4, n(o)];
        case 3:
          m.sent();
          return [2, o];
        case 4:
          return "window" === e.type && Platform.isDesktopApp && currentElectronMajorVersion >= 13 ? (a = new WorkspaceWindow(this, e.id, e), [4, n(a)]) : [3, 6];
        case 5:
          if (m.sent(), 0 === a.children.length) return [2, null];
          for (s = 0; s < e.children.length; s++) {
            l = e.children[s].dimension;
            a.children[s].setDimension(l);
          }
          a.recomputeChildrenDimensions();
          return [2, a];
        case 6:
          return "tabs" !== e.type ? [3, 8] : (c = new WorkspaceTabs(this, e.id), e.stacked && c.setStacked(!0), [4, n(c)]);
        case 7:
          m.sent();
          return 0 === c.children.length ? [2, null] : (u = e.currentTab || 0, c.selectTabIndex(u), c.recomputeChildrenDimensions(), [2, c]);
        case 8:
          return "leaf" !== e.type ? [3, 10] : (h = new WorkspaceLeaf(this.app, e.id), p = e.state || {}, [4, h.setViewState(p)]);
        case 9:
          m.sent();
          return h.view ? (e.group && h.setGroup(e.group), e.pinned && h.togglePinned(), [2, h]) : (h.detach(), [2, null]);
        case 10:
          return "mobile-drawer" !== e.type ? [3, 12] : Platform.isMobile ? (d = void 0, "left" === t ? d = new LeftMobileDrawer(this, e.id) : "right" === t && (d = new RightMobileDrawer(this, e.id)), [4, n(d)]) : [2, null];
        case 11:
          m.sent();
          d.currentTab = e.currentTab;
          d.recomputeChildrenDimensions();
          e.pinned && d.setPinned(!0);
          return [2, d];
        case 12:
          return [2, null];
      }
    });
  });
}