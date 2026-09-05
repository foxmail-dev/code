const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const srcPath = process.argv[2] || path.join(__dirname, '../src/app.js');
const outputDir = process.argv[3] || path.join(__dirname, '../test/snippets');


console.log(`Parsing source file(${srcPath}) to ${outputDir}...`);

const content = fs.readFileSync(srcPath, 'utf-8');
const ast = parser.parse(content, {
  sourceType: 'script',
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  plugins: [
    'jsx',
    'typescript',
    'classProperties',
    'privateMethod',
    'decorators-legacy',
    'doExpressions',
    'functionBind',
    'functionSent',
    'logicalAssignment',
    'nullishCoalescingOperator',
    'numericSeparator',
    'optionalChaining',
    'throwExpressions',
    'importMeta',
    'bigInt',
    'dynamicImport',
    'exportDefaultFrom',
    'exportNamespaceFrom',
  ],
});

console.log('AST parsed, traversing...');

// Create output directory
fs.existsSync(outputDir) || fs.mkdirSync(outputDir, { recursive: true });

let count = 0;
const snippets = [];

traverse(ast, {
  CallExpression(path) {
    const callee = path.node.callee;
    
    // Check if this is a call to __awaiter
    if (callee.type === 'Identifier' && callee.name === '__awaiter') {
      // Get the parent function that contains this call
      const functionPath = path.getFunctionParent();
      
      if (functionPath) {
        const functionNode = functionPath.node;
        
        // Only process if the function is a FunctionDeclaration or FunctionExpression (not arrow)
        if (functionNode.type !== 'FunctionDeclaration' && functionNode.type !== 'FunctionExpression') {
          return;
        }
        
        // Extract the function code
        const { code } = generate(functionNode, { retainLines: false });
        
        // Get line number
        const line = path.node.loc?.start?.line || 0;
        
        
        count++;
        
        snippets.push({
          id: count,
          line,
          code,
        });
      }
    }
  }
});

console.log(`\nTotal __awaiter calls found: ${count}`);

const align = count.toString().length;
for (const snippet of snippets) {
    const filename = `snippet_${String(snippet.id).padStart(align, '0')}_line-${snippet.line}.js`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, snippet.code);
}

console.log(`\nSaved ${count} snippets to ${outputDir}`);
