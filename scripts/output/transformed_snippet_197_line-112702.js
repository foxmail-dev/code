function () {
  return __awaiter(this, void 0, Promise, function () {
    var e,
      t,
      n,
      i,
      r,
      o = this;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          if (!(e = this.server) || e.isConnected() || e.isConnecting() || (e.disconnect(), e = this.server = null, this.backoff.fail()), e) return [3, 5];
          if (this.encryptionProvider || !this.key) return [3, 4];
          a.label = 1;
        case 1:
          a.trys.push([1, 3,, 4]);
          t = this;
          return [4, initEncryption(this.encryptionVersion, this.key, this.salt)];
        case 2:
          t.encryptionProvider = a.sent();
          return [3, 4];
        case 3:
          n = a.sent();
          console.error(n);
          this.log("Unable to decrypt vault", null, !0);
          this.error = !0;
          this.backoff.fail();
          return [2, null];
        case 4:
          if (!(this.host && account.token && this.vaultId && this.encryptionProvider)) return [2, null];
          e = this.server = new SyncWebSocketClient(this.encryptionProvider);
          a.label = 5;
        case 5:
          if (e.hasConnection()) return [3, 12];
          this.setStatus("Connecting to server");
          this.log("Connecting to server");
          this.ready = !1;
          a.label = 6;
        case 6:
          a.trys.push([6, 8,, 12]);
          i = this.deviceName || this.getDefaultDeviceName();
          return [4, e.connect(this.getHost(), account.token, this.vaultId, this.version, this.initial, i, function (version) {
            o.log("Connection successful. Detecting changes...");
            o.ready = !0;
            o.initial && (o.initial = !1);
            o.version < version && (o.version = version);
            o.dirty = !0;
            o.requestSaveData();
            o.requestSync();
          }, this.onPushedFile.bind(this))];
        case 7:
          a.sent();
          this.backoff.success();
          return [3, 12];
        case 8:
          return (r = a.sent()).message && r.message.contains("Your subscription to Obsidian Sync has expired") ? (new Notice(r.message), [3, 11]) : [3, 9];
        case 9:
          return r.message && r.message.contains("Vault not found") ? (new Notice(i18nProxy.plugins.sync.msgDisconnectFromDeletedVault()), [4, this.unsetup()]) : [3, 11];
        case 10:
          a.sent();
          a.label = 11;
        case 11:
          console.error(r);
          this.log(r.message, null, !0);
          e.disconnect();
          e = this.server = null;
          this.error = !0;
          this.backoff.fail();
          return [2, null];
        case 12:
          this.userId = e.userId;
          return [2, e];
      }
    });
  });
}