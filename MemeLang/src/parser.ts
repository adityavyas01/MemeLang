import { Token, TokenType, ASTNode } from './types';
import { CompileError } from './errors';
import { Lexer } from './lexer';

export class Parser {
  private tokens: Token[] = [];
  private current: number = 0;

  constructor(private lexer: Lexer) {
    this.tokens = lexer.tokenize();
    this.tokens.push({
      type: TokenType.EOF,
      lexeme: '',
      literal: null,
      value: null,
      position: {
        line: this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].position.line : 1,
        column: this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].position.column : 1
      }
    });
  }

  public parse(): ASTNode {
    return this.program();
  }

  private program(): ASTNode {
    const statements: ASTNode[] = [];
    
    // Check for program start
    if (!this.match(TokenType.PROGRAM_START)) {
      throw new CompileError("Program must start with 'hi_bhai'", this.peek().position.line, this.peek().position.column);
    }

    while (!this.check(TokenType.PROGRAM_END) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    // Check for program end
    if (!this.match(TokenType.PROGRAM_END)) {
      throw new CompileError("Program must end with 'bye_bhai'", this.peek().position.line, this.peek().position.column);
    }

    return { type: 'Program', statements };
  }

  private declaration(): ASTNode {
    try {
      if (this.match(TokenType.LET, TokenType.CONST)) {
        return this.variableDeclaration();
      }
      if (this.match(TokenType.FUNCTION)) {
        return this.functionDeclaration();
      }
      if (this.match(TokenType.PRINT)) {
        return this.printStatement();
      }
      return this.statement();
    } catch (error) {
      this.synchronize();
      throw error;
    }
  }

  private statement(): ASTNode {
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
    }
    if (this.match(TokenType.WHILE)) {
      return this.whileStatement();
    }
    if (this.match(TokenType.LEFT_BRACE)) {
      return { type: 'BlockStatement', statements: this.block() };
    }
    if (this.match(TokenType.RETURN)) {
      return this.returnStatement();
    }
    if (this.match(TokenType.SEMICOLON)) {
      return { type: 'EmptyStatement' };
    }
    return this.expressionStatement();
  }

  private block(): ASTNode[] {
    const statements: ASTNode[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after block");
    return statements;
  }

  private functionDeclaration(): ASTNode {
    const nameToken = this.consume(TokenType.IDENTIFIER, "Expected function name");
    const name = nameToken.lexeme;
    
    // Make parentheses optional for function declarations
    const parameters: string[] = [];
    if (this.match(TokenType.LEFT_PAREN)) {
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do {
          const paramToken = this.consume(TokenType.IDENTIFIER, "Expected parameter name");
          parameters.push(paramToken.lexeme);
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
    } else {
      // If no parentheses, parse parameters until we see a left brace
      while (!this.check(TokenType.LEFT_BRACE) && !this.isAtEnd()) {
        const paramToken = this.consume(TokenType.IDENTIFIER, "Expected parameter name");
        parameters.push(paramToken.lexeme);
        if (!this.check(TokenType.LEFT_BRACE)) {
          this.consume(TokenType.COMMA, "Expected ',' between parameters");
        }
      }
    }
    
    this.consume(TokenType.LEFT_BRACE, "Expected '{' before function body");
    
    const body = this.block();
    return {
      type: 'FunctionDeclaration',
      name,
      parameters,
      body
    };
  }

  private ifStatement(): ASTNode {
    // Make parentheses optional for if statements
    let condition;
    if (this.match(TokenType.LEFT_PAREN)) {
      condition = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after condition");
    } else {
      condition = this.expression();
    }
    
    const thenBranch = this.statement();
    let elseBranch = null;

    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return {
      type: 'IfStatement',
      condition,
      thenBranch,
      elseBranch
    };
  }

  private whileStatement(): ASTNode {
    // Make parentheses optional for while loops
    let condition;
    if (this.match(TokenType.LEFT_PAREN)) {
      condition = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after condition");
    } else {
      condition = this.expression();
    }
    
    const body = this.statement();

    return {
      type: 'WhileStatement',
      condition,
      body
    };
  }

  private printStatement(): ASTNode {
    // Make parentheses optional for print statements
    let expression;
    if (this.match(TokenType.LEFT_PAREN)) {
      expression = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
    } else {
      expression = this.expression();
    }
    
    // Make semicolons optional for print statements
    if (this.check(TokenType.SEMICOLON)) {
      this.consume(TokenType.SEMICOLON, "Expected ';' after value");
    }

    return {
      type: 'PrintStatement',
      argument: expression
    };
  }

  private returnStatement(): ASTNode {
    const keyword = this.previous();
    let value = null;

    if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE)) {
      value = this.expression();
    }

    // Make semicolons optional for return statements
    if (this.check(TokenType.SEMICOLON)) {
      this.consume(TokenType.SEMICOLON, "Expected ';' after return value");
    }

    return {
      type: 'ReturnStatement',
      value
    };
  }

  private expressionStatement(): ASTNode {
    const expr = this.expression();
    
    // Make semicolons optional for expression statements
    if (this.check(TokenType.SEMICOLON)) {
      this.consume(TokenType.SEMICOLON, "Expected ';' after expression");
    }
    
    return { type: 'ExpressionStatement', expression: expr };
  }

  private expression(): ASTNode {
    return this.assignment();
  }

  private assignment(): ASTNode {
    const expr = this.additive();

    if (this.match(TokenType.ASSIGN)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr.type === 'Identifier') {
        return { type: 'AssignmentExpression', name: expr.name, value };
      } else if (expr.type === 'MemberExpression') {
        return {
          type: 'AssignmentExpression',
          object: expr.object,
          property: expr.property,
          computed: expr.computed,
          value
        };
      }

      throw new CompileError("Invalid assignment target", equals.position.line, equals.position.column);
    }

    return expr;
  }

  private additive(): ASTNode {
    let expr = this.equality();

    while (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().value as string;
      if (operator === '+' || operator === '-') {
        const right = this.equality();
        expr = {
          type: 'BinaryExpression',
          operator,
          left: expr,
          right
        };
      } else {
        this.backup();
        break;
      }
    }

    return expr;
  }

  private equality(): ASTNode {
    let expr = this.comparison();

    while (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().value as string;
      if (operator === '==' || operator === '!=') {
        const right = this.comparison();
        expr = {
          type: 'BinaryExpression',
          operator,
          left: expr,
          right
        };
      } else {
        this.backup();
        break;
      }
    }

    return expr;
  }

  private comparison(): ASTNode {
    let expr = this.term();

    while (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().value as string;
      if (operator === '<' || operator === '<=' || operator === '>' || operator === '>=') {
        const right = this.term();
        expr = {
          type: 'BinaryExpression',
          operator,
          left: expr,
          right
        };
      } else {
        this.backup();
        break;
      }
    }

    return expr;
  }

  private term(): ASTNode {
    let expr = this.unary();

    while (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().value as string;
      if (operator === '*' || operator === '/' || operator === '%') {
        const right = this.unary();
        expr = {
          type: 'BinaryExpression',
          operator,
          left: expr,
          right
        };
      } else {
        this.backup();
        break;
      }
    }

    return expr;
  }

  private unary(): ASTNode {
    if (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().value;
      if (operator === '-' || operator === '!') {
        const right = this.unary();
        return {
          type: 'UnaryExpression',
          operator,
          argument: right
        };
      }
      // If it's not a unary operator, we need to backtrack
      this.current--;
    }

    return this.primary();
  }

  private primary(): ASTNode {
    if (this.match(TokenType.FALSE)) return { type: 'Literal', value: false };
    if (this.match(TokenType.TRUE)) return { type: 'Literal', value: true };
    if (this.match(TokenType.NULL)) return { type: 'Literal', value: null };

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return { type: 'Literal', value: this.previous().value };
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
      return { type: 'GroupingExpression', expression: expr };
    }

    if (this.match(TokenType.LEFT_BRACKET)) {
      const elements: ASTNode[] = [];
      if (!this.check(TokenType.RIGHT_BRACKET)) {
        do {
          elements.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array elements");
      return { type: 'ArrayExpression', elements };
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.previous().lexeme;
      
      // Check if this is a function call with parentheses
      if (this.match(TokenType.LEFT_PAREN)) {
        return this.finishCall(name);
      }
      
      // Check for array access
      if (this.match(TokenType.LEFT_BRACKET)) {
        const index = this.expression();
        this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array index");
        
        return {
          type: 'MemberExpression',
          object: { type: 'Identifier', name },
          property: index,
          computed: true
        };
      }
      
      // Check for property access with dot notation
      if (this.match(TokenType.DOT)) {
        const propertyName = this.consume(TokenType.IDENTIFIER, "Expected property name after '.'").lexeme;
        return {
          type: 'MemberExpression',
          object: { type: 'Identifier', name },
          property: { type: 'Identifier', name: propertyName },
          computed: false
        };
      }
      
      // At this point, we've matched an identifier but not a function call or array access
      // So this is just a variable reference
      return { type: 'Identifier', name };
    }

    throw new CompileError("Expected expression", this.peek().position.line, this.peek().position.column);
  }

  private finishCall(calleeName: string): ASTNode {
    const args: ASTNode[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");

    return {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: calleeName },
      arguments: args
    };
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new CompileError(message, this.peek().position.line, this.peek().position.column);
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.FUNCTION:
        case TokenType.LET:
        case TokenType.CONST:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }

  private variableDeclaration(): ASTNode {
    const isConstant = this.previous().type === TokenType.CONST;
    const name = this.consume(TokenType.IDENTIFIER, "Expected variable name");
    this.consume(TokenType.ASSIGN, "Expected '=' after variable name");
    const init = this.expression();
    
    // Make semicolons optional for variable declarations
    if (this.check(TokenType.SEMICOLON)) {
      this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration");
    }
    
    return { type: 'VariableDeclaration', name, init, isConstant };
  }

  private backup(): void {
    this.current--;
  }
} 