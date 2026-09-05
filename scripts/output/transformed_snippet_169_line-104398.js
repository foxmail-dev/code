function (e) {
  return __awaiter(this, void 0, void 0, function () {
    var oldKey, newKey, i, r, o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          return e && e === this.propertyBeingRenamed ? (this.exitRename(), oldKey = e.property.name, newKey = e.titleEl.getText().trim(), oldKey === newKey ? (e.updateTitle(), [2]) : "" === newKey ? (e.updateTitle(), e.displayError(i18nProxy.properties.msgEmptyPropertyName()), [2]) : (i = this.app.metadataCache.getAllPropertyInfos(), (r = i.hasOwnProperty(newKey)) ? [4, new ConfirmDialog(this.app, i18nProxy.dialogue.buttonSave()).setTitle(i18nProxy.plugins.properties.msgMergePropertiesWarning({
            oldKey: oldKey,
            newKey: newKey
          })).setContent(i18nProxy.plugins.properties.msgMergePropertiesWarningDesc({
            oldKey: oldKey
          })).prompt()] : [3, 2])) : [2];
        case 1:
          if (!a.sent()) {
            e.updateTitle();
            return [2];
          }
          a.label = 2;
        case 2:
          a.trys.push([2, 4,, 5]);
          return [4, this.app.fileManager.renameProperty(oldKey, newKey)];
        case 3:
          a.sent();
          o = this.doms[newKey];
          this.tree.infinityScroll.scrollIntoView(o, 4);
          r && flashElement(o.selfEl);
          return [3, 5];
        case 4:
          a.sent();
          e.updateTitle();
          return [3, 5];
        case 5:
          return [2];
      }
    });
  });
}