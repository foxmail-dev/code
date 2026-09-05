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
      y,
      w,
      k,
      C,
      contentE0,
      S,
      M,
      x,
      T,
      D,
      A,
      P,
      L,
      I,
      O,
      F,
      N,
      R,
      B,
      V,
      H,
      z,
      q,
      W,
      U,
      _,
      j,
      G,
      K,
      sizes,
      Z,
      X,
      Q = this;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          t = (e = this).containerEl;
          n = e.site;
          i = e.render;
          return n ? ("degraded" === n.status && ((r = document.body.createDiv("top-notice")).setText("This site is no longer active. If you are the owner of the site, please update your subscription "), r.createEl("a", {
            attr: {
              href: "https://obsidian.md/account",
              target: "_blank"
            },
            text: "here"
          }), r.appendText(".")), o = n.loadOptions(), a = n.loadCache(), [4, o]) : (activatePreloadedStylesheets(), t.show(), i.renderContent("### Site not found."), [2]);
        case 1:
          b.sent();
          activatePreloadedStylesheets();
          t.show();
          l = (s = this).leftColumnInnerEl;
          c = s.rightColumnInnerEl;
          u = s.siteHeaderEl;
          h = s.siteHeaderTextEl;
          p = s.siteLogoEl;
          d = s.siteLogoLinkEl;
          f = s.leftSiteHeaderEl;
          m = s.leftSiteHeaderLogoEl;
          g = s.leftSiteHeaderLogoLinkEl;
          v = s.renderContainerEl;
          y = n.getConfig(PublishShowNavigation);
          w = n.getConfig(PublishShowGraph);
          k = n.getConfig(PublishShowOutline);
          C = this.search.outerContainerEl;
          if (y) {
            l.insertBefore(C, this.leftSiteThemeToggleEl.nextSibling);
          } else {
            w || k ? c.prepend(C) : u.prepend(C);
          }
          contentE0 = n.getSiteName();
          h.setText(contentE0);
          f.setText(contentE0);
          f.setAttr("aria-label", contentE0);
          g.setAttr("aria-label", "".concat(contentE0, " logo"));
          document.head.find('meta[property="og:site_name"]') || (S = document.head.find('meta[name="description"]')) && S.parentNode.insertBefore(createEl("meta", {
            attr: {
              property: "og:site_name",
              content: contentE0
            }
          }), S);
          if ("system" === (M = n.getConfig(PublishDefaultTheme))) {
            x = window.matchMedia("(prefers-color-scheme: dark)");
            T = function () {
              if (x.matches) {
                Q.setTheme("dark");
              } else {
                Q.setTheme("light");
              }
            };
            x.addEventListener("change", T);
            T();
          } else {
            this.setTheme(M);
          }
          if (n.getConfig(PublishShowThemeToggle)) {
            D = function (e) {
              var t = "dark" === Q.themeInEffect,
                n = t ? "light" : "dark";
              Q.setTheme(n);
              Q.leftSiteThemeToggleEl.toggleClass("is-dark", !t);
              e.toggleClass("is-enabled", !t);
              localStorage.setItem("site-theme", n);
              Q.graph.renderer && Q.graph.renderer.testCSS();
            };
            (A = localStorage.getItem("site-theme")) && this.setTheme(A);
            this.leftSiteThemeToggleEl.createSpan({
              cls: "option mod-dark"
            }, function (e) {
              setIcon(e, "lucide-moon");
            });
            this.leftSiteThemeToggleEl.createDiv("checkbox-container", function (e) {
              Q.leftSiteThemeToggleEl.toggleClass("is-dark", "dark" === Q.themeInEffect);
              e.toggleClass("is-enabled", "dark" === Q.themeInEffect);
              e.addEventListener("click", function () {
                return D(e);
              });
            });
            this.leftSiteThemeToggleEl.createSpan({
              cls: "option mod-light"
            }, function (e) {
              setIcon(e, "lucide-sun");
            });
            this.leftSiteThemeToggleEl.show();
          }
          if (P = n.getConfig(PublishSlidingWindowMode)) {
            v.on("click", ".publish-renderer", this.onPublishRendererClick.bind(this));
            v.addEventListener("scroll", this.onSlidingWindowScroll.bind(this));
          }
          L = !P && !!n.getConfig(PublishReadableLineLength);
          this.containerEl.toggleClass("is-readable-line-width", L);
          remarkParser.globalOptions.breaks = !n.getConfig(PublishStrictLineBreaks);
          i.renderContent("### Loading site...");
          b.label = 2;
        case 2:
          b.trys.push([2, 4,, 9]);
          return [4, a];
        case 3:
          b.sent();
          return [3, 9];
        case 4:
          return (I = b.sent()) instanceof XMLHttpRequest && 401 === I.status ? (this.setNoIndex(!0), [4, new Promise(function (e) {
            new PasswordModal(Q, e).open();
          })]) : [3, 7];
        case 5:
          b.sent();
          return [4, n.loadCache()];
        case 6:
          b.sent();
          return [3, 8];
        case 7:
          console.error(I);
          new Notice("Oh no! Seems like something went wrong!");
          return [2];
        case 8:
          return [3, 9];
        case 9:
          if (O = document.head, (F = n.getSiteLogoUrl()) && n.cache.has(F) && (N = n.getInternalUrl(F), d.show(), p.setAttribute("src", N), m.show(), m.setAttribute("src", N)), this.addLinkToSiteRoot(h), this.addLinkToSiteRoot(f), this.addLinkToSiteRoot(g), this.addLinkToSiteRoot(d), R = n.getConfig(PublishGoogleAnalytics), n.isCustomDomain() && R) try {
            if (R.startsWith("G-")) {
              window.dataLayer = window.dataLayer || [];
              window.gtag = function () {
                window.dataLayer.push(arguments);
              };
              window.gtag("js", new Date());
              window.gtag("config", R);
              (X = O.createEl("script")).async = !0;
              X.src = "https://www.googletagmanager.com/gtag/js?id=" + R;
            } else {
              window.GoogleAnalyticsObject = "ga";
              B = window.ga = function () {
                (B.q = B.q || []).push(arguments);
              };
              B.l = Date.now();
              (X = O.createEl("script")).async = !0;
              X.src = "https://www.google-analytics.com/analytics.js";
              B("create", R, "auto");
              B("send", "pageview");
            }
          } catch (e) {}
          for (V = !1, H = !1, z = 0, q = Array.from(O.childNodes); z < q.length; z++) if ((W = q[z]) instanceof HTMLLinkElement && "stylesheet" === W.rel) {
            W.href.contains(ObsidianCssFile) && (V = !0);
            W.href.contains(PublishCssFile) && (H = !0);
          }
          for (j in !V && n.cache.has(ObsidianCssFile) && O.createEl("link", {
            href: n.getInternalUrl(ObsidianCssFile),
            attr: {
              rel: "stylesheet"
            }
          }), !H && n.cache.has(PublishCssFile) && O.createEl("link", {
            href: n.getInternalUrl(PublishCssFile),
            attr: {
              rel: "stylesheet"
            }
          }), U = n.cache.cache, _ = O.find('link[rel="icon"]:not([sizes])'), U) if (U.hasOwnProperty(j)) {
            if ("favicon.ico" === (G = getFileName(j))) {
              O.createEl("link", {
                href: n.getInternalUrl(j),
                attr: {
                  rel: "icon"
                }
              });
              _ && _.detach();
              continue;
            }
            if (K = G.match(FaviconRegex)) {
              sizes = K[1] + (K[2] || "x" + K[1]);
              O.createEl("link", {
                href: n.getInternalUrl(j),
                attr: {
                  rel: "icon",
                  sizes: sizes
                }
              });
              _ && _.detach();
            }
          }
          this.trigger("options-updated");
          this.updateSlidingWindow();
          return n.isCustomDomain() && n.cache.has(PublishJsFile) ? ((Z = createEl("script")).async = !0, Z.src = n.getInternalUrl(PublishJsFile), [4, new Promise(function (e) {
            Z.addEventListener("load", e);
            Z.addEventListener("error", e);
            O.appendChild(Z);
          })]) : [3, 11];
        case 10:
          b.sent();
          b.label = 11;
        case 11:
          return [4, this.loadFromUrl()];
        case 12:
          b.sent();
          try {
            (X = i.renderer.previewEl).style.outline = "none";
            X.tabIndex = -1;
            X.focus();
          } catch (e) {
            console.error(e);
          }
          return [2];
      }
    });
  });
}