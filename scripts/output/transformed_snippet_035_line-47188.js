function (e) {
  var t = this;
  this._graphData || (this._graphData = __awaiter(t, void 0, Promise, function () {
    return __generator(this, function (t) {
      return [2, buildFullGraphData(e, {
        showAttachments: !1,
        hideUnresolved: !0,
        showTags: !1
      })];
    });
  }));
  return this._graphData;
}