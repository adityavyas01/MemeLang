import { Interpreter } from '../interpreter';

describe('MemeLang Edge Cases', () => {
  let interpreter: Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test('Empty program should execute without errors', () => {
    const code = `hi_bhai
    bye_bhai`;
    const result = interpreter.interpret(code);
    expect(result).toEqual([]);
  });

  test('Nested expressions with mixed operators', () => {
    const code = `hi_bhai
      rakho result = 2 + 3 * 4 - (8 / 2) + 1;
      chaap result;
    bye_bhai`;
    const result = interpreter.interpret(code);
    expect(result).toEqual(['11']);
  });

  test('Simple conditionals', () => {
    const code = `hi_bhai
      rakho x = 5;
      
      // Instead of using if-else directly, let's use the condition in a variable
      rakho isGreaterThan10 = x > 10;
      rakho isEqual5 = x == 5;
      
      // Use the boolean values to determine output
      if (isGreaterThan10) {
        chaap "Greater than 10";
      }
      
      if (isEqual5) {
        chaap "Exactly 5";
      }
      
      rakho math = 2 + 2 == 4;
      if (math) {
        chaap "Math works";
      }
    bye_bhai`;
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Exactly 5', 'Math works']);
  });

  test('Complex array operations', () => {
    const code = `hi_bhai
      rakho arr = [1, 2, 3, 4, 5];
      rakho sum = 0;
      rakho i = arr.length - 1;
      
      // Summing array in reverse
      jabtak i >= 0 {
        sum = sum + arr[i];
        i = i - 1;
      }
      
      chaap "Sum in reverse: " + sum;
      
      // Array modification
      rakho j = 0;
      jabtak j < arr.length {
        arr[j] = arr[j] * 2;
        j = j + 1;
      }
      
      // Sum the modified array
      rakho newSum = 0;
      rakho k = 0;
      jabtak k < arr.length {
        newSum = newSum + arr[k];
        k = k + 1;
      }
      
      chaap "Sum after modification: " + newSum;
    bye_bhai`;
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Sum in reverse: 15', 'Sum after modification: 30']);
  });

  test('Simple function with return values', () => {
    const code = `hi_bhai
      // Simple addition function
      rakho function add(a, b) {
        return a + b;
      }
      
      // Call the function with various values
      chaap "2 + 3 = " + add(2, 3);
      chaap "5 + 7 = " + add(5, 7);
      chaap "10 + -5 = " + add(10, -5);
    bye_bhai`;
    const result = interpreter.interpret(code);
    expect(result).toEqual([
      '2 + 3 = 5',
      '5 + 7 = 12',
      '10 + -5 = 5'
    ]);
  });

  test('String manipulation and edge cases', () => {
    const code = `hi_bhai
      rakho emptyStr = "";
      rakho normalStr = "Hello";
      rakho numAsStr = "42";
      
      chaap "Empty string: [" + emptyStr + "]";
      chaap "String length: " + normalStr.length;
      chaap "Concatenation: " + normalStr + " World";
      chaap "Number + String: " + (5 + numAsStr);
      chaap "String + Number: " + (numAsStr + 5);
    bye_bhai`;
    const result = interpreter.interpret(code);
    expect(result).toEqual([
      'Empty string: []',
      'String length: 5',
      'Concatenation: Hello World',
      'Number + String: 542',  // JavaScript-like behavior
      'String + Number: 425'   // JavaScript-like behavior
    ]);
  });

  test('Mixed data types and operator precedence', () => {
    const code = `hi_bhai
      rakho a = 5;
      rakho b = "10";
      rakho c = a + b;     // String concatenation: "510"
      rakho d = b + a;     // String concatenation: "105"
      rakho e = a * 2 + 3; // Numeric operation with precedence: 13
      
      chaap "a + b: " + c;
      chaap "b + a: " + d;
      chaap "a * 2 + 3: " + e;
      
      rakho complex = 2 + 3 * 4 / 2 - 1;
      chaap "Complex: " + complex; // Should be 7 with proper precedence
    bye_bhai`;
    const result = interpreter.interpret(code);
    expect(result).toEqual([
      'a + b: 510', 
      'b + a: 105', 
      'a * 2 + 3: 13',
      'Complex: 7'
    ]);
  });

  test('Variable scope and shadowing', () => {
    const code = `hi_bhai
      rakho x = "global";
      
      {
        chaap "Outer block sees x as: " + x;
        rakho x = "outer block";
        chaap "After redefinition in outer block: " + x;
        
        {
          chaap "Inner block sees x as: " + x;
          rakho x = "inner block";
          chaap "After redefinition in inner block: " + x;
        }
        
        chaap "Back to outer block, x is: " + x;
      }
      
      chaap "Back to global scope, x is: " + x;
    bye_bhai`;
    const result = interpreter.interpret(code);
    expect(result).toEqual([
      'Outer block sees x as: global',
      'After redefinition in outer block: outer block',
      'Inner block sees x as: outer block',
      'After redefinition in inner block: inner block',
      'Back to outer block, x is: outer block',
      'Back to global scope, x is: global'
    ]);
  });
}); 