function sendRequest(e) {
  return __awaiter(this, void 0, Promise, function () {
    var body;
    var binary;
    var i;
    var r;
    var o;
    var method;
    var contentType;
    var bodyl0;
    var headers;
    var u;
    var h;
    var p;
    return __generator(this, function (d) {
      switch (d.label) {
        case 0:
          String.isString(e) && (e = {
            url: e
          });
          return isNativeApp ? (binary = !1, e.body instanceof ArrayBuffer ? (body = arrayBufferToBase64(e.body), binary = !0) : body = e.body, [4, appPlugin.requestUrl({
            url: e.url,
            method: e.method,
            contentType: e.contentType,
            headers: e.headers,
            body: body,
            binary: binary
          })]) : [3, 2];
        case 1:
          i = d.sent();
          return [2, createRequestResponse(e, i.status, i.headers, base64ToArrayBuffer(i.body))];
        case 2:
          return safeRequire("electron") ? [4, requestUrlElectron(e)] : [3, 4];
        case 3:
          r = d.sent();
          return [2, createRequestResponse(e, r.status, r.headers, r.body)];
        case 4:
          o = e.url;
          method = e.method;
          contentType = e.contentType;
          bodyl0 = e.body;
          headers = null;
          contentType && (headers = {
            "Content-Type": contentType
          });
          return [4, fetch(o, {
            method: method,
            headers: headers,
            body: bodyl0
          })];
        case 5:
          return [4, (u = d.sent()).arrayBuffer()];
        case 6:
          h = d.sent();
          p = {};
          u.headers.forEach(function (e, t) {
            return p[t] = e;
          });
          return [2, createRequestResponse(e, u.status, p, h)];
      }
    });
  });
}