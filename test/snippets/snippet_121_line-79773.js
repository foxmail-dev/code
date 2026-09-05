function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t;
    var n;
    var i;
    var r;
    var o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          t = e.getRoot();
          n = !1;
          if (t instanceof WorkspaceSidedock && t.collapsed) {
            n = !0;
            t.expand();
          }
          if (t instanceof MobileDrawer) {
            t.openLeaf(e);
            t.expand();
            if (t === this.leftSplit) {
              this.rightSplit.collapse();
            } else {
              t === this.rightSplit && this.leftSplit.collapse();
            }
          }
          if ((i = e.parent) instanceof WorkspaceTabs) {
            r = i.currentTab;
            i.selectTab(e);
            (n || i.currentTab !== r) && flashElement(e.tabHeaderEl);
          }
          (o = e.getContainer()) && o.focus();
          return [4, e.loadIfDeferred()];
        case 1:
          a.sent();
          return [2];
      }
    });
  });
}