function (e, filet0) {
  return __awaiter(this, void 0, Promise, function () {
    var mtime;
    var i;
    var r;
    var contento0;
    var a;
    var blocks;
    var l;
    var c;
    var u;
    var node;
    var display;
    var error;
    var f;
    var m;
    var g;
    var v;
    var y;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          return "md" !== filet0.extension ? [2, null] : (mtime = filet0.stat.mtime, (i = this.cache).hasOwnProperty(filet0.path) && (r = i[filet0.path]).file === filet0 && r.mtime === mtime ? [2, r] : [4, this.app.vault.cachedRead(filet0)]);
        case 1:
          if (contento0 = b.sent(), e.isCancelled()) return [2, null];
          a = parseMarkdown(contento0);
          blocks = [];
          b.label = 2;
        case 2:
          b.trys.push([2, 7, 8, 13]);
          l = !0;
          c = __asyncValues(createBatchedAsyncGenerator(asyncGeneratorFromArray(a.children), {
            maxDelay: 0
          }));
          b.label = 3;
        case 3:
          return [4, c.next()];
        case 4:
          if (u = b.sent(), m = u.done) return [3, 6];
          if (y = u.value, l = !1, node = y, e.isCancelled()) return [3, 6];
          if ("yaml" === node.type) return [3, 5];
          if ("list" === node.type) {
            visit(node, "listItem", function (node) {
              var display = _extractNodeText(node).trim();
              display && blocks.push({
                display: display,
                node: node
              });
            });
            return [3, 5];
          }
          if ("" === (display = _extractNodeText(node).trim())) return [3, 5];
          "heading" === node.type && (display = Array(node.depth || 1).fill("#").join("") + " " + display);
          blocks.push({
            display: display,
            node: node
          });
          b.label = 5;
        case 5:
          l = !0;
          return [3, 3];
        case 6:
          return [3, 13];
        case 7:
          error = b.sent();
          g = {
            error: error
          };
          return [3, 13];
        case 8:
          b.trys.push([8,, 11, 12]);
          return l || m || !(v = c.return) ? [3, 10] : [4, v.call(c)];
        case 9:
          b.sent();
          b.label = 10;
        case 10:
          return [3, 12];
        case 11:
          if (g) throw g.error;
          return [7];
        case 12:
          return [7];
        case 13:
          f = {
            file: filet0,
            content: contento0,
            mtime: mtime,
            blocks: blocks
          };
          i[filet0.path] = f;
          return [2, f];
      }
    });
  });
}