"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const keywords_1 = require("../src/keywords");
const errors_1 = require("../errors");
class Lexer {
    constructor(source) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.source = source;
    }
    createToken(type, value) {
        return {
            type,
            value,
            position: { line: this.line, column: this.column }
        };
    }
    isWhitespace(char) {
        return /\s/.test(char);
    }
    isDigit(char) {
        return /[0-9]/.test(char);
    }
    isAlpha(char) {
        return /[a-zA-Z_]/.test(char);
    }
    isAlphanumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }
    peek() {
        return this.source[this.position] || '';
    }
    peekNext() {
        return this.source[this.position + 1] || '';
    }
    advance() {
        const char = this.peek();
        this.position++;
        if (char === '\n') {
            this.line++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        return char;
    }
    scanString() {
        let value = '';
        this.advance(); // Skip opening quote
        while (this.peek() && this.peek() !== '"') {
            if (this.peek() === '\\') {
                this.advance();
                switch (this.peek()) {
                    case 'n':
                        value += '\n';
                        break;
                    case 't':
                        value += '\t';
                        break;
                    case '"':
                        value += '"';
                        break;
                    case '\\':
                        value += '\\';
                        break;
                    default:
                        throw new errors_1.CompileTimeError(`Invalid escape sequence: \\${this.peek()}`, { line: this.line, column: this.column });
                }
            }
            else {
                value += this.peek();
            }
            this.advance();
        }
        if (this.peek() !== '"') {
            throw new errors_1.CompileTimeError('Unterminated string literal', { line: this.line, column: this.column });
        }
        this.advance(); // Skip closing quote
        return this.createToken('STRING', value);
    }
    scanNumber() {
        let value = '';
        let hasDecimal = false;
        while (this.peek() && (this.isDigit(this.peek()) || this.peek() === '.')) {
            if (this.peek() === '.') {
                if (hasDecimal) {
                    throw new errors_1.CompileTimeError('Invalid number format: multiple decimal points', { line: this.line, column: this.column });
                }
                hasDecimal = true;
            }
            value += this.advance();
        }
        return this.createToken('NUMBER', value);
    }
    scanIdentifier() {
        let value = '';
        while (this.peek() && this.isAlphanumeric(this.peek())) {
            value += this.advance();
        }
        const keyword = keywords_1.keywords[value];
        return keyword ?
            this.createToken('KEYWORD', keyword) :
            this.createToken('IDENTIFIER', value);
    }
    tokenize() {
        while (this.position < this.source.length) {
            const char = this.peek();
            if (this.isWhitespace(char)) {
                this.advance();
                continue;
            }
            // Comments
            if (char === '#') {
                while (this.peek() && this.peek() !== '\n') {
                    this.advance();
                }
                continue;
            }
            // Strings
            if (char === '"' || char === "'") {
                this.tokens.push(this.scanString());
                continue;
            }
            // Numbers
            if (this.isDigit(char)) {
                this.tokens.push(this.scanNumber());
                continue;
            }
            // Identifiers and Keywords
            if (this.isAlpha(char)) {
                this.tokens.push(this.scanIdentifier());
                continue;
            }
            // Two-character operators
            if ("=!<>".includes(char)) {
                let operator = char;
                if (this.peekNext() === '=') {
                    operator += this.advance();
                }
                this.tokens.push(this.createToken('OPERATOR', operator));
                this.advance();
                continue;
            }
            // Single-character operators and delimiters
            if ("+-*/%(){}[];,".includes(char)) {
                this.tokens.push(this.createToken('SYMBOL', char));
                this.advance();
                continue;
            }
            throw new errors_1.CompileTimeError(`Unexpected character: ${char}`, { line: this.line, column: this.column });
        }
        this.tokens.push(this.createToken('EOF', 'EOF'));
        return this.tokens;
    }
}
exports.Lexer = Lexer;
