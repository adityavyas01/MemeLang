// Optimized test runner that disables all debug output
const { Interpreter } = require('./dist/interpreter');

// Set DEBUG to false by default
process.env.DEBUG = 'false';

// Store original console methods
const originalConsole = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error
};

// Disable all console output during tests
function disableConsoleOutput() {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
}

// Restore console output
function restoreConsoleOutput() {
  console.log = originalConsole.log;
  console.debug = originalConsole.debug;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
}

// Run tests with optimized settings
async function runOptimizedTests() {
  try {
    console.log('Running MemeLang tests with optimized settings...');
    
    // Disable console output
    disableConsoleOutput();
    
    // Create interpreter
    const interpreter = new Interpreter();
    
    // Loop test
    const loopCode = `
      hi_bhai
        rakho count = 0;
        rakho sum = 0;
        
        jabtak (count < 50) {
          sum = sum + count;
          count = count + 1;
        }
        
        chaap("Loop completed");
        chaap("Sum: " + sum);
        chaap("Loop iterations: " + count);
      bye_bhai
    `;
    
    const startTime = Date.now();
    const result = await interpreter.interpret(loopCode);
    const endTime = Date.now();
    
    // Re-enable console for results
    restoreConsoleOutput();
    
    // Display results
    console.log('\nLoop test results:');
    result.forEach(line => console.log(`- ${line}`));
    console.log(`\nTotal execution time: ${endTime - startTime}ms`);
    
    // Verify the sum (sum of numbers 0 to 49 = 1225)
    if (result[1].includes("1225")) {
      console.log("Test PASSED - Loop executed correctly");
      process.exit(0);
    } else {
      console.log("Test FAILED - Incorrect loop result");
      process.exit(1);
    }
  } catch (error) {
    // Re-enable console for error reporting
    restoreConsoleOutput();
    console.error("Test failed:", error);
    process.exit(1);
  }
}

// Run the optimized tests
runOptimizedTests(); 