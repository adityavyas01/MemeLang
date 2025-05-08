import { Interpreter } from './interpreter';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { ProgramNode } from './types';

export async function startREPL(): Promise<void> {
  const interpreter = new Interpreter();
  const readline = require('readline');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const prompt = () => {
    rl.question('> ', async (line: string) => {
      if (line.toLowerCase() === 'exit') {
        rl.close();
        return;
      }
      
      try {
        const result = await interpreter.interpret(line);
        console.log(result.join('\n'));
      } catch (error) {
        console.error('Error:', error);
      }
      
      prompt();
    });
  };
  
  prompt();
}

// Only run REPL if this file is being executed directly
if (require.main === module) {
  startREPL();
} 