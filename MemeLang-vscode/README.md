# MemeLang VS Code Extension

This extension provides language support for the MemeLang programming language.

## Features

- Syntax highlighting for MemeLang keywords, operators, and built-in functions
- Bracket matching and auto-closing pairs
- Code folding support
- Comment toggling
- Full support for OOP keywords and features
- Import/Export statement highlighting
- Support for `.ml` file extension

## Installation

### From VSIX file

1. Download the `.vsix` file
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X)
4. Click on the "..." in the top-right of the Extensions view
5. Select "Install from VSIX..."
6. Navigate to the downloaded `.vsix` file and install it

### Manual Installation

1. Copy this folder to your VS Code extensions folder:
   - Windows: `%USERPROFILE%\.vscode\extensions`
   - macOS/Linux: `~/.vscode/extensions`
2. Restart VS Code

## MemeLang Language Keywords

### Program Structure
- `hi_bhai` - Program start
- `bye_bhai` - Program end

### Variable Declaration
- `rakho` - Variable declaration (let)
- `pakka` - Constant declaration (const)

### Control Flow
- `agar` - If statement
- `warna` - Else statement
- `jabtak` - While loop
- `bas_karo` - Break statement
- `agla_dekho` - Continue statement

### Functions
- `kaam` - Function declaration
- `wapas` - Return statement

### OOP Features
- `class` - Class declaration
- `extends` - Inheritance
- `constructor` - Constructor method
- `this` - Current instance
- `super` - Parent class reference
- `new` - Create object instance
- `public` - Public access modifier
- `private` - Private access modifier
- `protected` - Protected access modifier
- `static` - Static method/property

### Import/Export
- `import` - Import declaration
- `export` - Export declaration
- `from` - Import source
- `default` - Default export

### Others
- `chaap` - Print statement
- `kuch_nahi` - Null value
- `sahi` - True value
- `galat` - False value
- `aur` - Logical AND
- `ya` - Logical OR
- `nahi` - Logical NOT

## Example

```
hi_bhai
  // Define a Person class
  class Person {
    // Constructor
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
    
    // Method to greet
    namaste() {
      chaap("Namaste, my name is " + this.name + " and I am " + this.age + " years old.");
    }
  }
  
  // Create a Person instance
  rakho rahul = new Person("Rahul", 25);
  rahul.namaste();
bye_bhai
```

## License

MIT 