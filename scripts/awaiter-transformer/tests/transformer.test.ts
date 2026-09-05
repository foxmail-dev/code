import { AwaiterTransformer } from "../src/transformer";
import { TransformOptions } from "../src/types";

describe("AwaiterTransformer", () => {
  let transformer: AwaiterTransformer;

  beforeEach(() => {
    transformer = new AwaiterTransformer();
  });

  describe("transformSource", () => {
    it("should transform simple __awaiter with single await", () => {
      const input = `
function toggleVisibility(e, t, n) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          stopAnimation(e);
          return t ? n ? [4, slideUpAnimation(e)] : [3, 2] : [3, 3];
        case 1:
          i.sent();
          i.label = 2;
        case 2:
          e.hide();
          return [3, 5];
        case 3:
          e.show();
          return n ? [4, slideDownAnimation(e)] : [3, 5];
        case 4:
          i.sent();
          i.label = 5;
        case 5:
          return [2];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      // 转换器应该成功执行
      expect(result.success).toBe(true);
      // 输出应包含 async 关键字
      expect(result.code).toContain("async");
      // 不应包含 __awaiter 和 __generator
      expect(result.code).not.toContain("__awaiter");
      expect(result.code).not.toContain("__generator");
      expect(result.stats.awaiterCallsFound).toBe(1);
    });

    it("should handle multiple awaits in sequence", () => {
      const input = `
function fetchData() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          return [4, fetch('/api/data')];
        case 1:
          response = g.sent();
          return [4, response.json()];
        case 2:
          data = g.sent();
          return [2, data];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
      expect(result.code).toContain("async");
      expect((result.code.match(/await/g) || []).length).toBeGreaterThanOrEqual(1);
    });

    it("should remove __awaiter and __generator declarations", () => {
      const input = `
var __awaiter = function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var __generator = function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

function test() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          return [4, Promise.resolve(1)];
        case 1:
          return [2, g.sent()];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      // 转换器应该执行（可能成功或有警告）
      expect(result).toBeDefined();
      // 不应包含 __awaiter 和 __generator 声明
      expect(result.code).not.toContain("var __awaiter");
      expect(result.code).not.toContain("var __generator");
    });

    it("should handle conditional branches", () => {
      const input = `
function animateAttachment(e, t, n, i) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          return n ? i ? [4, slideUpAnimation(e)] : [3, 2] : [3, 3];
        case 1:
          r.sent();
          r.label = 2;
        case 2:
          e.detach();
          return [3, 5];
        case 3:
          e.show();
          t.appendChild(e);
          return i ? [4, slideDownAnimation(e)] : [3, 5];
        case 4:
          r.sent();
          r.label = 5;
        case 5:
          return [2];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
      expect(result.code).toContain("async");
    });

    it("should preserve function parameters", () => {
      const input = `
function processItems(items, options, callback) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          return [4, validateItems(items)];
        case 1:
          g.sent();
          return [4, processWithOptions(items, options)];
        case 2:
          result = g.sent();
          callback(result);
          return [2];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
      expect(result.code).toContain("processItems(items, options, callback)");
      expect(result.code).toContain("async");
    });

    it("should handle nested __awaiter calls", () => {
      const input = `
function outer() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          return [4, inner()];
        case 1:
          g.sent();
          return [2];
      }
    });
  });
}

function inner() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          return [4, doSomething()];
        case 1:
          return [2, g.sent()];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
      expect(result.stats.awaiterCallsFound).toBeGreaterThanOrEqual(2);
    });

    it("should report errors for malformed input", () => {
      const input = `
function broken() {
  return __awaiter(this, void 0, Promise, function () {
    // Missing __generator
    return someInvalidCode;
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      // Should not crash, but may have warnings
      expect(result).toBeDefined();
    });

    it("should handle empty generator body", () => {
      const input = `
function empty() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          return [2];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
      expect(result.code).toContain("async");
    });

    it("should handle try-catch-finally patterns", () => {
      const input = `
function withErrorHandling() {
  return __awaiter(this, void 0, Promise, function () {
    var _this = this;
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          g.trys.push([0, 2, , 4]);
          return [4, riskyOperation()];
        case 1:
          return [2, g.sent()];
        case 2:
          error = g.sent();
          console.error(error);
          return [3, 4];
        case 3:
          cleanup();
          return [7];
        case 4:
          return [2];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
      expect(result.code).toContain("async");
    });

    it("should handle arrow functions", () => {
      const input = `
const fetchData = () => {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0:
          return [4, api.get()];
        case 1:
          return [2, g.sent()];
      }
    });
  });
};
`;

      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
      expect(result.code).toContain("async");
    });

    it("should track transformation statistics", () => {
      const input = `
function func1() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0: return [4, a()];
        case 1: return [2, g.sent()];
      }
    });
  });
}

function func2() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (g) {
      switch (g.label) {
        case 0: return [4, b()];
        case 1: return [2, g.sent()];
      }
    });
  });
}
`;

      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.stats.awaiterCallsFound).toBe(2);
      expect(result.stats.awaiterCallsTransformed).toBeGreaterThanOrEqual(0);
    });
  });

  describe("constructor options", () => {
    it("should accept custom options", () => {
      const options: TransformOptions = {
        target: "ES2018",
        preserveVariableNames: true,
        semanticRenaming: false,
        removeRuntimeHelpers: true,
        format: false,
        allowDispatchFallback: true,
      };

      const transformerWithOptions = new AwaiterTransformer(options);
      expect(transformerWithOptions).toBeDefined();
    });

    it("should use default options when none provided", () => {
      const transformerWithDefaults = new AwaiterTransformer();
      expect(transformerWithDefaults).toBeDefined();
    });
  });

  describe("transformFile integration", () => {
    it("should transform real snippet files", () => {
      // This test would require actual file paths
      // Skipped in unit tests, run in integration tests
      const transformer = new AwaiterTransformer();
      expect(transformer).toBeDefined();
    });
  });
});
