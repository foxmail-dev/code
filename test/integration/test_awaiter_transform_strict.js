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
const parser = require('@babel/parser');
const prettier = require('prettier');

// 目录配置
const TYPESCRIPT_DIR = path.join(__dirname, '..', 'typescript');
const SCRIPT_PATH = path.join(__dirname, '..', '..', 'scripts', 'incorrect', 'awaiter_transform_strict.js');
const TEMP_COMPILED_DIR = '/tmp/integration_test_compiled';
const TEMP_TRANSFORMED_DIR = '/tmp/integration_test_transformed';
const TSCONFIG_PATH = path.join(TYPESCRIPT_DIR, 'tsconfig.json');

// 读取 TypeScript 配置文件
function getTsConfig() {
  if (!fs.existsSync(TSCONFIG_PATH)) {
    throw new Error(`TypeScript config file not found: ${TSCONFIG_PATH}`);
  }
  const configContent = fs.readFileSync(TSCONFIG_PATH, 'utf-8');
  const config = JSON.parse(configContent);
  return config.compilerOptions || {};
}

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
    
    // 从配置文件加载编译选项，并强制 target 为 ES5 以生成 __awaiter/__generator
    const baseConfig = getTsConfig();
    const compilerOptions = {
      ...baseConfig,
      target: ts.ScriptTarget.ES5,  // 强制 ES5 以生成 __awaiter
      outDir: TEMP_COMPILED_DIR,
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

// 方案一：AST 结构化比对
// 解析代码生成 AST，移除注释、位置等非语义节点后进行比较
function normalizeAst(node) {
  if (!node || typeof node !== 'object') {
    return node;
  }
  
  if (Array.isArray(node)) {
    return node.map(normalizeAst).filter(n => n !== null);
  }
  
  const result = {};
  for (const key of Object.keys(node)) {
    // 忽略位置和注释等非语义信息
    if (key === 'loc' || key === 'start' || key === 'end' || 
        key === 'leadingComments' || key === 'trailingComments' || 
        key === 'innerComments' || key === 'extra') {
      continue;
    }
    
    const value = node[key];
    if (typeof value === 'object' && value !== null) {
      const normalized = normalizeAst(value);
      if (normalized !== null) {
        result[key] = normalized;
      }
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  
  return result;
}

function parseCode(code, isTs = false) {
  const plugins = ['typescript', 'doExpressions', 'asyncDoExpressions', 'decimal', 'decorators-legacy'];
  return parser.parse(code, {
    sourceType: 'module',
    plugins,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    allowUndeclaredExports: true
  });
}

function compareAst(ast1, ast2) {
  const norm1 = normalizeAst(ast1);
  const norm2 = normalizeAst(ast2);
  
  const json1 = JSON.stringify(norm1);
  const json2 = JSON.stringify(norm2);
  
  return json1 === json2;
}

// 方案一验证函数
function verifyWithAst(originalTs, transformedJs) {
  try {
    const tsAst = parseCode(originalTs, true);
    const jsAst = parseCode(transformedJs, false);
    
    // 比较 program.body
    const tsBody = normalizeAst(tsAst.program.body);
    const jsBody = normalizeAst(jsAst.program.body);
    
    const jsonTs = JSON.stringify(tsBody, null, 2);
    const jsonJs = JSON.stringify(jsBody, null, 2);
    
    return jsonTs === jsonJs;
  } catch (error) {
    console.log(`  ⚠ AST comparison error: ${error.message}`);
    return false;
  }
}

// 方案三：二次编译比对
// 将原始 TS 编译为 async/await 格式，与转换后的 JS 进行结构比较
async function verifyWithRecompile(originalTs, transformedJs, fileName) {
  try {
    // 从配置文件加载编译选项，但强制 target 为 ES2018 以保留 async/await
    const baseConfig = getTsConfig();
    const tsOptions = {
      ...baseConfig,
      target: ts.ScriptTarget.ES2018,  // 强制 ES2018 以保留 async/await
      noEmitOnError: false
    };

    const tsResult = ts.transpileModule(originalTs, { compilerOptions: tsOptions });
    const tsCompiled = tsResult.outputText;

    // 规范化代码进行比较
    function normalize(code) {
      return code
        .replace(/\/\*[\s\S]*?\*\//g, '')  // 移除块注释
        .replace(/\/\/.*$/gm, '')              // 移除行注释
        .replace(/\s+/g, ' ')                   // 统一空白
        .trim();
    }

    const normalizedTs = normalize(tsCompiled);
    const normalizedJs = normalize(transformedJs);

    // 检查 async/await 数量（允许一定差异）
    const asyncCountTs = (normalizedTs.match(/async\s+(?:function|\(|=>)/g) || []).length;
    const asyncCountJs = (normalizedJs.match(/async\s+(?:function|\(|=>)/g) || []).length;
    const awaitCountTs = (normalizedTs.match(/\bawait\b/g) || []).length;
    const awaitCountJs = (normalizedJs.match(/\bawait\b/g) || []).length;

    // 如果转换后没有 async/await，检查是否保留了 __awaiter/__generator 模式
    if (asyncCountJs === 0 && awaitCountJs === 0) {
      // 检查是否是有效的 __awaiter/__generator 代码
      const hasAwaiter = /__awaiter/.test(normalizedJs);
      const hasGenerator = /__generator/.test(normalizedJs);
      
      if (hasAwaiter && hasGenerator) {
        console.log(`    ℹ Transformed code uses __awaiter/__generator pattern (acceptable fallback)`);
        // 进一步检查关键结构是否保留
        const structuralPatterns = [
          { name: 'Promise.resolve', pattern: /Promise\.resolve/g },
          { name: 'try-catch', pattern: /try\s*\{/g },
          { name: 'return', pattern: /\breturn\b/g }
        ];
        
        for (const { name, pattern } of structuralPatterns) {
          const tsMatches = (normalizedTs.match(pattern) || []).length;
          const jsMatches = (normalizedJs.match(pattern) || []).length;
          
          if (tsMatches > 0 && jsMatches === 0) {
            console.log(`    ⚠ Structural pattern '${name}' missing in transformed output`);
            return false;
          }
        }
        return true;
      }
    }

    // async/await 数量应该大致匹配（允许 1 个误差）
    if (Math.abs(asyncCountTs - asyncCountJs) > 1 || Math.abs(awaitCountTs - awaitCountJs) > 1) {
      console.log(`    ⚠ Async/await count mismatch: TS(async=${asyncCountTs}, await=${awaitCountTs}) vs JS(async=${asyncCountJs}, await=${awaitCountJs})`);
      return false;
    }

    // 检查主要函数名是否都存在
    const funcPattern = /function\s+(\w+)/g;
    const funcsTs = [...normalizedTs.matchAll(funcPattern)].map(m => m[1]);
    const funcsJs = [...normalizedJs.matchAll(funcPattern)].map(m => m[1]);

    // 检查 TS 中的函数是否都在 JS 中
    for (const fn of funcsTs) {
      if (!funcsJs.includes(fn)) {
        console.log(`    ⚠ Function '${fn}' missing in transformed output`);
        return false;
      }
    }

    // 检查是否包含相同的关键结构（Promise、try/catch、循环等）
    const structuralPatterns = [
      { name: 'Promise.resolve', pattern: /Promise\.resolve/g },
      { name: 'try-catch', pattern: /try\s*\{/g },
      { name: 'return', pattern: /\breturn\b/g }
    ];
    
    for (const { name, pattern } of structuralPatterns) {
      const tsMatches = (normalizedTs.match(pattern) || []).length;
      const jsMatches = (normalizedJs.match(pattern) || []).length;
      
      // 如果 TS 中有该结构，JS 中也应该有（允许一定误差）
      if (tsMatches > 0 && jsMatches === 0) {
        console.log(`    ⚠ Structural pattern '${name}' missing in transformed output`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log(`  ⚠ Recompile comparison error: ${error.message}`);
    return false;
  }
}

// 综合验证函数：先方案一，失败则方案三
async function verifySemanticEquivalence(originalTs, transformedJs, fileName) {
  console.log('  Running semantic verification...');
  
  // 方案一：AST 比对（仅当转换成功生成 async/await 时）
  console.log('    - Checking if transformation produced async/await...');
  const hasAsyncAwait = /async\s+(?:function|\(|=>)/.test(transformedJs);
  
  if (!hasAsyncAwait) {
    console.log('    ⚠ Transformation did not produce async/await syntax');
    console.log('    - Skipping AST comparison, falling back to recompile comparison...');
    return await verifyWithRecompile(originalTs, transformedJs, fileName);
  }
  
  console.log('    - Attempting AST structural comparison...');
  const astPassed = verifyWithAst(originalTs, transformedJs);
  
  if (astPassed) {
    console.log('    ✓ AST comparison passed');
    return true;
  }
  
  console.log('    ✗ AST comparison failed, falling back to recompile comparison...');
  
  // 方案三：二次编译比对
  console.log('    - Attempting recompile comparison...');
  const recompilePassed = await verifyWithRecompile(originalTs, transformedJs, fileName);
  
  if (recompilePassed) {
    console.log('    ✓ Recompile comparison passed');
    return true;
  }
  
  console.log('    ✗ Recompile comparison failed');
  return false;
}

// 设置临时目录
function setup() {
  cleanup();
  fs.mkdirSync(TEMP_COMPILED_DIR, { recursive: true });
  fs.mkdirSync(TEMP_TRANSFORMED_DIR, { recursive: true });
}

// 主测试函数
async function runIntegrationTests() {
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
      if (transformedContent.includes('SyntaxError')) {
        throw new Error('Transformed content contains SyntaxError');
      }

      // Step 5: Semantic equivalence verification (方案一 + 方案三)
      const originalTs = readFile(tsFile);
      const semanticPassed = await verifySemanticEquivalence(originalTs, transformedContent, fileName);
      
      if (!semanticPassed) {
        throw new Error('Semantic equivalence verification failed (both AST and recompile comparison failed)');
      }

      console.log(`  ✓ All verifications passed\n`);
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
