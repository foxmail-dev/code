function (e, t, n) {
  return __awaiter(this, void 0, void 0, function () {
    var i, r, o, a, s, l;
    return __generator(this, function (c) {
      if ("file" === e.type || "graph" === e.type) {
        i = this.app.workspace.getLeaf(t);
        return [2, this.openBookmarkInLeaf(e, i, n)];
      }
      if ("url" === e.type) window.open(e.url, "_blank");else if ("folder" === e.type) (r = this.app.vault.getAbstractFileByPath(e.path)) && (o = this.app.internalPlugins.getEnabledPluginById("file-explorer")) && o.revealInFolder(r);else if ("search" === e.type && (a = e.query, s = this.app.internalPlugins.getEnabledPluginById("global-search"))) {
        if (l = s.getGlobalSearchQuery(), !t || "" === l) {
          s.openGlobalSearch(a);
          return [2];
        }
        if (l.contains(a)) {
          s.openGlobalSearch(l.replace(a, "").trim());
        } else {
          s.openGlobalSearch("".concat(l.trim(), " ").concat(a));
        }
      }
      return [2];
    });
  });
}