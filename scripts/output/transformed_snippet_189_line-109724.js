function () {
  return __awaiter(this, void 0, void 0, function () {
    var e,
      t,
      n,
      i,
      r,
      o,
      a,
      s,
      l,
      c,
      u,
      h,
      p,
      d,
      f,
      m,
      g,
      v,
      w = this;
    return __generator(this, function (k) {
      switch (k.label) {
        case 0:
          t = (e = this).items;
          n = e.listEl;
          i = e.loadMoreButtonEl;
          r = null;
          o = this.filepath;
          a = 0 === t.length;
          i.detach();
          if (t.length > 0) {
            s = t.last().last();
            r = s.uid;
            o = s.relatedpath || s.path;
          }
          k.label = 1;
        case 1:
          k.trys.push([1, 3,, 4]);
          return [4, this.plugin.getHistory(o, r)];
        case 2:
          l = k.sent();
          return [3, 4];
        case 3:
          k.sent();
          new Notice(i18nProxy.plugins.sync.labelUnableToRetrieve());
          this.listEl.append(i);
          return [2];
        case 4:
          for (c = l.items, -1 !== (u = c.findIndex(function (e) {
            return e.relatedpath && !e.deleted;
          })) && (u < c.length - 1 && (c = c.slice(0, u + 1)), l.more = !0), h = function (e) {
            for (var t = [], n = [], i = 0, r = e; i < r.length; i++) {
              var o = r[i];
              if ((!o.deleted || !o.relatedpath) && !o.folder) if (0 !== n.length) {
                var a = n.first();
                if (o.deleted || o.relatedpath || !window.moment(a.ts).isSame(o.ts, "day")) {
                  t.push(n);
                  n = [o];
                } else {
                  a.device === o.device && a.username === o.username && a.ts - o.ts < ONE_HOUR_MS ? n.push(o) : (t.push(n), n = [o]);
                }
              } else n.push(o);
            }
            n.length > 0 && t.push(n);
            return t;
          }(c), p = function (e) {
            var activeItem = e[0],
              r = t.push(e) - 1,
              o = n.createDiv("sync-history-list-item");
            activeItem.username || activeItem.email || o.addClass("mod-current-user");
            var s = o.createDiv("sync-history-list-item-header"),
              textl0 = activeItem.ts + 864e5 < Date.now() ? window.moment(activeItem.ts).format("llll") : window.moment(activeItem.ts).fromNow();
            d.createHistoryItemAvatar(s, activeItem);
            var c = s.createDiv({
                cls: "sync-history-list-item-details",
                text: textl0
              }),
              u = s.createDiv("tree-item-flair-outer"),
              h = c.createDiv("u-small u-muted");
            if (activeItem.relatedpath) {
              var from = getFileName(activeItem.relatedpath),
                f = getFileName(activeItem.path),
                m = getDirectoryName(activeItem.relatedpath),
                g = getDirectoryName(activeItem.path);
              if (from === f) {
                h.setText(i18nProxy.plugins.sync.labelFileMovedFrom({
                  from: m || "/"
                }));
              } else {
                m === g ? h.setText(i18nProxy.plugins.sync.labelFileRenamedFrom({
                  from: from
                })) : h.setText(i18nProxy.plugins.sync.labelFileRenamedFrom({
                  from: activeItem.relatedpath
                }));
              }
            } else if (activeItem.deleted) {
              if (activeItem.username || activeItem.email) {
                h.setText(i18nProxy.plugins.sync.labelFileDeleted());
              } else {
                h.setText(i18nProxy.plugins.sync.labelFileDeletedVia({
                  device: activeItem.device
                }));
              }
            } else if (0 === activeItem.size) h.setText(i18nProxy.plugins.sync.labelEmptyFile());else {
              var v = i18nProxy.plugins.sync.labelRevision({
                  count: e.length
                }),
                k = activeItem.username || activeItem.email ? "" : " " + i18nProxy.plugins.sync.labelViaDevice({
                  device: activeItem.device
                });
              h.setText(v + k);
            }
            var C = o.createDiv("version-group-container");
            C.hide();
            C.createSpan("connecting-line");
            for (var E = function (n) {
                var activeItem = e[n],
                  o = C.createDiv({
                    cls: "version-group-item",
                    text: window.moment(activeItem.ts).format("LT")
                  });
                o.addEventListener("click", async function () {
                  var a;
                  a = null;
                  a = n === e.length - 1 ? r !== t.length - 1 ? t[r + 1].first() : null : e[n + 1];
                  await this.openHistory(activeItem, a);
                  this.activeItem = activeItem;
                  Platform.isMobile || this.setActiveHistoryItem(o, activeItem, s);
                  return;
                });
              }, S = 0; S < e.length; S++) E(S);
            var M = u.createSpan({
              cls: "is-collapsed tree-item-flair"
            });
            Platform.isMobile || M.addClass("collapse-icon");
            var x = function () {
              var e = !M.hasClass("is-collapsed");
              M.toggleClass("is-collapsed", e);
              toggleVisibility(C, e, !0);
            };
            setIcon(M, Platform.isMobile ? "chevrons-up-down" : "right-triangle");
            M.addEventListener("click", function (e) {
              e.stopPropagation();
              x();
            });
            s.addEventListener("click", async function (n) {
              var r, o;
              if (M.contains(n.targetNode)) {
                return;
              }
              if (this.activeItem === activeItem) {
                x();
                return;
              }
              r = t.indexOf(e);
              o = -1 !== r && r !== t.length - 1 ? t[r + 1].first() : null;
              await this.openHistory(activeItem, o);
              Platform.isMobile || this.setActiveHistoryItem(s, activeItem);
              this.activeItem = activeItem;
              return;
            });
            !a || d.activeItemEl || Platform.isMobile || d.setActiveHistoryItem(s, activeItem);
          }, d = this, f = 0, m = h; f < m.length; f++) {
            g = m[f];
            p(g);
          }
          return a ? 0 !== t.length ? [3, 5] : (n.createDiv({
            cls: "list-item mod-empty",
            text: i18nProxy.plugins.sync.labelNoHistory()
          }), [3, 7]) : [3, 7];
        case 5:
          return Platform.isMobile ? [3, 7] : (v = t.length > 1 ? t[1][0] : null, [4, this.openHistory(t[0][0], v)]);
        case 6:
          k.sent();
          k.label = 7;
        case 7:
          l.more && this.listEl.append(i);
          return [2];
      }
    });
  });
}