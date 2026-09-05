function (n) {
  var i;
  i = n.url;
  __awaiter(e, void 0, void 0, function () {
    var e;
    return __generator(this, function (n) {
      return i && (e = parseCallbackUrl(i)) ? e.vault && e.vault.toLowerCase() !== this.app.vault.getName().toLowerCase() ? (sessionStorage.setItem("obsidian-uri", i), window.location.reload(), [2]) : (OBS_ACT(e), [2]) : [2];
    });
  });
}