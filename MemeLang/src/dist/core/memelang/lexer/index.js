import { TokenType } from '../types/token';
export class Lexer {
    constructor(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.column = 1;
        this.tokenStartColumn = 1;
        this.source = source;
    }
    tokenize() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.tokenStartColumn = this.column;
            this.skipWhitespace();
            if (this.isAtEnd())
                break;
            this.scanToken();
        }
        this.tokens.push(this.createToken(TokenType.EOF, 'EOF'));
        return this.tokens;
    }
    skipWhitespace() {
        while (!this.isAtEnd()) {
            const c = this.peek();
            switch (c) {
                case ' ':
                case '\r':
                case '\t':
                    this.advance();
                    break;
                case '\n':
                    this.line++;
                    this.column = 1;
                    this.advance();
                    break;
                default:
                    return;
            }
        }
    }
    scanToken() {
        const c = this.advance();
        switch (c) {
            case '(':
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case '[':
                this.addToken(TokenType.LEFT_BRACKET);
                break;
            case ']':
                this.addToken(TokenType.RIGHT_BRACKET);
                break;
            case ',':
                this.addToken(TokenType.COMMA);
                break;
            case '.':
                this.addToken(TokenType.DOT);
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON);
                break;
            case '+':
                this.addToken(TokenType.OPERATOR);
                break;
            case '-':
                this.addToken(TokenType.OPERATOR);
                break;
            case '*':
                this.addToken(TokenType.OPERATOR);
                break;
            case '/':
                this.addToken(TokenType.OPERATOR);
                break;
            case '=':
                if (this.match('=')) {
                    this.addToken(TokenType.OPERATOR);
                }
                else {
                    this.addToken(TokenType.ASSIGN);
                }
                break;
            case '!':
                if (this.match('=')) {
                    this.addToken(TokenType.OPERATOR, '!=');
                }
                else {
                    this.addToken(TokenType.OPERATOR);
                }
                break;
            case '<':
                if (this.match('=')) {
                    this.addToken(TokenType.OPERATOR, '<=');
                }
                else {
                    this.addToken(TokenType.OPERATOR);
                }
                break;
            case '>':
                if (this.match('=')) {
                    this.addToken(TokenType.OPERATOR, '>=');
                }
                else {
                    this.addToken(TokenType.OPERATOR);
                }
                break;
            case '"':
                this.string();
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                }
                else if (this.isAlpha(c)) {
                    this.identifier();
                }
                else {
                    throw new Error(`Unexpected character: ${c}`);
                }
                break;
        }
    }
    string() {
        this.advance(); // Skip opening quote
        this.start = this.current;
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 1;
            }
            this.advance();
        }
        if (this.isAtEnd()) {
            throw new Error('Unterminated string.');
        }
        const value = this.source.substring(this.start, this.current);
        this.advance(); // Skip closing quote
        this.tokens.push({
            type: TokenType.STRING,
            value,
            position: { line: this.line, column: this.tokenStartColumn }
        });
    }
    number() {
        while (this.isDigit(this.peek()))
            this.advance();
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek()))
                this.advance();
        }
        const value = this.source.substring(this.start, this.current);
        this.tokens.push({
            type: TokenType.NUMBER,
            value,
            position: { line: this.line, column: this.tokenStartColumn }
        });
    }
    identifier() {
        while (this.isAlphaNumeric(this.peek()))
            this.advance();
        const text = this.source.substring(this.start, this.current);
        const type = this.isKeyword(text) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        const value = type === TokenType.KEYWORD ? this.getKeywordValue(text) : text;
        this.tokens.push({
            type,
            value,
            position: { line: this.line, column: this.tokenStartColumn }
        });
    }
    isKeyword(text) {
        const keywords = ['agar', 'warna', 'jabtak', 'karo', 'rakho', 'chaap'];
        return keywords.includes(text.toLowerCase());
    }
    getKeywordValue(text) {
        const keywordMap = {
            'agar': 'IF',
            'warna': 'ELSE',
            'jabtak': 'WHILE',
            'karo': 'DO',
            'rakho': 'LET',
            'chaap': 'PRINT'
        };
        return keywordMap[text.toLowerCase()] || text.toUpperCase();
    }
    addToken(type, value) {
        const text = value ?? this.source.substring(this.start, this.current);
        this.tokens.push({
            type,
            value: text,
            position: { line: this.line, column: this.tokenStartColumn }
        });
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) !== expected)
            return false;
        this.current++;
        this.column++;
        return true;
    }
    peek() {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.current);
    }
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.current + 1);
    }
    isDigit(c) {
        return c >= '0' && c <= '9';
    }
    isAlpha(c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c === '_';
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }
    advance() {
        this.column++;
        return this.source.charAt(this.current++);
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    createToken(type, value) {
        return {
            type,
            value,
            position: { line: this.line, column: this.column }
        };
    }
}
