import { Interpreter } from './interpreter';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { ProgramNode } from './types';

export async function interpret(code: string): Promise<any[]> {
  const interpreter = new Interpreter();
  console.log("Interpreter created");
  return await interpreter.interpret(code);
}

// Entry point for command line usage
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide a file path');
    process.exit(1);
  }
  
  const code = fs.readFileSync(filePath, 'utf8');
  interpret(code).then(results => {
    if (Array.isArray(results)) {
      console.log(results.map(String).join('\n'));
    } else {
      console.log(results);
    }
  }).catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
} 