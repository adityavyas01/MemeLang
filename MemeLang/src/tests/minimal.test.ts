import { Interpreter } from '../interpreter';

describe('MemeLang Minimal Test', () => {
  let interpreter: Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test('Simple function without recursion', () => {
    const code = `hi_bhai
      kaam multiply(a, b) {
        wapas a * b;
      }
      
      rakho result = multiply(5, 6);
      chaap result;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['30']);
  });

  test('Function with conditional (if-else)', () => {
    const code = `hi_bhai
      kaam getStatus(age) {
        agar age >= 18 {
          wapas "Adult";
        } warna {
          wapas "Minor";
        }
      }
      
      rakho status = getStatus(20);
      chaap status;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Adult']);
  });

  test('Factorial function with recursion', () => {
    const code = `hi_bhai
      kaam factorial(n) {
        agar n <= 1 {
          wapas 1;
        } warna {
          wapas n * factorial(n - 1);
        }
      }
      
      rakho factResult = factorial(5);
      chaap factResult;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['120']);
  });

  test('Nested blocks', () => {
    const code = `hi_bhai
      rakho outer = "Outer";
      {
        chaap outer;
        rakho inner = "Inner";
        chaap inner;
      }
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Outer', 'Inner']);
  });
}); 