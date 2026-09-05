function e(basePath, t) {
  var n = this;
  this.fs = t;
  this.basePath = basePath;
  this.files = {};
  this.promise = Promise.resolve();
  this.handler = null;
  this.insensitive = !1;
  __awaiter(n, void 0, void 0, function () {
    return __generator(this, function (e) {
      try {
        this.testInsensitive();
      } catch (e) {
        console.error(e);
      }
      return [2];
    });
  });
}