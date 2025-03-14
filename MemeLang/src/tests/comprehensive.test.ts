import { Interpreter } from '../interpreter';

describe('MemeLang Comprehensive Test', () => {
  let interpreter: Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test('should execute all language features correctly', () => {
    const code = `hi_bhai
      // Variable declarations
      rakho num = 42;
      rakho str = "MemeLang";
      pakka PI = 3.14159;
      
      // Print statements
      chaap "Starting comprehensive test...";
      chaap "Num: " + num;
      chaap "String: " + str;
      chaap "Constant PI: " + PI;
      
      // Arithmetic operations
      rakho sum = 10 + 5;
      rakho diff = 10 - 5;
      rakho prod = 10 * 5;
      rakho quot = 10 / 5;
      rakho mod = 10 % 3;
      
      chaap "Sum: " + sum;
      chaap "Difference: " + diff;
      chaap "Product: " + prod;
      chaap "Quotient: " + quot;
      chaap "Modulus: " + mod;
      
      // Boolean logic & comparisons
      rakho isTrue = sahi;
      rakho isFalse = galat;
      rakho isEqual = 5 == 5;
      rakho isNotEqual = 5 != 3;
      rakho isGreater = 5 > 3;
      rakho isLess = 3 < 5;
      rakho isGreaterEqual = 5 >= 5;
      rakho isLessEqual = 3 <= 3;
      
      chaap "Boolean true: " + isTrue;
      chaap "Boolean false: " + isFalse;
      chaap "Equal: " + isEqual;
      chaap "Not equal: " + isNotEqual;
      chaap "Greater: " + isGreater;
      chaap "Less: " + isLess;
      chaap "Greater or equal: " + isGreaterEqual;
      chaap "Less or equal: " + isLessEqual;
      
      // Control flow - if-else
      rakho age = 20;
      agar age >= 18 {
        chaap "Person is an adult";
      } warna {
        chaap "Person is a minor";
      }
      
      // Control flow - nested if-else with correct syntax
      rakho score = 85;
      agar score >= 90 {
        chaap "Grade: A";
      } warna {
        agar score >= 80 {
          chaap "Grade: B";
        } warna {
          agar score >= 70 {
            chaap "Grade: C";
          } warna {
            chaap "Grade: F";
          }
        }
      }
      
      // Arrays
      rakho fruits = ["Apple", "Banana", "Orange"];
      chaap "First fruit: " + fruits[0];
      chaap "Second fruit: " + fruits[1];
      chaap "Third fruit: " + fruits[2];
      
      // Array modification
      fruits[1] = "Mango";
      chaap "Updated second fruit: " + fruits[1];
      
      // Control flow - while loop
      rakho counter = 1;
      rakho loopResult = "";
      jabtak counter <= 5 {
        loopResult = loopResult + counter;
        counter = counter + 1;
      }
      chaap "Loop result: " + loopResult;
      
      // Functions
      kaam greet(name) {
        wapas "Hello, " + name + "!";
      }
      
      rakho greeting = greet("World");
      chaap greeting;
      
      // Function with multiple parameters
      kaam add(a, b) {
        wapas a + b;
      }
      
      rakho addResult = add(10, 20);
      chaap "Addition result: " + addResult;
      
      // Recursive function
      kaam factorial(n) {
        agar n <= 1 {
          wapas 1;
        } warna {
          wapas n * factorial(n - 1);
        }
      }
      
      rakho factResult = factorial(5);
      chaap "Factorial of 5: " + factResult;
      
      // Nested blocks and scope
      rakho outer = "Outer";
      {
        chaap "Accessing outer variable: " + outer;
        rakho inner = "Inner";
        chaap "Defined inner variable: " + inner;
        
        {
          chaap "Nested block - outer: " + outer;
          chaap "Nested block - inner: " + inner;
          rakho deepest = "Deepest";
          chaap "Defined deepest variable: " + deepest;
        }
      }
      
      // Empty statement
      ;
      
      // Null value
      rakho nullValue = kuch_nahi;
      chaap "Null value: " + nullValue;
      
      // String concatenation
      rakho firstName = "Meme";
      rakho lastName = "Lang";
      rakho fullName = firstName + " " + lastName;
      chaap "Full name: " + fullName;
      
      // Plain function calls without higher-order functions
      kaam multiply(x, y) {
        wapas x * y;
      }
      
      rakho operationResult = multiply(5, 3);
      chaap "Operation result: " + operationResult;
      
      chaap "Comprehensive test completed!";
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    
    // Check that the output contains all the expected values
    expect(result).toContain("Starting comprehensive test...");
    expect(result).toContain("Num: 42");
    expect(result).toContain("String: MemeLang");
    expect(result).toContain("Constant PI: 3.14159");
    
    expect(result).toContain("Sum: 15");
    expect(result).toContain("Difference: 5");
    expect(result).toContain("Product: 50");
    expect(result).toContain("Quotient: 2");
    expect(result).toContain("Modulus: 1");
    
    expect(result).toContain("Boolean true: true");
    expect(result).toContain("Boolean false: false");
    expect(result).toContain("Equal: true");
    expect(result).toContain("Not equal: true");
    expect(result).toContain("Greater: true");
    expect(result).toContain("Less: true");
    expect(result).toContain("Greater or equal: true");
    expect(result).toContain("Less or equal: true");
    
    expect(result).toContain("Person is an adult");
    expect(result).toContain("Grade: B");
    
    expect(result).toContain("First fruit: Apple");
    expect(result).toContain("Second fruit: Banana");
    expect(result).toContain("Third fruit: Orange");
    expect(result).toContain("Updated second fruit: Mango");
    
    expect(result).toContain("Loop result: 12345");
    
    expect(result).toContain("Hello, World!");
    expect(result).toContain("Addition result: 30");
    expect(result).toContain("Factorial of 5: 120");
    
    expect(result).toContain("Accessing outer variable: Outer");
    expect(result).toContain("Defined inner variable: Inner");
    expect(result).toContain("Nested block - outer: Outer");
    expect(result).toContain("Nested block - inner: Inner");
    expect(result).toContain("Defined deepest variable: Deepest");
    
    expect(result).toContain("Null value: null");
    expect(result).toContain("Full name: Meme Lang");
    expect(result).toContain("Operation result: 15");
    
    expect(result).toContain("Comprehensive test completed!");
  });
}); 