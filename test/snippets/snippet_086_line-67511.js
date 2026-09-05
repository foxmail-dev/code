function hashEncryptionKey(e, t, n) {
  return __awaiter(this, void 0, Promise, function () {
    var i;
    var r;
    var o;
    var a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          switch (n) {
            case 0:
              return [3, 1];
            case 2:
            case 3:
              return [3, 3];
          }
          return [3, 7];
        case 1:
          i = arrayBufferToHex;
          return [4, computeSha256(e)];
        case 2:
          return [2, i.apply(void 0, [s.sent()])];
        case 3:
          return [4, window.crypto.subtle.importKey("raw", e, "HKDF", !1, ["deriveKey"])];
        case 4:
          r = s.sent();
          return [4, window.crypto.subtle.deriveKey({
            name: "HKDF",
            salt: stringToArrayBuffer(t),
            info: stringToArrayBuffer("ObsidianKeyHash"),
            hash: "SHA-256"
          }, r, {
            name: "AES-CBC",
            length: 256
          }, !0, ["encrypt"])];
        case 5:
          o = s.sent();
          a = arrayBufferToHex;
          return [4, window.crypto.subtle.exportKey("raw", o)];
        case 6:
          return [2, a.apply(void 0, [s.sent()])];
        case 7:
          throw new Error("Encryption version not supported");
      }
    });
  });
}