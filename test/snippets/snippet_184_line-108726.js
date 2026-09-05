function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var t,
      n,
      i,
      r,
      o,
      a,
      s,
      containerEl,
      c,
      frontmatter,
      h,
      p,
      d,
      f,
      m,
      g,
      promises,
      y,
      w = this;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          this.destroy();
          this.app.keymap.pushScope(this.scope);
          return [4, this.app.vault.read(e)];
        case 1:
          t = b.sent();
          b.label = 2;
        case 2:
          for (b.trys.push([2, 6,, 7]), this.containerEl && this.containerEl.detach(), n = REVEAL_SCRIPT_LOADER.promise, i = "moonstone" === this.app.vault.getConfig("theme"), r = this.containerEl = activeDocument.body.createDiv("slides-container"), (o = this.themeCssEl = activeDocument.head.createEl("link", {
            prepend: !0
          })).setAttribute("rel", "stylesheet"), i ? o.setAttribute("href", "/lib/reveal/white.css") : o.setAttribute("href", "/lib/reveal/black.css"), (a = this.revealCssEl = activeDocument.head.createEl("link", {
            prepend: !0
          })).setAttribute("rel", "stylesheet"), a.setAttribute("href", "/lib/reveal/reveal.css"), s = r.createDiv("reveal"), containerEl = s.createDiv("slides"), s.createDiv("slides-close-btn", function (e) {
            setIcon(e, "lucide-x-square");
            e.addEventListener("click", w.close.bind(w));
          }), c = parseMarkdown(t), frontmatter = extractFrontmatter(c), h = {
            definitions: stringifyHtml(c)
          }, p = c.children, d = [[]], g = 0; g < p.length; g++) if ("thematicBreak" === (f = p[g]).type) {
            d.push([]);
          } else {
            d.last().push(f);
          }
          for (m = function (e) {
            var childrent0 = d[e];
            if (0 === childrent0.length) return "continue";
            c.children = childrent0;
            var n = compileMarkdown(c, h);
            containerEl.createEl("section", {}, function (e) {
              var t = sanitizeHTMLToDom(n);
              e.appendChild(t);
            });
          }, g = 0; g < d.length; g++) m(g);
          promises = [];
          MarkdownPreviewView.postProcess(this.app, {
            docId: generateRandomHex(16),
            sourcePath: e.path,
            frontmatter: frontmatter,
            promises: promises,
            addChild: function (e) {
              return w.addChild(e);
            },
            getSectionInfo: function () {
              return null;
            },
            replace: function () {
              return null;
            },
            containerEl: containerEl,
            el: containerEl
          });
          return promises.length > 0 ? [4, Promise.all(promises)] : [3, 4];
        case 3:
          b.sent();
          b.label = 4;
        case 4:
          return [4, n];
        case 5:
          b.sent();
          (this.deck = new Reveal(s, {
            embedded: !0,
            keyboardCondition: "focused",
            controlsTutorial: !1,
            overview: !1
          })).initialize();
          setTimeout(function () {
            s.dispatchEvent(new PointerEvent("pointerdown"));
          }, 0);
          return [3, 7];
        case 6:
          y = b.sent();
          console.error(y);
          this.close();
          return [3, 7];
        case 7:
          return [2];
      }
    });
  });
}