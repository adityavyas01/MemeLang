import { keywords } from './keywords';
import { Token, TokenType, Position } from './types';
import { CompileError } from './errors';

export class Lexer {
  private current: number = 0;
  private start: number = 0;
  private line: number = 1;
  private column: number = 1;
  public input: string = '';

  private keywords: Map<string, TokenType> = new Map([
    ['hi_bhai', TokenType.PROGRAM_START],
    ['bye_bhai', TokenType.PROGRAM_END],
    ['chaap', TokenType.PRINT],
    ['rakho', TokenType.LET],
    ['pakka', TokenType.CONST],
    ['agar', TokenType.IF],
    ['warna', TokenType.ELSE],
    ['jabtak', TokenType.WHILE],
    ['kaam', TokenType.FUNCTION],
    ['wapas', TokenType.RETURN],
    ['sahi', TokenType.TRUE],
    ['galat', TokenType.FALSE],
    ['kuch_nahi', TokenType.NULL],
    ['roko', TokenType.BREAK],
    ['agla', TokenType.CONTINUE],
    ['aur', TokenType.AND],
    ['ya', TokenType.OR],
    ['nahi', TokenType.NOT]
  ]);

  constructor(input: string = '') {
    this.input = input;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (!this.isAtEnd()) {
      this.start = this.current;
      const char = this.advance();
      
      switch (char) {
        case '(':
          tokens.push(this.createToken(TokenType.LEFT_PAREN, '('));
          break;
        case ')':
          tokens.push(this.createToken(TokenType.RIGHT_PAREN, ')'));
          break;
        case '{':
          tokens.push(this.createToken(TokenType.LEFT_BRACE, '{'));
          break;
        case '}':
          tokens.push(this.createToken(TokenType.RIGHT_BRACE, '}'));
          break;
        case '[':
          tokens.push(this.createToken(TokenType.LEFT_BRACKET, '['));
          break;
        case ']':
          tokens.push(this.createToken(TokenType.RIGHT_BRACKET, ']'));
          break;
        case ',':
          tokens.push(this.createToken(TokenType.COMMA, ','));
          break;
        case '.':
          tokens.push(this.createToken(TokenType.DOT, '.'));
          break;
        case '-':
          if (this.isDigit(this.peek())) {
            this.start = this.current - 1;
            this.number();
            const value = parseFloat(this.input.substring(this.start, this.current));
            tokens.push(this.createToken(TokenType.NUMBER, this.input.substring(this.start, this.current), value));
          } else {
            tokens.push(this.createToken(TokenType.OPERATOR, '-', '-'));
          }
          break;
        case '+':
          tokens.push(this.createToken(TokenType.OPERATOR, '+', '+'));
          break;
        case ';':
          tokens.push(this.createToken(TokenType.SEMICOLON, ';'));
          break;
        case '*':
          tokens.push(this.createToken(TokenType.OPERATOR, '*', '*'));
          break;
        case '/':
          if (this.match('/')) {
            // Comment goes until the end of the line
            while (this.peek() !== '\n' && !this.isAtEnd()) {
              this.advance();
            }
          } else {
            tokens.push(this.createToken(TokenType.OPERATOR, '/', '/'));
          }
          break;
        case '%':
          tokens.push(this.createToken(TokenType.OPERATOR, '%', '%'));
          break;
        case '=':
          if (this.match('=')) {
            tokens.push(this.createToken(TokenType.OPERATOR, '==', '=='));
          } else {
            tokens.push(this.createToken(TokenType.ASSIGN, '=', '='));
          }
          break;
        case '!':
          if (this.match('=')) {
            tokens.push(this.createToken(TokenType.OPERATOR, '!=', '!='));
          } else {
            tokens.push(this.createToken(TokenType.OPERATOR, '!', '!'));
          }
          break;
        case '<':
          if (this.match('=')) {
            tokens.push(this.createToken(TokenType.OPERATOR, '<=', '<='));
          } else {
            tokens.push(this.createToken(TokenType.OPERATOR, '<', '<'));
          }
          break;
        case '>':
          if (this.match('=')) {
            tokens.push(this.createToken(TokenType.OPERATOR, '>=', '>='));
          } else {
            tokens.push(this.createToken(TokenType.OPERATOR, '>', '>'));
          }
          break;
        case '"':
          tokens.push(this.string());
          break;
        case ' ':
        case '\r':
        case '\t':
          // Ignore whitespace
          break;
        case '\n':
          // Already handled in advance()
          break;
        default:
          if (this.isDigit(char)) {
            this.number();
            const value = parseFloat(this.input.substring(this.start, this.current));
            tokens.push(this.createToken(TokenType.NUMBER, this.input.substring(this.start, this.current), value));
          } else if (this.isAlpha(char)) {
            tokens.push(this.identifier());
          } else {
            throw new CompileError(`Unexpected character: ${char}`, this.line, this.column);
          }
      }
    }
    
    return tokens;
  }

  private number(): void {
    while (this.isDigit(this.peek())) this.advance();

    // Look for a decimal part
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }
  }

  private string(): Token {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      throw new CompileError('Unterminated string', this.line, this.column);
    }

    this.advance(); // consume closing quote
    const value = this.input.substring(this.start + 1, this.current - 1);
    return this.createToken(TokenType.STRING, this.input.substring(this.start, this.current), value);
  }

  private identifier(): Token {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const lexeme = this.input.substring(this.start, this.current);
    
    // Special handling for program start/end
    if (lexeme === 'hi_bhai') {
      return this.createToken(TokenType.PROGRAM_START, lexeme);
    }
    if (lexeme === 'bye_bhai') {
      return this.createToken(TokenType.PROGRAM_END, lexeme);
    }
    
    // Handle other keywords
    switch (lexeme) {
      case 'chaap':
        return this.createToken(TokenType.PRINT, lexeme);
      case 'rakho':
        return this.createToken(TokenType.LET, lexeme);
      case 'pakka':
        return this.createToken(TokenType.CONST, lexeme);
      case 'agar':
        return this.createToken(TokenType.IF, lexeme);
      case 'warna':
        return this.createToken(TokenType.ELSE, lexeme);
      case 'jabtak':
        return this.createToken(TokenType.WHILE, lexeme);
      case 'kaam':
        return this.createToken(TokenType.FUNCTION, lexeme);
      case 'wapas':
        return this.createToken(TokenType.RETURN, lexeme);
      case 'sahi':
        return this.createToken(TokenType.TRUE, lexeme, true);
      case 'galat':
        return this.createToken(TokenType.FALSE, lexeme, false);
      case 'kuch_nahi':
        return this.createToken(TokenType.NULL, lexeme, null);
      case 'roko':
        return this.createToken(TokenType.BREAK, lexeme);
      case 'agla':
        return this.createToken(TokenType.CONTINUE, lexeme);
      case 'aur':
        return this.createToken(TokenType.AND, lexeme);
      case 'ya':
        return this.createToken(TokenType.OR, lexeme);
      case 'nahi':
        return this.createToken(TokenType.NOT, lexeme);
      default:
        return this.createToken(TokenType.IDENTIFIER, lexeme);
    }
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.input[this.current] !== expected) return false;
    this.current++;
    this.column++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.input[this.current];
  }

  private peekNext(): string {
    if (this.current + 1 >= this.input.length) return '\0';
    return this.input[this.current + 1];
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private isAtEnd(): boolean {
    return this.current >= this.input.length;
  }

  private advance(): string {
    const char = this.input[this.current++];
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private createToken(type: TokenType, lexeme: string, literal: any = null): Token {
    return {
      type,
      lexeme,
      literal,
      value: literal,
      position: {
        line: this.line,
        column: this.column
      }
    };
  }
} 