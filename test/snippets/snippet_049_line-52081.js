function (e) {
  var t = this;
  if (!e.isComposing) {
    var n = function () {
        i.blur();
        t.setEphemeralState({
          focus: !0,
          focusOnMobile: i !== t.titleEl
        });
      },
      i = e.targetNode;
    if ("Escape" === e.key && (e.preventDefault(), this.fileBeingRenamed = null, i.setText(this.file.basename), n()), "Enter" === e.key || "Tab" === e.key) {
      e.preventDefault();
      __awaiter(t, void 0, void 0, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.saveTitle(i)];
            case 1:
              e.sent() && n();
              return [2];
          }
        });
      });
    } else if ("ArrowDown" === e.key) {
      var r = i.win.getSelection();
      if (r && r.rangeCount >= 1 && i.instanceOf(HTMLElement)) {
        var o = r.getRangeAt(0);
        if (i === o.startContainer || i.contains(o.startContainer)) {
          var a = o.getBoundingClientRect();
          if (a.bottom + a.height / 2 >= i.getBoundingClientRect().bottom) {
            e.preventDefault();
            i.blur();
            i.win.getSelection().empty();
            this.setEphemeralState({
              focus: !0,
              focusMetadata: !e.altKey
            });
          }
        }
      }
    }
  }
}