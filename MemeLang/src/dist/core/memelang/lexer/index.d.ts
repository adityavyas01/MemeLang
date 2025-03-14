import { Token } from '../types/token';
export declare class Lexer {
    private source;
    private tokens;
    private start;
    private current;
    private line;
    private column;
    private tokenStartColumn;
    constructor(source: string);
    tokenize(): Token[];
    private skipWhitespace;
    private scanToken;
    private string;
    private number;
    private identifier;
    private isKeyword;
    private getKeywordValue;
    private addToken;
    private match;
    private peek;
    private peekNext;
    private isDigit;
    private isAlpha;
    private isAlphaNumeric;
    private advance;
    private isAtEnd;
    private createToken;
}
