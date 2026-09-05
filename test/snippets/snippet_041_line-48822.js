function e(publish) {
  var t = this;
  this.renderQueue = new AsyncGeneratorQueue();
  this.requestUpdateSearch = debounce(this.updateSearch.bind(this), 200, !0);
  this.query = "";
  this.queryWords = [];
  this.runFullSearch = debounce(function (e, query, i) {
    return __awaiter(t, void 0, void 0, function () {
      var t, r, o, a, s;
      return __generator(this, function (l) {
        switch (l.label) {
          case 0:
            t = this.inputEl;
            r = {
              url: this.publish.site.host + "/search",
              method: "POST",
              withCredentials: !0,
              data: {
                id: this.publish.site.id,
                query: query
              }
            };
            a = 1;
            l.label = 1;
          case 1:
            if (!(a <= 3)) return [3, 7];
            if (t.value !== e) return [2];
            l.label = 2;
          case 2:
            l.trys.push([2, 4,, 6]);
            return [4, ajaxPromise(r)];
          case 3:
            o = l.sent();
            return [3, 7];
          case 4:
            s = l.sent();
            console.error(s);
            return [4, sleep(5e3 * a)];
          case 5:
            l.sent();
            return [3, 6];
          case 6:
            a++;
            return [3, 1];
          case 7:
            t.value !== e || i.resolve(o ? JSON.parse(o).results : null);
            return [2];
        }
      });
    });
  }, 500);
  this.publish = publish;
  var n = this.outerContainerEl = createDiv("search-view-outer"),
    i = this.containerEl = n.createDiv("search-view-container");
  i.createSpan("published-search-icon", function (e) {
    setIcon(e, "lucide-search");
  });
  var r = this.inputEl = i.createEl("input", {
    cls: "search-bar",
    type: "text",
    attr: {
      tabIndex: 0
    }
  });
  r.setAttribute("placeholder", "Search page or heading...");
  this.resultEl = createDiv("search-results");
  var o = this.scope = new Scope();
  this.chooser = new SuggestionContainer(this, this.resultEl, o);
  publish.on("options-updated", this.updateOptions.bind(this));
  r.addEventListener("input", function () {
    t.renderQueue.clear();
    t.runFullSearch.cancel();
    t.requestUpdateSearch();
  });
  r.addEventListener("keydown", this.onKeydown.bind(this));
  document.addEventListener("click", this.onDocumentClick.bind(this));
  __awaiter(t, void 0, void 0, function () {
    var e, t, n, i, r, error, a, s, l, c;
    return __generator(this, function (u) {
      switch (u.label) {
        case 0:
          u.trys.push([0, 8, 9, 14]);
          e = !0;
          t = __asyncValues(createBatchedAsyncGenerator(this.renderQueue.generator()));
          u.label = 1;
        case 1:
          return [4, t.next()];
        case 2:
          if (n = u.sent(), a = n.done) return [3, 7];
          c = n.value;
          e = !1;
          i = c;
          u.label = 3;
        case 3:
          u.trys.push([3, 5,, 6]);
          return [4, i()];
        case 4:
          u.sent();
          return [3, 6];
        case 5:
          r = u.sent();
          console.error(r);
          return [3, 6];
        case 6:
          e = !0;
          return [3, 1];
        case 7:
          return [3, 14];
        case 8:
          error = u.sent();
          s = {
            error: error
          };
          return [3, 14];
        case 9:
          u.trys.push([9,, 12, 13]);
          return e || a || !(l = t.return) ? [3, 11] : [4, l.call(t)];
        case 10:
          u.sent();
          u.label = 11;
        case 11:
          return [3, 13];
        case 12:
          if (s) throw s.error;
          return [7];
        case 13:
          return [7];
        case 14:
          return [2];
      }
    });
  });
}