function () {
  __awaiter(this, void 0, void 0, function () {
    var e;
    var t;
    var n;
    var i;
    var r;
    var o;
    var a = this;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          Platform.isDesktopApp = !0;
          Platform.isDesktop = !0;
          Platform.hasPhysicalKeyboard = !0;
          startTiming("initialization");
          return [4, languageLoadPromise];
        case 1:
          if (s.sent(), e = safeRequire("electron"), t = e.ipcRenderer.sendSync("vault"), n = t.id, !(i = t.path) || !safeRequire("original-fs").existsSync(i)) {
            e.ipcRenderer.sendSync("starter");
            window.close();
            return [2];
          }
          try {
            (r = navigator.clipboard).readText = async function () {
              return window.electron.clipboard.readText();
            };
            r.writeText = async function (e) {
              window.electron.clipboard.writeText(e);
              return;
            };
            Object.defineProperty(navigator, "clipboard", {
              get: function () {
                if (activeWindow === window) return r;
                var e = activeWindow.navigator.clipboard;
                e.readText = r.readText;
                e.writeText = r.writeText;
                return e;
              }
            });
          } catch (e) {}
          Platform.isLinux && window.addEventListener("mousedown", function (e) {
            if (1 === e.button) {
              var t = e.win;
              var n = t.document;
              var i = n.activeElement;
              var r = e;
              var o = !1;
              var a = function (e) {
                if (1 === e.button) if (t.removeEventListener("mouseup", a), r.defaultPrevented) e.preventDefault();else if (n.activeElement !== i || o) e.preventDefault();else {
                  var s,
                    l = function (e) {
                      e.defaultPrevented || u();
                    },
                    c = function (e) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.stopImmediatePropagation();
                    },
                    u = function () {
                      t.removeEventListener("auxclick", l);
                      t.removeEventListener("paste", c, {
                        capture: !0
                      });
                      t.clearTimeout(s);
                    };
                  t.addEventListener("auxclick", l);
                  t.addEventListener("paste", c, {
                    capture: !0
                  });
                  s = t.setTimeout(u, 100);
                }
              };
              if (t.addEventListener("mouseup", a), i && i.instanceOf(HTMLElement) && i !== n.body) {
                var s = e.targetNode;
                if (i.contains(s)) {
                  if (!i.instanceOf(HTMLInputElement)) for (; s && s !== i;) {
                    if (s.instanceOf(HTMLElement)) {
                      if ("false" === s.contentEditable) {
                        o = !0;
                        break;
                      }
                      if ("true" === s.contentEditable) break;
                    }
                    s = s.parentElement;
                  }
                } else i.blur();
              } else o = !0;
            }
          });
          initElectron(window);
          initTitleBar(window);
          bindWindowFocus(window);
          o = new FileSystemAdapter(i);
          document.title = getFileName(normalizePath(i)) + " - Obsidian v" + e.ipcRenderer.sendSync("version");
          ready(async function () {
            window.app = new App(o, n);
            return;
          });
          return [2];
      }
    });
  });
}