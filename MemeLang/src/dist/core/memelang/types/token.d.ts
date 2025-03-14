export declare enum TokenType {
    PROGRAM_START = "PROGRAM_START",
    PROGRAM_END = "PROGRAM_END",
    PRINT = "PRINT",
    INPUT = "INPUT",
    LET = "LET",
    CONST = "CONST",
    IF = "IF",
    ELSE = "ELSE",
    WHILE = "WHILE",
    BREAK = "BREAK",
    CONTINUE = "CONTINUE",
    FUNCTION = "FUNCTION",
    RETURN = "RETURN",
    TRUE = "TRUE",
    FALSE = "FALSE",
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    CLASS = "CLASS",
    EXTENDS = "EXTENDS",
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    STATIC = "STATIC",
    CONSTRUCTOR = "CONSTRUCTOR",
    THIS = "THIS",
    SUPER = "SUPER",
    NEW = "NEW",
    NULL = "NULL",
    UNDEFINED = "UNDEFINED",
    NUMBER = "NUMBER",
    STRING = "STRING",
    ARRAY = "ARRAY",
    OBJECT = "OBJECT",
    LENGTH = "LENGTH",
    IDENTIFIER = "IDENTIFIER",
    OPERATOR = "OPERATOR",
    ASSIGN = "ASSIGN",
    KEYWORD = "KEYWORD",
    EOF = "EOF",
    LEFT_PAREN = "LEFT_PAREN",
    RIGHT_PAREN = "RIGHT_PAREN",
    LEFT_BRACE = "LEFT_BRACE",
    RIGHT_BRACE = "RIGHT_BRACE",
    LEFT_BRACKET = "LEFT_BRACKET",
    RIGHT_BRACKET = "RIGHT_BRACKET",
    COMMA = "COMMA",
    DOT = "DOT",
    SEMICOLON = "SEMICOLON"
}
export interface Position {
    line: number;
    column: number;
}
export interface Token {
    type: TokenType;
    value: string | number;
    position: Position;
}
