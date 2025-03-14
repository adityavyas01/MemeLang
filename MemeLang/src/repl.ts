import { Interpreter } from './interpreter';

export async function startRepl(): Promise<void> {
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
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      prompt();
    });
  };

  prompt();
}

// Only run REPL if this file is being executed directly
if (require.main === module) {
  startRepl();
} 