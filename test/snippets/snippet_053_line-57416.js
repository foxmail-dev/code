function () {
  return __awaiter(this, void 0, void 0, function () {
    var e,
      t,
      n,
      i,
      hoverParent,
      o,
      a,
      insert,
      l,
      from,
      u,
      changes,
      p,
      d,
      f,
      m,
      g,
      targetEl,
      y,
      w,
      k,
      C,
      E = this;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          t = (e = this).cm;
          n = e.editorComponent;
          i = n.app;
          hoverParent = n.owner;
          o = n.file;
          a = o ? i.metadataCache.getFileCache(o) : null;
          insert = "[^" + getNextFootnoteIndex(a) + "]";
          l = t.state.selection.main;
          from = l.from;
          u = l.to;
          changes = [{
            from: from,
            insert: insert
          }];
          p = t.state.doc;
          d = p.slice(u).toString().match(/\n*$/);
          f = d[0].length;
          m = "\n".repeat(2 - Math.min(f, 2));
          changes.push({
            from: p.length,
            insert: m + insert + ": \n"
          });
          t.dispatch({
            changes: changes,
            selection: EditorSelection.cursor(from + insert.length)
          });
          return hoverParent instanceof MarkdownView ? [4, hoverParent.saveImmediately()] : [3, 2];
        case 1:
        case 3:
          b.sent();
          return [3, 5];
        case 2:
          return hoverParent instanceof MarkdownEmbed ? [4, hoverParent.save(hoverParent.text, !0)] : [3, 4];
        case 4:
          return [2];
        case 5:
          return [4, i.metadataCache.computeFileMetadataAsync(o)];
        case 6:
          b.sent();
          g = t.domAtPos(from + 1).node;
          targetEl = g.instanceOf(HTMLElement) ? g : g.parentElement;
          y = "rtl" === getComputedStyle(targetEl).direction;
          w = t.coordsAtPos(from);
          return [4, BasesPopover.create({
            app: i,
            hoverParent: hoverParent,
            targetEl: targetEl,
            linktext: "#" + insert,
            sourcePath: null == o ? void 0 : o.path,
            waitTime: 0,
            state: {
              mode: "source"
            },
            position: {
              x: w[y ? "right" : "left"],
              y: (w.top + w.bottom) / 2
            }
          })];
        case 7:
          k = b.sent();
          (C = k.embed) instanceof MarkdownEmbed && C.editMode.register(function () {
            var e = targetEl.win,
              t = targetEl.doc;
            e.setTimeout(function () {
              t.activeElement === t.body && E.focus();
            });
          });
          return [2];
      }
    });
  });
}