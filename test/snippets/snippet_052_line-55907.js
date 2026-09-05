function (e) {
  var t = this,
    n = this.viewContainerEl;
  this.queue.stop();
  this.errors.clear();
  var i = this.queue.start(),
    r = createBatchedAsyncGenerator(i.generator(), {
      batchSize: 10,
      duration: 50,
      maxDelay: 16
    });
  this.initialScan = !0;
  __awaiter(t, void 0, Promise, function () {
    var t, o, a, s, l, c, error, h, p, d, f;
    return __generator(this, function (m) {
      switch (m.label) {
        case 0:
          t = !1;
          m.label = 1;
        case 1:
          m.trys.push([1, 8, 9, 14]);
          o = !0;
          a = __asyncValues(r);
          m.label = 2;
        case 2:
          return [4, a.next()];
        case 3:
          s = m.sent();
          return (h = s.done) ? [3, 7] : (f = s.value, o = !1, l = f, i.runnable.isCancelled() ? [2] : n.isShown() ? [3, 5] : [4, new Promise(function (e) {
            return n.onNodeInserted(e, !0);
          })]);
        case 4:
          m.sent();
          m.label = 5;
        case 5:
          if (e.local && e.local.file === l) if (t) {
            if (e.localUsed) {
              this.runQuery(e.regenerateLocal());
              return [2];
            }
          } else t = !0;
          if (this.removeResult(l), this.app.metadataCache.isUserIgnored(l.path)) return [3, 6];
          try {
            c = new FileExecutionContext(e, l);
            (!e.filter || e.filter.test(c)) && this.addResult(l, c);
          } catch (e) {
            this.errors.add(BasesI18nProxy7.msgErrorFilterFailedToEvaluate({
              message: e.message
            }));
          }
          m.label = 6;
        case 6:
          o = !0;
          return [3, 2];
        case 7:
          return [3, 14];
        case 8:
          error = m.sent();
          p = {
            error: error
          };
          return [3, 14];
        case 9:
          m.trys.push([9,, 12, 13]);
          return o || h || !(d = a.return) ? [3, 11] : [4, d.call(a)];
        case 10:
          m.sent();
          m.label = 11;
        case 11:
          return [3, 13];
        case 12:
          if (p) throw p.error;
          return [7];
        case 13:
          return [7];
        case 14:
          return [2];
      }
    });
  });
}