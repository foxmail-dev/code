function () {
  return __awaiter(this, void 0, void 0, function () {
    var e = this;
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          this.vaultName = "";
          this.region = "";
          this.useOwnPassword = !0;
          this.key = "";
          return [4, getVaultRegions(account.token)];
        case 1:
          t.sent().forEach(function (t) {
            e.regionSettingDropdown.addOption(t.value, t.name);
          });
          return [2];
      }
    });
  });
}