function () {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          return [4, this.checkPermission()];
        case 1:
          return e.sent() ? this.recording ? [3, 3] : [4, this.onStartRecording()] : [2];
        case 2:
          e.sent();
          return [3, 4];
        case 3:
          this.onStopRecording();
          e.label = 4;
        case 4:
          return [2];
      }
    });
  });
}