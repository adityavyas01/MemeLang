# MemeLang Language Guide

## Introduction

MemeLang is a fun, interpreted programming language with a simple syntax designed for learning and experimentation. This guide provides a comprehensive overview of the language syntax, features, and usage.

## Program Structure

Every MemeLang program needs to include `hi_bhai` and `bye_bhai` markers:

```js
hi_bhai
  // Your code goes here
bye_bhai
```

Code before `hi_bhai` or after `bye_bhai` will be ignored by the interpreter. This makes it easier to add comments, metadata, or other content outside the program's main execution block.

## Comments

Comments start with `//` for single-line comments or are enclosed between `/*` and `*/` for multi-line comments:

```
// This is a single-line comment

/*
  This is a
  multi-line comment
*/
```

## Variables

Variables are declared using the `rakho` keyword:

```
rakho name = "John";
rakho age = 30;
```

Constants (variables that cannot be reassigned) use `rakho pakka`:

```
rakho pakka PI = 3.14;
```

## Data Types

MemeLang supports the following data types:

- **Numbers**: `42`, `3.14`
- **Strings**: `"Hello, World!"`
- **Booleans**: `sahi` (true), `galat` (false)
- **Null**: `nalla`
- **Arrays**: `[1, 2, 3]`
- **Objects**: `{ name: "John", age: 30 }`

## Operators

### Arithmetic Operators

- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Modulus: `%`

### Comparison Operators

- Equal: `==`
- Not equal: `!=`
- Greater than: `>`
- Less than: `<`
- Greater than or equal: `>=`
- Less than or equal: `<=`

### Logical Operators

- And: `&&`
- Or: `||`
- Not: `!`

## Control Flow

### If-Else Statements

```
if (condition) {
  // code to execute if condition is true
} else if (anotherCondition) {
  // code to execute if anotherCondition is true
} else {
  // code to execute if all conditions are false
}
```

Note: Parentheses around the condition are optional in MemeLang.

### While Loops

```
jabtak condition {
  // code to execute while condition is true
}
```

## Functions

Functions are declared using the `function` keyword after a variable declaration:

```
rakho function add(a, b) {
  return a + b;
}
```

Functions are called with parentheses:

```
rakho result = add(5, 3);
```

## Arrays

Arrays are declared with square brackets:

```
rakho numbers = [1, 2, 3, 4, 5];
```

Access array elements by index (zero-based):

```
rakho firstNumber = numbers[0]; // Gets 1
```

Access the length property with dot notation:

```
rakho count = numbers.length; // Gets 5
```

## Objects

Objects are declared with curly braces:

```
rakho person = {
  name: "John",
  age: 30,
  isStudent: false
};
```

Access object properties with dot notation or bracket notation:

```
chaap person.name;    // Prints "John"
chaap person["age"];  // Prints 30
```

## Built-in Functions

### Print

The `chaap` keyword is used to print values to the console:

```
chaap "Hello, World!";
```

### Memify

The `memify` function adds a "MEME:" prefix to the input text and prints it to the console:

```
memify "Hello, World!";  // Prints "MEME: Hello, World!"
```

### Input

The `input` function reads input (in the current implementation, it returns a default value for testing):

```
rakho userInput = input();
```

## Advanced Features

### Property Access with Dot Notation

MemeLang supports dot notation for accessing properties of objects and arrays:

```
rakho arr = [1, 2, 3, 4, 5];
chaap arr.length;  // Prints 5

rakho person = { name: "John", address: { city: "New York" } };
chaap person.address.city;  // Prints "New York"
```

### Closures

MemeLang supports closures, allowing functions to access variables from their outer scope:

```
rakho function makeCounter() {
  rakho count = 0;
  return function() {
    count = count + 1;
    return count;
  };
}

rakho counter = makeCounter();
chaap counter();  // Prints 1
chaap counter();  // Prints 2
```

### Higher-Order Functions

Functions can be passed as arguments or returned from other functions:

```
rakho function applyOperation(a, b, operation) {
  return operation(a, b);
}

rakho function add(x, y) {
  return x + y;
}

chaap applyOperation(5, 3, add);  // Prints 8
```

## Error Handling

MemeLang provides error messages for common programming errors:

- Syntax errors (missing tokens, incorrect syntax)
- Runtime errors (division by zero, undefined variables)
- Type errors (invalid operations between types)

## Best Practices

1. Use meaningful variable names
2. Add comments to explain complex logic
3. Break down large problems into smaller functions
4. Use consistent indentation (2 or 4 spaces recommended)
5. Initialize variables before using them

## Examples

Check out the `examples` directory for sample programs written in MemeLang, including:

- Bubble sort algorithm
- Simple calculator
- Todo list application
- Array manipulation

## Conclusion

MemeLang is designed to be easy to learn while providing enough features for writing interesting programs. Enjoy experimenting with the language and happy coding! 