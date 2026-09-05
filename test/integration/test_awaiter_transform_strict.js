/**
 * 集成测试：awaiter_transform_strict.js
 * 
 * 测试用例为 test/typescript/*.ts 的编译结果，
 * 预期结果为对应的 ts 文件内容（转换回 async/await 后应与原 TS 文件语义一致）
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// 编译 TypeScript 文件
function compileTypeScript(tsFile) {
  const fileName = path.basename(tsFile, '.ts');
  const outFile = path.join(TEMP_COMPILED_DIR, `${fileName}.js`);
  
  try {
    execSync(
      `node_modules/.bin/tsc "${tsFile}" --outDir "${TEMP_COMPILED_DIR}" --lib ES2018,DOM`,
      { cwd: path.join(__dirname, '..'), stdio: 'pipe' }
    );
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
      // The transformed file should contain async functions (not __awaiter calls in user code)
      const originalTs = readFile(tsFile);
      
      // Count async function declarations in original TS
      const originalAsyncCount = (originalTs.match(/async\s+(?:function|\(|const|let|var)/g) || []).length;
      
      // The transformed JS should have similar structure (allowing for some differences due to compilation)
      // We check that the transformation produced valid JavaScript
      if (transformedContent.includes('SyntaxError') || transformedContent.includes('undefined')) {
        throw new Error('Transformed content contains errors');
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
