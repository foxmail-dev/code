function (e, t, n) {
  return __awaiter(this, void 0, void 0, function () {
    var i, r, o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          return "file" !== e.type ? [3, 1] : (i = e.path + (null !== (o = e.subpath) && void 0 !== o ? o : ""), t.openLinkText(i, "", n), [3, 5]);
        case 1:
          return "graph" !== e.type ? [3, 4] : (r = this.app.internalPlugins.getEnabledPluginById("graph")) ? [4, t.setViewState({
            type: "graph"
          })] : [3, 3];
        case 2:
          a.sent();
          t.view instanceof GraphView && t.view.dataEngine.setOptions(e.options);
          r.options.options = e.options;
          a.label = 3;
        case 3:
          return [3, 5];
        case 4:
          "url" === e.type && window.open(e.url, "_blank");
          a.label = 5;
        case 5:
          return [2];
      }
    });
  });
}