function () {
  return __awaiter(this, void 0, void 0, function () {
    var t,
      n,
      i,
      r,
      o,
      a,
      s,
      l,
      c,
      count,
      h,
      p,
      d,
      f,
      m,
      g,
      v,
      w,
      limit,
      C,
      E,
      S,
      M,
      x,
      T = this;
    return __generator(this, function (D) {
      switch (D.label) {
        case 0:
          n = (t = this).parentModal;
          i = t.el;
          r = n.plugin;
          o = n.app;
          i.empty();
          D.label = 1;
        case 1:
          D.trys.push([1, 3,, 4]);
          return [4, (tokenA0 = account.token, apiRequest("/publish/list", {
            token: tokenA0
          }))];
        case 2:
          a = D.sent();
          return [3, 4];
        case 3:
          s = D.sent();
          n.handleError(s);
          return [2];
        case 4:
          l = a.sites;
          c = a.shared;
          count = a.limit;
          new Setting(i).setName(i18nProxy.plugins.publish.labelYourSites()).setHeading();
          h = i.createDiv("site-list-container");
          p = l.map(function (e) {
            return e.id;
          }).concat(c.map(function (e) {
            return e.id;
          }));
          d = {};
          D.label = 5;
        case 5:
          D.trys.push([5, 7,, 8]);
          return [4, r.apiGetSlugs(p)];
        case 6:
          d = D.sent();
          return [3, 8];
        case 7:
          f = D.sent();
          console.error(f);
          return [3, 8];
        case 8:
          if (0 === l.length && 0 !== count) h.createDiv("site-empty-state u-center-text", function (e) {
            e.createEl("p", {
              text: i18nProxy.plugins.publish.labelNoSites()
            });
          });else for (m = function (e) {
            h.createDiv("site-list-item list-item", function (t) {
              var texti0 = d[e.id] || e.id;
              t.createDiv({
                cls: "list-item-part mod-extended",
                text: texti0
              });
              t.createEl("button", {
                text: i18nProxy.plugins.publish.buttonChoose()
              }, function (t) {
                t.addEventListener("click", async function () {
                  await r.setup(e.id, e.host);
                  await n.openReviewChanges();
                  return;
                });
              });
              t.createDiv({
                cls: "clickable-icon"
              }, function (t) {
                setIcon(t, "lucide-edit-3");
                setTooltip(t, i18nProxy.plugins.publish.tooltipEditSiteId());
                t.addEventListener("click", function () {
                  n.editSlug(e, d[e.id] || "");
                });
              });
              t.createDiv("clickable-icon", function (t) {
                setIcon(t, "lucide-x");
                setTooltip(t, i18nProxy.plugins.publish.tooltipDeleteSite());
                t.addEventListener("click", function () {
                  var t = document.createDocumentFragment();
                  t.createEl("p", {
                    text: i18nProxy.plugins.publish.labelDeleteSiteConfirmation()
                  });
                  t.createEl("p", {
                    cls: "setting-message mod-warning",
                    text: i18nProxy.plugins.publish.labelDeleteSiteDetails()
                  });
                  new ConfirmationModal(o).setTitle(i18nProxy.plugins.publish.labelConfirmDeleteSite({
                    site: texti0
                  })).setContent(t).addButton("mod-warning", i18nProxy.dialogue.buttonDelete(), function () {
                    n.deleteSite(e.id);
                  }).addCancelButton().open();
                });
              });
            });
          }, g = 0, v = l; g < v.length; g++) {
            w = v[g];
            m(w);
          }
          if (l.length < count ? (new Setting(i).setName(i18nProxy.plugins.publish.optionSiteId()).setDesc(i18nProxy.plugins.publish.optionSiteIdDescription()).addText(function (e) {
            e.setPlaceholder(i18nProxy.plugins.publish.optionSiteIdPlaceholder());
            e.inputEl.addEventListener("keydown", function (e) {
              e.isComposing || "Enter" !== e.key || T.createSite();
            });
            T.slugInputEl = e.inputEl;
          }).setClass("site-list-site-id-setting"), i.createDiv("u-center-text", function (e) {
            e.createEl("button", {
              text: i18nProxy.plugins.publish.buttonCreate(),
              cls: "mod-cta"
            }, function (e) {
              e.addEventListener("click", T.createSite.bind(T));
            });
          })) : 0 === count ? h.createDiv("list-item", function (e) {
            e.createDiv({
              cls: "list-item-part mod-extended u-muted",
              text: i18nProxy.plugins.publish.labelNoSitesBought()
            });
            e.createEl("button", {
              cls: "list-item-part mod-cta",
              text: i18nProxy.plugins.publish.buttonGetSite()
            }, function (e) {
              e.addEventListener("click", function () {
                window.open("https://obsidian.md/account", "_blank");
              });
            });
          }) : (limit = i18nProxy.nouns.siteWithCount({
            count: count
          }), h.createDiv("list-item", function (e) {
            e.createDiv({
              cls: "list-item-part mod-extended u-muted",
              text: i18nProxy.plugins.publish.labelSiteUsage({
                site: l.length.toString(),
                limit: limit
              })
            });
            e.createEl("button", {
              cls: "list-item-part mod-cta",
              text: i18nProxy.plugins.publish.buttonAddMoreSites()
            }, function (e) {
              e.addEventListener("click", function () {
                window.open("https://obsidian.md/account", "_blank");
              });
            });
          })), c.length > 0) for (new Setting(i).setName(i18nProxy.plugins.publish.labelSitesSharedWithYou()).setHeading(), C = i.createDiv("site-list-container"), E = function (e) {
            C.createDiv("site-list-item list-item", function (t) {
              var i = e.id,
                texta0 = d[i] || i;
              t.createDiv({
                cls: "list-item-part mod-extended",
                text: texta0
              });
              t.createEl("button", {
                text: i18nProxy.plugins.publish.buttonChoose()
              }, function (t) {
                t.addEventListener("click", async function () {
                  await r.setup(i, e.host);
                  await n.openReviewChanges();
                  return;
                });
              });
              t.createDiv("clickable-icon", function (t) {
                setIcon(t, "lucide-x");
                setTooltip(t, i18nProxy.plugins.publish.tooltipLeaveSiteSharing());
                t.addEventListener("click", function () {
                  var t = document.createDocumentFragment();
                  t.createEl("p", {
                    cls: "setting-message mod-warning",
                    text: i18nProxy.plugins.publish.labelLeaveSiteConfirmationDetails()
                  });
                  t.createEl("p", {
                    text: i18nProxy.plugins.publish.labelLeaveSiteConfirmationDetails_2()
                  });
                  new ConfirmationModal(o).setTitle(i18nProxy.plugins.publish.labelLeaveSiteConfirmation({
                    site: texta0
                  })).setContent(t).addButton("mod-warning", i18nProxy.plugins.publish.buttonLeave(), function () {
                    n.deleteSiteShare(i, e.share_uid);
                  }).addCancelButton().open();
                });
              });
            });
          }, S = 0, M = c; S < M.length; S++) {
            x = M[S];
            E(x);
          }
          e.prototype.show.call(this);
          return [2];
      }
      var tokenA0;
    });
  });
}