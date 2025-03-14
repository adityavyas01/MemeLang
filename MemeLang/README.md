# MemeLang: Programming Language with Hindi Memes

MemeLang is a fun programming language that brings Indian pop culture into coding! It's a JavaScript-based interpreter that features Hindi keywords and Bollywood-inspired error messages, making programming more approachable and enjoyable for Hindi speakers.

![MemeLang Logo](https://via.placeholder.com/150x150)

## Features

- **Hindi Keywords**: Write code using Hindi/English hybrid keywords (`hi_bhai`, `bye_bhai`, `rakho`, `chaap`, etc.)
- **Bollywood-Inspired Error Messages**: Get helpful error feedback with popular Hindi memes and movie quotes
- **Web-Based IDE**: Code and run programs directly in the browser with syntax highlighting
- **Complete Language Features**: Variables, functions, arrays, control flow statements, and more
- **TypeScript Implementation**: Robust interpreter built with TypeScript

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

Every MemeLang program must start with `hi_bhai` and end with `bye_bhai`:

```
hi_bhai
  chaap("Namaste Duniya!");
bye_bhai
```

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

### Data Types

MemeLang supports:
- Strings: `"Hello"`, `'World'`
- Numbers: `42`, `3.14`
- Booleans: `sahi` (true), `galat` (false)
- Arrays: `[1, 2, 3]`
- Null: `kuch_nahi` (null)

## Error Messages

MemeLang features fun and culturally relevant error messages:

- **Variable not defined**: "Rasode mein kaun tha? Variable नहीं था!"
- **Division by zero**: "अनंत से मिलने की कोशिश? जीरो से डिवाइड!"
- **Syntax error**: "अरे भाई भाई भाई! गलत token लिख दिया तूने!"

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