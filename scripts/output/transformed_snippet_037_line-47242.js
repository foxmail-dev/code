function buildFullGraphData(e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n;
    var i;
    var r;
    var nodes;
    var a;
    var s;
    var l;
    var c;
    var u;
    var h;
    var error;
    var d;
    var f;
    var m;
    var g;
    return __generator(this, function (v) {
      switch (v.label) {
        case 0:
          n = t.showAttachments;
          i = t.hideUnresolved;
          r = t.showTags;
          nodes = {};
          a = asyncGeneratorFromArray(Object.keys(e.cache));
          s = createBatchedAsyncGenerator(a);
          v.label = 1;
        case 1:
          v.trys.push([1, 6, 7, 12]);
          l = function () {
            g = h.value;
            c = !1;
            var t = g;
            if (!n && "md" !== getFileExtension(t)) return "continue";
            var a = (nodes[t] = createGraphNodeType()).links;
            var s = e.cache[t];
            if (iterateCacheRefs(s, function (r) {
              var s = getLinkpath(r.link);
              var l = e.getLinktextDest(s, t);
              if (l) {
                if (!n && "md" !== getFileExtension(l)) return;
                a[l] = !0;
              } else if (i) {
                a[s] = !0;
                nodes.hasOwnProperty(s) || (nodes[s] = createGraphNodeType("unresolved"));
              }
            }), r) {
              var l = getAllTags(s);
              if (l && l.length > 0) for (var u = 0, p = l; u < p.length; u++) {
                var d = p[u];
                a[d] = !0;
                nodes.hasOwnProperty(d) || (nodes[d] = createGraphNodeType("tag"));
              }
            }
          };
          c = !0;
          u = __asyncValues(s);
          v.label = 2;
        case 2:
          return [4, u.next()];
        case 3:
          if (h = v.sent(), d = h.done) return [3, 5];
          l();
          v.label = 4;
        case 4:
          c = !0;
          return [3, 2];
        case 5:
          return [3, 12];
        case 6:
          error = v.sent();
          f = {
            error: error
          };
          return [3, 12];
        case 7:
          v.trys.push([7,, 10, 11]);
          return c || d || !(m = u.return) ? [3, 9] : [4, m.call(u)];
        case 8:
          v.sent();
          v.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if (f) throw f.error;
          return [7];
        case 11:
          return [7];
        case 12:
          return [2, {
            nodes: nodes
          }];
      }
    });
  });
}