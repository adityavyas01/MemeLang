import { Interpreter } from '../interpreter';

describe('MemeLang Advanced Features', () => {
  let interpreter: Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test('Higher-order functions', () => {
    const code = `hi_bhai
      // Define a function that returns a function
      rakho function makeMultiplier(factor) {
        return function(x) {
          return x * factor;
        };
      }
      
      // Create specific multiplier functions
      rakho double = makeMultiplier(2);
      rakho triple = makeMultiplier(3);
      
      // Use the returned functions
      chaap "Double 5: " + double(5);
      chaap "Triple 5: " + triple(5);
      
      // Higher-order function that takes a function as argument
      rakho function applyOperation(x, operation) {
        return operation(x);
      }
      
      chaap "Apply double to 10: " + applyOperation(10, double);
      chaap "Apply triple to 10: " + applyOperation(10, triple);
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual([
      'Double 5: 10',
      'Triple 5: 15',
      'Apply double to 10: 20',
      'Apply triple to 10: 30'
    ]);
  });

  test('Closures and lexical scoping', () => {
    const code = `hi_bhai
      rakho function makeCounter() {
        rakho count = 0;
        return function() {
          count = count + 1;
          return count;
        };
      }
      
      rakho counter1 = makeCounter();
      rakho counter2 = makeCounter();
      
      chaap "Counter1 first call: " + counter1();
      chaap "Counter1 second call: " + counter1();
      chaap "Counter2 first call: " + counter2(); // Should be independent
      chaap "Counter1 third call: " + counter1();
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual([
      'Counter1 first call: 1',
      'Counter1 second call: 2',
      'Counter2 first call: 1',
      'Counter1 third call: 3'
    ]);
  });

  test('Complex property access with dot notation', () => {
    const code = `hi_bhai
      // Create a person object
      rakho person = {
        name: "John",
        age: 30,
        address: {
          street: "123 Main St",
          city: "Anytown",
          zip: "12345"
        },
        friends: ["Alice", "Bob", "Charlie"]
      };
      
      // Access nested properties
      chaap "Name: " + person.name;
      chaap "Age: " + person.age;
      chaap "Street: " + person.address.street;
      chaap "City: " + person.address.city;
      
      // Access array element inside object
      chaap "First friend: " + person.friends[0];
      chaap "Number of friends: " + person.friends.length;
      
      // Modify object properties
      person.age = 31;
      person.address.city = "New City";
      
      chaap "Updated age: " + person.age;
      chaap "Updated city: " + person.address.city;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual([
      'Name: John',
      'Age: 30',
      'Street: 123 Main St',
      'City: Anytown',
      'First friend: Alice',
      'Number of friends: 3',
      'Updated age: 31',
      'Updated city: New City'
    ]);
  });

  test('Array methods and operations', () => {
    const code = `hi_bhai
      rakho numbers = [1, 2, 3, 4, 5];
      
      // Basic array operations
      chaap "Original array: " + numbers;
      chaap "Array length: " + numbers.length;
      
      // Accessing elements
      chaap "First element: " + numbers[0];
      chaap "Last element: " + numbers[numbers.length - 1];
      
      // Modifying elements
      numbers[0] = 10;
      chaap "After modification: " + numbers;
      
      // Adding elements
      numbers[numbers.length] = 6;
      chaap "After adding element: " + numbers;
      
      // Array methods (if supported)
      // Custom implementation of map (since we're in a custom language)
      rakho function map(arr, fn) {
        rakho result = [];
        rakho i = 0;
        jabtak i < arr.length {
          result[i] = fn(arr[i]);
          i = i + 1;
        }
        return result;
      }
      
      rakho function double(x) {
        return x * 2;
      }
      
      rakho doubled = map(numbers, double);
      chaap "Doubled array: " + doubled;
      
      // Custom filter implementation
      rakho function filter(arr, predicate) {
        rakho result = [];
        rakho i = 0;
        rakho resultIndex = 0;
        jabtak i < arr.length {
          if (predicate(arr[i])) {
            result[resultIndex] = arr[i];
            resultIndex = resultIndex + 1;
          }
          i = i + 1;
        }
        return result;
      }
      
      rakho function isEven(x) {
        return x % 2 == 0;
      }
      
      rakho evenNumbers = filter(numbers, isEven);
      chaap "Even numbers: " + evenNumbers;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    // We expect the strings to match these patterns
    expect(result[0]).toMatch(/Original array:/);
    expect(result[1]).toMatch(/Array length: 5/);
    expect(result[2]).toMatch(/First element: 1/);
    expect(result[3]).toMatch(/Last element: 5/);
    expect(result[4]).toMatch(/After modification:/);
    expect(result[4]).toMatch(/10/);
    expect(result[5]).toMatch(/After adding element:/);
    expect(result[5]).toMatch(/6/);
    expect(result[6]).toMatch(/Doubled array:/);
    expect(result[7]).toMatch(/Even numbers:/);
  });

  test('Function recursion with memoization', () => {
    const code = `hi_bhai
      // Create a memoized fibonacci function
      rakho memo = [];
      
      rakho function fibonacci(n) {
        // Check if we've already calculated this value
        if (memo[n] != nalla) {
          return memo[n];
        }
        
        // Base cases
        if (n <= 1) {
          memo[n] = n;
          return n;
        }
        
        // Recursive calculation with memoization
        memo[n] = fibonacci(n-1) + fibonacci(n-2);
        return memo[n];
      }
      
      // Calculate fibonacci values
      rakho i = 0;
      jabtak i <= 10 {
        chaap "Fibonacci(" + i + "): " + fibonacci(i);
        i = i + 1;
      }
      
      // Measure performance by calling a larger value
      // This should be fast due to memoization
      chaap "Fibonacci(20): " + fibonacci(20);
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toContain('Fibonacci(0): 0');
    expect(result).toContain('Fibonacci(1): 1');
    expect(result).toContain('Fibonacci(2): 1');
    expect(result).toContain('Fibonacci(3): 2');
    expect(result).toContain('Fibonacci(5): 5');
    expect(result).toContain('Fibonacci(8): 21');
    expect(result).toContain('Fibonacci(10): 55');
    expect(result).toContain('Fibonacci(20): 6765');
  });

  test('Complex control flow and operators', () => {
    const code = `hi_bhai
      // Testing various combinations of control flow and operators
      rakho x = 10;
      rakho y = 5;
      
      // Compound conditions
      if ((x > 5 && y < 10) || x % y == 0) {
        chaap "Complex condition satisfied";
      }
      
      // Nested loops with breaks
      rakho i = 0;
      rakho found = false;
      
      jabtak i < 10 {
        rakho j = 0;
        jabtak j < 10 {
          if (i * j == 15) {
            chaap "Found i=" + i + ", j=" + j + " where i*j=15";
            found = true;
            // In a real language, we'd break here
            j = 10; // Simulate a break
          }
          j = j + 1;
        }
        
        if (found) {
          i = 10; // Simulate a break from outer loop
        } else {
          i = i + 1;
        }
      }
      
      // Conditional expressions
      rakho max = x > y ? x : y;
      chaap "Max value: " + max;
      
      // Testing all comparison operators
      chaap "x == y: " + (x == y);
      chaap "x != y: " + (x != y);
      chaap "x < y: " + (x < y);
      chaap "x <= y: " + (x <= y);
      chaap "x > y: " + (x > y);
      chaap "x >= y: " + (x >= y);
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toContain('Complex condition satisfied');
    expect(result).toContain('Found i=3, j=5 where i*j=15');
    expect(result).toContain('Max value: 10');
    expect(result).toContain('x == y: false');
    expect(result).toContain('x != y: true');
    expect(result).toContain('x < y: false');
    expect(result).toContain('x <= y: false');
    expect(result).toContain('x > y: true');
    expect(result).toContain('x >= y: true');
  });
}); 