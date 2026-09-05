function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n,
      i,
      r,
      o,
      a,
      s,
      l,
      c,
      from,
      h,
      p,
      d,
      f = this;
    return __generator(this, function (m) {
      switch (m.label) {
        case 0:
          i = (n = this).contentContainerEl;
          r = n.diffToggle;
          o = n.contentPreviewEl;
          a = n.contentDiffEl;
          s = n.contentCopyButton;
          l = n.contentTitlebarEl;
          c = n.restoreVersionButton;
          o.removeClass("markdown-rendered");
          o.empty();
          a.empty();
          l.hide();
          r.setDisabled(!0);
          s.buttonEl.setAttr("disabled", !0);
          c.buttonEl.hide();
          if (Platform.isPhone) {
            animateChildrenReplacement(this.contentEl, this.contentContainerEl, "right");
            this.backButtonEl.show();
          }
          return e.relatedpath ? (from = getFileName(e.relatedpath), h = getFileName(e.path), p = getDirectoryName(e.relatedpath), d = getDirectoryName(e.path), from === h ? o.createDiv({
            cls: "sync-history-desc",
            text: i18nProxy.plugins.sync.labelFileMovedFromTo({
              from: p || "/",
              to: d || "/"
            })
          }) : p === d ? o.createDiv({
            cls: "sync-history-desc",
            text: i18nProxy.plugins.sync.labelFileRenamedFromTo({
              from: from,
              to: h
            })
          }) : o.createDiv({
            cls: "sync-history-desc",
            text: i18nProxy.plugins.sync.labelFileRenamedFromTo({
              from: e.relatedpath,
              to: e.path
            })
          }), o.show(), [3, 4]) : [3, 1];
        case 1:
          return e.deleted ? (o.createDiv({
            cls: "sync-history-desc",
            text: i18nProxy.plugins.sync.labelFileDeleted()
          }), o.show(), [3, 4]) : [3, 2];
        case 2:
          c.buttonEl.show();
          l.show();
          return [4, withLoadingClass(i, function () {
            return __awaiter(f, void 0, void 0, function () {
              var typen0,
                i,
                l,
                c,
                u,
                h,
                p,
                d,
                f,
                m = this;
              return __generator(this, function (g) {
                switch (g.label) {
                  case 0:
                    return typen0 = getFileExtension(getFileName(this.filepath)), markdownExtensions.contains(typen0) || scriptExtensions.contains(typen0) || baseExtensions.contains(typen0) ? (l = arrayBufferToString, [4, this.getContentForVersion(e.uid)]) : [3, 3];
                  case 1:
                    return i = l.apply(void 0, [g.sent()]), o.addClass("markdown-rendered"), r.setDisabled(!1), s.buttonEl.removeAttribute("disabled"), s.onClick(function (e) {
                      copyToClipboard(i);
                      new Notice(i18nProxy.interface.copied({
                        context: "generic"
                      }));
                    }), c = !1, u = !1, h = function () {
                      return __awaiter(m, void 0, void 0, function () {
                        var e, s, l, h, p;
                        return __generator(this, function (d) {
                          switch (d.label) {
                            case 0:
                              return (e = r.getValue()) ? localStorage.setItem("history-show-diff", "true") : localStorage.removeItem("history-show-diff"), o.toggle(!e), a.toggle(e), !e || u ? [3, 4] : (u = !0, t ? (h = arrayBufferToString, [4, this.getContentForVersion(t.uid)]) : [3, 2]);
                            case 1:
                              return l = h.apply(void 0, [d.sent()]), [3, 3];
                            case 2:
                              l = i;
                              d.label = 3;
                            case 3:
                              return s = l, a.empty(), a.appendChild(renderDiffView(s, i)), [3, 5];
                            case 4:
                              e || c || (c = !0, markdownExtensions.contains(typen0) ? (p = compileMarkdown(parseMarkdown(i)), o.appendChild(sanitizeHTMLToDom(p))) : o.createEl("pre").setText(i));
                              d.label = 5;
                            case 5:
                              return [2];
                          }
                        });
                      });
                    }, r.onChange(h), [4, h()];
                  case 2:
                    return g.sent(), [3, 9];
                  case 3:
                    return imageExtensions.contains(typen0) ? [4, this.getContentForVersion(e.uid)] : [3, 5];
                  case 4:
                    return d = g.sent(), p = URL.createObjectURL(new Blob([d], {
                      type: "image/" + typen0
                    })), loadImageElement(o, p).then(function () {
                      URL.revokeObjectURL(p);
                    }), [3, 8];
                  case 5:
                    return canvasExtensions.contains(typen0) ? (f = arrayBufferToString, [4, this.getContentForVersion(e.uid)]) : [3, 7];
                  case 6:
                    return d = f.apply(void 0, [g.sent()]), renderCanvasMinimap(o, d), [3, 8];
                  case 7:
                    o.createDiv(i18nProxy.plugins.sync.labelPreviewUnsupportedFileType({
                      type: typen0
                    }));
                    g.label = 8;
                  case 8:
                    o.show();
                    a.hide();
                    g.label = 9;
                  case 9:
                    return [2];
                }
              });
            });
          })];
        case 3:
          m.sent();
          m.label = 4;
        case 4:
          return [2];
      }
    });
  });
}