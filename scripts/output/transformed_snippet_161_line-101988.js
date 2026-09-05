function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t, n, i, r, o, a, s, l, c, u, h, error, d, f, m, g;
    return __generator(this, function (v) {
      switch (v.label) {
        case 0:
          n = (t = this).app;
          i = t.runnable;
          r = {
            processed: 0,
            modified: 0,
            replaced: 0,
            failed: 0
          };
          o = n.vault.getMarkdownFiles();
          a = [];
          v.label = 1;
        case 1:
          v.trys.push([1, 7, 8, 13]);
          s = function () {
            var filet0, o;
            return __generator(this, function (s) {
              switch (s.label) {
                case 0:
                  if (g = h.value, c = !1, filet0 = g, i.isCancelled()) {
                    l.onFinish(r);
                    return [2, "break"];
                  }
                  s.label = 1;
                case 1:
                  s.trys.push([1, 3,, 4]);
                  return [4, n.vault.process(filet0, function (contenti0) {
                    for (var o = contenti0, s = 0, l = e; s < l.length; s++) {
                      o = l[s].convert(n, filet0, o, r);
                    }
                    return o !== contenti0 && (r.modified++, a.push({
                      file: filet0,
                      mtime: filet0.stat.mtime,
                      content: contenti0
                    })), o;
                  }, {
                    mtime: filet0.stat.mtime + 1
                  })];
                case 2:
                  s.sent();
                  return [3, 4];
                case 3:
                  o = s.sent();
                  r.failed++;
                  console.error(o);
                  return [3, 4];
                case 4:
                  r.processed++;
                  return i.isCancelled() ? (l.onFinish(r), l.app.fileManager.notifyForBulkUndo(a), [2, "break"]) : (l.renderStats(r), r.processed % 10 != 0 ? [3, 6] : [4, sleep(0)]);
                case 5:
                  s.sent();
                  s.label = 6;
                case 6:
                  return [2];
              }
            });
          };
          l = this;
          c = !0;
          u = __asyncValues(asyncGeneratorFromArray(o));
          v.label = 2;
        case 2:
          return [4, u.next()];
        case 3:
          h = v.sent();
          return (d = h.done) ? [3, 6] : [5, s()];
        case 4:
          if ("break" === v.sent()) return [3, 6];
          v.label = 5;
        case 5:
          c = !0;
          return [3, 2];
        case 6:
          return [3, 13];
        case 7:
          error = v.sent();
          f = {
            error: error
          };
          return [3, 13];
        case 8:
          v.trys.push([8,, 11, 12]);
          return c || d || !(m = u.return) ? [3, 10] : [4, m.call(u)];
        case 9:
          v.sent();
          v.label = 10;
        case 10:
          return [3, 12];
        case 11:
          if (f) throw f.error;
          return [7];
        case 12:
          return [7];
        case 13:
          this.onFinish(r);
          this.app.fileManager.notifyForBulkUndo(a);
          return [2];
      }
    });
  });
}