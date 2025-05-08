#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Interpreter } = require('./interpreter.js');

// Get command line arguments
const args = process.argv.slice(2);

// Show usage if no file is provided
if (args.length === 0) {
  console.log('MemeLang - A fun programming language with Hindi meme-inspired syntax');
  console.log('');
  console.log('Usage: memelang [file.ml]');
  console.log('');
  console.log('Examples:');
  console.log('  memelang script.ml         Run a MemeLang script');
  console.log('  memelang examples/test-script.ml  Run the example script');
  process.exit(0);
}

// Get the script file path
const scriptPath = path.resolve(args[0]);

// Check if the file exists
if (!fs.existsSync(scriptPath)) {
  console.error(`Error: File not found: ${scriptPath}`);
  process.exit(1);
}

// Read the script
try {
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  
  // Create an interpreter instance
  const interpreter = new Interpreter(scriptContent);

  // Run the interpreter
  (async function() {
    try {
      console.log(`Running MemeLang script: ${scriptPath}`);
      const output = await interpreter.interpret(scriptContent, scriptPath);
      if (output && output.length > 0) {
        console.log("Program output:");
        output.forEach(line => console.log(line));
      }
    } catch (error) {
      console.error("Error running script:", error);
      process.exit(1);
    }
  })();
} catch (error) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
} 