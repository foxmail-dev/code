function t(t) {
  var n = e.call(this, t) || this;
  n.sortOrder = "download";
  n.items = {};
  n.itemsVisible = [];
  n.selectedItemId = null;
  n.selectedItemCloseable = null;
  n.dimBackground = !1;
  n.returnToGridView = n.returnToGridView.bind(n);
  var i = n,
    r = i.contentEl;
  i.modalEl.addClass("mod-community-modal", "mod-sidebar-layout");
  var o = n.sidebarEl = r.createDiv("modal-sidebar");
  n.detailsEl = createDiv("community-modal-details");
  o.createDiv("community-modal-controls", function (e) {
    new Setting(e).addSearch(function (e) {
      return n.search = e.onChange(debounce(n.update.bind(n), 300)).then(function () {
        e.inputEl.addEventListener("keypress", function (e) {
          e.isComposing || "Enter" !== e.key || Platform.hasPhysicalKeyboard || clearSelectionAndBlur();
        });
      });
    }).addButton(function (e) {
      return e.onClick(function (e) {
        return n.showSortMenu(e);
      }).then(function (e) {
        if (Platform.isPhone) e.setButtonText(i18nProxy.plugins.fileExplorer.actionChangeSort());else {
          var t = e.buttonEl;
          setIcon(t, "lucide-sort-asc");
          setTooltip(t, i18nProxy.plugins.fileExplorer.actionChangeSort());
          t.addClass("clickable-icon");
        }
      });
    });
    n.installedOnlyToggleSetting = new Setting(e).setName(i18nProxy.setting.thirdPartyPlugin.showInstalledOnly()).addToggle(function (e) {
      return n.installedOnlyToggle = e.setSmall().setValue(!1).onChange(function () {
        return n.update();
      });
    });
    n.addCustomControls(e);
    n.searchSummaryEl = e.createDiv("community-modal-search-summary u-muted");
  });
  var a = o.createDiv("community-modal-search-results-wrapper");
  n.emptyStateEl = a.createDiv("community-modal-empty-state");
  n.listEl = a.createDiv("community-modal-search-results");
  Platform.isMobile && registerSwipeHandler(n.contentEl, function (e) {
    if (1 === e.points && "x" === e.direction && !(null === n.selectedItemId || e.touch.clientX > 40)) {
      var t = n,
        i = t.detailsEl,
        r = t.sidebarEl;
      n.contentEl.prepend(r);
      restoreScrollPositions(r);
      e.registerCallback({
        move: function (t, n) {
          var r = i.offsetWidth,
            o = Math.clamp((t - e.startX) / r, 0, 1);
          i.style.transform = "translateX(".concat(o * r, "px)");
        },
        cancel: function () {
          i.style.transform = "";
          r.detach();
        },
        finish: function (t, o, a) {
          var s = i.offsetWidth,
            l = Math.clamp((t - e.startX) / s, 0, 1);
          if (0.5 * a < s / 2) {
            startAnimation(i, new TransitionAnimation({
              duration: 200 * l
            }).addProp("transform", null, "translateX(0)", ""), function () {
              r.detach();
            });
          } else {
            startAnimation(i, new TransitionAnimation({
              duration: 100 * (1 - l),
              fn: "ease-out"
            }).addProp("transform", null, "translateX(".concat(s, "px)"), ""), function () {
              i.detach();
              n.returnToGridView();
            });
          }
        }
      });
    }
  });
  var s = n.renderQueue = new AsyncGeneratorQueue(),
    l = null,
    beforePause = function () {
      if (a.scrollTop + a.clientHeight < a.scrollHeight - a.clientHeight / 2) {
        l || (l = createDeferred());
      } else {
        l && (l.resolve(), l = null);
      }
    },
    u = createBatchedAsyncGenerator(s.generator(), {
      batchSize: 10,
      beforePause: beforePause
    });
  __awaiter(n, void 0, void 0, function () {
    var e, t, n, error, r, o, a, s;
    return __generator(this, function (c) {
      switch (c.label) {
        case 0:
          c.trys.push([0, 6, 7, 12]);
          e = !0;
          t = __asyncValues(u);
          c.label = 1;
        case 1:
          return [4, t.next()];
        case 2:
          n = c.sent();
          return (r = n.done) ? [3, 5] : (s = n.value, e = !1, s(), l ? [4, l.promise] : [3, 4]);
        case 3:
          c.sent();
          c.label = 4;
        case 4:
          e = !0;
          return [3, 1];
        case 5:
          return [3, 12];
        case 6:
          error = c.sent();
          o = {
            error: error
          };
          return [3, 12];
        case 7:
          c.trys.push([7,, 10, 11]);
          return e || r || !(a = t.return) ? [3, 9] : [4, a.call(t)];
        case 8:
          c.sent();
          c.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if (o) throw o.error;
          return [7];
        case 11:
          return [7];
        case 12:
          return [2];
      }
    });
  });
  a.addEventListener("scroll", beforePause, {
    passive: !0
  });
  return n;
}