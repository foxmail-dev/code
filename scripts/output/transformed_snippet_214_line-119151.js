function (t) {
  return __awaiter(this, void 0, void 0, function () {
    var n,
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
      f = this;
    return __generator(this, function (m) {
      switch (m.label) {
        case 0:
          if (n = this.vault = new Vault(t), !Platform.isDesktopApp) return [3, 4];
          m.label = 1;
        case 1:
          m.trys.push([1, 3,, 4]);
          return [4, n.readRaw("")];
        case 2:
          m.sent();
          return [3, 4];
        case 3:
          return "ENOENT" === (i = m.sent()).code ? (this.vault = null, this.openVaultChooser(!0), [2]) : (i.code, [3, 4]);
        case 4:
          n.on("closed", function () {
            return f.openVaultChooser(!0);
          });
          n.on("config-changed", this.onConfigChanged.bind(this));
          (r = e.getOverrideConfigDir(this.appId)) && n.setConfigDir(r);
          return [4, n.setupConfig()];
        case 5:
          m.sent();
          startTiming("vault.setup");
          this.disableCssTransition();
          this.workspace = new Workspace(this, this.dom.workspaceEl);
          this.fileManager = new FileManager(this);
          this.statusBar = new StatusBarHelper(this, this.dom.statusBarEl);
          this.metadataCache = new MetadataCache(this, n);
          this.metadataTypeManager = new PropertyTypeManager(this);
          this.setting = new SettingModal(this);
          this.foldManager = new FoldManager(this);
          o = this.internalPlugins = new InternalPluginManager(this);
          a = this.plugins = new CommunityPluginManager(this);
          startTiming("workspace.components");
          s = function () {
            "system" === n.getConfig("theme") && f.updateTheme();
          };
          window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", s);
          Platform.isDesktopApp && window.electron.remote.nativeTheme.removeAllListeners("updated").on("updated", s);
          this.updateAccentColor();
          this.updateTheme();
          this.updateFontFamily();
          this.updateFontSize();
          this.updateTabSize();
          this.customCss.load();
          this.updateInlineTitleDisplay();
          this.updateRibbonDisplay();
          this.updateViewHeaderDisplay();
          this.updateUseNativeMenu();
          startTiming("workspace.appearance");
          Platform.isDesktopApp && (this.appMenuBarManager = new AppMenu(this));
          if (Platform.isMobile) {
            this.mobileToolbar = new MobileToolbar(this);
            this.mobileNavbar = new MobileNavbar(this);
            this.mobileTabSwitcher = new MobileTabSwitcher(this);
          }
          this.shareReceiver.setupWorkspace();
          return [4, this.metadataTypeManager.load()];
        case 6:
          m.sent();
          return [4, this.hotkeyManager.load()];
        case 7:
          m.sent();
          this.registerCommands();
          startTiming("workspace.components");
          ProgressBar.instance.setMessage(i18nProxy.interface.startUp.loadingPlugins());
          o.loadPlugin(new FileExplorerPlugin());
          o.loadPlugin(new GlobalSearchPlugin());
          o.loadPlugin(new QuickSwitcherPlugin());
          o.loadPlugin(new GraphPlugin());
          o.loadPlugin(new BacklinkPlugin());
          o.loadPlugin(new CanvasPluginManager());
          o.loadPlugin(new OutgoingLinksPlugin());
          o.loadPlugin(new TagPanePlugin());
          o.loadPlugin(new FootnotesPlugin());
          o.loadPlugin(new PropertiesCorePlugin());
          o.loadPlugin(new PagePreviewCorePlugin());
          o.loadPlugin(new DailyNotesPluginManager());
          o.loadPlugin(new TemplatesPlugin());
          o.loadPlugin(new NoteComposerPlugin());
          o.loadPlugin(new CommandPalettePluginManager());
          o.loadPlugin(new SlashCommandPlugin());
          o.loadPlugin(new EditorStatusPlugin());
          o.loadPlugin(new BookmarksPluginManager());
          o.loadPlugin(new MarkdownImporterPlugin());
          o.loadPlugin(new UniqueNoteCreatorPlugin());
          o.loadPlugin(new RandomNotePlugin());
          o.loadPlugin(new OutlineCorePlugin());
          o.loadPlugin(new WordCountPlugin());
          o.loadPlugin(new SlidesPlugin());
          o.loadPlugin(new AudioRecorderPlugin());
          o.loadPlugin(new WorkspacesPlugin());
          o.loadPlugin(new FileRecoveryPlugin());
          o.loadPlugin(new PublishPlugin());
          o.loadPlugin(new SyncPlugin());
          o.loadPlugin(new BasesPluginManager());
          Platform.isDesktopApp && o.loadPlugin(new WebViewerPlugin());
          return [4, o.enable()];
        case 8:
          m.sent();
          startTiming("corePlugins");
          return [4, a.initialize()];
        case 9:
          m.sent();
          ProgressBar.instance.setMessage(i18nProxy.interface.startUp.loadingVault());
          m.label = 10;
        case 10:
          m.trys.push([10, 12,, 13]);
          this.metadataCache.preload();
          return [4, this.vault.load()];
        case 11:
          m.sent();
          return [3, 13];
        case 12:
          throw l = m.sent(), new Notice(i18nProxy.interface.startUp.msgFailedToLoadVault() + l ? l.message : ""), console.error(l), l;
        case 13:
          this.hotkeyManager.registerListeners();
          this.metadataTypeManager.registerListeners();
          ProgressBar.instance.setMessage(i18nProxy.interface.startUp.loadingCache());
          return [4, this.metadataCache.initialize()];
        case 14:
          m.sent();
          startTiming("vault");
          ProgressBar.instance.setMessage(i18nProxy.interface.startUp.loadingWorkspace());
          return [4, this.workspace.loadLayout()];
        case 15:
          m.sent();
          startTiming("workspace.layout");
          setTimeout(function () {
            f.enableCssTransition();
          }, 500);
          this.workspace.registerUriHook();
          this.registerQuitHook();
          this.metadataCache.showIndexingNotice();
          this.shareReceiver.setupNative();
          if (Platform.isDesktopApp) {
            c = !1;
            u = function () {
              if (!c) {
                c = !0;
                new Notice(createFragment(function (e) {
                  e.createEl("b", {
                    text: i18nProxy.interface.labelUpdateAvailable()
                  });
                  e.createEl("p", {
                    text: i18nProxy.setting.about.labelManualUpdateRequired()
                  });
                }), 0).addButton(i18nProxy.dialogue.buttonDownload(), function () {
                  return window.open(getDownloadUrl());
                });
              }
            };
            if (compareVersion(currentElectronVersion, REQUIRED_ELECTRON_VERSION) && !electron.ipcRenderer.sendSync("disable-update")) {
              u();
            } else {
              h = function () {
                withElectron(function (e) {
                  if ("update-manual-required" === e.ipcRenderer.sendSync("update")) {
                    clearInterval(p);
                    u();
                  }
                });
              };
              p = setInterval(h, 36e5);
              h();
            }
            if (compareVersion(null !== (d = localStorage.getItem("most-recently-installed-version")) && void 0 !== d ? d : electron.remote.app.getVersion(), apiVersion)) {
              this.showReleaseNotes();
              localStorage.setItem("most-recently-installed-version", apiVersion);
            }
          }
          Platform.isDesktopApp && electron && window.addEventListener("drop", function (e) {
            var t = e.dataTransfer;
            if (hasFiles(t)) {
              var n = extractFilesFromClipboard(t, "drop", !1);
              if (1 !== n.length) return !1;
              var i = n[0];
              if ("asar" === i.extension && i.name.match(/^obsidian-\d+\.\d+\.\d+/)) {
                e.preventDefault();
                var r = /^obsidian-(\d+\.\d+\.\d+)/.exec(i.name)[1];
                if (apiVersion === r || compareVersion(apiVersion, r)) {
                  new ConfirmationModal(f).setTitle("Install Obsidian v" + r + "?").setContent("This build is potentially experimental. Ensure your vault data is backed up.").addButton("mod-cta", "Install", function () {
                    electron.ipcRenderer.sendSync("copy-asar", i.filepath) && electron.ipcRenderer.sendSync("relaunch");
                  }).addCancelButton().open();
                } else {
                  new ConfirmationModal(f).setTitle("Unable to install Obsidian v" + r).setContent("The build is older than the currently installed version of Obsidian (v".concat(apiVersion, ").")).addButton("mod-cancel", "Okay", function () {}).open();
                }
              }
            }
          }, {
            capture: !0
          });
          startTiming("workspace.extra");
          window.setTimeout(function () {
            try {
              var e = f.internalPlugins.getPluginById("sync");
              e && !e.enabled && function (e, {
                blocked: blocked
              } = {}) {
                const n = indexedDB.deleteDatabase(e);
                blocked && n.addEventListener("blocked", e => blocked(e.oldVersion, e));
                wrapIndexedDBRequest(n).then(() => {});
              }(f.appId + "-sync");
            } catch (e) {
              console.error("Failed to clean-up Sync DB", e);
            }
          }, 3e4);
          (function (e) {
            timingTree.duration = performance.now();
            var views = 0,
              deferredViews = 0;
            e.workspace.iterateAllLeaves(function (e) {
              views++;
              (e.view instanceof MobileOnboardingController || e.view instanceof EmptyView || e.view instanceof UnknownPaneView) && deferredViews++;
            });
            viewCounts.views = views;
            viewCounts.deferredViews = deferredViews;
            startupTimings.sort(function (e, t) {
              return e.ts - t.ts;
            });
            for (var i = 0, r = 0, o = startupTimings; r < o.length; r++) {
              var a = o[r],
                durations0 = a.ts - i;
              i = a.ts;
              for (var l = timingTree, c = 0, u = a.key.split("."); c < u.length; c++) {
                var h = u[c];
                l.children[h] || (l.children[h] = {
                  key: h,
                  children: {},
                  duration: 0
                });
                (l = l.children[h]).duration += durations0;
              }
            }
            startupTimings = [];
          })(this);
          "1" === (g = this).loadLocalStorage("slow-startup-check") && getTimingDuration() > 8e3 && new Notice(i18nProxy.interface.msgSlowBoot()).addButton(i18nProxy.dialogue.buttonView(), function () {
            var e = new StartupTimeDebugModal(g);
            e.shouldAnimate = !1;
            e.open();
          });
          return [2];
      }
      var g;
    });
  });
}