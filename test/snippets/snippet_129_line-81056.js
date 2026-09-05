function () {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, i, r, o, a, s, l, repo, u, manifest, version, count;
    return __generator(this, function (f) {
      switch (f.label) {
        case 0:
          this.updates = {};
          e = this.updates;
          f.label = 1;
        case 1:
          f.trys.push([1, 3,, 4]);
          return [4, fetchCommunityPluginsThrottled()];
        case 2:
          t = f.sent();
          return [3, 4];
        case 3:
          n = f.sent();
          console.error(n);
          new Notice(i18nProxy.setting.thirdPartyPlugin.msgFailedLoadPlugins());
          return [2];
        case 4:
          i = 0;
          r = t;
          f.label = 5;
        case 5:
          if (!(i < r.length)) return [3, 12];
          if (o = r[i], a = o.id, !this.manifests.hasOwnProperty(a)) return [3, 11];
          if (s = this.manifests[a], !(l = s.version)) return [3, 11];
          repo = o.repo;
          u = getRawGithubUrl(repo, PLUGIN_MANIFEST_JSON);
          manifest = null;
          f.label = 6;
        case 6:
          f.trys.push([6, 8,, 9]);
          return [4, requestLazy(u).json];
        case 7:
          return (manifest = f.sent()) && manifest.id && manifest.id === a ? [3, 9] : [3, 11];
        case 8:
          f.sent();
          return [3, 11];
        case 9:
          return [4, getLatestCompatibleVersion(repo, manifest)];
        case 10:
          (version = f.sent()) && compareVersion(l, version) && (e[a] = {
            repo: repo,
            version: version,
            manifest: manifest
          });
          f.label = 11;
        case 11:
          i++;
          return [3, 5];
        case 12:
          count = Object.keys(e).length;
          new Notice(0 === count ? i18nProxy.setting.thirdPartyPlugin.msgNoUpdatesFound() : i18nProxy.setting.thirdPartyPlugin.msgUpdatesFound({
            count: count
          }));
          return [2];
      }
    });
  });
}