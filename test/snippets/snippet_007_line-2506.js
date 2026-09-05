function (e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n = this;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return e === t ? [2] : [4, this.queue(function () {
            return __awaiter(n, void 0, void 0, function () {
              var n, i, r, o, realpath, s, l, c, u, h;
              return __generator(this, function (p) {
                switch (p.label) {
                  case 0:
                    n = this.getFullPath(e);
                    i = this.getFullPath(t);
                    return [4, this._exists(i, !1)];
                  case 1:
                    if (p.sent() && (!this.insensitive || e.toLowerCase() !== t.toLowerCase())) throw new Error("Destination file already exists!");
                    r = this.files[e];
                    o = r ? r.realpath : null;
                    return [4, this.fsPromises.rename(n, i)];
                  case 2:
                    p.sent();
                    return r ? (delete this.files[e], realpath = this.getRealPath(t), r.realpath = realpath, this.files[t] = r, this.trigger("renamed", t, e), "folder" === r.type && this.watchers.hasOwnProperty(e) ? (this.stopWatchPath(e), [4, this.startWatchPath(t)]) : [3, 4]) : [2];
                  case 3:
                    p.sent();
                    p.label = 4;
                  case 4:
                    if ("folder" === r.type) for (s in this.files) if (this.files.hasOwnProperty(s) && s.startsWith(e + "/")) {
                      l = s.slice(e.length);
                      c = t + l;
                      u = this.files[s];
                      delete this.files[s];
                      h = u.realpath.slice(o.length);
                      u.realpath = realpath + h;
                      this.files[c] = u;
                      this.trigger("renamed", c, s);
                    }
                    return [2];
                }
              });
            });
          })];
        case 1:
          i.sent();
          return [2];
      }
    });
  });
}