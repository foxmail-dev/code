function getVaultLocations() {
  return __awaiter(this, void 0, Promise, function () {
    var e;
    var t;
    var n;
    var i;
    var r;
    var o;
    var location;
    var s;
    var l;
    var c;
    var u = this;
    return __generator(this, function (h) {
      switch (h.label) {
        case 0:
          e = [];
          t = async function (t, n, i, r, o) {
            var a;
            var s;
            var l;
            var c;
            var u;
            var nameh0;
            try {
              a = await t.readdir(n);
            } catch (_e0) {
              s = _e0;
              console.error(s);
              return;
            }
            for (l = 0, c = a; l < c.length; l++) {
              u = c[l];
              (nameh0 = u.name).startsWith(".") || o && o.contains(nameh0) || "directory" === u.type && e.push({
                name: nameh0,
                location: i + nameh0,
                storageType: r ? "iCloud" : "local"
              });
            }
            return;
          };
          return isIosApp ? icloudRoot ? [4, t(icloudRoot, Documents, "icloud/", !0)] : [3, 2] : [3, 4];
        case 1:
          h.sent();
          h.label = 2;
        case 2:
          return [4, t(documentsRoot, "", "documents/")];
        case 3:
          h.sent();
          return [3, 13];
        case 4:
          return isAndroidApp ? (n = [], [4, checkStoragePermission()]) : [3, 13];
        case 5:
          if (!h.sent()) return [3, 11];
          i = documentsRoot.getUri("") + "/";
          r = 0;
          o = androidStorageLocations;
          h.label = 6;
        case 6:
          if (!(r < o.length)) return [3, 11];
          location = o[r];
          h.label = 7;
        case 7:
          h.trys.push([7, 9,, 10]);
          (s = androidFs.getUri(location)).startsWith(i) && ((l = s.substr(i.length)).contains("/") || n.push(decodeURIComponent(l)));
          return [4, androidFs.stat(location)];
        case 8:
          "directory" === h.sent().type && e.push({
            location: location,
            name: getFileName(location),
            storageType: "local"
          });
          return [3, 10];
        case 9:
          c = h.sent();
          console.error(c);
          return [3, 10];
        case 10:
          r++;
          return [3, 6];
        case 11:
          return [4, t(documentsRoot, "", "", !1, n)];
        case 12:
          h.sent();
          h.label = 13;
        case 13:
          return [2, e];
      }
    });
  });
}