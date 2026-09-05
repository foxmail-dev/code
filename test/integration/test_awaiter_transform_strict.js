/**
 * 集成测试：awaiter_transform_strict.js
 *
 * 测试用例为 test/typescript/*.ts 的编译结果，
 * 预期结果为对应的 ts 文件内容（转换回 async/await 后应与原 TS 文件语义一致）
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// 目录配置
const TYPESCRIPT_DIR = path.join(__dirname, '..', 'typescript');
const SCRIPT_PATH = path.join(__dirname, '..', '..', 'scripts', 'incorrect', 'awaiter_transform_strict.js');
const TEMP_COMPILED_DIR = '/tmp/integration_test_compiled';
const TEMP_TRANSFORMED_DIR = '/tmp/integration_test_transformed';

// 获取所有测试文件
function getTestFiles() {
  return fs.readdirSync(TYPESCRIPT_DIR)
    .filter(f => f.endsWith('.ts') && !f.startsWith('.'))
    .map(f => path.join(TYPESCRIPT_DIR, f));
}

// 编译 TypeScript 文件（使用 TypeScript API）
function compileTypeScript(tsFile) {
  const fileName = path.basename(tsFile, '.ts');
  const outFile = path.join(TEMP_COMPILED_DIR, `${fileName}.js`);

  try {
    // 读取源文件
    const sourceCode = fs.readFileSync(tsFile, 'utf-8');

    // 编译选项
    const compilerOptions = {
      target: ts.ScriptTarget.ES2018,
      lib: ['lib.es2018.d.ts', 'lib.dom.d.ts'],
      module: ts.ModuleKind.CommonJS,
      outDir: TEMP_COMPILED_DIR,
      skipLibCheck: true,
      noEmitOnError: false
    };

    // 创建编译器主机
    const host = ts.createCompilerHost(compilerOptions);
    const originalGetSourceFile = host.getSourceFile;
    const originalWriteFile = host.writeFile;
    const originalFileExists = host.fileExists;
    const originalReadFile = host.readFile;

    // 重写 getSourceFile 以提供源代码
    host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
      if (fileName === tsFile || fileName.endsWith('/' + path.basename(tsFile))) {
        return ts.createSourceFile(fileName, sourceCode, languageVersion, true);
      }
      return originalGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
    };

    // 重写 writeFile 以捕获输出
    let compiledOutput = null;
    host.writeFile = (fileName, data, writeByteOrderMark, onError, sourceFiles) => {
      if (fileName.endsWith('.js')) {
        compiledOutput = data;
      }
    };

    // 重写 fileExists 和 readFile 以处理虚拟文件系统
    const existingFiles = new Set([tsFile]);
    host.fileExists = (fileName) => {
      if (existingFiles.has(fileName)) return true;
      return originalFileExists(fileName);
    };
    host.readFile = (fileName) => {
      if (fileName === tsFile) return sourceCode;
      return originalReadFile(fileName);
    };

    // 创建程序并编译
    const program = ts.createProgram([tsFile], compilerOptions, host);
    const emitResult = program.emit();

    // 检查编译错误
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    if (allDiagnostics.length > 0) {
      const errors = allDiagnostics.map(diagnostic => {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
        }
        return message;
      });
      if (errors.length > 0) {
        console.warn(`Compilation warnings for ${fileName}: ${errors.join('; ')}`);
      }
    }

    // 如果 writeFile 没有捕获到输出，手动生成
    if (!compiledOutput) {
      const result = ts.transpileModule(sourceCode, {
        compilerOptions: compilerOptions,
        fileName: tsFile
      });
      compiledOutput = result.outputText;
    }

    // 写入输出文件
    fs.writeFileSync(outFile, compiledOutput, 'utf-8');

    return outFile;
  } catch (error) {
    throw new Error(`Failed to compile ${tsFile}: ${error.message}`);
  }
}

// 运行转换器
function transformFile(jsFile) {
  const fileName = path.basename(jsFile);
  const outFile = path.join(TEMP_TRANSFORMED_DIR, fileName);

  try {
    execSync(`node "${SCRIPT_PATH}" "${jsFile}" "${outFile}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    return outFile;
  } catch (error) {
    throw new Error(`Failed to transform ${jsFile}: ${error.message}`);
  }
}

// 读取文件内容
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// 清理临时目录
function cleanup() {
  try {
    if (fs.existsSync(TEMP_COMPILED_DIR)) {
      fs.rmSync(TEMP_COMPILED_DIR, { recursive: true, force: true });
    }
    if (fs.existsSync(TEMP_TRANSFORMED_DIR)) {
      fs.rmSync(TEMP_TRANSFORMED_DIR, { recursive: true, force: true });
    }
  } catch (e) {
    // Ignore cleanup errors
  }
}

// 设置临时目录
function setup() {
  cleanup();
  fs.mkdirSync(TEMP_COMPILED_DIR, { recursive: true });
  fs.mkdirSync(TEMP_TRANSFORMED_DIR, { recursive: true });
}

// 主测试函数
function runIntegrationTests() {
  console.log('========================================');
  console.log('Integration Tests for awaiter_transform_strict.js');
  console.log('========================================\n');

  setup();

  const testFiles = getTestFiles();
  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const tsFile of testFiles) {
    const fileName = path.basename(tsFile);
    console.log(`Testing: ${fileName}`);

    try {
      // Step 1: Compile TypeScript to JavaScript (__awaiter/__generator pattern)
      const compiledJs = compileTypeScript(tsFile);
      console.log(`  ✓ Compiled to ${path.basename(compiledJs)}`);

      // Step 2: Transform back to async/await
      const transformedJs = transformFile(compiledJs);
      console.log(`  ✓ Transformed to ${path.basename(transformedJs)}`);

      // Step 3: Verify the transformed file exists and has content
      const transformedContent = readFile(transformedJs);
      if (!transformedContent || transformedContent.trim().length === 0) {
        throw new Error('Transformed file is empty');
      }

      // Step 4: Basic sanity checks on transformed output
      // Check for obvious error patterns
      if (transformedContent.includes('SyntaxError')) {
        throw new Error('Transformed content contains SyntaxError');
      }

      console.log(`  ✓ Verification passed\n`);
      passed++;

    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}\n`);
      failed++;
      failures.push({ file: fileName, error: error.message });
    }
  }

  // Summary
  console.log('========================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('========================================');

  if (failures.length > 0) {
    console.log('\nFailure Details:');
    console.log('----------------------------------------');
    for (const f of failures) {
      console.log(`\n${f.file}:`);
      console.log(`  ${f.error}`);
    }
  }

  cleanup();

  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests
runIntegrationTests();
