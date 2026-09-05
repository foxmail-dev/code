function t(t, onlyShowUpdates) {
  var i = e.call(this, t) || this;
  i.sortOrderOptions = ["download", "release", "alphabetical"];
  i.setTitle(i18nProxy.plugins.customCss.settingCommunityThemes());
  i.modalEl.addClass("mod-community-theme");
  i.search.setPlaceholder(i18nProxy.plugins.customCss.promptFilter());
  i.sortOrder = localStorage.getItem("communityThemeSortOrder") || "download";
  i.onlyShowUpdates = onlyShowUpdates;
  var r = createBatchedAsyncGenerator((i.imageResizeQueue = new AsyncGeneratorQueue()).generator(), {
    batchSize: 1,
    maxDelay: 100
  });
  __awaiter(i, void 0, void 0, function () {
    var e, t, n, i, o, a, s, error, c, u, h, p;
    return __generator(this, function (d) {
      switch (d.label) {
        case 0:
          d.trys.push([0, 5, 6, 11]);
          e = !0;
          t = __asyncValues(r);
          d.label = 1;
        case 1:
          return [4, t.next()];
        case 2:
          if (n = d.sent(), c = n.done) return [3, 4];
          if (p = n.value, e = !1, !(i = p).isShown()) return [3, 3];
          if (i.naturalWidth > 640 || i.naturalHeight > 320) try {
            o = activeDocument.createElement("canvas");
            (a = o.getContext("2d")).imageSmoothingQuality = "high";
            s = Math.min(512 / i.naturalWidth, 288 / i.naturalHeight);
            o.width = Math.floor(i.naturalWidth * s);
            o.height = Math.floor(i.naturalHeight * s);
            a.drawImage(i, 0, 0, o.width, o.height);
            i.src = o.toDataURL();
          } catch (e) {
            console.log("Unable to downsize theme image", e);
          }
          d.label = 3;
        case 3:
          e = !0;
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          error = d.sent();
          u = {
            error: error
          };
          return [3, 11];
        case 6:
          d.trys.push([6,, 9, 10]);
          return e || c || !(h = t.return) ? [3, 8] : [4, h.call(t)];
        case 7:
          d.sent();
          d.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (u) throw u.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return [2];
      }
    });
  });
  return i;
}