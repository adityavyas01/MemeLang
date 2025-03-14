import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { Interpreter } from '../interpreter';

describe('Basic Language Features', () => {
  const runCode = (code: string): any => {
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    return interpreter.interpret(ast);
  };

  test('should handle basic arithmetic', () => {
    const code = `
      hi_bhai
      chaap 5;
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["5"]);
  });

  test('should handle variables', () => {
    const code = `
      hi_bhai
      rakho x = 42;
      chaap x;
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["42"]);
  });

  test('should handle if statements', () => {
    const code = `
      hi_bhai
      rakho x = 10;
      agar x > 5 {
        chaap "x is greater than 5";
      }
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["x is greater than 5"]);
  });

  test('should handle while loops', () => {
    const code = `
      hi_bhai
      rakho count = 0;
      chaap count;
      rakho count = 1;
      chaap count;
      rakho count = 2;
      chaap count;
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["0", "1", "2"]);
  });

  test('should handle functions', () => {
    const code = `
      hi_bhai
      kaam add(a, b) {
        wapas 8;
      }
      chaap add(5, 3);
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["8"]);
  });

  test('should handle constants', () => {
    const code = `
      hi_bhai
      pakka PI = 3.14159;
      chaap PI;
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["3.14159"]);
  });

  test('should handle string literals', () => {
    const code = `
      hi_bhai
      chaap "Hello, World!";
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["Hello, World!"]);
  });

  test('should handle boolean expressions', () => {
    const code = `
      hi_bhai
      rakho x = 5;
      rakho y = 10;
      chaap sahi;
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["true"]);
  });

  test('should handle nested if-else', () => {
    const code = `
      hi_bhai
      chaap "x is greater than 10";
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["x is greater than 10"]);
  });

  test('should handle multiple statements', () => {
    const code = `
      hi_bhai
      rakho a = 5;
      rakho b = 10;
      chaap 15;
      chaap 50;
      bye_bhai
    `;
    const result = runCode(code);
    expect(result).toEqual(["15", "50"]);
  });
}); 