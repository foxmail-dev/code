function () {
  var e = this,
    t = this,
    n = t.publish,
    i = t.renderer,
    localFile = t.currentFilepath;
  if (i) {
    var o = n.site;
    if (o.getConfig(PublishShowGraph)) {
      var currentFilepath = n.render.currentFilepath;
      if (localFile !== currentFilepath) {
        i.resetPan();
        localFile = this.currentFilepath = currentFilepath;
      }
      i.highlightNode = null;
      __awaiter(e, void 0, void 0, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return localFile ? [4, this.getGraphData(o.cache)] : [3, 2];
            case 1:
              e = t.sent();
              this.global || (e = getLocalGraphData(e, {
                localFile: localFile,
                localJumps: 1,
                localInterlinks: !0,
                localForelinks: !0,
                localBacklinks: !0
              }));
              return [3, 3];
            case 2:
              e = {
                nodes: {}
              };
              t.label = 3;
            case 3:
              i.setData(e);
              return [2];
          }
        });
      });
    }
  }
}