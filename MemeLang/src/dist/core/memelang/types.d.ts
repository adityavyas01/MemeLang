export type ASTNode = ProgramNode | VariableDeclarationNode | FunctionDeclarationNode | IfNode | WhileNode | ReturnNode | PrintNode | ExpressionStatementNode | AssignmentExpressionNode | BinaryExpressionNode | UnaryExpressionNode | ArrayExpressionNode | IdentifierNode | LiteralNode;
export interface ProgramNode {
    type: 'Program';
    body: ASTNode[];
}
export interface VariableDeclarationNode {
    type: 'VariableDeclaration';
    kind: 'let' | 'const';
    identifier: IdentifierNode;
    init: ASTNode;
}
export interface FunctionDeclarationNode {
    type: 'FunctionDeclaration';
    name: IdentifierNode;
    params: IdentifierNode[];
    body: ASTNode[];
}
export interface IfNode {
    type: 'IfStatement';
    test: ASTNode;
    consequent: ASTNode[];
    alternate: ASTNode[] | null;
}
export interface WhileNode {
    type: 'WhileStatement';
    test: ASTNode;
    body: ASTNode[];
}
export interface ReturnNode {
    type: 'ReturnStatement';
    argument: ASTNode;
}
export interface PrintNode {
    type: 'PrintStatement';
    argument: ASTNode;
}
export interface ExpressionStatementNode {
    type: 'ExpressionStatement';
    expression: ASTNode;
}
export interface AssignmentExpressionNode {
    type: 'AssignmentExpression';
    operator: '=';
    left: IdentifierNode;
    right: ASTNode;
}
export interface BinaryExpressionNode {
    type: 'BinaryExpression';
    operator: string;
    left: ASTNode;
    right: ASTNode;
}
export interface UnaryExpressionNode {
    type: 'UnaryExpression';
    operator: string;
    argument: ASTNode;
}
export interface ArrayExpressionNode {
    type: 'ArrayExpression';
    elements: ASTNode[];
}
export interface IdentifierNode {
    type: 'Identifier';
    name: string;
}
export interface LiteralNode {
    type: 'NumberLiteral' | 'StringLiteral' | 'BooleanLiteral' | 'NullLiteral';
    value: any;
}
export interface Environment {
    parent: Environment | null;
    variables: Map<string, any>;
    functions: Map<string, Function>;
}
export interface Position {
    line: number;
    column: number;
}
export interface Token {
    type: string;
    value: string;
    position: Position;
}
