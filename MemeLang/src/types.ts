// AST Node types
export type ASTNode = 
  | ProgramNode 
  | VariableDeclarationNode 
  | FunctionDeclarationNode 
  | IfStatementNode 
  | WhileStatementNode 
  | ExpressionStatementNode 
  | BinaryExpressionNode 
  | UnaryExpressionNode 
  | LiteralNode 
  | IdentifierNode 
  | CallExpressionNode 
  | PrintStatementNode
  | ReturnNode
  | AssignmentExpressionNode
  | BlockStatementNode
  | GroupingExpressionNode
  | ArrayExpressionNode
  | MemberExpressionNode
  | EmptyStatementNode;

export interface BaseNode {
  type: string;
}

export interface ProgramNode {
  type: 'Program';
  statements: ASTNode[];
}

export interface VariableDeclarationNode {
  type: 'VariableDeclaration';
  name: Token;
  init: ASTNode;
  isConstant: boolean;
}

export interface FunctionDeclarationNode {
  type: 'FunctionDeclaration';
  name: string;
  parameters: string[];
  body: ASTNode[];
}

export interface IfStatementNode {
  type: 'IfStatement';
  condition: ASTNode;
  thenBranch: ASTNode;
  elseBranch: ASTNode | null;
}

export interface WhileStatementNode {
  type: 'WhileStatement';
  condition: ASTNode;
  body: ASTNode;
}

export interface ExpressionStatementNode {
  type: 'ExpressionStatement';
  expression: ASTNode;
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

export interface LiteralNode extends BaseNode {
  type: 'Literal';
  value: any;
}

export interface IdentifierNode {
  type: 'Identifier';
  name: string;
}

export interface CallExpressionNode {
  type: 'CallExpression';
  callee: ASTNode;
  arguments: ASTNode[];
}

export interface PrintStatementNode {
  type: 'PrintStatement';
  argument: ASTNode;
}

export interface ReturnNode extends BaseNode {
  type: 'ReturnStatement';
  value: ASTNode | null;
}

export interface AssignmentExpressionNode {
  type: 'AssignmentExpression';
  name?: string;
  value: ASTNode;
  object?: ASTNode;
  property?: ASTNode;
  computed?: boolean;
}

export interface BlockStatementNode {
  type: 'BlockStatement';
  statements: ASTNode[];
}

export interface GroupingExpressionNode {
  type: 'GroupingExpression';
  expression: ASTNode;
}

export interface ArrayExpressionNode {
  type: 'ArrayExpression';
  elements: ASTNode[];
}

export interface MemberExpressionNode {
  type: 'MemberExpression';
  object: ASTNode;
  property: ASTNode;
  computed: boolean;
}

export interface EmptyStatementNode {
  type: 'EmptyStatement';
}

// Environment type for interpreter
export interface Environment {
  parent: Environment | null;
  variables: Map<string, { value: any; isConstant: boolean }>;
  functions: Map<string, FunctionDeclaration>;
}

export interface FunctionDeclaration {
  parameters: string[];
  body: ASTNode;
  environment: Environment;
}

export interface Position {
  line: number;
  column: number;
}

export interface Token {
  type: TokenType;
  lexeme: string;
  literal: any;
  value: any;
  position: Position;
}

export enum TokenType {
  // Keywords
  PROGRAM_START = 'PROGRAM_START',
  PROGRAM_END = 'PROGRAM_END',
  PRINT = 'PRINT',
  LET = 'LET',
  CONST = 'CONST',
  IF = 'IF',
  ELSE = 'ELSE',
  WHILE = 'WHILE',
  FUNCTION = 'FUNCTION',
  RETURN = 'RETURN',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL = 'NULL',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',

  // Single-character tokens
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',
  COMMA = 'COMMA',
  DOT = 'DOT',
  SEMICOLON = 'SEMICOLON',
  ASSIGN = 'ASSIGN',
  OPERATOR = 'OPERATOR',

  // Literals
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',

  // End of file
  EOF = 'EOF'
} 