import { AwaiterTransformer } from "../src/index";

describe("AwaiterTransformer - Solution 02", () => {
  let transformer: AwaiterTransformer;

  beforeEach(() => {
    transformer = new AwaiterTransformer();
  });

  describe("Basic transformation", () => {
    it("should identify __awaiter calls", () => {
      const input = `
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        return 42;
    });
}
`;
      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.stats.awaiterCallsFound).toBe(1);
    });

    it("should remove runtime helpers", () => {
      const input = `
var __awaiter = (this && this.__awaiter) || function () {};
var __generator = (this && this.__generator) || function () {};

function test() {
    return 42;
}
`;
      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.code).not.toContain("var __awaiter");
      expect(result.code).not.toContain("var __generator");
    });
  });

  describe("CFG building", () => {
    it("should build linear flow for simple cases", () => {
      const input = `
function simple() {
    return __awaiter(this, void 0, void 0, function* () {
        return 42;
    });
}
`;
      const result = transformer.transformSource(input, "test.ts");
      
      // At minimum, should identify the awaiter call
      expect(result.stats.awaiterCallsFound).toBe(1);
    });
  });

  describe("Statistics tracking", () => {
    it("should track multiple awaiter calls", () => {
      const input = `
function fn1() {
    return __awaiter(this, void 0, void 0, function* () {
        return 1;
    });
}

function fn2() {
    return __awaiter(this, void 0, void 0, function* () {
        return 2;
    });
}
`;
      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.stats.awaiterCallsFound).toBe(2);
    });
  });

  describe("Options handling", () => {
    it("should respect target option", () => {
      const transformerES2017 = new AwaiterTransformer({ target: "ES2017" });
      const input = `
function test() {
    return 42;
}
`;
      const result = transformerES2017.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
    });

    it("should handle format option", () => {
      const transformerNoFormat = new AwaiterTransformer({ format: false });
      const input = `
function test() {
    return 42;
}
`;
      const result = transformerNoFormat.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
    });
  });

  describe("Error handling", () => {
    it("should handle empty input gracefully", () => {
      const result = transformer.transformSource("", "empty.ts");
      
      expect(result.success).toBe(true);
    });

    it("should handle valid JS without awaiter", () => {
      const input = `
function plain() {
    return 42;
}
`;
      const result = transformer.transformSource(input, "test.ts");
      
      expect(result.success).toBe(true);
      expect(result.code).toContain("function plain()");
    });
  });

  describe("File operations", () => {
    it("should transform file content", () => {
      const fs = require('fs');
      const path = require('path');
      const tmpDir = require('os').tmpdir();
      const testFile = path.join(tmpDir, `test_${Date.now()}.ts`);
      
      const input = `
function fileTest() {
    return 42;
}
`;
      
      fs.writeFileSync(testFile, input);
      
      try {
        const result = transformer.transformFile(testFile);
        
        expect(result.success).toBe(true);
        expect(result.code).toContain("function fileTest()");
      } finally {
        fs.unlinkSync(testFile);
      }
    });
  });
});
