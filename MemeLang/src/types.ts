import { Interpreter } from './interpreter';
import { RuntimeError } from './errors';

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
  | EmptyStatementNode
  | ClassDeclarationNode
  | MethodDefinitionNode
  | ThisExpressionNode
  | NewExpressionNode
  | SuperExpressionNode
  | ImportDeclarationNode
  | ExportDeclarationNode
  | { type: 'EmptyStatement' };

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
  token: Token;
}

export interface CallExpressionNode {
  type: 'CallExpression';
  callee: ASTNode;
  arguments: ASTNode[];
}

export interface PrintStatementNode extends BaseNode {
  type: 'PrintStatement';
  expressions: ASTNode[];
  line: number;
  column: number;
}

export interface ReturnNode extends BaseNode {
  type: 'ReturnStatement';
  value: ASTNode | null;
}

export interface AssignmentExpressionNode {
  type: 'AssignmentExpression';
  left: IdentifierNode | MemberExpressionNode;
  right: ASTNode;
  operator: string;
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
export interface FunctionDeclaration {
  type: 'FunctionDeclaration';
  name: string;
  parameters: string[];
  body: ASTNode[];
  environment?: Environment;
}

export interface Environment {
  variables: Map<string, { value: any, isConstant: boolean }>;
  exports: Map<string, any>;
  functions: Map<string, Function>;
  parent?: Environment;
  interpreter?: Interpreter;
}

export class Environment {
  variables: Map<string, { value: any, isConstant: boolean }>;
  exports: Map<string, any>;
  functions: Map<string, Function>;
  parent?: Environment;
  interpreter?: Interpreter;

  constructor(parent?: Environment) {
    this.variables = new Map();
    this.exports = new Map();
    this.functions = new Map();
    this.parent = parent;
  }

  define(name: string, value: any, isConstant: boolean = false): void {
    this.variables.set(name, { value, isConstant });
  }

  defineFunction(name: string, func: Function): void {
    this.functions.set(name, func);
  }

  get(name: string): { value: any, isConstant: boolean } | undefined {
    const value = this.variables.get(name);
    if (value !== undefined) {
      return value;
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    return undefined;
  }

  getFunction(name: string): Function | undefined {
    const func = this.functions.get(name);
    if (func !== undefined) {
      return func;
    }
    if (this.parent) {
      return this.parent.getFunction(name);
    }
    return undefined;
  }

  set(name: string, value: any): void {
    const existing = this.get(name);
    if (existing && existing.isConstant) {
      throw new RuntimeError(`Cannot reassign constant: ${name}`);
    }
    this.variables.set(name, { value, isConstant: false });
  }

  getParent(): Environment | undefined {
    return this.parent;
  }
}

export interface Position {
  line: number;
  column: number;
}

export interface Token {
  type: TokenType;
  lexeme: string;
  literal: any;
  value?: any;
  position?: Position;
  line: number;
  toString(): string;
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
  // OOP keywords
  CLASS = 'CLASS',
  EXTENDS = 'EXTENDS',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  PROTECTED = 'PROTECTED',
  STATIC = 'STATIC',
  CONSTRUCTOR = 'CONSTRUCTOR',
  THIS = 'THIS',
  SUPER = 'SUPER',
  NEW = 'NEW',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  FROM = 'FROM',
  DEFAULT = 'DEFAULT',

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
  EOF = 'EOF',

  // New additions
  NEWLINE = 'NEWLINE',
  WHITESPACE = 'WHITESPACE'
}

// New node types for OOP
export interface ClassDeclarationNode {
  type: 'ClassDeclaration';
  name: string;
  superClass?: string;
  methods: Array<{
    name: string;
    body: FunctionDeclaration;
    access?: 'public' | 'private' | 'protected';
  }>;
}

export interface MethodDefinitionNode {
  type: 'MethodDefinition';
  key: string;
  name?: string;  // Additional field for compatibility
  value: FunctionDeclarationNode;
  params?: string[];  // Additional field for compatibility
  body?: ASTNode | ASTNode[];  // Additional field for compatibility
  kind: 'constructor' | 'method' | 'get' | 'set';
  static: boolean;
  access: 'public' | 'private' | 'protected';
}

export interface ThisExpressionNode {
  type: 'ThisExpression';
}

export interface NewExpressionNode {
  type: 'NewExpression';
  callee: ASTNode;
  arguments: ASTNode[];
}

export interface SuperExpressionNode {
  type: 'SuperExpression';
}

export interface ImportSpecifier {
  type: 'ImportSpecifier';
  local: { name: string };
  exported: { name: string };
}

export interface ExportSpecifier {
  type: 'ExportSpecifier';
  local: { name: string };
  exported: { name: string };
}

export interface ImportDeclarationNode {
  type: 'ImportDeclaration';
  source: { value: string };
  specifiers: ImportSpecifier[];
}

export interface ExportDeclarationNode {
  type: 'ExportDeclaration';
  declaration?: VariableDeclarationNode | FunctionDeclarationNode | ClassDeclarationNode;
  specifiers?: ExportSpecifier[];
}

export interface MethodDefinition {
  func: Function;  // Simplify to just Function since that's all we need
  static: boolean;
  access: 'public' | 'private' | 'protected';
  isConstructor?: boolean;
} 