function (e) {
  var t = this;
  var n = e.getData("text/markdown");
  if (n) return n;
  var i = e.getData("text/html");
  if (i) {
    if (!this.app.vault.getConfig("autoConvertHtml")) return null;
    var r = sanitizeHTMLToDom(i);
    var o = createEl("div");
    if (o.appendChild(r), e.files.length > 0 && /^<img [^>]+>$/.test(o.innerHTML.trim())) return null;
    for (var a = [], s = 0, l = r.findAll("img, audio, video"); s < l.length; s++) {
      var c = l[s];
      if (c.instanceOf(HTMLImageElement) || c.instanceOf(HTMLMediaElement)) {
        if (Platform.isDesktopApp && c.src.startsWith(Platform.resourcePathPrefix)) {
          c.src = "file:///" + c.src.substring(Platform.resourcePathPrefix.length);
          var u = this.app.vault.resolveFileUrl(c.src);
          u instanceof TFile && (c.src = this.app.metadataCache.fileToLinktext(u, this.getPath(), !0));
        }
        if (c.src.startsWith("data:") && c.src.length > 1e3) {
          a.push(c.src);
          c.detach();
        }
      }
    }
    __awaiter(t, void 0, void 0, function () {
      var e;
      var t;
      var n;
      var i;
      var r;
      var o;
      var s;
      var l;
      var c;
      var u;
      var h;
      return __generator(this, function (p) {
        switch (p.label) {
          case 0:
            for (n in t = [], e = a) t.push(n);
            i = 0;
            p.label = 1;
          case 1:
            if (!(i < t.length)) return [3, 7];
            if (!((n = t[i]) in e)) return [3, 6];
            r = n;
            p.label = 2;
          case 2:
            p.trys.push([2, 5,, 6]);
            o = r.match(/^data:([\w/\-.]+);base64,(.*)/);
            s = o[1];
            c = "image/jpeg" === s;
            return (l = "image/png" === s) || c ? (u = base64ToArrayBuffer(o[2]), [4, this.saveAttachment("Pasted image", l ? "png" : "jpg", u, !0)]) : [3, 4];
          case 3:
            p.sent();
            p.label = 4;
          case 4:
            return [3, 6];
          case 5:
            h = p.sent();
            console.error(h);
            return [3, 6];
          case 6:
            i++;
            return [3, 1];
          case 7:
            return [2];
        }
      });
    });
    return htmlToMarkdown(o.innerHTML.trim());
  }
  var h = e.getData("text/uri-list");
  if (h) {
    var p = e.getData("text/plain") || "";
    if (!p) {
      var d = extractFilesFromClipboard(e, "drop", !1);
      if (d && d.length > 0) {
        var f = d[0].extension.toLowerCase();
        if ("webloc" === f || "url" === f) return d[0].name;
      }
      return h;
    }
    if (h.toLowerCase() !== p.toLowerCase() && decodeURIComponent(h.toLowerCase()) !== p.toLowerCase()) {
      var m = getFileExtension(getFileName(h));
      var g = "[".concat(p, "](").concat(h, ")");
      imageExtensions.contains(m) && (g = "!" + g);
      return g;
    }
  }
  return null;
}