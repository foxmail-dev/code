function e(e, appId) {
  var n = this;
  this.appMenuBarManager = null;
  this.embedRegistry = new EmbedRegistry();
  this.viewRegistry = new ViewRegistry();
  this.nextFrameEvents = [];
  this.nextFrameTimer = null;
  this.isMobile = !1;
  this.mobileToolbar = null;
  this.mobileNavbar = null;
  this.mobileTabSwitcher = null;
  this.lastEvent = null;
  console.log("%cObsidian Developer Console", "color:#7f6df2; font-size:40px; font-weight:bold;");
  var i,
    r,
    o = document.body;
  this.title = document.title;
  this.appId = appId;
  this.keymap = Keymap.init();
  this.scope = Keymap.global.getRootScope();
  this.commands = new CommandManager(this);
  this.hotkeyManager = new HotkeyManager(this);
  this.dragManager = new DragManager(this);
  this.dom = new AppLayout(o);
  this.customCss = new CustomCssManager(this);
  this.shareReceiver = new ShareManager(this);
  this.renderContext = new BaseLinkRenderer(this);
  o.addClass("obsidian-app");
  "1" === this.loadLocalStorage(DEBUG_MODE_KEY) && function (e) {
    if (isInsiderBuild = e) {
      new Notice("Obsidian debug mode enabled.");
      console.debug("[Obsidian] Debug mode enabled. Run `app.debugMode(false)` to disable.");
    } else {
      new Notice("Obsidian debug mode disabled.");
      console.debug("[Obsidian] Debug mode disabled.");
    }
  }(!0);
  if (!Platform.isMobile && localStorage.getItem(EMULATE_MOBILE_KEY)) {
    Platform.isMobile = !0;
    Platform.isDesktop = !1;
    Platform.hasPhysicalKeyboard = !1;
    o.addClass("emulate-mobile");
    if (Platform.isMobile) {
      document.body.on("mouseover", clickableElementsSelector, function (e, t) {
        isFocusOutside(e, t) && (isRapidClick(e) || (null == lastTouchState || lastTouchState.removeClass(mobileTapEventType), (lastTouchState = t).addClass(mobileTapEventType)));
      });
      document.body.on("mouseout", clickableElementsSelector, function (e, t) {
        isRapidClick(e) || isFocusOutside(e, t) && (null == lastTouchState || lastTouchState.removeClass(mobileTapEventType));
      });
      document.addEventListener("touchstart", function (e) {
        if (1 === e.touches.length) {
          var t,
            n = e.targetNode;
          if (n.instanceOf(Element) && ((t = n.matchParent(clickableElementsSelector)) || (t = n.instanceOf(HTMLElement) ? n : n.parentElement)), t) {
            var i = e.timeStamp,
              r = e.touches[0],
              o = r.identifier,
              a = !1,
              s = window.setTimeout(function () {
                a || t.addClass(mobileTapEventType);
              }, 10),
              l = function (e) {
                a = !0;
                u();
                var n = Math.max(10, 300 - (e.timeStamp - i));
                window.setTimeout(function () {
                  return t.removeClass(mobileTapEventType);
                }, n);
              },
              c = function (e) {
                var t = findTouchById(e, o);
                if (t && !a) {
                  window.clearTimeout(s);
                  calculateDistance(getEventPoint(t), getEventPoint(r)) > 5 && l(e);
                }
              },
              u = function () {
                document.removeEventListener("touchmove", c);
                document.removeEventListener("touchcancel", l);
                document.removeEventListener("touchend", l);
              };
            document.addEventListener("touchmove", c);
            document.addEventListener("touchcancel", l);
            document.addEventListener("touchend", l);
          }
        }
      }, !0);
    }
    window.frameDom && window.frameDom.titleBarEl.hide();
    i = window.matchMedia("(min-width: 600px) and (min-height: 600px)");
    r = function () {
      if (!Platform.mobileSoftKeyboardVisible) {
        Platform.isTablet = i.matches;
        Platform.isPhone = !i.matches;
        document.body.toggleClass("is-tablet", Platform.isTablet);
        document.body.toggleClass("is-phone", Platform.isPhone);
      }
    };
    i.addEventListener("change", debounce(r, 10));
    r();
  }
  keyboardPlugin && keyboardPlugin.hasPhysicalKeyboard().then(function (e) {
    Platform.hasPhysicalKeyboard = e.hasPhysicalKeyboard;
  });
  this.isMobile = Platform.isMobile;
  Platform.isMobile && o.addClass("is-mobile");
  Platform.isMacOS || document.body.addClass("styled-scrollbars");
  Platform.isIosApp && function () {
    document.body.style["-webkit-touch-callout"] = "none";
    var e = window;
    e.addEventListener("touchstart", function (t) {
      if (!(t.touches.length > 1)) {
        var n = t.touches[0],
          i = t.targetNode,
          clientX = n.clientX,
          clientY = n.clientY,
          a = n.identifier,
          s = 800;
        i instanceof Element && i.matchParent('[draggable="true"]') && (s = 1200);
        var l = window.setTimeout(function () {
            c();
            i.dispatchEvent(new MouseEvent("contextmenu", {
              button: 0,
              buttons: 0,
              ctrlKey: t.ctrlKey,
              altKey: t.altKey,
              metaKey: t.metaKey,
              shiftKey: t.shiftKey,
              screenX: n.screenX,
              screenY: n.screenY,
              bubbles: !0,
              cancelable: !0,
              clientX: clientX,
              clientY: clientY
            })) || navigator.vibrate(200);
          }, s),
          c = function () {
            e.removeEventListener("touchcancel", h, !0);
            e.removeEventListener("touchend", h, !0);
            e.removeEventListener("touchmove", p, !0);
            e.removeEventListener("dragstart", d, !0);
            window.clearTimeout(l);
            cleanupFunction = null;
          };
        cleanupFunction = c;
        var u = function (e, t) {
            var n = t.clientX - clientX,
              i = t.clientY - clientY;
            n * n + i * i > 25 && c();
          },
          h = function (e) {
            for (var t = e.changedTouches, n = 0; n < t.length; n++) {
              if (t[n].identifier === a) return void c();
            }
          },
          p = function (e) {
            for (var t = e.changedTouches, n = 0; n < t.length; n++) {
              var i = t[n];
              if (i.identifier === a) return void u(0, i);
            }
          },
          d = function (e) {
            var t = e.targetNode;
            t && (t === i || t.contains(i)) && c();
          };
        e.addEventListener("touchcancel", h, !0);
        e.addEventListener("touchend", h, !0);
        e.addEventListener("touchmove", p, !0);
        e.addEventListener("dragstart", d, !0);
      }
    });
  }();
  window.ServiceWorkerContainer && (window.ServiceWorkerContainer.prototype.register = function () {
    return new Promise(function () {});
  });
  __awaiter(n, void 0, void 0, function () {
    var t,
      n,
      i,
      r = this;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          t = ProgressBar.instance;
          n = setTimeout(function () {
            t.setContext(function (e) {
              e.createDiv("progress-bar-button-container", function (e) {
                e.createEl("button", {
                  text: i18nProxy.interface.startUp.buttonReloadApp()
                }, function (e) {
                  e.onClickEvent(function () {
                    window.location.reload();
                  });
                });
                r.plugins && r.plugins.isEnabled() && e.createEl("button", {
                  cls: "mod-cta",
                  text: i18nProxy.interface.startUp.buttonReloadAppInSafeMode()
                }, function (e) {
                  e.onClickEvent(async function () {
                    await this.plugins.setEnable(!1);
                    window.location.reload();
                    return;
                  });
                });
                e.createEl("button", {
                  text: i18nProxy.interface.startUp.buttonOpenAnotherVault()
                }, function (e) {
                  e.onClickEvent(function () {
                    r.openVaultChooser();
                  });
                });
              });
            });
          }, 2e4);
          o.label = 1;
        case 1:
          o.trys.push([1, 3, 4, 7]);
          t.setMessage(i18nProxy.interface.startUp.loadingObsidian()).show();
          return [4, this.initializeWithAdapter(e)];
        case 2:
          o.sent();
          t.hide();
          return [3, 7];
        case 3:
          i = o.sent();
          console.error(i);
          t.setMessage(i18nProxy.interface.startUp.obsidianLoadError() + " " + (i ? i.toString() : "unknown"));
          t.setContext(function (e) {
            e.createDiv("progress-bar-button-container", function (e) {
              e.createEl("button", {
                cls: "mod-cta",
                text: i18nProxy.interface.startUp.buttonReloadApp()
              }, function (e) {
                e.onClickEvent(function () {
                  window.location.reload();
                });
              });
              r.plugins && r.plugins.isEnabled() && e.createEl("button", {
                cls: "mod-cta",
                text: i18nProxy.interface.startUp.buttonReloadAppInSafeMode()
              }, function (e) {
                e.onClickEvent(async function () {
                  await this.plugins.setEnable(!1);
                  window.location.reload();
                  return;
                });
              });
              e.createEl("button", {
                cls: "mod-cta",
                text: i18nProxy.interface.startUp.buttonOpenAnotherVault()
              }, function (e) {
                e.onClickEvent(function () {
                  r.openVaultChooser();
                });
              });
            });
          });
          return [3, 7];
        case 4:
          clearTimeout(n);
          return Platform.isMobileApp && splashScreenPlugin ? [4, window.nextFrame()] : [3, 6];
        case 5:
          o.sent();
          splashScreenPlugin.hide();
          o.label = 6;
        case 6:
          return [7];
        case 7:
          return [2];
      }
    });
  });
  __awaiter(n, void 0, void 0, function () {
    var e;
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          t.trys.push([0, 3,, 4]);
          return (e = navigator.storage) && e.persist ? [4, e.persist()] : [3, 2];
        case 1:
          t.sent();
          t.label = 2;
        case 2:
          return [3, 4];
        case 3:
          t.sent();
          console.log("Failed to persist local storages");
          return [3, 4];
        case 4:
          return [2];
      }
    });
  });
}