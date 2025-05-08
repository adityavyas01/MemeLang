const fs = require('fs');
const path = require('path');
const { Interpreter } = require('./dist/interpreter');

// Read the test script
const scriptPath = path.join(__dirname, 'test-script.ml');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Create an interpreter instance
const interpreter = new Interpreter(scriptContent);

// Run the interpreter
async function runTest() {
  try {
    const output = await interpreter.interpret(scriptContent, scriptPath);
    console.log("Program output:", output);
  } catch (error) {
    console.error("Error running script:", error);
  }
}

runTest(); 