function () {
  var e = this,
    t = this.linksQueue;
  if (t && !t.runnable.isCancelled()) {
    t.runnable.cancel();
    this.outgoingFile = null;
  }
  this.linksQueue = null;
  var n = this.linksCollapsed,
    i = this.linksCountEl;
  if (n) i.hide();else {
    var outgoingFile = this.file;
    this.outgoingFile = outgoingFile;
    var o = this.outgoingLinkDom,
      a = this.outgoingLinkInfinityScroller;
    if (a.queueCompute(), i.show(), i.setText("0"), outgoingFile && "md" === outgoingFile.extension) {
      var s = this.app.metadataCache,
        l = s.getFileCache(outgoingFile);
      if (l) {
        var c = [];
        if (iterateAllLinks(l, function (e) {
          c.push({
            linktext: e.link,
            pos: hasPosition(e) ? e.position.start.offset : 0
          });
        }), c.sort(function (e, t) {
          return e.pos - t.pos;
        }), 0 !== c.length) {
          for (var u = outgoingFile.path, h = 0, p = 0, d = o.vChildren.children; p < d.length; p++) {
            d[p].invalidated = !0;
          }
          var f = function () {
            var e = o.vChildren,
              t = [...o.vChildren.children];
            t.sort(function (e, t) {
              return e.pos - t.pos;
            });
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              if (-1 !== h && r.pos > h) break;
              if (r.invalidated) {
                t.splice(n, 1);
                n--;
              }
            }
            e.setChildren(t);
            a.queueCompute();
            i.setText(String(e.children.length));
          };
          t = this.linksQueue = new AsyncGeneratorQueue({
            onStart: function () {},
            onStop: function () {
              h = -1;
              f();
            },
            onCancel: function () {
              e.linksQueue = null;
            }
          });
          var m = new Set();
          t.addList(c);
          var g = createBatchedAsyncGenerator(t.generator(), {
            batchSize: 20,
            beforePause: function () {
              f();
            }
          });
          __awaiter(e, void 0, void 0, function () {
            var e, t, n, i, pos, a, l, c, p, d, f, error, y, w, k, C;
            return __generator(this, function (b) {
              switch (b.label) {
                case 0:
                  b.trys.push([0, 5, 6, 11]);
                  e = !0;
                  t = __asyncValues(g);
                  b.label = 1;
                case 1:
                  return [4, t.next()];
                case 2:
                  if (n = b.sent(), y = n.done) return [3, 4];
                  if (C = n.value, e = !1, i = C.linktext, pos = C.pos, a = parseLinktext(i), l = a.path, c = a.subpath, (p = s.getFirstLinkpathDest(l, u)) || (l = removeMdExtension(l)), d = (p ? p.path : l) + c, m.has(d)) return [3, 3];
                  m.add(d);
                  (f = new OutgoingLinkTreeItem(this, i, l, c, u, p)).pos = pos;
                  h = pos;
                  o.vChildren.addChild(f);
                  b.label = 3;
                case 3:
                  e = !0;
                  return [3, 1];
                case 4:
                  return [3, 11];
                case 5:
                  error = b.sent();
                  w = {
                    error: error
                  };
                  return [3, 11];
                case 6:
                  b.trys.push([6,, 9, 10]);
                  return e || y || !(k = t.return) ? [3, 8] : [4, k.call(t)];
                case 7:
                  b.sent();
                  b.label = 8;
                case 8:
                  return [3, 10];
                case 9:
                  if (w) throw w.error;
                  return [7];
                case 10:
                  return [7];
                case 11:
                  return [2];
              }
            });
          });
        } else o.vChildren.clear();
      } else o.vChildren.clear();
    } else o.vChildren.clear();
  }
}