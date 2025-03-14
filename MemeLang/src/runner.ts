import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
import * as fs from 'fs';
import * as path from 'path';

export class Runner {
  public static runFile(filePath: string): any {
    const code = fs.readFileSync(filePath, 'utf-8');
    return this.run(code);
  }

  public static run(code: string): any {
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    return interpreter.interpret(ast);
  }
}

// If running directly from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Please provide a file path');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  try {
    const result = Runner.runFile(filePath);
    console.log('Result:', result);
  } catch (error: any) {
    console.error('Error:', error.message || 'Unknown error occurred');
    process.exit(1);
  }
} 