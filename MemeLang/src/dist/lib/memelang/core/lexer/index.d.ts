export declare class Lexer {
    private source;
    private position;
    private line;
    private column;
    constructor(source: string);
    tokenize(): {
        type: string;
        value: string;
        line: number;
        column: number;
    }[];
    private nextToken;
    private string;
    private number;
    private identifier;
    private isDigit;
    private isAlpha;
    private isAlphaNumeric;
    private skipWhitespace;
    private advance;
    private peek;
    private peekNext;
    private isAtEnd;
}
