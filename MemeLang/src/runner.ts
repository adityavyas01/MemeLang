import { Interpreter } from './interpreter';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { ProgramNode } from './types';
import * as fs from 'fs';
import * as path from 'path';

export class Runner {
  public static runFile(filePath: string): any {
    const code = fs.readFileSync(filePath, 'utf-8');
    return this.run(code);
  }

  public static async run(code: string): Promise<any[]> {
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    return await interpreter.interpretNode(ast);
  }
}

// If running directly from command line
if (require.main === module) {
  const main = () => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.error('Please provide a file path');
      return;
    }

    const filePath = path.resolve(args[0]);
    try {
      const result = Runner.runFile(filePath);
      console.log('Result:', result);
    } catch (error: any) {
      console.error('Error:', error.message || 'Unknown error occurred');
    }
  };
  main();
} 