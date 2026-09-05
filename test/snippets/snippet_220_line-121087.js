function (t) {
  window.onbeforeunload = null;
  var n = e.workspace;
  if (n) {
    var i = new PromiseBatcher();
    n.trigger("quit", i);
    if (!i.isEmpty()) {
      t.preventDefault();
      t.returnValue = "Saving...";
      ProgressBar.instance.show().setMessage("Saving...");
      __awaiter(e, void 0, void 0, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, i.promise()];
            case 1:
              e.sent();
              window.close();
              return [2];
          }
        });
      });
    }
  }
}