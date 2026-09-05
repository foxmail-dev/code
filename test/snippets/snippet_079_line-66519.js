function (e) {
  return __awaiter(this, void 0, Promise, function () {
    var t = this;
    return __generator(this, function (n) {
      return [2, this.queue(async function () {
        var t, n, i;
        t = this.getFullPath(e);
        try {
          n = await this.fs.stat(t);
          if ("file" === n.type) {
            return {
              type: "file",
              ...convertStat(n)
            };
          }
          if ("directory" === n.type) {
            return {
              type: "folder",
              ...convertStat(n)
            };
          }
        } catch (error) {
          if ("ENOENT" !== error.code) {
            throw error;
          }
        }
        return null;
      })];
    });
  });
}