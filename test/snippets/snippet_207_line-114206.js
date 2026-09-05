function (e) {
  return __awaiter(this, arguments, Promise, function (e, t) {
    var n, i, r, o, a;
    void 0 === t && (t = 6e4);
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          n = this.responsePromise = createDeferred();
          this.send(e);
          i = new Error("Timeout");
          r = window.setTimeout(function () {
            return n.reject(i);
          }, t);
          s.label = 1;
        case 1:
          return s.trys.push([1, 3,, 4]), [4, n.promise];
        case 2:
          return o = s.sent(), clearTimeout(r), [3, 4];
        case 3:
          throw (a = s.sent()) === i && this.disconnect(), a;
        case 4:
          if (o.err) throw new Error(o.err);
          return [2, o];
      }
    });
  });
}