# MemeLang NPM Package

MemeLang is a fun programming language with Hindi meme-inspired syntax. This guide explains how to use MemeLang as an npm package.

## Installation

Install MemeLang globally:

```bash
npm install -g memelang
```

## Using MemeLang

Once installed, you can run MemeLang scripts from anywhere on your system:

```bash
memelang yourscript.ml
```

## Creating MemeLang Scripts

Create a file with `.ml` extension and write MemeLang code:

```
hi_bhai
  rakho x = 10;
  rakho y = 20;
  rakho sum = x + y;
  chaap("Sum is: " + sum);
bye_bhai
```

## MemeLang Syntax Basics

- Programs start with `hi_bhai` and end with `bye_bhai`
- Declare variables with `rakho`
- Print to console with `chaap()`
- Statements end with semicolons
- For more syntax details, refer to the main [MemeLang README.md](README.md)

## Using MemeLang in Node.js Projects

You can also use MemeLang as a dependency in your Node.js projects:

```bash
npm install memelang --save
```

Then, in your JavaScript/TypeScript code:

```javascript
const { Interpreter } = require('memelang');

const code = `
hi_bhai
  rakho x = 10;
  rakho y = 20;
  rakho sum = x + y;
  chaap("Sum is: " + sum);
bye_bhai
`;

const interpreter = new Interpreter(code);
interpreter.interpret(code).then(output => {
  console.log('Program output:', output);
}).catch(error => {
  console.error('Error running script:', error);
});
```

## Use MemeLang Without Installing

If you don't want to install MemeLang, you can use `npx`:

```bash
npx memelang yourscript.ml
```

This will download and run the MemeLang package temporarily.

## Contributing

Feel free to contribute to MemeLang! See the main [README.md](README.md) for more details. 