function () {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (t) {
      if (this.onlyShowUpdates) {
        this.currentModeToggleSetting.settingEl.detach();
        this.installedOnlyToggleSetting.settingEl.detach();
      } else {
        "system" === this.app.vault.getConfig("theme") && (this.currentModeToggleSetting.settingEl.detach(), this.currentModeToggle.setValue(!1));
      }
      e.prototype.onOpen.call(this);
      return [2];
    });
  });
}