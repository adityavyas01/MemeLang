const fs = require('fs');
const path = require('path');
const { Interpreter } = require('./dist/interpreter');
const { enhanceErrorMessage } = require('./dist/custom-error-messages');

// Example usage function
function showUsage() {
  console.log('\nโœจ MemeLang CLI ๐Ÿ˜Ž');
  console.log('----------------');
  console.log('Usage:');
  console.log('  node simple-run.js <path-to-script>');
  console.log('\nExample:');
  console.log('  node simple-run.js examples/hello-world.ml');
  console.log('\n');
}

// Main function
async function main() {
  try {
    // Get the script path from command line arguments
    const scriptPath = process.argv[2];
    
    if (!scriptPath) {
      console.error('๐Ÿ"ฅ Error: Please provide a script file path');
      showUsage();
      process.exit(1);
    }
    
    // Resolve the full path
    const resolvedPath = path.resolve(scriptPath);
    
    // Check if the file exists
    if (!fs.existsSync(resolvedPath)) {
      const error = new Error(`Script file not found: ${resolvedPath}`);
      error.name = 'FileNotFoundError';
      throw error;
    }
    
    // Read script content
    const scriptContent = fs.readFileSync(resolvedPath, 'utf8');
    
    // Create interpreter instance
    const interpreter = new Interpreter(scriptContent);
    
    // Run the interpreter
    const output = await interpreter.interpret(scriptContent, resolvedPath);
    
    // Print each line of output
    output.forEach(line => console.log(line));
    
  } catch (error) {
    // Use the enhanced error message with memes
    console.error(enhanceErrorMessage(error));
    process.exit(1);
  }
}

// Run the main function
main(); 