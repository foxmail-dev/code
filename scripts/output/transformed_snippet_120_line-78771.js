function (t) {
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
}