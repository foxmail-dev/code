function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          if (isIosApp && !navigator.mediaDevices) {
            new Notice("This functionality requires iOS 14.5.");
            return [2];
          }
          i.label = 1;
        case 1:
          i.trys.push([1, 4,, 5]);
          return [4, navigator.mediaDevices.getUserMedia({
            audio: !0,
            video: !1
          })];
        case 2:
          e = i.sent();
          return [4, this.startRecording(e)];
        case 3:
          i.sent();
          return [3, 5];
        case 4:
          if ((t = i.sent()).message.contains("Requested device not found") && this.plugin.addedButtonEls.length > 0) {
            n = i18nProxy.plugins.audioRecorder.msgNoMicrophone();
            this.showRecordingMessage(n, !0);
          } else {
            t.message.contains("denied") && new Notice(t.message);
            console.error(t);
          }
          return [2];
        case 5:
          this.recording = !0;
          this.plugin.addedButtonEls.forEach(function (e) {
            setIcon(e, "lucide-mic");
            e.addClass("is-active");
          });
          return [2];
      }
    });
  });
}