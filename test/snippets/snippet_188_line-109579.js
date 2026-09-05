function () {
  return __awaiter(m, void 0, void 0, function () {
    var e, s, l, h, p;
    return __generator(this, function (d) {
      switch (d.label) {
        case 0:
          return (e = r.getValue()) ? localStorage.setItem("history-show-diff", "true") : localStorage.removeItem("history-show-diff"), o.toggle(!e), a.toggle(e), !e || u ? [3, 4] : (u = !0, t ? (h = arrayBufferToString, [4, this.getContentForVersion(t.uid)]) : [3, 2]);
        case 1:
          return l = h.apply(void 0, [d.sent()]), [3, 3];
        case 2:
          l = i;
          d.label = 3;
        case 3:
          return s = l, a.empty(), a.appendChild(renderDiffView(s, i)), [3, 5];
        case 4:
          e || c || (c = !0, markdownExtensions.contains(typen0) ? (p = compileMarkdown(parseMarkdown(i)), o.appendChild(sanitizeHTMLToDom(p))) : o.createEl("pre").setText(i));
          d.label = 5;
        case 5:
          return [2];
      }
    });
  });
}