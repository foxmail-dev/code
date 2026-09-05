function (e, t, n) {
  if ("outline" === t.source && "heading" === t.type && t.file === i.file) {
    if (!i.tree.root.vChildren.hasChildren()) return;
    var r = getDropTarget(e, i.tree),
      hoverEl = showDropIndicator(i.tree, r, [], n);
    n || __awaiter(i, void 0, void 0, function () {
      var e, n, i, o, a, s, l, c, u, h, p, d, f, m, g;
      return __generator(this, function (v) {
        switch (v.label) {
          case 0:
            if (!(e = this.app.metadataCache.getFileCache(this.file)) || !e.headings || !(null == r ? void 0 : r.node)) return [2];
            if (n = e.headings, i = t.heading, o = n.indexOf(i), a = r.node.heading, s = n.indexOf(a), -1 === o || -1 === s) return [2];
            if ("after" === r.placement && (s++, a = n[s]), o === s) return [2];
            for (l = o + 1; l < n.length && !(n[l].level <= i.level); l++);
            c = i.position.start.offset;
            u = l < n.length ? n[l].position.start.offset : -1;
            h = a ? a.position.start.offset : -1;
            p = Math.max(c, u, h) + 1;
            f = -1 === u ? p : u;
            return (d = -1 === h ? p : h) >= c && d <= f ? [2] : [4, this.app.vault.read(this.file)];
          case 1:
            m = v.sent();
            -1 === u && (u = m.length);
            -1 === h && (h = m.length);
            g = normalizeTrailingNewlines(m.substring(c, u));
            m = h < c ? normalizeTrailingNewlines(m.substring(0, h)) + g + m.substring(h, c) + m.substring(u) : m.substring(0, c) + normalizeTrailingNewlines(m.substring(u, h)) + g + m.substring(h);
            return [4, this.app.vault.modify(this.file, m)];
          case 2:
            v.sent();
            return [2];
        }
      });
    });
    return {
      dropEffect: "move",
      hoverEl: hoverEl,
      hoverClass: "is-active"
    };
  }
}