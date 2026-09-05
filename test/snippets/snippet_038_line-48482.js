function (e, n, i) {
  return __awaiter(this, arguments, Promise, function (e, n, i, r) {
    var o, a, s, l, c, u, h, textp0, d, f, m, g, v, y, w, k, C;
    void 0 === r && (r = !1);
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          return o = this.publish, a = o.site, s = a.cache, l = parseLinktext(e), c = l.path, u = l.subpath, h = s.getLinkpathDest(c, n), i.empty(), h ? (textp0 = getFileName(h), d = getFileExtension(h), f = a.getInternalUrl(h), imageExtensions.contains(d) ? (i.addClass("image-embed"), [4, loadImageElement(i, f)]) : [3, 2]) : [2, !1];
        case 1:
          return b.sent(), [3, 14];
        case 2:
          return audioExtensions.contains(d) ? (i.addClass("media-embed", "audio-embed"), [4, loadAudioElement(i, f)]) : [3, 4];
        case 3:
          return b.sent(), [3, 14];
        case 4:
          return videoExtensions.contains(d) ? (i.addClass("media-embed", "video-embed"), [4, loadVideoElement(i, f)]) : [3, 6];
        case 5:
          return b.sent(), [3, 14];
        case 6:
          return pdfExtensions.contains(d) ? (i.addClass("pdf-embed"), (m = i.createEl("iframe")).src = f + (u || ""), m.style.width = "100%", m.style.height = "100%", [3, 14]) : [3, 7];
        case 7:
          return markdownExtensions.contains(d) && this.embedDepth < 5 ? (g = s.getCache(h), v = void 0, h !== this.currentFilepath ? [3, 8] : (v = this.renderer.text, [3, 11])) : [3, 13];
        case 8:
          return b.trys.push([8, 10,, 11]), [4, ajaxPromise({
            withCredentials: !0,
            url: f
          })];
        case 9:
          return v = b.sent(), [3, 11];
        case 10:
          return y = b.sent(), v = y instanceof XMLHttpRequest && 404 === y.status ? "File not found" : "Failed to load", [3, 11];
        case 11:
          return w = resolveSubpathWithFootnotes(v, g, u), textp0 = textp0.substr(0, textp0.length - getFileExtension(textp0).length - 1), i.addClass("markdown-embed"), r || w || i.createDiv({
            cls: "markdown-embed-title",
            text: textp0
          }), k = i.createDiv("markdown-embed-content"), i.createDiv("markdown-embed-link", function (t) {
            setIcon(t, "lucide-link");
            setTooltip(t, "Open link");
            t.setAttr("role", "button");
            t.onClickEvent(function (t) {
              0 !== t.button && 1 !== t.button || (t.preventDefault(), t.stopPropagation(), o.navigate(e, n, t));
            });
          }), w && (v = extractSubpathContent(v, g, w).content), (C = new t(o, k)).embedDepth = this.embedDepth + 1, C.renderContent(v, h), [4, new Promise(function (e) {
            C.renderer.onRendered(e);
          })];
        case 12:
          return b.sent(), [3, 14];
        case 13:
          i.addClass("file-embed");
          i.createDiv({
            cls: "file-embed-title",
            text: textp0
          });
          i.createDiv("file-embed-link", function (e) {
            e.addEventListener("click", function () {
              window.open(f);
            });
            setIcon(e, "lucide-arrow-up-right");
            setTooltip(e, "Open in default app");
          });
          b.label = 14;
        case 14:
          return i.addClass("is-loaded"), [2, !0];
      }
    });
  });
}