function (unlinkedFile) {
  var t = this;
  this.stopUnlinkedSearch();
  var n = this.unlinkedCollapsed,
    i = this.unlinkedCountEl;
  if (n) i.hide();else {
    this.unlinkedFile = unlinkedFile;
    this.unlinkedAliases = "";
    var r = this.app,
      o = this.unlinkedDom;
    if (i.show(), i.setText("0"), o.emptyResults(), unlinkedFile) {
      var a = [new RegExp(buildWordRegex(unlinkedFile.basename), "gi")],
        s = this.app.metadataCache.getFileCache(unlinkedFile);
      if (s) {
        var l = parseFrontMatterAliases(s.frontmatter);
        if (l) {
          for (var c = 0, u = l; c < u.length; c++) {
            var h = u[c];
            h && a.push(new RegExp(buildWordRegex(h), "gi"));
          }
          this.unlinkedAliases = JSON.stringify(l);
        }
      }
      var beforePause = function () {
          i.setText(String(o.getMatchCount()));
        },
        d = this.unlinkedQueue = new AsyncGeneratorQueue({
          onStart: function () {
            o.startLoader();
          },
          onStop: function () {
            o.stopLoader();
            beforePause();
          },
          onCancel: function () {
            t.unlinkedQueue = null;
          }
        });
      o.emptyResults();
      var f = r.vault.getMarkdownFiles();
      f.sort(SORT_FUNCTIONS[o.sortOrder]);
      d.addList(f);
      var m = d.generator(),
        g = createBatchedAsyncGenerator(r.vault.generateFiles(m, !0), {
          beforePause: beforePause
        });
      __awaiter(t, void 0, void 0, function () {
        var t, n, i, s, l, c, u, h, p, d, f, m, v, y, w, k, C, E, M, x, error, D, A, P, L;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              b.trys.push([0, 5, 6, 11]);
              t = !0;
              n = __asyncValues(g);
              b.label = 1;
            case 1:
              return [4, n.next()];
            case 2:
              if (i = b.sent(), D = i.done) return [3, 4];
              if (L = i.value, t = !1, s = L.file, l = L.content, unlinkedFile === s) return [3, 3];
              if (r.metadataCache.isUserIgnored(s.path)) return [3, 3];
              if (c = r.metadataCache.getFileCache(s), !this.passSearchFilter(s, l)) return [3, 3];
              for (u = !1, h = [], p = 0, d = a; p < d.length; p++) for ((f = d[p]).lastIndex = 0, m = f.exec(l); m;) {
                v = f.lastIndex;
                y = v - m[1].length;
                h.push([y, v]);
                m = f.exec(l);
              }
              for ((w = {}).content = [], k = function (e) {
                var t = iterateCacheRefs(c, function (t) {
                  return t.position.start.offset <= e[0] && t.position.end.offset >= e[1];
                });
                if (c && c.frontmatterPosition) {
                  var n = c.frontmatterPosition;
                  n && n.start.offset <= e[0] && n.end.offset >= e[1] && (t = !0);
                }
                if (!t) {
                  u = !0;
                  w.content.push(e);
                }
              }, C = 0, E = h; C < E.length; C++) {
                M = E[C];
                k(M);
              }
              if (u) {
                x = o.addResult(s, w, l);
                this.addLinkFunction(x, unlinkedFile, s);
                x.separateMatches = !0;
              } else {
                o.removeResult(s);
              }
              b.label = 3;
            case 3:
              t = !0;
              return [3, 1];
            case 4:
              return [3, 11];
            case 5:
              error = b.sent();
              A = {
                error: error
              };
              return [3, 11];
            case 6:
              b.trys.push([6,, 9, 10]);
              return t || D || !(P = n.return) ? [3, 8] : [4, P.call(n)];
            case 7:
              b.sent();
              b.label = 8;
            case 8:
              return [3, 10];
            case 9:
              if (A) throw A.error;
              return [7];
            case 10:
              return [7];
            case 11:
              return [2];
          }
        });
      });
    }
  }
}