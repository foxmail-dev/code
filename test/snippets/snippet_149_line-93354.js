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
      w,
      k,
      C,
      E,
      src,
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
      Y,
      Z,
      X,
      Q,
      $,
      J = this;
    return __generator(this, function (ee) {
      switch (ee.label) {
        case 0:
          e = this.wrapperEl;
          return 0 === this.nodes.size ? (new Notice(i18nProxy.plugins.canvas.msgExportFailedEmptyCanvas()), [2]) : (t = e.win, n = e.doc, i = t.electron.remote, r = i.getCurrentWebContents(), o = Math.pow(1.2, r.getZoomLevel()), a = t.devicePixelRatio, s = Math.round(a / o * 1e5) / 1e5, l = expandBBox(getUnionBBox(Array.from(this.nodes.values()).map(rectToBBox)), 100), c = l.maxX - l.minX, u = l.maxY - l.minY, h = Math.min(2, 16284 / s / c, 16284 / s / u), p = "", d = Math.min(1, h), f = Math.log2(d), m = Math.log2(h), g = !0, v = !1, w = "full", [4, new Promise(function (e) {
            var t = new Modal(J.app);
            t.setTitle(i18nProxy.plugins.canvas.actionExportPng());
            t.modalEl.addClass("mod-narrow");
            var n,
              i,
              r = t.contentEl;
            r.createEl("p", {
              cls: "u-muted",
              text: i18nProxy.plugins.canvas.labelExportPngDesc({
                title: J.view.file.basename
              })
            });
            new Setting(r).setName(i18nProxy.plugins.canvas.optionExportPngFrame()).setDesc(i18nProxy.plugins.canvas.optionExportPngFrameDesc()).addDropdown(function (e) {
              return e.addOption("full", i18nProxy.plugins.canvas.optionExportPngFrameFull()).addOption("viewport", i18nProxy.plugins.canvas.optionExportPngFrameViewport()).setValue(w).onChange(function (e) {
                var t = "full" === (w = e);
                n.setVisibility(t);
                i.setVisibility(t);
              });
            });
            var o = function () {
              return n.setDesc(i18nProxy.plugins.canvas.labelExportPngDimensions({
                dimensions: "".concat(Math.ceil(c * d * s).toLocaleString(), "px x ").concat(Math.ceil(u * d * s).toLocaleString(), "px")
              }));
            };
            n = new Setting(r).setName(i18nProxy.plugins.canvas.optionExportPngZoom()).setDesc(i18nProxy.plugins.canvas.optionExportPngZoomDesc()).addSlider(function (e) {
              return e.setLimits(Math.min(-1, m), m, "any").setValue(f).setDynamicTooltip().onChange(function (e) {
                f = e;
                d = Math.pow(2, e);
                o();
              }).getValuePretty = function () {
                return Math.pow(2, e.getValue()).toFixed(2);
              };
            });
            o();
            i = new Setting(r).setName(i18nProxy.plugins.canvas.optionExportPngShowLogo()).setDesc(i18nProxy.plugins.canvas.optionExportPngShowLogoDesc()).addToggle(function (e) {
              return e.setValue(g).onChange(function (e) {
                return g = e;
              });
            });
            new Setting(r).setName(i18nProxy.plugins.canvas.optionExportPngPrivacyMode()).setDesc(i18nProxy.plugins.canvas.optionExportPngPrivacyModeDesc()).addToggle(function (e) {
              return e.setValue(v).onChange(function (e) {
                return v = e;
              });
            });
            r.createDiv("modal-button-container", function (n) {
              n.createEl("button", {
                cls: "mod-cta",
                text: i18nProxy.dialogue.buttonSave()
              }).addEventListener("click", async function () {
                t.close();
                e();
                return;
              });
            });
            t.open();
          })]);
        case 1:
          ee.sent();
          return [4, i.dialog.showSaveDialog({
            defaultPath: this.view.file.basename + ".png",
            filters: [{
              name: "PNG Files",
              extensions: ["png"]
            }, {
              name: "All Files",
              extensions: ["*"]
            }],
            properties: ["showOverwriteConfirmation"]
          })];
        case 2:
          return (k = ee.sent()).canceled || !k.filePath ? [2] : (p = k.filePath) ? "viewport" !== w ? [3, 4] : [4, this.takeScreenshot(p, v)] : [2];
        case 3:
          ee.sent();
          return [2];
        case 4:
          this.deselectAll();
          C = n.body;
          e.addClass("is-screenshotting");
          v && e.addClass("is-text-garbled");
          this.screenshotting = !0;
          C.appendChild(e);
          src = "";
          ee.label = 5;
        case 5:
          ee.trys.push([5,, 16, 18]);
          if (g) {
            l.maxY += 80;
            u += 80;
            (E = this.canvasEl.createDiv("canvas-watermark")).setCssStyles({
              position: "absolute",
              left: l.minX + 80 + "px",
              top: l.maxY - 80 + "px",
              transform: "translate(0, -100%) scale(".concat(4 / d, ")"),
              transformOrigin: "bottom left",
              display: "flex",
              whiteSpace: "pre",
              alignItems: "center",
              gap: "3px",
              zIndex: "9999999"
            });
            E.appendChild(function (e) {
              var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              t.setAttrs({
                viewBox: "0 0 143 25",
                width: String(e),
                fill: "currentColor"
              });
              t.innerHTML = '<path d="M7 14.6a12 12 0 0 1 2.8-.6 10 10 0 0 1 .5-8.8l.4-.7a32.9 32.9 0 0 0 .9-2.3v-1c-.1-.4-.3-.7-.7-1.1-.6-.2-1.1 0-1.6.3L4.2 5.1c-.3.2-.5.6-.6 1l-.4 3a14.6 14.6 0 0 1 3.7 5.5Zm-4-4.2-.1.3-2.8 6c-.2.7-.1 1.4.4 1.9L4.8 23a8.7 8.7 0 0 0 .8-8.7c-.7-1.8-1.9-3.2-2.6-4Z"/><path d="M5.8 23.5H6a23.8 23.8 0 0 1 7.4 1.4c1.2.4 2.3-.5 2.5-1.7a7 7 0 0 1 .8-2.7c-.8-2-1.6-3.2-2.6-4a5 5 0 0 0-2.9-1.3c-1.6-.2-3 .2-4 .5.6 2.3.4 5-1.4 7.8Z"/><path d="m17.4 19.3 2-3c0-.4 0-.7-.2-1a18 18 0 0 1-2-3.5c-.7-1.4-.7-3.5-.8-4.6 0-.4 0-.7-.3-1l-3.4-4.3v.6L12 4l-.5 1-.3.6A11 11 0 0 0 10 9.4c0 1.3 0 2.8.9 4.7h.4c1.1.2 2.3.6 3.5 1.6 1 .8 1.8 2 2.5 3.6ZM39.8 4.5c-6 0-10.3 3.7-10.3 8.9 0 5.1 4.3 8.9 10.3 8.9 5.9 0 10.2-3.8 10.2-9 0-5-4.3-8.8-10.2-8.8Zm0 3.5c3.5 0 6.1 2.1 6.1 5.4 0 3.2-2.6 5.4-6.1 5.4-3.6 0-6.2-2.2-6.2-5.4 0-3.3 2.6-5.4 6.2-5.4Zm15.7 12.6c.8.9 2.5 1.7 4.6 1.7 4.3 0 6.8-3 6.8-6.6C67 12 64.4 9 60.1 9c-2.1 0-3.8.8-4.6 1.7v-6h-3.9V22h3.9v-1.4Zm-.1-5c0-2 1.7-3.4 3.9-3.4 2 0 3.9 1.2 3.9 3.5 0 2.2-1.8 3.5-4 3.5-2.1 0-3.8-1.4-3.8-3.4v-.2ZM67.3 20a11 11 0 0 0 7.2 2.3c4 0 7-1.5 7-4.4 0-3-2.9-3.5-6.1-3.8-2.8-.4-3.6-.4-3.6-1.1 0-.7.9-1 2.5-1 2 0 3.7.5 4.8 1.6l2-2.3A9.7 9.7 0 0 0 74.5 9c-4 0-6.5 1.7-6.5 4.3 0 2.7 2.5 3.3 5.6 3.7 2.8.3 4 .3 4 1.2 0 .8-1 1.1-2.8 1.1-2.2 0-4.1-.7-5.7-2l-1.8 2.5ZM82.8 8h4V4.9h-4V8Zm3.9 1.4h-3.8V22h3.8V9.4Zm13.1 11.2V22h3.9V4.8h-3.9v6C99 9.8 97.4 9 95.2 9c-4.3 0-6.8 3-6.8 6.6 0 3.6 2.5 6.6 6.8 6.6 2.2 0 3.8-.8 4.6-1.7Zm.1-5v.2c0 2-1.7 3.4-3.9 3.4-2 0-3.9-1.3-3.9-3.5 0-2.3 1.8-3.5 4-3.5 2.1 0 3.8 1.4 3.8 3.4ZM106 8h4V4.9h-4V8Zm3.9 1.4H106V22h3.9V9.4Zm7 12.9a8 8 0 0 0 5.2-1.7c.6 1.2 2.2 2 5 1.4v-2.8c-1.4.3-1.7 0-1.7-.7v-4.6c0-3.2-2.3-4.8-6.4-4.8-3.5 0-6.2 1.5-7 3.8l3.4 1c.4-1 1.7-1.8 3.5-1.8 2 0 2.8.8 2.8 1.7v.1l-5 .5c-3 .3-5.2 1.5-5.2 4 0 2.4 2.2 3.9 5.4 3.9Zm4.8-5.1c0 1.4-2.2 2.3-4.1 2.3-1.5 0-2.4-.5-2.4-1.3s.7-1.1 2-1.3l4.5-.4v.7Zm6.7 4.8h3.8v-6c0-2.2 1.2-3.5 3.3-3.5 2 0 3 1.3 3 3.4V22h3.8v-7.2c0-3.5-2.2-5.7-5.5-5.7-2 0-3.6.8-4.6 1.8V9.4h-3.8V22Z"/>';
              return t;
            }(100));
          }
          x = 5 / o;
          e.setCssStyles({
            top: "".concat(x, "px"),
            left: "".concat(x, "px"),
            bottom: "".concat(x, "px"),
            right: "".concat(x, "px"),
            width: "auto",
            height: "auto"
          });
          M = window.open("about:blank", "_blank", "popup,x=".concat(t.screenX + 5, ",y=").concat(t.screenY + 5, ",width=").concat(t.outerWidth - 10, ",height=").concat(t.outerHeight - 10));
          T = createEl("base", {
            href: location.href
          });
          M.document.head.appendChild(T);
          M.document.title = "Obsidian";
          injectEnhanceScript(M);
          syncIframeDocument(M, [T])();
          (D = new ProgressBar(M.document)).show();
          D.setMessage("Rendering tiles...");
          A = !1;
          D.el.createEl("button", {
            cls: "mod-cta",
            text: i18nProxy.dialogue.buttonStop()
          }, function (e) {
            e.style.marginTop = "20px";
            e.onClickEvent(function () {
              A = !0;
            });
          });
          this.onResize();
          P = e.getBoundingClientRect();
          L = Math.ceil(P.x * o + 1);
          I = Math.ceil(P.y * o + 1);
          O = Math.floor(P.width * o) - 2;
          F = Math.floor(P.height * o) - 2;
          this.zoom = this.tZoom = Math.log2(d / o);
          N = createRect(L, I, O, F);
          R = O / d;
          B = F / d;
          V = Math.ceil((l.maxX - l.minX) / R);
          H = Math.ceil((l.maxY - l.minY) / B);
          z = l.minX + R / 2;
          q = l.minY + B / 2;
          (W = n.createElement("canvas")).width = Math.ceil(c * d * s);
          W.height = Math.ceil(u * d * s);
          U = W.getContext("2d");
          this.viewportChanged = !0;
          this.requestFrame();
          return [4, sleep(500)];
        case 6:
          ee.sent();
          _ = V * H;
          j = 0;
          G = 0;
          ee.label = 7;
        case 7:
          if (!(G < H)) return [3, 12];
          K = function (e) {
            var i, o, a, l;
            return __generator(this, function (c) {
              switch (c.label) {
                case 0:
                  return A ? [2, {
                    value: void 0
                  }] : (Y.x = Y.tx = z + e * R, Y.y = Y.ty = q + G * B, Y.viewportChanged = !0, Y.requestFrame(), [4, sleep(100)]);
                case 1:
                  c.sent();
                  return [4, t.nextFrame()];
                case 2:
                  c.sent();
                  return t.requestIdleCallback ? [4, new Promise(function (e) {
                    return t.requestIdleCallback(e);
                  })] : [3, 4];
                case 3:
                  c.sent();
                  c.label = 4;
                case 4:
                  return [4, r.capturePage(N)];
                case 5:
                  i = c.sent();
                  o = sliceArrayBuffer(i.toPNG());
                  a = new Blob([o], {
                    type: "image/png"
                  });
                  src = URL.createObjectURL(a);
                  (l = n.createElement("img")).src = src;
                  return [4, new Promise(function (e, t) {
                    l.addEventListener("load", e);
                    l.addEventListener("error", t);
                  })];
                case 6:
                  c.sent();
                  U.drawImage(l, e * O * s, G * F * s);
                  URL.revokeObjectURL(src);
                  src = "";
                  j++;
                  D.setProgress(j, _);
                  D.setMessage("Rendering tiles... (".concat(j, "/").concat(_, ")"));
                  return [2];
              }
            });
          };
          Y = this;
          Z = 0;
          ee.label = 8;
        case 8:
          return Z < V ? [5, K(Z)] : [3, 11];
        case 9:
          if ("object" == typeof (X = ee.sent())) return [2, X.value];
          ee.label = 10;
        case 10:
          Z++;
          return [3, 8];
        case 11:
          G++;
          return [3, 7];
        case 12:
          D.setMessage("Generating final image");
          return [4, canvasToBlob(W, "image/png")];
        case 13:
          return [4, ee.sent().arrayBuffer()];
        case 14:
          Q = ee.sent();
          $ = toNodeBuffer(Q);
          return [4, window.require("original-fs").promises.writeFile(p, $)];
        case 15:
          ee.sent();
          new Notice(p, 1e4).addButton(Platform.isMacOS ? i18nProxy.plugins.openWithDefaultApp.actionShowInFolderMac() : i18nProxy.plugins.openWithDefaultApp.actionShowInFolder(), function () {
            return showItemInFolder(p);
          });
          return [3, 18];
        case 16:
          this.view.contentEl.appendChild(e);
          E && E.detach();
          e.removeClass("is-screenshotting");
          e.removeClass("is-text-garbled");
          e.setCssStyles({
            top: "",
            left: "",
            bottom: "",
            right: "",
            width: "",
            height: ""
          });
          this.screenshotting = !1;
          M && M.close();
          src && URL.revokeObjectURL(src);
          return [4, t.nextFrame()];
        case 17:
          ee.sent();
          this.zoomToFitQueued = !0;
          this.onResize();
          return [7];
        case 18:
          return [2];
      }
    });
  });
}