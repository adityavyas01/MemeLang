import { Interpreter } from './interpreter';
import { enhanceErrorMessage } from './custom-error-messages';

export function execute(code: string): string[] {
  try {
    const interpreter = new Interpreter();
    return interpreter.interpret(code);
  } catch (error) {
    console.error(error);
    
    // Use our custom error enhancement for more fun messaging
    if (error instanceof Error) {
      return [`${enhanceErrorMessage(error)}`];
    } else {
      return [`Error: ${String(error)}`];
    }
  }
}

// Only export REPL function in Node.js environment
if (typeof window === 'undefined') {
  // @ts-ignore - This is intentionally ignored as it's only used in Node.js
  exports.executeRepl = async function() {
    const interpreter = new Interpreter();
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const prompt = () => {
      readline.question('> ', (input: string) => {
        if (input.trim().toLowerCase() === 'exit') {
          readline.close();
          return;
        }
        try {
          const result = interpreter.interpret(input);
          console.log(result.join('\n'));
        } catch (error) {
          // Use our custom error enhancement for more fun messaging in REPL too
          if (error instanceof Error) {
            console.error(enhanceErrorMessage(error));
          } else {
            console.error(`Error: ${String(error)}`);
          }
        }
        prompt();
      });
    };

    prompt();
  };
} 