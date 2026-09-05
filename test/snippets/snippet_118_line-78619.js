function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t;
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
    var f;
    var m;
    var g;
    var v;
    var y;
    var w;
    var k;
    var C;
    var E;
    var S;
    var M;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          this.layoutReady = !1;
          t = this.app.vault;
          n = Platform.isMobile;
          return (s = e.main) ? (l = this, [4, this.deserializeLayout(s, "root")]) : [3, 2];
        case 1:
          if ((i = l.rootSplit = b.sent()) && "vertical" !== i.direction) {
            i.setDirection("vertical");
            i.recomputeChildrenDimensions();
          }
          b.label = 2;
        case 2:
          return (c = e.left) ? (u = this, [4, this.deserializeLayout(c, "left")]) : [3, 4];
        case 3:
          if ((r = u.leftSplit = b.sent()) && r instanceof WorkspaceSidedock && "horizontal" !== r.direction) {
            r.setDirection("horizontal");
            r.recomputeChildrenDimensions();
          }
          b.label = 4;
        case 4:
          return (h = e.right) ? (p = this, [4, this.deserializeLayout(h, "right")]) : [3, 6];
        case 5:
          if ((o = p.rightSplit = b.sent()) && o instanceof WorkspaceSidedock && "horizontal" !== o.direction) {
            o.setDirection("horizontal");
            o.recomputeChildrenDimensions();
          }
          b.label = 6;
        case 6:
          return (d = e.floating) ? (f = this, [4, this.deserializeLayout(d, null)]) : [3, 8];
        case 7:
          a = f.floatingSplit = b.sent();
          b.label = 8;
        case 8:
          (m = e["left-ribbon"]) && this.leftRibbon.load(m);
          return i ? [3, 11] : (i = this.rootSplit = new WorkspaceRoot(this, "vertical"), g = new WorkspaceTabs(this), v = new WorkspaceLeaf(this.app), g.insertChild(0, v), i.insertChild(0, g), (y = this.getLastOpenFiles()).length > 0 ? (w = y[0], (k = t.getAbstractFileByPath(w)) && k instanceof TFile ? [4, v.openFile(k)] : [3, 10]) : [3, 10]);
        case 9:
          b.sent();
          b.label = 10;
        case 10:
          this.setActiveLeaf(v);
          b.label = 11;
        case 11:
          i.containerEl.addClass("mod-root");
          r || (n ? (r = this.leftSplit = new LeftMobileDrawer(this)).collapse() : r = this.leftSplit = new WorkspaceSidedock(this, "horizontal", "left"));
          o || (o = this.rightSplit = n ? new RightMobileDrawer(this) : new WorkspaceSidedock(this, "horizontal", "right")).collapse();
          a || (a = this.floatingSplit = new WorkspaceFloating(this));
          C = this.containerEl;
          if (Platform.isMobile) {
            C.setChildrenInPlace([r.containerEl, i.containerEl, o.containerEl]);
          } else {
            C.setChildrenInPlace([this.leftRibbon.containerEl, r.containerEl, i.containerEl, o.containerEl, this.rightRibbon.containerEl]);
          }
          E = e.active;
          (S = this.getLeafById(E)) && this.setActiveLeaf(S, {
            focus: !0
          });
          M = [];
          this.iterateAllLeaves(function (e) {
            e.isVisible() && M.push(e.loadIfDeferred());
          });
          return [4, Promise.all(M)];
        case 12:
          b.sent();
          this.layoutReady = !0;
          this.onLayoutChange();
          this.requestActiveLeafEvents();
          return [2];
      }
    });
  });
}