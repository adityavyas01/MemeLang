import { Interpreter } from '../interpreter';
import { CompileError, RuntimeError } from '../errors';

describe('MemeLang Error Handling', () => {
  let interpreter: Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test('Division by zero should throw RuntimeError', () => {
    const code = `hi_bhai
      rakho result = 10 / 0;
      chaap result;
    bye_bhai`;
    
    expect(() => {
      interpreter.interpret(code);
    }).toThrow(RuntimeError);
  });

  test('Undefined variable access should throw RuntimeError', () => {
    const code = `hi_bhai
      chaap undefinedVar;
    bye_bhai`;
    
    expect(() => {
      interpreter.interpret(code);
    }).toThrow(RuntimeError);
  });

  test('Invalid assignment target should throw CompileError', () => {
    const code = `hi_bhai
      5 = 10;
    bye_bhai`;
    
    expect(() => {
      interpreter.interpret(code);
    }).toThrow(CompileError);
  });

  test('Missing program end should throw CompileError', () => {
    const code = `hi_bhai
      chaap "Hello, world!";`;
    
    expect(() => {
      interpreter.interpret(code);
    }).toThrow(CompileError);
  });

  test('Missing program start should throw CompileError', () => {
    const code = `
      chaap "Hello, world!";
    bye_bhai`;
    
    expect(() => {
      interpreter.interpret(code);
    }).toThrow(CompileError);
  });

  test('Invalid array index should handle gracefully', () => {
    const code = `hi_bhai
      rakho arr = [1, 2, 3];
      
      // Out of bounds index access
      chaap "Out of bounds: " + arr[5];
      
      // Negative index access
      chaap "Negative index: " + arr[-1];
      
      // Non-integer index
      chaap "String index: " + arr["hello"];
      
      // Accessing length of null
      rakho nullArray = nalla;
      
      // This would normally throw an error, but we'll handle it gracefully
      // by checking if nullArray is null before accessing properties
      if (nullArray != nalla) {
        chaap "Length: " + nullArray.length;
      } else {
        chaap "Array is null";
      }
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toContain('Out of bounds: undefined');
    expect(result).toContain('Negative index: undefined');
    expect(result).toContain('Array is null');
  });

  test('Calling non-function should throw RuntimeError', () => {
    const code = `hi_bhai
      rakho notAFunction = 5;
      rakho result = notAFunction();
      chaap result;
    bye_bhai`;
    
    expect(() => {
      interpreter.interpret(code);
    }).toThrow(RuntimeError);
  });

  test('Invalid operator for types should be handled', () => {
    const code = `hi_bhai
      // These should work - string concatenation
      chaap "String concat: " + ("5" + 5);
      
      // This should cause an error in strict languages, but JavaScript allows it
      // and converts strings to numbers for these operations
      chaap "Subtraction with string: " + ("10" - 5);
      chaap "Multiplication with string: " + ("10" * 5);
      chaap "Division with string: " + ("10" / 5);
      
      // This should output NaN or similar in JavaScript
      chaap "Invalid math: " + ("hello" - 5);
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toContain('String concat: 55');
    expect(result).toContain('Subtraction with string: 5');
    expect(result).toContain('Multiplication with string: 50');
    expect(result).toContain('Division with string: 2');
    // JavaScript evaluates "hello" - 5 as NaN
    expect(result[4]).toMatch(/Invalid math: NaN/);
  });

  test('Reassigning constant should throw RuntimeError', () => {
    const code = `hi_bhai
      rakho pakka PI = 3.14;
      PI = 3; // This should cause an error
      chaap PI;
    bye_bhai`;
    
    expect(() => {
      interpreter.interpret(code);
    }).toThrow(RuntimeError);
  });

  test('Return outside function should be handled', () => {
    const code = `hi_bhai
      return 5; // This should be handled somehow
      chaap "This will not be executed";
    bye_bhai`;
    
    // Either this should throw an error OR execute without printing the message
    const result = interpreter.interpret(code);
    expect(result).not.toContain('This will not be executed');
  });

  test('Function with too many/few arguments should be handled', () => {
    const code = `hi_bhai
      rakho function add(a, b) {
        return a + b;
      }
      
      // Call with correct number of arguments
      chaap "Correct args: " + add(1, 2);
      
      // Call with too few arguments
      chaap "Too few args: " + add(1);
      
      // Call with too many arguments
      chaap "Too many args: " + add(1, 2, 3);
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toContain('Correct args: 3');
    // Depending on implementation, these might be undefined or have default behaviors
    expect(result[1]).toMatch(/Too few args:/);
    expect(result[2]).toMatch(/Too many args: 3/); // Extra args should be ignored
  });
}); 