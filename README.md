# MemeLang: Programming Language with Hindi Memes

MemeLang is a fun programming language that brings Indian pop culture into coding! It's a JavaScript-based interpreter that features Hindi keywords and Bollywood-inspired error messages, making programming more approachable and enjoyable for Hindi speakers.

![MemeLang Logo](https://via.placeholder.com/150x150)

## Features

- **Hindi Keywords**: Write code using Hindi/English hybrid keywords (`hi_bhai`, `bye_bhai`, `rakho`, `chaap`, etc.)
- **Fun Error Messages**: Get error messages with Hindi meme phrases
- **JavaScript-like Syntax**: Familiar syntax for easier learning
- **Object-Oriented**: Classes, inheritance, and methods
- **Built-in Meme Functions**: Use `memify` to add meme context to your output strings
- **Web Playground**: Try the language directly in your browser
- **Bollywood-Inspired Error Messages**: Get helpful error feedback with popular Hindi memes and movie quotes
- **Web-Based IDE**: Code and run programs directly in the browser with syntax highlighting
- **Complete Language Features**: Variables, functions, arrays, control flow statements, and more
- **TypeScript Implementation**: Robust interpreter built with TypeScript
- **Object-Oriented Programming**: Full support for classes, inheritance, and encapsulation
- **Modules System**: Import/export functionality for code organization
- **Responsive Design**: Mobile-friendly UI that adapts to different screen sizes
- **Dark/Light Theme**: Toggle between dark and light themes based on your preference
- **File System Integration**: Save and load MemeLang files directly from your browser
- **Built-in Examples**: Learn by example with a variety of sample programs
- **Comprehensive Documentation**: Detailed documentation for all language features

## Demo

Visit our [live demo](https://memelang.vercel.app) (or deploy your own instance)

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MemeLang.git
   cd MemeLang
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Language Syntax

### Program Structure

Every MemeLang program must include `hi_bhai` and `bye_bhai` markers:

```js
hi_bhai
  chaap("Namaste Duniya!");  // Print "Hello World!"
bye_bhai
```

Any code before `hi_bhai` or after `bye_bhai` will be ignored by the interpreter, making it easier to include comments or additional information outside the program's main execution block.

### Variables

Declare variables with `rakho` (let) or `pakka` (const):

```
rakho naam = "Rahul";
pakka umar = 25;
```

### Output

Print to the console with `chaap`:

```
chaap("Namaste " + naam);
```

### Conditionals

Use `agar` (if) and `warna` (else) for conditionals:

```
agar (umar >= 18) {
  chaap("Aap vote kar sakte hain!");
} warna {
  chaap("Aap abhi vote nahi kar sakte!");
}
```

### Loops

Use `jabtak` (while) for loops:

```
rakho count = 1;
jabtak (count <= 5) {
  chaap("Count: " + count);
  count = count + 1;
}
```

### Functions

Declare functions with `kaam` and return values with `wapas`:

```
kaam namaste(naam) {
  wapas "Namaste, " + naam + "!";
}

rakho sandesh = namaste("Rahul");
chaap(sandesh);
```

### Object-Oriented Programming

Define classes and create objects:

```
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  namaste() {
    chaap("Namaste, my name is " + this.name);
  }
}

rakho rahul = new Person("Rahul", 25);
rahul.namaste();
```

### Inheritance

Create classes that extend other classes:

```
class Student extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }
  
  study() {
    chaap(this.name + " is studying " + this.subject);
  }
}
```

### Modules and Import/Export

MemeLang supports a module system to organize your code:

```
// math.ml
hi_bhai
  // Export a function to add two numbers
  export kaam add(a, b) {
    wapas a + b;
  }
  
  // Export default multiplication function
  export default kaam multiply(a, b) {
    wapas a * b;
  }
bye_bhai

// main.ml
hi_bhai
  // Import specific functions from a module
  import { add } from "./math.ml";
  
  // Import the default export
  import multiply from "./math.ml";
  
  chaap("3 + 4 = " + add(3, 4));
  chaap("5 * 6 = " + multiply(5, 6));
bye_bhai
```

### Access Modifiers

Control visibility with access modifiers:

```
class Example {
  public publicMethod() {
    // Accessible from anywhere
  }
  
  private privateMethod() {
    // Only accessible within this class
  }
  
  protected protectedMethod() {
    // Accessible within this class and subclasses
  }
  
  static staticMethod() {
    // Called on the class itself, not instances
  }
}
```

### Data Types

MemeLang supports:
- Strings: `"Hello"`, `'World'`
- Numbers: `42`, `3.14`
- Booleans: `sahi` (true), `galat` (false)
- Arrays: `[1, 2, 3]`
- Null: `kuch_nahi` (null)
- Objects: Created with classes

## Error Messages

MemeLang features fun and culturally relevant error messages:

- **Variable not defined**: "Rasode mein kaun tha? Variable नहीं था!"
- **Division by zero**: "अनंत से मिलने की कोशिश? जीरो से डिवाइड!"
- **Syntax error**: "अरे भाई भाई भाई! गलत token लिख दिया तूने!"

## IDE Features

The web-based IDE includes:

- **Syntax Highlighting**: Colorful highlighting for keywords, strings, and more
- **Error Reporting**: Clear and humorous error messages
- **File System**: Save and load your code
- **Examples Gallery**: Learn from pre-built examples
- **Documentation**: Access comprehensive documentation
- **Responsive Design**: Works on desktop and mobile devices
- **Theme Toggle**: Switch between light and dark themes

## VS Code Extension

MemeLang also provides a VS Code extension for a native coding experience:

1. Install the extension from the `MemeLang-vscode` directory
2. Create files with the `.ml` extension
3. Enjoy syntax highlighting, bracket matching, and more

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by BhaiLang and other fun programming languages
- Special thanks to the Indian meme community for the error messages
- Built with Next.js, TypeScript, and Monaco Editor 

# Running Tests

The following test commands are available:

- `npm test`: Run all tests with Jest
- `npm run test:coverage`: Run tests with coverage report
- `npm run test:watch`: Run tests in watch mode
- `npm run test:optimized`: Run tests with optimized settings for better performance
- `npm run test:minimal`: Run a minimal test that avoids UI lag and memory issues

If you're experiencing lag or memory issues when running tests, use the minimal test option:

```bash
npm run test:minimal
```

This runs a highly optimized test that disables all debug output and performs only essential operations to verify that the interpreter is working correctly. 