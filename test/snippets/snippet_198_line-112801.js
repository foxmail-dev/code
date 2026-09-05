function () {
  return __awaiter(this, void 0, Promise, function () {
    var e,
      t,
      n,
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
      y,
      w,
      k,
      C,
      E,
      S,
      M,
      x,
      T,
      D,
      A,
      P,
      L,
      I,
      O,
      F,
      size,
      R,
      B,
      V,
      H,
      z,
      q,
      W,
      U,
      _,
      j,
      path,
      K,
      ctime,
      mtime,
      X,
      synchash,
      $,
      J = this;
    return __generator(this, function (ee) {
      switch (ee.label) {
        case 0:
          if (this.pause) return [2, !1];
          if (!this.backoff.isReady()) {
            this.log("Waiting to connect to server");
            return [2, !1];
          }
          if (!account.token) throw new Error("Not logged in");
          return [4, this.getServer()];
        case 1:
          if (!(e = ee.sent())) return [2, !1];
          if (this.pause || !this.vaultId) return [2, !1];
          t = this.localFiles;
          n = this.serverFiles;
          i = this.newServerFiles;
          r = this.vault;
          o = r.adapter;
          a = Date.now();
          s = 0;
          this.setStatus("Indexing...");
          l = r.configDir;
          c = l + "/";
          ee.label = 2;
        case 2:
          if (ee.trys.push([2, 24,, 25]), u = {}, h = this.scanSpecialFileQueue, !this.scanSpecialFiles) return [3, 20];
          for (path in this.scanSpecialFiles = !1, this.setStatus("Initializing..."), h = this.scanSpecialFileQueue = [], t) if (t.hasOwnProperty(path) && path.startsWith(".")) {
            u[path] = t[path];
            delete t[path];
          }
          return [4, o.exists(l)];
        case 3:
          return ee.sent() ? (h.push(c + "config"), [4, o.list(l)]) : [3, 20];
        case 4:
          for (p = ee.sent(), d = 0, f = p.files; d < f.length; d++) "json" === getFileExtension(I = f[d]) && h.push(I);
          return [4, o.exists(c + "themes")];
        case 5:
          return ee.sent() ? [4, o.list(c + "themes")] : [3, 10];
        case 6:
          m = ee.sent();
          g = 0;
          v = m.folders;
          ee.label = 7;
        case 7:
          return g < v.length ? (D = v[g], [4, o.list(D)]) : [3, 10];
        case 8:
          for (y = ee.sent(), w = 0, k = y.files; w < k.length; w++) {
            I = k[w];
            "manifest.json" !== (O = getFileName(I)) && "theme.css" !== O || h.push(I);
          }
          ee.label = 9;
        case 9:
          g++;
          return [3, 7];
        case 10:
          return [4, o.exists(c + "snippets")];
        case 11:
          return ee.sent() ? [4, o.list(c + "snippets")] : [3, 13];
        case 12:
          for (C = ee.sent(), E = 0, S = C.files; E < S.length; E++) "css" === getFileExtension(I = S[E]) && h.push(I);
          ee.label = 13;
        case 13:
          return [4, o.exists(c + "plugins")];
        case 14:
          return ee.sent() ? [4, o.list(c + "plugins")] : [3, 19];
        case 15:
          M = ee.sent();
          x = 0;
          T = M.folders;
          ee.label = 16;
        case 16:
          return x < T.length ? (D = T[x], [4, o.list(D)]) : [3, 19];
        case 17:
          for (A = ee.sent(), P = 0, L = A.files; P < L.length; P++) {
            I = L[P];
            isPluginSpecialFile(O = getFileName(I)) && h.push(I);
          }
          ee.label = 18;
        case 18:
          x++;
          return [3, 16];
        case 19:
          this.forceSaveData();
          ee.label = 20;
        case 20:
          return h.length > 0 ? (path = h.pop(), [4, o.exists(path)]) : [3, 23];
        case 21:
          return ee.sent() ? [4, o.stat(path)] : (delete t[path], [3, 20]);
        case 22:
          return (F = ee.sent()) && "file" === F.type ? ((j = t[path]) || (j = u.hasOwnProperty(path) ? t[path] = u[path] : t[path] = {
            path: path,
            previouspath: "",
            ctime: 0,
            mtime: 0,
            size: 0,
            folder: !1,
            hash: "",
            synchash: "",
            synctime: 0
          }), mtime = Math.ceil(F.mtime), ctime = Math.ceil(F.ctime), size = F.size, j.mtime && j.mtime === mtime && j.size === F.size || (j.hash = ""), j.mtime = mtime, j.ctime = ctime, j.size = size, [3, 20]) : (delete t[path], [3, 20]);
        case 23:
          return [3, 25];
        case 24:
          R = ee.sent();
          console.error("Failed to scan config files", R);
          return [3, 25];
        case 25:
          if (!(i.length > 0)) return [3, 29];
          B = function (l) {
            var u, syncingPath, p, d, f, m, g, v, y, w, k, C, E, S, M, x, T, D, A, P, L, I, O, F, N, R, B, H, z, q, W, U, _, j, G, K;
            return __generator(this, function (b) {
              switch (b.label) {
                case 0:
                  if (u = i[l], syncingPath = u.path, p = n[syncingPath], d = t[syncingPath], f = function (e, t) {
                    e || J.log("Accepted", syncingPath);
                    d && (d.synctime = Date.now());
                    t || (n[syncingPath] = u);
                    i.splice(l, 1);
                    J.setDirty();
                    return !0;
                  }, !V.allowSyncFile(syncingPath, u.folder)) return [2, {
                    value: f(!0)
                  }];
                  if (!isValidFileName(syncingPath) || Platform.isAndroidApp && /[*?<>"]/.test(syncingPath)) {
                    V.log("Ignoring remote file name with illegal characters", syncingPath, !0);
                    new Notice('Sync: Unable to download file with illegal name "'.concat(syncingPath, '"'));
                    return [2, {
                      value: f(!0, !0)
                    }];
                  }
                  if (normalizePath(syncingPath).split("/").contains("..")) return [2, {
                    value: f(!0)
                  }];
                  if (!V.canSyncPath(a, syncingPath)) {
                    s++;
                    return [2, "continue"];
                  }
                  for (V.syncingPath = syncingPath, m = l + 1; m < i.length; m++) if (i[m].path === syncingPath) {
                    V.log("Skipped", syncingPath);
                    return [2, {
                      value: f(!0, !0)
                    }];
                  }
                  if (d) return [3, 8];
                  if (u.deleted) return [2, {
                    value: f(!0)
                  }];
                  if (V.setStatus("Downloading " + syncingPath), !Platform.isAndroidApp) return [3, 5];
                  b.label = 1;
                case 1:
                  b.trys.push([1, 3,, 4]);
                  return [4, V.syncFileDown(e, u)];
                case 2:
                  b.sent();
                  return [3, 4];
                case 3:
                  if ((g = b.sent()) && "string" == typeof g.message && g.message.contains("FILE_NOTCREATED")) {
                    V.log("Ignoring remote file name with illegal characters", syncingPath, !0);
                    new Notice('Sync: Unable to download file with illegal name "'.concat(syncingPath, '"'));
                    return [2, {
                      value: f(!0, !0)
                    }];
                  }
                  throw g;
                case 4:
                  return [3, 7];
                case 5:
                  return [4, V.syncFileDown(e, u)];
                case 6:
                  b.sent();
                  b.label = 7;
                case 7:
                  return [2, {
                    value: f()
                  }];
                case 8:
                  return d.folder || d.hash ? [3, 10] : (V.getHashFromMetadataCache(d), d.hash ? [3, 10] : (V.setStatus("Computing hash " + syncingPath), [4, V.updateHash(d)]));
                case 9:
                  b.sent();
                  b.label = 10;
                case 10:
                  if (!d.folder || !u.folder) return [3, 15];
                  if (!u.deleted) return [3, 14];
                  if (!(E = r.getAbstractFileByPath(syncingPath))) return [3, 14];
                  if (E instanceof TFolder && E.children.length > 0) return [2, {
                    value: f(!0)
                  }];
                  V.setStatus("Deleting " + syncingPath);
                  V.log("Deleting", syncingPath);
                  b.label = 11;
                case 11:
                  b.trys.push([11, 13,, 14]);
                  return [4, r.delete(E, !0)];
                case 12:
                  b.sent();
                  return [3, 14];
                case 13:
                  v = b.sent();
                  y = (v ? v.message : "") || "Failed to delete folder";
                  V.log(y, syncingPath, !0);
                  return [3, 14];
                case 14:
                  return [2, {
                    value: f(!0)
                  }];
                case 15:
                  return d.folder || u.folder || d.hash !== u.hash ? p && (d.folder && p.folder || d.hash === p.hash) ? u.deleted ? (V.setStatus("Deleting " + syncingPath), (E = r.getAbstractFileByPath(syncingPath)) ? (V.log("Deleting", syncingPath), [4, r.delete(E)]) : [3, 17]) : [3, 20] : [3, 22] : [2, {
                    value: f(!0)
                  }];
                case 16:
                  b.sent();
                  return [3, 19];
                case 17:
                  V.log("Deleting", syncingPath);
                  return [4, o.remove(syncingPath)];
                case 18:
                  b.sent();
                  b.label = 19;
                case 19:
                  return [2, {
                    value: f()
                  }];
                case 20:
                  V.setStatus("Downloading " + syncingPath);
                  return [4, V.syncFileDown(e, u)];
                case 21:
                  b.sent();
                  return [2, {
                    value: f()
                  }];
                case 22:
                  return d.folder || !u.folder ? [3, 24] : (E = r.getAbstractFileByPath(syncingPath)) instanceof TFile ? (w = E.extension, k = w ? syncingPath.substr(syncingPath.length - w.length - 1) : "", C = syncingPath.substr(0, syncingPath.length - k.length), F = C + " (Conflicted copy)" + k, V.setStatus("Renaming conflicted file " + syncingPath), V.log("Renaming conflicted file", syncingPath), [4, r.rename(E, F)]) : [3, 24];
                case 23:
                  b.sent();
                  V.setDirty();
                  return [2, {
                    value: !0
                  }];
                case 24:
                  return u.initial && u.mtime > d.mtime ? (V.setStatus("Downloading " + syncingPath), [4, V.syncFileDown(e, u)]) : [3, 26];
                case 25:
                  b.sent();
                  return [2, {
                    value: f()
                  }];
                case 26:
                  if (u.initial || d.folder || u.folder || u.deleted || "md" !== getFileExtension(syncingPath) || u.hash === d.synchash) return [3, 53];
                  if (V.setStatus("Merging " + syncingPath), V.logMerge("Merging conflicted file", syncingPath), !((E = r.getAbstractFileByPath(syncingPath)) instanceof TFile)) {
                    V.logMerge("Merge failed.", syncingPath, !0);
                    return [2, {
                      value: f(!0)
                    }];
                  }
                  S = void 0;
                  b.label = 27;
                case 27:
                  b.trys.push([27, 29,, 30]);
                  return [4, r.read(E)];
                case 28:
                  S = b.sent();
                  return [3, 30];
                case 29:
                  M = b.sent();
                  V.logMerge("Merge failed. " + M.toString(), syncingPath, !0);
                  return [2, {
                    value: f(!0)
                  }];
                case 30:
                  return S ? [3, 32] : [4, V.syncFileDown(e, u)];
                case 31:
                  b.sent();
                  return [2, {
                    value: f()
                  }];
                case 32:
                  if (x = "", !p || p.deleted) return [3, 36];
                  b.label = 33;
                case 33:
                  b.trys.push([33, 35,, 36]);
                  T = arrayBufferToString;
                  return [4, e.pull(p.uid)];
                case 34:
                  x = T.apply(void 0, [b.sent()]);
                  return [3, 36];
                case 35:
                  D = b.sent();
                  V.logMerge("Merge failed. " + D.toString(), syncingPath, !0);
                  return [2, {
                    value: f(!0)
                  }];
                case 36:
                  A = void 0;
                  b.label = 37;
                case 37:
                  b.trys.push([37, 39,, 40]);
                  P = arrayBufferToString;
                  return [4, e.pull(u.uid)];
                case 38:
                  A = P.apply(void 0, [b.sent()]);
                  return [3, 40];
                case 39:
                  L = b.sent();
                  V.logMerge("Merge failed. " + L.toString(), syncingPath, !0);
                  return [2, {
                    value: f(!0)
                  }];
                case 40:
                  if (x === A || S === A) return [2, {
                    value: f()
                  }];
                  if (!A) return [2, {
                    value: f()
                  }];
                  if ("conflict" !== V.conflictAction) return [3, 46];
                  I = window.moment().format("YYYYMMDDHHmm");
                  O = function (e, t) {
                    void 0 === t && (t = "_");
                    var n = e.trim();
                    if (n && (n = e.replace(forbiddenCharsRegex, t), 1 === t.length)) {
                      var i = escapeRegExp(t),
                        r = new RegExp("".concat(i, "{2,}"), "g");
                      n = n.replace(r, t);
                    }
                    return n;
                  }(V.deviceName || V.getDefaultDeviceName());
                  F = V.vault.getAvailablePath("".concat(getPathWithoutExtension(syncingPath), " (Conflicted copy ").concat(O, " ").concat(I, ")"), getFileExtension(syncingPath));
                  b.label = 41;
                case 41:
                  b.trys.push([41, 44,, 45]);
                  return [4, r.create(F, S, {
                    ctime: E.stat.ctime,
                    mtime: E.stat.mtime
                  })];
                case 42:
                  b.sent();
                  return [4, r.modify(E, A, {
                    ctime: u.ctime,
                    mtime: u.mtime
                  })];
                case 43:
                  b.sent();
                  V.logMerge("Conflicted copy stored", syncingPath);
                  return [3, 45];
                case 44:
                  b.sent();
                  return [2, {
                    value: f()
                  }];
                case 45:
                  return [2, {
                    value: f()
                  }];
                case 46:
                  return x ? [3, 51] : Math.abs(Date.now() - d.ctime) < 18e4 ? (V.app.fileManager.storeTextFileBackup(syncingPath, S), V.setStatus("Downloading " + syncingPath), [4, r.modify(E, A, {
                    ctime: u.ctime,
                    mtime: u.mtime
                  })]) : [3, 48];
                case 47:
                  b.sent();
                  return [2, {
                    value: f()
                  }];
                case 48:
                  return u.mtime > d.mtime ? (V.app.fileManager.storeTextFileBackup(syncingPath, S), V.setStatus("Downloading " + syncingPath), [4, r.modify(E, A, {
                    ctime: u.ctime,
                    mtime: u.mtime
                  })]) : [3, 50];
                case 49:
                  b.sent();
                  return [2, {
                    value: f()
                  }];
                case 50:
                  return [2, {
                    value: f()
                  }];
                case 51:
                  V.app.fileManager.storeTextFileBackup(syncingPath, S);
                  N = applyPatch(x, S, A);
                  return [4, r.modify(E, N)];
                case 52:
                  b.sent();
                  V.logMerge("Merge successful", syncingPath);
                  return [2, {
                    value: f()
                  }];
                case 53:
                  if (u.folder || u.deleted || !(u.size > 0) || !syncingPath.startsWith(c)) return [3, 62];
                  if ("json" !== getFileExtension(syncingPath)) return [3, 60];
                  b.label = 54;
                case 54:
                  b.trys.push([54, 59,, 60]);
                  V.setStatus("Merging " + syncingPath);
                  V.log("Merging conflicted file", syncingPath);
                  H = (B = JSON).parse;
                  return [4, o.read(syncingPath)];
                case 55:
                  return !(R = H.apply(B, [b.sent()])) || Array.isArray(R) || "object" != typeof R ? [3, 58] : (W = (q = JSON).parse, U = arrayBufferToString, [4, e.pull(u.uid)]);
                case 56:
                  if (!(z = W.apply(q, [U.apply(void 0, [b.sent()])])) || Array.isArray(z) || "object" != typeof z) return [3, 58];
                  for (_ in z) z.hasOwnProperty(_) && (R[_] = z[_]);
                  j = stringToArrayBuffer(JSON.stringify(R, void 0, 2));
                  if (syncingPath === V.vault.configDir + "/core-plugins.json" && (G = V.patchCorePluginsFile(j)) !== j) {
                    j = G;
                    V.log("Fixing core plugins list", syncingPath);
                  }
                  return [4, o.writeBinary(syncingPath, j)];
                case 57:
                  b.sent();
                  V.log("Merge successful", syncingPath);
                  return [2, {
                    value: f(!0)
                  }];
                case 58:
                  return [3, 60];
                case 59:
                  K = b.sent();
                  V.log("Merge failed. " + K.toString(), syncingPath, !0);
                  return [3, 60];
                case 60:
                  return [4, V.syncFileDown(e, u)];
                case 61:
                  b.sent();
                  return [2, {
                    value: f()
                  }];
                case 62:
                  V.log("Rejected server change", syncingPath);
                  return [2, {
                    value: f(!0)
                  }];
              }
            });
          };
          V = this;
          H = 0;
          ee.label = 26;
        case 26:
          return H < i.length ? [5, B(H)] : [3, 29];
        case 27:
          if ("object" == typeof (z = ee.sent())) return [2, z.value];
          ee.label = 28;
        case 28:
          H++;
          return [3, 26];
        case 29:
          if (!this.ready) return [2, !1];
          for (path in q = null, W = null, n) if (n.hasOwnProperty(path) && (K = n[path], !t.hasOwnProperty(path))) {
            if (K.deleted) {
              delete n[path];
              continue;
            }
            if (!this.allowSyncFile(path, K.folder)) continue;
            if (K.folder) {
              (!W || K.path.length > W.path.length) && (W = K);
            } else {
              (!q || K.path.length > q.path.length) && (q = K);
            }
          }
          return q ? (path = q.path, this.setStatus("Deleting remote file " + path), this.log("Deleting remote file", path), this.syncingPath = path, [4, e.push(path, null, !1, !0, 0, 0, "", null)]) : [3, 31];
        case 30:
          ee.sent();
          q.deleted = !0;
          this.setDirty();
          return [2, !0];
        case 31:
          return W ? (path = W.path, this.setStatus("Deleting remote folder " + path), this.log("Deleting remote folder", path), this.syncingPath = path, [4, e.push(path, null, !0, !0, 0, 0, "", null)]) : [3, 33];
        case 32:
          ee.sent();
          W.deleted = !0;
          this.setDirty();
          return [2, !0];
        case 33:
          for (path in U = null, _ = null, t) if (t.hasOwnProperty(path) && (j = t[path], (!(K = n[path]) || K.deleted || j.folder !== K.folder || j.ctime !== K.ctime || j.mtime !== K.mtime || j.size !== K.size || !j.hash || j.hash !== K.hash) && this.allowSyncFile(path, j.folder))) if (this.canSyncPath(a, path)) {
            if (SHOULD_FIX_CTIME && !j.folder && K && K.ctime && (0 === j.ctime || j.ctime > K.ctime) && !K.folder && !K.deleted && (j.ctime = K.ctime), j.folder || !(j.size > e.perFileMax)) if (K && !K.deleted) {
              if (!U) if (j.folder) {
                if (!this.canSyncLocalFile(a, j)) {
                  s++;
                  continue;
                }
                K.folder || (!U || j.path.length < U.path.length) && (U = j);
              } else if (K.folder) {
                if (!this.canSyncLocalFile(a, j)) {
                  s++;
                  continue;
                }
                W = K;
              } else if (j.hash || this.getHashFromMetadataCache(j), !j.hash || j.hash !== K.hash) {
                if (!this.canSyncLocalFile(a, j)) {
                  s++;
                  continue;
                }
                (!_ || j.size < _.size) && (_ = j);
              }
            } else {
              if (!this.canSyncLocalFile(a, j)) {
                s++;
                continue;
              }
              if (j.folder) {
                (!U || j.path.length < U.path.length) && (U = j);
              } else {
                (!_ || j.size < _.size) && (_ = j);
              }
            }
          } else s++;
          return U ? (path = U.path, this.syncingPath = path, this.setStatus("Uploading " + path), this.log("Uploading", path), [4, e.push(path, U.previouspath, !0, !1, 0, 0, "", null)]) : [3, 35];
        case 34:
          ee.sent();
          if (n.hasOwnProperty(path)) {
            n[path].deleted && (n[path].deleted = !1);
          } else {
            n[path] = {
              uid: 0,
              path: path,
              size: 0,
              hash: "",
              ctime: 0,
              mtime: 0,
              folder: !0,
              deleted: !1,
              device: this.deviceName
            };
          }
          U.previouspath = "";
          U.synctime = Date.now();
          this.setDirty();
          return [2, !0];
        case 35:
          return _ ? (path = _.path, this.syncingPath = path, this.setStatus("Uploading " + path), K = n[path], !_.hash && (this.getHashFromMetadataCache(_), _.hash && K && !K.deleted && K.hash === _.hash) ? (this.setStatus("Comparing " + path), this.setDirty(), [2, !0]) : (ctime = _.ctime, mtime = _.mtime, [4, o.readBinary(path)])) : [3, 39];
        case 36:
          X = ee.sent();
          $ = _;
          return [4, computeSha256Hex(X)];
        case 37:
          synchash = $.hash = ee.sent();
          return K && !K.deleted && K.hash === _.hash ? (this.setStatus("Comparing " + path), this.setDirty(), [2, !0]) : (this.log("Uploading file", path), [4, e.push(path, _.previouspath, !1, !1, ctime, mtime, synchash, X)]);
        case 38:
          ee.sent();
          _.synchash = synchash;
          this.log("Upload complete", path);
          _.previouspath = "";
          _.synctime = Date.now();
          this.setDirty();
          return [2, !0];
        case 39:
          return 0 === s ? (this.log("Fully synced"), this.setStatus("Fully synced"), this.fileRetry = {}, [2, !1]) : (this.setStatus("Indexing..."), [2, !0]);
      }
    });
  });
}