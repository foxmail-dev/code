function initEncryption(e, t, n) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (i) {
      switch (e) {
        case 0:
          return [2, EncryptionV0.init(t)];
        case 2:
        case 3:
          return [2, EncryptionV2.init(t, n, e)];
        default:
          throw new Error("Encryption version not supported");
      }
      return [2];
    });
  });
}