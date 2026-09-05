function (e, t) {
  return __awaiter(this, void 0, void 0, function () {
    var n, i, r, o, a, s, l, c, u, h, hash, d, ctime, m, g, v, y;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          n = t.path;
          return [4, (i = this.vault.adapter).stat(n)];
        case 1:
          if (r = b.sent(), !t.folder) return [3, 8];
          if (!r || "folder" !== r.type) return [3, 4];
          if ((o = this.localFiles)[n]) return [3, 3];
          for (l in a = n.toLowerCase(), s = "", o) if (o.hasOwnProperty(l) && l.toLowerCase() === a) {
            s = l;
            break;
          }
          return s ? (this.log("Detected case sensitive folder collision, renaming folder", n), [4, i.rename(s, normalizePath(n))]) : [3, 3];
        case 2:
          b.sent();
          b.label = 3;
        case 3:
          return [2];
        case 4:
          return r && "file" === r.type ? (this.log("Deleting local file", n), [4, i.remove(n)]) : [3, 6];
        case 5:
          b.sent();
          b.label = 6;
        case 6:
          this.log("Creating local folder", n);
          return [4, i.mkdir(n)];
        case 7:
          b.sent();
          return [2];
        case 8:
          return r && "folder" === r.type ? [4, i.list(n)] : [3, 13];
        case 9:
          return 0 !== (c = b.sent()).files.length || 0 !== c.folders.length ? [3, 11] : (this.log("Deleting local folder", n), [4, i.rmdir(n, !0)]);
        case 10:
          b.sent();
          return [2];
        case 11:
          this.log("Renaming conflicted file", n);
          return [4, i.rename(n, n + " (Conflicted copy)")];
        case 12:
          b.sent();
          return [2];
        case 13:
          this.log("Downloading file", n);
          return [4, e.pull(t.uid)];
        case 14:
          if (!(u = b.sent())) throw new Error("Failed to download file, no data.");
          if (n === this.vault.configDir + "/core-plugins.json") try {
            if ((h = this.patchCorePluginsFile(u)) !== u) {
              u = h;
              this.log("Fixing core plugins list", n);
            }
          } catch (e) {
            this.log("File is corrupt, ignoring", n);
            return [2];
          }
          return [4, computeSha256Hex(u)];
        case 15:
          hash = b.sent();
          return [4, resolvePromise(i.promise)];
        case 16:
          b.sent();
          return [4, i.stat(n)];
        case 17:
          if ((d = b.sent()) && (!r || d.mtime !== r.mtime || d.size !== r.size)) throw new Error("Download cancelled because file was changed locally. Will try again soon.");
          return r ? (ctime = void 0, t.ctime && (0 === r.ctime || t.ctime < r.ctime) && (ctime = t.ctime), (m = this.vault.getAbstractFileByPath(n)) instanceof TFile ? m.saving ? [4, resolvePromise(i.promise)] : [3, 19] : [3, 21]) : [3, 24];
        case 18:
          b.sent();
          b.label = 19;
        case 19:
          return [4, this.vault.modifyBinary(m, u, {
            ctime: ctime,
            mtime: t.mtime
          })];
        case 20:
          b.sent();
          return [3, 23];
        case 21:
          return [4, i.writeBinary(n, u, {
            ctime: ctime,
            mtime: t.mtime
          })];
        case 22:
          b.sent();
          b.label = 23;
        case 23:
          return [3, 30];
        case 24:
          g = getDirectoryName(n);
          return (v = "/" !== g && "" !== g) ? [4, i.exists(g)] : [3, 26];
        case 25:
          v = !b.sent();
          b.label = 26;
        case 26:
          return v ? [4, i.mkdir(g)] : [3, 28];
        case 27:
          b.sent();
          b.label = 28;
        case 28:
          return [4, i.writeBinary(n, u, {
            ctime: t.ctime,
            mtime: t.mtime
          })];
        case 29:
          b.sent();
          b.label = 30;
        case 30:
          if (y = this.localFiles[n]) {
            y.hash = hash;
            y.synchash = hash;
          }
          this.log("Downloading complete", n);
          b.label = 31;
        case 31:
          return [2];
      }
    });
  });
}