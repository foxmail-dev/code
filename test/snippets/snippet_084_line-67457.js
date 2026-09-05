function deriveScryptKey(e, t) {
  return __awaiter(this, void 0, Promise, function () {
    var n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          e = e.normalize("NFKC");
          t = t.normalize("NFKC");
          return (n = window.require && window.require("crypto")) ? [4, new Promise(function (i, r) {
            n.scrypt(Buffer.from(e, "utf8"), Buffer.from(t, "utf8"), 32, scryptParams, function (e, t) {
              e ? r(e) : i(t);
            });
          })] : [3, 2];
        case 1:
          return [2, sliceArrayBuffer(i.sent())];
        case 2:
          return [4, window.scrypt.scrypt(new Uint8Array(stringToArrayBuffer(e)), new Uint8Array(stringToArrayBuffer(t)), scryptN, 8, 1, 32)];
        case 3:
          return [2, cloneArrayBuffer(i.sent())];
      }
    });
  });
}