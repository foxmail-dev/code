function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t,
      n,
      i,
      r = this;
    return __generator(this, function (o) {
      e.preventDefault();
      t = this.tree;
      n = t.focusedItem;
      if ((i = t.selectedDoms).size > 0) {
        i.forEach(function (e) {
          r.plugin.removeItem(e.item);
        });
      } else {
        n instanceof BookmarkLeafTreeItem && this.plugin.removeItem(n.item);
      }
      return [2];
    });
  });
}