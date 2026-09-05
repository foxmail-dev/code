function () {
  return __awaiter(void 0, void 0, void 0, function () {
    var e;
    var t;
    var n;
    var i;
    var r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          o.trys.push([0, 5,, 6]);
          return currentLanguageCode.contains("/") || currentLanguageCode.contains("\\") ? (e = JSON.parse(window.require("original-fs").readFileSync(currentLanguageCode, "utf8")), i18next.addResourceBundle("dev", defaultNS, e), [4, i18next.changeLanguage("dev")]) : [3, 2];
        case 1:
          o.sent();
          return [2];
        case 2:
          i = (n = JSON).parse;
          return [4, ajaxPromise({
            url: "/i18n/" + currentLanguageCode + ".json"
          })];
        case 3:
          t = i.apply(n, [o.sent()]);
          i18next.addResourceBundle(currentLanguageCode, defaultNS, t);
          return [4, i18next.changeLanguage(currentLanguageCode)];
        case 4:
          o.sent();
          return [3, 6];
        case 5:
          r = o.sent();
          console.error("Failed to load language pack.", r);
          return [3, 6];
        case 6:
          return [2];
      }
    });
  });
}