function () {
  return __awaiter(this, void 0, void 0, function () {
    var e,
      t,
      n,
      i,
      unlinkedFile,
      o,
      a,
      s,
      l,
      c,
      u,
      h,
      contentp0,
      d,
      f,
      m,
      g,
      v,
      w,
      C,
      E,
      M,
      x,
      T,
      D,
      A,
      P,
      L,
      I,
      O,
      F,
      N,
      R,
      B,
      V = this;
    return __generator(this, function (H) {
      switch (H.label) {
        case 0:
          if ((e = this.unlinksQueue) && !e.runnable.isCancelled()) {
            e.runnable.cancel();
            this.unlinkedFile = null;
          }
          this.unlinksQueue = null;
          n = (t = this).unlinkedCollapsed;
          i = t.unlinkedCountEl;
          return n ? (i.hide(), [2]) : (unlinkedFile = this.file, o = this.unlinkedDom, s = (a = this).app, l = a.unlinkedDomInfo, this.unlinkedFile = unlinkedFile, i.show(), i.setText("0"), unlinkedFile && "md" === unlinkedFile.extension ? (c = new Map(), u = function (texte0, t) {
            texte0 = texte0.toLowerCase();
            var n = c.get(texte0) || {
              text: texte0,
              files: []
            };
            c.set(texte0, n);
            n.files.contains(t) || n.files.push(t);
          }, h = s.metadataCache.getFileCache(unlinkedFile), [4, s.vault.cachedRead(unlinkedFile)]) : (o.emptyResults(), [2]));
        case 1:
          for (contentp0 = H.sent(), d = s.vault.getMarkdownFiles(), f = 0, m = d; f < m.length; f++) if ((g = m[f]) !== unlinkedFile && !s.metadataCache.isUserIgnored(g.path) && (u(g.basename, g), (v = s.metadataCache.getFileCache(g)) && (w = parseFrontMatterAliases(v.frontmatter)))) for (C = 0, E = w; C < E.length; C++) (M = E[C]) && u(M, g);
          if (x = Array.from(c.values()).sort(function (e, t) {
            return collatorCompare(e.text, t.text);
          }), T = o.getResult(unlinkedFile)) {
            for (D = T.vChildren, A = [...D.children], P = 0; P < A.length; P++) (L = A[P]) instanceof ContentMatchComponent && ((I = l.get(L)) && c.has(I.text) || (A.splice(P, 1), P--));
            D.setChildren(A);
            T.content = contentp0;
          } else {
            o.emptyResults();
            T = o.addResult(unlinkedFile, {
              content: []
            }, contentp0, !1);
          }
          T.separateMatches = !0;
          O = function () {
            T.vChildren.sort(function (e, t) {
              return Array.isArray(e.matches) ? Array.isArray(t.matches) ? e.matches[0][0] - t.matches[0][0] : 1 : -1;
            });
            o.infinityScroll.queueCompute();
            i.setText(String(T.vChildren.size()));
          };
          e = this.unlinksQueue = new AsyncGeneratorQueue({
            onStart: function () {},
            onStop: function () {
              O();
            },
            onCancel: function () {
              V.linksQueue = null;
            }
          });
          F = 0;
          (N = null == h ? void 0 : h.frontmatterPosition) && (F = N.end.offset);
          R = contentp0.toLowerCase();
          e.addList(x);
          B = createBatchedAsyncGenerator(e.generator(), {
            beforePause: function () {
              O();
            }
          });
          __awaiter(V, void 0, void 0, function () {
            var e, t, n, i, error, a, s, l, c;
            return __generator(this, function (u) {
              switch (u.label) {
                case 0:
                  u.trys.push([0, 5, 6, 11]);
                  e = !0;
                  t = __asyncValues(B);
                  u.label = 1;
                case 1:
                  return [4, t.next()];
                case 2:
                  if (n = u.sent(), a = n.done) return [3, 4];
                  c = n.value;
                  e = !1;
                  i = c;
                  this.processInfo(unlinkedFile, contentp0, R, h, F, T, i);
                  u.label = 3;
                case 3:
                  e = !0;
                  return [3, 1];
                case 4:
                  return [3, 11];
                case 5:
                  error = u.sent();
                  s = {
                    error: error
                  };
                  return [3, 11];
                case 6:
                  u.trys.push([6,, 9, 10]);
                  return e || a || !(l = t.return) ? [3, 8] : [4, l.call(t)];
                case 7:
                  u.sent();
                  u.label = 8;
                case 8:
                  return [3, 10];
                case 9:
                  if (s) throw s.error;
                  return [7];
                case 10:
                  return [7];
                case 11:
                  return [2];
              }
            });
          }).then();
          return [2];
      }
    });
  });
}