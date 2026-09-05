function (e) {
  return __awaiter(this, arguments, void 0, function (e, t) {
    var n,
      i,
      r,
      o,
      a,
      s,
      l,
      c,
      u,
      h,
      p,
      d,
      f,
      m,
      g,
      v,
      w,
      k,
      C,
      E,
      S,
      M,
      x,
      T,
      D,
      A = this;
    void 0 === t && (t = !1);
    return __generator(this, function (P) {
      switch (P.label) {
        case 0:
          if (e.defaultPrevented) return [2];
          if (Platform.isMobile) {
            if (e.instanceOf(PointerEvent) && "mouse" === e.pointerType && -1 === e.button) return [2];
            if (!t && Platform.mobileSoftKeyboardVisible && (!e.isTrusted || e.instanceOf(TouchEvent))) return [2];
          }
          return i = (n = this).app, r = n.editor, (o = r.posAtMouse(e)) ? (a = new Menu().addSections(["title", "correction", "spellcheck", "open", "selection-link", "selection", "insert", "clipboard", "info", "action", "view", "", "danger"]), s = !0, l = !0, c = !0, h = Platform.isDesktopApp && e.win.electron, p = !1, h && e.isTrusted ? [4, getElectronContextMenu(e)] : [3, 2]) : [2];
        case 1:
          if (!(d = P.sent()) || e.defaultPrevented) return [2];
          if (u = h.remote.webContents.fromId(d.webContentsId), T = d.editFlags || {}, s = T.canCut, l = T.canCopy, c = T.canPaste, u && d.misspelledWord) {
            if (0 === (f = d.dictionarySuggestions || []).length) a.addItem(function (e) {
              return e.setSection("correction").setDisabled(!0).setTitle(i18nProxy.editor.spellcheck.noSuggestion());
            });else for (f.length > 6 && (f = f.slice(0, 6)), m = function (e) {
              a.addItem(function (t) {
                return t.setSection("correction").setTitle(e).setIcon("lucide-repeat").onClick(function () {
                  a.hide();
                  u.replaceMisspelling(e);
                });
              });
            }, g = 0, v = f; g < v.length; g++) {
              w = v[g];
              m(w);
            }
            a.addItem(function (e) {
              return e.setSection("spellcheck").setTitle(i18nProxy.editor.spellcheck.addToDictionary()).setIcon("lucide-folder-tree").onClick(function () {
                u.session.addWordToSpellCheckerDictionary(d.misspelledWord);
                u.replaceMisspelling(d.misspelledWord);
              });
            });
          }
          return [3, 3];
        case 2:
          p = !0;
          P.label = 3;
        case 3:
          if (k = r.getClickableTokenAt(o), !t && function (e) {
            var t = e.targetNode;
            return !(!t || !t.instanceOf(Element)) && t.hasClass("cm-line");
          }(e) && (p = !0, k = null), k) {
            "internal-link" !== k.type && "external-link" !== k.type || a.addItem(function (e) {
              return e.setSection("selection").setTitle(i18nProxy.editor.menu.editLink()).setIcon("lucide-text-cursor-input").onClick(function () {
                r.focus();
                r.setSelection(k.start, k.end);
              });
            });
            "internal-link" === k.type ? i.workspace.handleLinkContextMenu(a, k.text, this.path) : "external-link" === k.type || "external-ref-link" === k.type ? (C = this.getClickableTokenHref(k)) && i.workspace.handleExternalLinkContextMenu(a, C) : "tag" === k.type ? a.addItem(function (e) {
              return e.setSection("selection").setTitle(i18nProxy.editor.menu.editTag()).setIcon("lucide-text-cursor-input").onClick(function () {
                r.focus();
                r.setSelection(shiftPosition(k.start, 1), k.end);
              });
            }) : "footref" === k.type && this.file && (E = i.metadataCache.getFileCache(this.file), (S = null === (D = null == E ? void 0 : E.footnotes) || void 0 === D ? void 0 : D.find(function (e) {
              return e.id === k.text;
            })) && a.addItem(function (e) {
              return e.setSection("action").setTitle(i18nProxy.editor.menu.labelDeleteFootrefAndNote()).setIcon("lucide-file-signature").onClick(function () {
                A.cm.dispatch({
                  changes: [{
                    from: r.posToOffset(k.start),
                    to: r.posToOffset(k.end),
                    insert: ""
                  }, {
                    from: S.position.start.offset - 1,
                    to: S.position.end.offset,
                    insert: ""
                  }]
                });
              });
            }));
          } else if (Platform.isMobile && !t) return [2];
          return M = r.getSelection().trim(), Platform.isDesktopApp && Platform.isMacOS && M.length > 0 && a.addItem(function (e) {
            return e.setSection("title").setTitle(i18nProxy.interface.menu.lookupSelection({
              selection: truncateString(M, 25)
            })).setIcon("lucide-library").onClick(async function () {
              h.remote.getCurrentWebContents().showDefinitionForSelection();
              return;
            });
          }), Platform.isMobile || (a.addItem(function (e) {
            return e.setSection("clipboard").setTitle(i18nProxy.interface.menu.cut()).setIcon("lucide-scissors").setDisabled(!s).onClick(function () {
              return __awaiter(A, void 0, void 0, function () {
                var e;
                return __generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return h && u ? (u.cut(), [3, 3]) : [3, 1];
                    case 1:
                      return e = r.getSelection(), r.replaceSelection(""), [4, navigator.clipboard.writeText(e)];
                    case 2:
                      t.sent();
                      t.label = 3;
                    case 3:
                      return [2];
                  }
                });
              });
            });
          }), a.addItem(function (e) {
            return e.setSection("clipboard").setTitle(i18nProxy.interface.menu.copy()).setIcon("lucide-copy").setDisabled(!l).onClick(function () {
              return __awaiter(A, void 0, void 0, function () {
                var e;
                return __generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return h && u ? (u.copy(), [3, 3]) : [3, 1];
                    case 1:
                      return e = r.getSelection(), [4, navigator.clipboard.writeText(e)];
                    case 2:
                      t.sent();
                      t.label = 3;
                    case 3:
                      return [2];
                  }
                });
              });
            });
          }), a.addItem(function (e) {
            return e.setSection("clipboard").setTitle(i18nProxy.interface.menu.paste()).setIcon("lucide-clipboard-check").setDisabled(!c).onClick(function () {
              return __awaiter(A, void 0, void 0, function () {
                var e;
                return __generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return h && u ? (u.paste(), [3, 3]) : [3, 1];
                    case 1:
                      return [4, navigator.clipboard.readText()];
                    case 2:
                      e = t.sent();
                      r.replaceSelection(e);
                      t.label = 3;
                    case 3:
                      return [2];
                  }
                });
              });
            });
          }), a.addItem(function (e) {
            return e.setSection("clipboard").setTitle(i18nProxy.interface.menu.pasteAsPlainText()).setIcon("lucide-clipboard-type").setDisabled(!c).onClick(function () {
              return __awaiter(A, void 0, void 0, function () {
                var e;
                return __generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return h && u ? (u.pasteAndMatchStyle(), [3, 3]) : [3, 1];
                    case 1:
                      return [4, navigator.clipboard.readText()];
                    case 2:
                      e = t.sent();
                      r.replaceSelection(e);
                      t.label = 3;
                    case 3:
                      return [2];
                  }
                });
              });
            });
          }), a.addItem(function (e) {
            return e.setSection("clipboard").setTitle(i18nProxy.interface.menu.selectAll()).setIcon("lucide-box-select").onClick(function () {
              var line = r.lineCount() - 1;
              r.setSelection({
                line: 0,
                ch: 0
              }, {
                line: line,
                ch: r.getLine(line).length
              });
            });
          }), a.addItem(function (e) {
            return e.setSection("selection-link").setTitle(i18nProxy.interface.formatting.insertLink()).setIcon("lucide-link").setDisabled(/\n/.test(M)).onClick(function () {
              A.editor.triggerWikilink(!1);
            });
          }), a.addItem(function (e) {
            return e.setSection("selection-link").setTitle(i18nProxy.interface.formatting.insertExternalLink()).setIcon("lucide-external-link").setDisabled(/\n/.test(M)).onClick(function () {
              A.editor.insertMarkdownLink();
            });
          }), x = getSelectionFormatting(r.cm.state, r.cm.state.selection.main), k || buildFormattingMenu(a, r, x, "selection"), a.addSections(["selection-heading", "selection-list", "selection-insert-basic", "selection-insert-advanced"]), a.addItem(function (e) {
            var t = e.setSection("selection").setTitle(i18nProxy.interface.formatting.labelParagraph()).setDisabled(r.inTableCell).setIcon("lucide-pilcrow").setSubmenu();
            t.addItem(function (e) {
              return e.setSection("selection-list").setTitle(i18nProxy.interface.formatting.toggleBulletList()).setIcon("lucide-list").onClick(function () {
                return A.editor.toggleBulletList();
              });
            }).addItem(function (e) {
              return e.setSection("selection-list").setTitle(i18nProxy.interface.formatting.toggleNumberedList()).setIcon("lucide-list-ordered").onClick(function () {
                return A.editor.toggleNumberList();
              });
            }).addItem(function (e) {
              return e.setSection("selection-list").setTitle(i18nProxy.interface.formatting.toggleChecklist()).setIcon("lucide-check-square").onClick(function () {
                return A.editor.toggleCheckList();
              });
            });
            for (var n = function (level) {
                t.addItem(function (t) {
                  return t.setSection("selection-heading").setTitle(i18nProxy.interface.formatting.setHeading({
                    level: level
                  })).setIcon("lucide-heading-" + level).setChecked(x.uniformHeading && x.headingLevel === level).onClick(function () {
                    return A.editor.setHeading(level);
                  });
                });
              }, i = 0, o = [1, 2, 3, 4, 5, 6]; i < o.length; i++) {
              n(o[i]);
            }
            t.addItem(function (e) {
              return e.setSection("selection-heading").setTitle(i18nProxy.interface.formatting.noHeading()).setIcon("lucide-text").setChecked(x.uniformHeading && 0 === x.headingLevel).onClick(function () {
                return A.editor.setHeading(0);
              });
            }).addItem(function (e) {
              return e.setSection("selection-block").setTitle(i18nProxy.interface.formatting.toggleQuote()).setIcon("lucide-quote").onClick(function () {
                return A.editor.toggleBlockquote();
              });
            });
          }).addItem(function (e) {
            e.setSection("selection").setTitle(i18nProxy.interface.formatting.labelInsert()).setDisabled(r.inTableCell).setIcon("lucide-list-plus").setSubmenu().addItem(function (e) {
              return e.setSection("selection-insert-basic").setTitle(i18nProxy.interface.formatting.insertFootnote()).setIcon("lucide-file-signature").onClick(function () {
                return A.editor.insertFootnote();
              });
            }).addItem(function (e) {
              return e.setSection("selection-insert-basic").setTitle(i18nProxy.interface.formatting.insertTable()).setIcon("lucide-table").onClick(function () {
                return A.editor.insertTable();
              });
            }).addItem(function (e) {
              return e.setSection("selection-insert-basic").setTitle(i18nProxy.interface.formatting.insertCallout()).setIcon("lucide-quote").onClick(function () {
                return A.editor.insertCallout();
              });
            }).addItem(function (e) {
              return e.setSection("selection-insert-basic").setTitle(i18nProxy.interface.formatting.insertHorizontalRule()).setIcon("lucide-minus").onClick(function () {
                return A.editor.insertHorizontalRule();
              });
            }).addItem(function (e) {
              return e.setSection("selection-insert-advanced").setTitle(i18nProxy.interface.formatting.insertCodeBlock()).setIcon("lucide-code").onClick(function () {
                return A.editor.insertCodeblock();
              });
            }).addItem(function (e) {
              return e.setSection("selection-insert-advanced").setTitle(i18nProxy.interface.formatting.insertMathBlock()).setIcon("lucide-sigma-square").onClick(function () {
                return A.editor.insertMathBlock();
              });
            });
          })), !t && Platform.isMobile && k || (i.workspace.trigger("editor-menu", a, r, this.owner), this.onMenu(a)), a.showAtMouseEvent(e), p && e.preventDefault(), [2];
      }
    });
  });
}