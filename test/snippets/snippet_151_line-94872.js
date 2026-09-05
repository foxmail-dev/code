function () {
  var t,
    n,
    i = this;
  e.prototype.render.call(this);
  var r = this,
    o = r.file,
    texta0 = r.filePath,
    s = r.subpath;
  if (o) {
    var l = o.getShortName();
    s && "md" === o.extension && (l += " › " + s.substring(1));
    this.updateNodeLabel(l);
    this.placeholderEl.setText(l);
  } else {
    this.updateNodeLabel(createFragment(function (e) {
      setIcon(e.createSpan(), "lucide-alert-triangle");
      e.createSpan({
        text: texta0
      });
    }));
    this.placeholderEl.setText(texta0);
  }
  if (!this.child) {
    var c,
      u = {
        app: this.app,
        linktext: this.filePath + this.subpath,
        sourcePath: null !== (n = null === (t = this.canvas.view.file) || void 0 === t ? void 0 : t.path) && void 0 !== n ? n : "",
        containerEl: this.contentEl,
        depth: 0
      };
    if (o) {
      (c = this.child = EmbedFactory.load(u)) instanceof MarkdownEmbed && (c.useLocalPropertiesFoldState = !0, c.editable = !0, c.useIframe = !0);
    } else {
      c = this.child = new CanvasEmptyEmbed(u, this, function () {
        return i.render();
      });
    }
    this.isFocused && this.onFileFocus();
    c.load();
    __awaiter(i, void 0, void 0, function () {
      var e,
        t,
        n,
        i,
        r,
        o,
        a,
        s = this;
      return __generator(this, function (l) {
        switch (l.label) {
          case 0:
            return [4, c.loadFile()];
          case 1:
            l.sent();
            c instanceof PdfEmbedView && c.viewer.then(function (e) {
              var t = e.pdfViewer,
                n = e.toolbar;
              t.setHeight("auto");
              n.toolbarRightEl.createDiv("clickable-icon", function (n) {
                setIcon(n, "lucide-file-symlink");
                setTooltip(n, i18nProxy.pdf.actionSavePDFLocation());
                e.on("pagechanging", debounce(function () {
                  if (s.subpath !== "#page=".concat(t.page)) {
                    n.setAttr("aria-disabled", "false");
                  } else {
                    "true" !== n.getAttr("aria-disable") && n.setAttr("aria-disabled", "true");
                  }
                }, 100, !0));
                n.addEventListener("click", function () {
                  s.subpath = "#page=".concat(t.page);
                  s.canvas.requestSave();
                  n.setAttr("aria-disabled", "true");
                });
              });
            });
            return (e = this.contentEl.firstChild) ? (t = null, e.instanceOf(HTMLImageElement) ? (t = {
              width: e.naturalWidth,
              height: e.naturalHeight
            }, e.draggable = !1) : e.instanceOf(HTMLVideoElement) ? t = {
              width: e.videoWidth,
              height: e.videoHeight
            } : e.instanceOf(HTMLAudioElement) && (n = function () {
              s.resize({
                width: s.width,
                height: e.clientHeight || 42
              });
            }, e.isShown() || e.onNodeInserted(n, !0), n()), t && 0 !== t.height && (i = this.aspectRatio = t.width / t.height, o = (r = this).width, a = r.height, o / a !== i && (this.resize({
              width: Math.min(o, a * i),
              height: Math.min(a, o / i)
            }), this.canvas.overrideHistory())), [2]) : [2];
        }
      });
    });
  }
}