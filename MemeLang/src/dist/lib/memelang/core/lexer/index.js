import { keywords } from '../keywords';
import { CompileError } from '../errors';
export class Lexer {
    constructor(source) {
        this.source = source;
        this.position = 0;
        this.line = 1;
        this.column = 1;
    }
    tokenize() {
        const tokens = [];
        while (!this.isAtEnd()) {
            try {
                const token = this.nextToken();
                if (token) {
                    tokens.push(token);
                }
            }
            catch (error) {
                if (error instanceof CompileError) {
                    throw error;
                }
                throw new CompileError(`Unexpected error at line ${this.line}, column ${this.column}`);
            }
        }
        return tokens;
    }
    nextToken() {
        this.skipWhitespace();
        if (this.isAtEnd())
            return null;
        const char = this.peek();
        // Handle string literals
        if (char === '"') {
            return this.string();
        }
        // Handle numbers
        if (this.isDigit(char)) {
            return this.number();
        }
        // Handle identifiers and keywords
        if (this.isAlpha(char)) {
            return this.identifier();
        }
        // Handle single-character tokens
        this.advance();
        return {
            type: char,
            value: char,
            line: this.line,
            column: this.column - 1
        };
    }
    string() {
        this.advance(); // Skip opening quote
        let value = '';
        while (!this.isAtEnd() && this.peek() !== '"') {
            value += this.advance();
        }
        if (this.isAtEnd()) {
            throw new CompileError('Unterminated string');
        }
        this.advance(); // Skip closing quote
        return {
            type: 'STRING',
            value,
            line: this.line,
            column: this.column - value.length - 2
        };
    }
    number() {
        let value = '';
        while (!this.isAtEnd() && this.isDigit(this.peek())) {
            value += this.advance();
        }
        // Handle decimal numbers
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            value += this.advance(); // Consume the dot
            while (this.isDigit(this.peek())) {
                value += this.advance();
            }
        }
        return {
            type: 'NUMBER',
            value,
            line: this.line,
            column: this.column - value.length
        };
    }
    identifier() {
        let value = '';
        while (!this.isAtEnd() && (this.isAlphaNumeric(this.peek()) || this.peek() === '_')) {
            value += this.advance();
        }
        // Check if it's a keyword
        const type = Object.entries(keywords).find(([k]) => k === value)?.[1] || 'IDENTIFIER';
        return {
            type,
            value,
            line: this.line,
            column: this.column - value.length
        };
    }
    isDigit(char) {
        return char >= '0' && char <= '9';
    }
    isAlpha(char) {
        return (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            char === '_';
    }
    isAlphaNumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }
    skipWhitespace() {
        while (!this.isAtEnd()) {
            const char = this.peek();
            if (char === ' ' || char === '\t' || char === '\r') {
                this.advance();
            }
            else if (char === '\n') {
                this.line++;
                this.column = 1;
                this.advance();
            }
            else {
                break;
            }
        }
    }
    advance() {
        const char = this.source[this.position];
        this.position++;
        this.column++;
        return char;
    }
    peek() {
        return this.source[this.position];
    }
    peekNext() {
        return this.position + 1 >= this.source.length ? '\0' : this.source[this.position + 1];
    }
    isAtEnd() {
        return this.position >= this.source.length;
    }
}
