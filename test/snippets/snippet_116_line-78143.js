function (e) {
  return __awaiter(i, void 0, void 0, function () {
    var t;
    var n;
    var i;
    var r;
    var o;
    var a;
    var s;
    var l;
    var c;
    var u;
    var h;
    var p;
    var d;
    var f;
    var m;
    var g;
    var v;
    return __generator(this, function (y) {
      switch (y.label) {
        case 0:
          t = null;
          n = this.app;
          i = n.vault;
          r = n.fileManager;
          o = n.metadataCache;
          a = e.overwrite;
          s = e.append || e.prepend || a;
          return e.file ? (l = e.file, /\.\.[\/\\]/.test(l) ? [2] : (s && ((t = o.getFirstLinkpathDest(l, "")) || (c = i.getAbstractFileByPathInsensitive(l)) instanceof TFile && (t = c)), t ? [3, 7] : (u = getDirectoryName(l), m = void 0, "" !== u ? [3, 1] : (m = i.getRoot(), [3, 3])))) : [3, 8];
        case 1:
          return (m = i.getAbstractFileByPathInsensitive(u)) ? [3, 3] : [4, i.createFolder(u)];
        case 2:
          y.sent();
          m = i.getAbstractFileByPathInsensitive(u);
          y.label = 3;
        case 3:
          if (!(m instanceof TFolder)) return [2];
          y.label = 4;
        case 4:
          y.trys.push([4, 6,, 7]);
          return [4, r.createNewFile(m, getFileName(l))];
        case 5:
          t = y.sent();
          return [3, 7];
        case 6:
          h = y.sent();
          new Notice(h.toString());
          return [2];
        case 7:
          return [3, 12];
        case 8:
          if (p = (p = e.name || "").replace(/[\/\\]/, ""), s && (t = o.getFirstLinkpathDest(p, "")), t) return [3, 12];
          d = "";
          (f = this.getActiveFile()) && (d = f.path);
          m = r.getNewFileParent(d, p);
          y.label = 9;
        case 9:
          y.trys.push([9, 11,, 12]);
          return [4, r.createNewFile(m, p)];
        case 10:
          t = y.sent();
          return [3, 12];
        case 11:
          g = y.sent();
          new Notice(g.toString());
          return [2];
        case 12:
          return t ? (v = e.content, e.clipboard ? [4, navigator.clipboard.readText()] : [3, 14]) : [2];
        case 13:
          v = y.sent();
          y.label = 14;
        case 14:
          return v ? e.append || e.prepend ? [4, r.insertIntoFile(t, v, e.prepend ? "prepend" : "append")] : [3, 16] : [3, 18];
        case 15:
          y.sent();
          return [3, 18];
        case 16:
          return [4, i.modify(t, v)];
        case 17:
          y.sent();
          y.label = 18;
        case 18:
          return e.silent ? [3, 20] : [4, this.getLeaf().openFile(t, {
            active: !0,
            state: {
              mode: "source"
            },
            eState: {
              rename: "all"
            }
          })];
        case 19:
          y.sent();
          y.label = 20;
        case 20:
          this.handleXCallback(e, t);
          return [2];
      }
    });
  });
}