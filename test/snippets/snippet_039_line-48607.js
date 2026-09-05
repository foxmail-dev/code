function (currentFilepath, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n, i, r, o, a, s, l, textc0, u, h, p, d, f, m, g, v, y, w, k;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          if (i = (n = this).publish, r = n.renderer, o = n.hoverPopover, a = i.site, this.currentFilepath === currentFilepath) {
            this.navigateSubpath(t);
            return [2];
          }
          if (this.currentFilepath = currentFilepath, s = getFileName(currentFilepath), l = getFileExtension(s), textc0 = getMarkdownBaseName(currentFilepath), o && (o.hide(), this.hoverPopover = o = null), this.extraTitle.setText(textc0), u = r.header, (h = u.el).empty(), a.getConfig(PublishHideTitle) || h.createEl("h1", {
            cls: "page-header",
            text: textc0
          }), r.updateHeader(), r.clear(), p = r.footer, (d = p.el).empty(), r.updateFooter(), "md" !== l) return [3, 5];
          f = "";
          b.label = 1;
        case 1:
          b.trys.push([1, 3,, 4]);
          return [4, a.loadMarkdownFile(currentFilepath)];
        case 2:
          f = b.sent();
          return [3, 4];
        case 3:
          if ((m = b.sent()) instanceof XMLHttpRequest) {
            404 === m.status ? new Notice('"'.concat(currentFilepath, '" does not exist')) : (new Notice('An error occurred while loading "'.concat(currentFilepath, '"')), console.error(m.response));
          } else {
            new Notice('An error occurred while loading "'.concat(currentFilepath, '"'));
            console.error(m);
          }
          return [3, 4];
        case 4:
          r.set(f || " ");
          this.navigateSubpath(t) || (t = "");
          return [3, 6];
        case 5:
          r.set("![[" + currentFilepath + "]]");
          b.label = 6;
        case 6:
          if (i.trigger("navigated"), t && (g = a.getPublicHref(currentFilepath) + encodePathSegments(t, "#"), history.replaceState(null, null, g)), a.getConfig(PublishShowBacklinks)) {
            for (k in v = a.cache.cache, y = [], w = function (dataHref) {
              if (!v.hasOwnProperty(dataHref) || dataHref === currentFilepath) return "continue";
              if (iterateCacheRefs(v[dataHref], function (n) {
                if (a.cache.getLinktextDest(n.link, dataHref) === currentFilepath) return !0;
              })) {
                var textn0 = getMarkdownBaseName(dataHref),
                  i = createDiv("backlink-item", function (e) {
                    return e.createEl("a", {
                      cls: "internal-link",
                      href: a.getPublicHref(dataHref),
                      attr: {
                        "data-href": dataHref
                      },
                      text: textn0
                    });
                  });
                y.push({
                  el: i,
                  name: textn0
                });
              }
            }, v) w(k);
            y.length > 0 && r.onRendered(function () {
              d.empty();
              var e = d.createDiv("backlinks");
              e.createDiv("published-section-header", function (e) {
                e.createSpan("published-section-header-icon", function (e) {
                  setIcon(e, "lucide-link");
                });
                e.createSpan({
                  text: "Links to this page"
                });
              });
              var t = e.createDiv("backlink-items-container");
              y.sort(function (e, t) {
                return collatorCompare(e.name, t.name);
              });
              t.setChildrenInPlace(y.map(function (e) {
                return e.el;
              }));
              r.updateFooter();
            });
          }
          return [2];
      }
    });
  });
}