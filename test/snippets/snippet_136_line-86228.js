function () {
  return __awaiter(this, void 0, Promise, function () {
    var storages, t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          storages = [];
          if (this.clearAll) {
            storages = ["cookies", "filesystem", "indexdb", "localstorage", "shadercache", "websql", "serviceworkers", "cachestorage"];
          } else {
            this.clearCookies && storages.push("cookies");
            this.clearCache && storages.push("cachestorage");
          }
          return storages.length > 0 ? [4, (t = electron.remote.session.fromPartition(this.app.getWebviewPartition())).clearStorageData({
            storages: storages
          })] : [3, 3];
        case 1:
          n.sent();
          return this.clearAll ? [4, t.clearData()] : [3, 3];
        case 2:
          n.sent();
          n.label = 3;
        case 3:
          return this.clearHistory ? [4, this.webviewer.db.clearHistoryItems()] : [3, 5];
        case 4:
          n.sent();
          n.label = 5;
        case 5:
          this.close();
          return [2];
      }
    });
  });
}