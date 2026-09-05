function (backlinkFile) {
  var t = this;
  this.stopBacklinkSearch();
  var n = this.backlinkCollapsed,
    i = this.backlinkCountEl;
  if (n) i.hide();else {
    this.backlinkFile = backlinkFile;
    var r = this.app,
      o = this.backlinkDom;
    if (i.show(), i.setText("0"), o.emptyResults(), backlinkFile) {
      var a = this.app.metadataCache,
        beforePause = function () {
          i.setText(String(o.getMatchCount()));
          o.changed();
        },
        l = this.backlinkQueue = new AsyncGeneratorQueue({
          onStart: function () {
            o.startLoader();
          },
          onStop: function () {
            o.stopLoader();
            beforePause();
          },
          onCancel: function () {
            t.backlinkQueue = null;
            beforePause();
          }
        });
      o.emptyResults();
      var c = r.vault.getMarkdownFiles();
      c.sort(getSortFunction(o.sortOrder));
      l.addList(c);
      var u = function () {
          return __asyncGenerator(this, arguments, function () {
            var t, n, i, r, error, c, u, h, p;
            return __generator(this, function (d) {
              switch (d.label) {
                case 0:
                  d.trys.push([0, 8, 9, 14]);
                  t = !0;
                  n = __asyncValues(l.generator());
                  d.label = 1;
                case 1:
                  return [4, __await(n.next())];
                case 2:
                  i = d.sent();
                  return (c = i.done) ? [3, 7] : (p = i.value, t = !1, function (t) {
                    var n = t.path,
                      i = a.resolvedLinks;
                    return i.hasOwnProperty(n) && i[n].hasOwnProperty(backlinkFile.path);
                  }(r = p) ? [4, __await(r)] : [3, 5]);
                case 3:
                  return [4, d.sent()];
                case 4:
                  d.sent();
                  return [3, 6];
                case 5:
                  o.removeResult(r);
                  d.label = 6;
                case 6:
                  t = !0;
                  return [3, 1];
                case 7:
                  return [3, 14];
                case 8:
                  error = d.sent();
                  u = {
                    error: error
                  };
                  return [3, 14];
                case 9:
                  d.trys.push([9,, 12, 13]);
                  return t || c || !(h = n.return) ? [3, 11] : [4, __await(h.call(n))];
                case 10:
                  d.sent();
                  d.label = 11;
                case 11:
                  return [3, 13];
                case 12:
                  if (u) throw u.error;
                  return [7];
                case 13:
                  return [7];
                case 14:
                  return [2];
              }
            });
          });
        }(),
        h = createBatchedAsyncGenerator(r.vault.generateFiles(u, !0), {
          batchSize: 2,
          beforePause: beforePause
        });
      __awaiter(t, void 0, void 0, function () {
        var t, n, i, r, s, c, error, p, d, f, m;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              g.trys.push([0, 5, 6, 11]);
              t = function () {
                m = s.value;
                i = !1;
                var t = m.file,
                  r = m.content;
                if (l.runnable.isCancelled()) return {
                  value: void 0
                };
                if (backlinkFile === t) return "continue";
                var c = !1,
                  u = {},
                  h = a.getFileCache(t);
                if (!h) {
                  o.removeResult(t);
                  return "continue";
                }
                if (!n.passSearchFilter(t, r)) return "continue";
                var p = [];
                iterateAllLinks(h, function (n) {
                  (function (t, n) {
                    var i = getLinkpath(n.link),
                      r = a.getFirstLinkpathDest(i, t);
                    return r && r === backlinkFile;
                  })(t.path, n) && p.push(n);
                });
                u.content = [];
                u.properties = [];
                for (var d = 0, f = p; d < f.length; d++) {
                  var g = f[d];
                  if (hasPosition(g)) u.content.push([g.position.start.offset, g.position.end.offset]);else if (hasKey(g)) {
                    var v = g.key.split("."),
                      y = v[0],
                      b = v.slice(1),
                      subkey = void 0;
                    if (b) {
                      subkey = [];
                      for (var k = 0, C = b; k < C.length; k++) {
                        var E = C[k],
                          S = Number(E);
                        subkey.push(Number.isNaN(S) ? E : S);
                      }
                    }
                    u.properties.push({
                      key: y,
                      subkey: subkey,
                      pos: [0, g.original.length]
                    });
                  }
                  c = !0;
                }
                if (c) {
                  o.addResult(t, u, r);
                } else {
                  o.removeResult(t);
                }
              };
              n = this;
              i = !0;
              r = __asyncValues(h);
              g.label = 1;
            case 1:
              return [4, r.next()];
            case 2:
              if (s = g.sent(), p = s.done) return [3, 4];
              if ("object" == typeof (c = t())) return [2, c.value];
              g.label = 3;
            case 3:
              i = !0;
              return [3, 1];
            case 4:
              return [3, 11];
            case 5:
              error = g.sent();
              d = {
                error: error
              };
              return [3, 11];
            case 6:
              g.trys.push([6,, 9, 10]);
              return i || p || !(f = r.return) ? [3, 8] : [4, f.call(r)];
            case 7:
              g.sent();
              g.label = 8;
            case 8:
              return [3, 10];
            case 9:
              if (d) throw d.error;
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