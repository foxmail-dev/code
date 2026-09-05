#!/usr/bin/env node

import { AwaiterTransformer } from "./index";
import * as fs from "fs";
import * as path from "path";

interface CliOptions {
  input: string;
  output?: string;
  target: string;
  preserveNames: boolean;
  noFormat: boolean;
  verbose: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    input: "",
    target: "ES2020",
    preserveNames: false,
    noFormat: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === "-i" || arg === "--input") {
      options.input = args[++i];
    } else if (arg === "-o" || arg === "--output") {
      options.output = args[++i];
    } else if (arg === "-t" || arg === "--target") {
      options.target = args[++i];
    } else if (arg === "--preserve-names") {
      options.preserveNames = true;
    } else if (arg === "--no-format") {
      options.noFormat = true;
    } else if (arg === "-v" || arg === "--verbose") {
      options.verbose = true;
    } else if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    }
  }

  if (!options.input) {
    console.error("Error: Input file is required");
    printHelp();
    process.exit(1);
  }

  return options;
}

function printHelp(): void {
  console.log(`
Awaiter Transformer - Convert __awaiter/__generator to native async/await

Usage: awaiter-transformer [options]

Options:
  -i, --input <file>       Input file path (required)
  -o, --output <file>      Output file path (default: stdout)
  -t, --target <version>   Target ES version (default: ES2020)
                           Available: ES2017, ES2018, ES2019, ES2020, ES2021, ES2022, ESNext
  --preserve-names         Preserve original variable names (var instead of const/let)
  --no-format              Disable code formatting
  -v, --verbose            Verbose output with statistics
  -h, --help               Show this help message

Examples:
  awaiter-transformer -i input.js -o output.ts
  awaiter-transformer -i snippet.js --target ES2017 --verbose
  cat input.js | awaiter-transformer -i /dev/stdin > output.ts
`);
}

async function main(): Promise<void> {
  const options = parseArgs();

  // Read input file
  let sourceCode: string;
  try {
    sourceCode = fs.readFileSync(options.input, "utf-8");
  } catch (error) {
    console.error(`Error reading input file: ${error}`);
    process.exit(1);
  }

  // Create transformer
  const transformer = new AwaiterTransformer({
    target: options.target as any,
    preserveVariableNames: options.preserveNames,
    format: !options.noFormat,
  });

  // Transform
  const result = transformer.transformSource(sourceCode, options.input);

  if (!result.success) {
    console.error("Transformation errors:");
    for (const error of result.errors) {
      console.error(`  ${error.file}:${error.line}:${error.column} - ${error.message}`);
    }
  }

  if (options.verbose && result.warnings.length > 0) {
    console.warn("Warnings:");
    for (const warning of result.warnings) {
      console.warn(`  ${warning.file}:${warning.line}:${warning.column} - ${warning.message}`);
    }
  }

  if (options.verbose) {
    console.log("\nStatistics:");
    console.log(`  __awaiter calls found: ${result.stats.awaiterCallsFound}`);
    console.log(`  __awaiter calls transformed: ${result.stats.awaiterCallsTransformed}`);
    console.log(`  Generator calls found: ${result.stats.generatorCallsFound}`);
    console.log(`  Try/catch blocks restored: ${result.stats.tryCatchBlocksRestored}`);
    console.log(`  Loops restored: ${result.stats.loopsRestored}`);
    console.log(`  Awaits restored: ${result.stats.awaitsRestored}`);
  }

  // Output result
  if (options.output) {
    try {
      fs.writeFileSync(options.output, result.code, "utf-8");
      if (options.verbose) {
        console.log(`\nOutput written to: ${options.output}`);
      }
    } catch (error) {
      console.error(`Error writing output file: ${error}`);
      process.exit(1);
    }
  } else {
    console.log(result.code);
  }

  if (!result.success) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`Fatal error: ${error}`);
  process.exit(1);
});
