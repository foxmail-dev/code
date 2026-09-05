import { program } from "commander";
import { glob } from "glob";
import { AwaiterTransformer, TransformOptions, TransformResult } from "./index";
import * as fs from "fs";
import * as path from "path";

interface CliOptions {
  input: string;
  output?: string;
  target?: string;
  preserveNames?: boolean;
  semanticRenaming?: boolean;
  removeHelpers?: boolean;
  format?: boolean;
  recursive?: boolean;
  pattern?: string;
}

async function main() {
  program
    .name("awaiter-transformer")
    .description("Transform TypeScript __awaiter/__generator compiled output to native async/await")
    .version("1.0.0");

  program
    .command("transform")
    .description("Transform all matching files in a directory")
    .requiredOption("-i, --input <path>", "Input directory or file")
    .option("-o, --output <path>", "Output directory (default: overwrite input)")
    .option("-t, --target <version>", "Target ES version (ES2017, ES2018, ES2019, ES2020, ES2021, ES2022, ESNext)", "ES2020")
    .option("--preserve-names", "Preserve original variable names (single letters)")
    .option("--no-semantic-renaming", "Disable semantic variable renaming")
    .option("--no-remove-helpers", "Keep __awaiter/__generator runtime helper declarations")
    .option("--no-format", "Disable output formatting")
    .option("-r, --recursive", "Process directories recursively")
    .option("-p, --pattern <glob>", "File pattern to match", "**/*.js")
    .action(async (options: CliOptions) => {
      await transformCommand(options);
    });

  program
    .command("transform-file")
    .description("Transform a single file")
    .requiredOption("-i, --input <path>", "Input file")
    .option("-o, --output <path>", "Output file (default: stdout)")
    .option("-t, --target <version>", "Target ES version", "ES2020")
    .option("--preserve-names", "Preserve original variable names")
    .option("--no-semantic-renaming", "Disable semantic renaming")
    .option("--no-remove-helpers", "Keep runtime helpers")
    .option("--no-format", "Disable formatting")
    .action(async (options: CliOptions) => {
      await transformFileCommand(options);
    });

  program.parse();
}

async function transformCommand(options: CliOptions): Promise<void> {
  const inputPath = path.resolve(options.input);
  const outputPath = options.output ? path.resolve(options.output) : null;
  const isDirectory = fs.statSync(inputPath).isDirectory();

  const files = isDirectory
    ? await glob(options.pattern || "**/*.js", { 
        cwd: inputPath, 
        absolute: true,
        nodir: true,
      })
    : [inputPath];

  console.log(`Found ${files.length} file(s) to process`);

  const transformerOptions: TransformOptions = {
    target: options.target as any,
    preserveVariableNames: options.preserveNames,
    semanticRenaming: options.semanticRenaming !== false,
    removeRuntimeHelpers: options.removeHelpers !== false,
    format: options.format !== false,
  };

  const transformer = new AwaiterTransformer(transformerOptions);
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const relativePath = isDirectory ? path.relative(inputPath, file) : path.basename(file);
    const outFile = outputPath 
      ? path.join(outputPath, relativePath)
      : file;

    try {
      console.log(`Processing: ${relativePath}`);
      const result = transformer.transformFile(file);
      
      if (result.success) {
        // 确保输出目录存在
        const outDir = path.dirname(outFile);
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }
        
        fs.writeFileSync(outFile, result.code);
        successCount++;
        console.log(`  ✓ Success (${result.stats.awaiterCallsTransformed}/${result.stats.awaiterCallsFound} awaiters transformed)`);
      } else {
        failCount++;
        console.log(`  ✗ Failed:`);
        for (const error of result.errors.filter(e => e.severity === "error")) {
          console.log(`    Error: ${error.message}`);
        }
      }

      if (result.warnings.length > 0) {
        for (const warning of result.warnings) {
          console.log(`    Warning: ${warning.message}`);
        }
      }
    } catch (error) {
      failCount++;
      console.log(`  ✗ Exception: ${error}`);
    }
  }

  console.log(`\nDone: ${successCount} succeeded, ${failCount} failed`);
  
  if (failCount > 0) {
    process.exit(1);
  }
}

async function transformFileCommand(options: CliOptions): Promise<void> {
  const inputPath = path.resolve(options.input);
  const outputPath = options.output ? path.resolve(options.output) : null;
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const sourceCode = fs.readFileSync(inputPath, "utf-8");

  const transformerOptions: TransformOptions = {
    target: options.target as any,
    preserveVariableNames: options.preserveNames,
    semanticRenaming: options.semanticRenaming !== false,
    removeRuntimeHelpers: options.removeHelpers !== false,
    format: options.format !== false,
  };

  const transformer = new AwaiterTransformer(transformerOptions);
  const result = transformer.transformSource(sourceCode, path.basename(inputPath));

  if (result.success) {
    if (outputPath) {
      const outDir = path.dirname(outputPath);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      fs.writeFileSync(outputPath, result.code);
      console.log(`Transformed: ${inputPath} -> ${outputPath}`);
    } else {
      console.log(result.code);
    }
  } else {
    console.error("Transform failed:");
    for (const error of result.errors.filter(e => e.severity === "error")) {
      console.error(`  Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main().catch(console.error);