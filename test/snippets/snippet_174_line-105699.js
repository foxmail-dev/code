function () {
  return __awaiter(n, void 0, void 0, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          account.key = this.licenseKeyEl.value.trim();
          return [4, validateBusinessKey(account)];
        case 1:
          e.sent();
          if ("valid" === account.keyValidation) {
            this.close();
          } else {
            this.errorEl.setText(account.keyValidation);
            this.errorEl.show();
          }
          return [2, !0];
      }
    });
  });
}