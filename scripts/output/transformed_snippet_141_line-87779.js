function () {
  return __awaiter(this, void 0, Promise, function () {
    var e, t, n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return Platform.isDesktopApp && "macOS" === operatingSystemName ? (e = safeRequire("electron")) ? (t = e.remote.systemPreferences, n = t.getMediaAccessStatus("microphone"), ["denied", "restricted", "unknown"].contains(n) ? (this.showRecordingMessage(i18nProxy.plugins.audioRecorder.msgAccessDenied(), !0), [2, !1]) : [3, 1]) : (this.showRecordingMessage(i18nProxy.plugins.audioRecorder.msgAccessDenied(), !0), [2, !1]) : [3, 5];
        case 1:
          return "not-determined" !== n ? [3, 3] : (this.showRecordingMessage(i18nProxy.plugins.audioRecorder.msgPendingGrant(), !1), [4, t.askForMediaAccess("microphone")]);
        case 2:
          return [2, i.sent()];
        case 3:
          if ("granted" === n) return [2, !0];
          i.label = 4;
        case 4:
          return [2, !1];
        case 5:
          return [2, !0];
      }
    });
  });
}