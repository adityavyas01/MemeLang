import { Interpreter } from '../interpreter';

describe('MemeLang Simplified Test', () => {
  let interpreter: Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test('Basic syntax and keywords', () => {
    const code = `hi_bhai
      rakho num = 42;
      chaap num;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['42']);
  });
  
  test('String literals', () => {
    const code = `hi_bhai
      rakho str = "MemeLang";
      chaap str;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['MemeLang']);
  });
  
  test('Constants', () => {
    const code = `hi_bhai
      pakka PI = 3.14;
      chaap PI;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['3.14']);
  });
  
  test('Arithmetic', () => {
    const code = `hi_bhai
      rakho sum = 10 + 5;
      chaap sum;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['15']);
  });
  
  test('Modulus', () => {
    const code = `hi_bhai
      rakho mod = 10 % 3;
      chaap mod;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['1']);
  });
  
  test('Boolean literals', () => {
    const code = `hi_bhai
      rakho isTrue = sahi;
      rakho isFalse = galat;
      chaap isTrue;
      chaap isFalse;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['true', 'false']);
  });
  
  test('Comparisons', () => {
    const code = `hi_bhai
      rakho isEqual = 5 == 5;
      chaap isEqual;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['true']);
  });
  
  test('If statement', () => {
    const code = `hi_bhai
      rakho age = 20;
      agar age >= 18 {
        chaap "Adult";
      } warna {
        chaap "Minor";
      }
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Adult']);
  });
  
  test('Arrays', () => {
    const code = `hi_bhai
      rakho fruits = ["Apple", "Banana", "Orange"];
      chaap fruits[0];
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Apple']);
  });
  
  test('Simple function', () => {
    const code = `hi_bhai
      kaam greet(name) {
        wapas "Hello, " + name + "!";
      }
      rakho greeting = greet("World");
      chaap greeting;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Hello, World!']);
  });
  
  test('While loop', () => {
    const code = `hi_bhai
      rakho counter = 1;
      rakho result = "";
      jabtak counter <= 3 {
        result = result + counter;
        counter = counter + 1;
      }
      chaap result;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['123']);
  });
  
  test('Null value', () => {
    const code = `hi_bhai
      rakho nullValue = kuch_nahi;
      chaap nullValue;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['null']);
  });
}); 