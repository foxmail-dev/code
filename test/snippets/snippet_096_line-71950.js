function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, progression;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          this.progression = 1;
          e = this.render();
          this.progressionSpeed = Math.clamp(0.5 * Math.sqrt(e), 5, 100);
          t = Date.now();
          i.label = 1;
        case 1:
          return this.progression > 0 ? (progression = this.progression, [4, new Promise(function (e) {
            return scheduleIdleTaskc(e, 0);
          })]) : [3, 3];
        case 2:
          i.sent();
          return progression !== this.progression ? [3, 3] : (progression = 1 + Math.floor(this.progressionSpeed * (Date.now() - t) / 1e3)) === this.progression || (this.progression = progression, this.render()) ? [3, 1] : [3, 3];
        case 3:
          return [2];
      }
    });
  });
}