export var TokenType;
(function (TokenType) {
    // Program structure
    TokenType["PROGRAM_START"] = "PROGRAM_START";
    TokenType["PROGRAM_END"] = "PROGRAM_END";
    // I/O
    TokenType["PRINT"] = "PRINT";
    TokenType["INPUT"] = "INPUT";
    // Variables
    TokenType["LET"] = "LET";
    TokenType["CONST"] = "CONST";
    // Control Flow
    TokenType["IF"] = "IF";
    TokenType["ELSE"] = "ELSE";
    TokenType["WHILE"] = "WHILE";
    TokenType["BREAK"] = "BREAK";
    TokenType["CONTINUE"] = "CONTINUE";
    // Functions
    TokenType["FUNCTION"] = "FUNCTION";
    TokenType["RETURN"] = "RETURN";
    // Boolean
    TokenType["TRUE"] = "TRUE";
    TokenType["FALSE"] = "FALSE";
    // Logical Operators
    TokenType["AND"] = "AND";
    TokenType["OR"] = "OR";
    TokenType["NOT"] = "NOT";
    // OOP
    TokenType["CLASS"] = "CLASS";
    TokenType["EXTENDS"] = "EXTENDS";
    TokenType["PRIVATE"] = "PRIVATE";
    TokenType["PUBLIC"] = "PUBLIC";
    TokenType["PROTECTED"] = "PROTECTED";
    TokenType["STATIC"] = "STATIC";
    TokenType["CONSTRUCTOR"] = "CONSTRUCTOR";
    TokenType["THIS"] = "THIS";
    TokenType["SUPER"] = "SUPER";
    TokenType["NEW"] = "NEW";
    // Other
    TokenType["NULL"] = "NULL";
    TokenType["UNDEFINED"] = "UNDEFINED";
    // Types
    TokenType["NUMBER"] = "NUMBER";
    TokenType["STRING"] = "STRING";
    TokenType["ARRAY"] = "ARRAY";
    TokenType["OBJECT"] = "OBJECT";
    TokenType["LENGTH"] = "LENGTH";
    // Basic token types
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["OPERATOR"] = "OPERATOR";
    TokenType["ASSIGN"] = "ASSIGN";
    TokenType["KEYWORD"] = "KEYWORD";
    TokenType["EOF"] = "EOF";
    // Punctuation
    TokenType["LEFT_PAREN"] = "LEFT_PAREN";
    TokenType["RIGHT_PAREN"] = "RIGHT_PAREN";
    TokenType["LEFT_BRACE"] = "LEFT_BRACE";
    TokenType["RIGHT_BRACE"] = "RIGHT_BRACE";
    TokenType["LEFT_BRACKET"] = "LEFT_BRACKET";
    TokenType["RIGHT_BRACKET"] = "RIGHT_BRACKET";
    TokenType["COMMA"] = "COMMA";
    TokenType["DOT"] = "DOT";
    TokenType["SEMICOLON"] = "SEMICOLON";
})(TokenType || (TokenType = {}));
