function (e) {
  var t = this,
    n = this.editor;
  if (void 0 !== e.startLoc && void 0 !== e.endLoc) {
    var i = e.startLoc,
      r = e.endLoc,
      from = {
        line: i.line,
        ch: i.col
      },
      a = r ? {
        line: r.line,
        ch: r.col
      } : {
        line: n.lastLine(),
        ch: n.getLine(n.lastLine()).length
      };
    this.highlightSearchMatches([{
      from: from,
      to: a
    }]);
    this.isScrolling = !0;
    this.onScroll();
  } else if (void 0 !== e.line && e.line >= 0) {
    var line = e.line;
    from = {
      line: line,
      ch: 0
    };
    a = {
      line: line,
      ch: n.getLine(line).length
    };
    n.setSelection(a, a);
    this.highlightSearchMatches([{
      from: from,
      to: a
    }]);
    this.isScrolling = !0;
    this.onScroll();
  } else if (void 0 !== e.propertyMatches) {
    var l = e.propertyMatches;
    l.length > 0 && ("hidden" === this.app.vault.getConfig("propertiesInDocument") || this.view.canShowProperties() ? __awaiter(t, void 0, void 0, function () {
      var e;
      return __generator(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, ensureMetadataEditor(this.app)];
          case 1:
            (e = t.sent()) && e.focusProperty(l[0].key);
            return [2];
        }
      });
    }) : (n.setSelection({
      line: 0,
      ch: 0
    }), this.isScrolling = !0, this.onScroll()));
  } else if (void 0 !== e.match) {
    var c = e.match,
      u = function (e, t) {
        for (var n = [], i = 0, r = t; i < r.length; i++) {
          var o = r[i];
          n.push(o[0], o[1]);
        }
        for (var a = offsetsToPositions(e, n), s = [], l = 0; l < t.length; l++) s.push({
          from: a[2 * l],
          to: a[2 * l + 1]
        });
        return s;
      }(c.content, c.matches);
    this.highlightSearchMatches(u);
    this.isScrolling = !0;
    this.onScroll();
  }
}