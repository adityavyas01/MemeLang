export interface Position {
    line: number;
    column: number;
}
export type TokenType = 'KEYWORD' | 'IDENTIFIER' | 'STRING' | 'NUMBER' | 'OPERATOR' | 'SYMBOL' | 'EOF';
export interface Token {
    type: TokenType;
    value: string;
    position: Position;
}
export type NodeType = 'Program' | 'Statement' | 'Expression' | 'BinaryExpression' | 'UnaryExpression' | 'Literal' | 'Identifier' | 'VariableDeclaration' | 'FunctionDeclaration' | 'ClassDeclaration' | 'IfStatement' | 'WhileStatement' | 'ReturnStatement' | 'CallExpression' | 'MemberExpression' | 'BlockStatement';
export interface ASTNode {
    type: NodeType;
    position: Position;
}
export type Value = string | number | boolean | null | Value[] | {
    [key: string]: Value;
} | Function;
export interface Context {
    variables: Map<string, Value>;
    functions: Map<string, Function>;
    parent?: Context;
}
export type ErrorType = 'SyntaxError' | 'RuntimeError' | 'TypeError' | 'ReferenceError';
export interface LanguageConfig {
    keywords: Record<string, string>;
    maxLoopIterations: number;
    maxRecursionDepth: number;
    maxStringLength: number;
}
