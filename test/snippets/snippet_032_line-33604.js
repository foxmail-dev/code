function () {
  var e = this;
  if (!this.parsing) {
    this.parsing = !0;
    __awaiter(e, void 0, Promise, function () {
      var e, parseSections, n, i, scrollTop, o;
      return __generator(this, function (a) {
        switch (a.label) {
          case 0:
            a.trys.push([0, 6,, 7]);
            return markdownWorker ? [3, 2] : [4, createWorker(this.workerPath)];
          case 1:
            e = a.sent();
            markdownWorker = new WorkerPromise(e);
            a.label = 2;
          case 2:
            return markdownWorker.promise ? [4, markdownWorker.promise.promise] : [3, 4];
          case 3:
            a.sent();
            return [3, 2];
          case 4:
            parseSections = this.text;
            return [4, markdownWorker.submit({
              parseSections: parseSections,
              options: remarkParser.globalOptions
            })];
          case 5:
            n = a.sent();
            i = this.previewEl;
            scrollTop = i.scrollTop;
            this.parseFinish(parseSections, n);
            i.scrollTop = scrollTop;
            this.onRender();
            this.parsing = !1;
            return [3, 7];
          case 6:
            o = a.sent();
            this.parsing = !1;
            console.error(o);
            this.parseSync();
            this.queueRender();
            return [3, 7];
          case 7:
            return [2];
        }
      });
    });
  }
}