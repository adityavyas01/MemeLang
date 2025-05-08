import { 
  Token, 
  TokenType, 
  ASTNode, 
  ProgramNode,
  IdentifierNode,
  MemberExpressionNode,
  AssignmentExpressionNode,
  FunctionDeclaration,
  VariableDeclarationNode,
  ClassDeclarationNode,
  FunctionDeclarationNode
} from './types';
import { CompileError } from './errors';
import { Lexer } from './lexer';

// Debug function that only logs essential info
function debug(type: 'error' | 'info', message: string, data?: any) {
  if (type === 'error') {
    console.error(message, data || '');
  } else if (process.env.DEBUG === 'true') {
    // Only log info in debug mode
    console.log(message, data || '');
  }
}

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
      line: this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].line : 1,
      position: {
        line: this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].position?.line || 1 : 1,
        column: this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].position?.column || 1 : 1
      },
      toString: () => "EOF"
    });
  }

  public parse(): ASTNode {
    return this.program();
  }

  private program(): ASTNode {
    const statements: ASTNode[] = [];
    
    console.log("Starting program parsing");
    // Reset current token pointer
    this.current = 0;
    console.log("Current token:", this.peek());
    
    // Skip initial whitespace and newlines
    while (!this.isAtEnd() && (this.peek().type === TokenType.NEWLINE || this.peek().type === TokenType.WHITESPACE)) {
      this.advance();
    }
    
    // Handle program start if present
    if (this.check(TokenType.PROGRAM_START)) {
      console.log("Found program start token");
      this.advance(); // consume hi_bhai
      console.log("After program start, current token:", this.peek());
    } else {
      console.error("No program start token found!");
      throw new CompileError("Program must start with 'hi_bhai'", this.peek().position?.line || 0, this.peek().position?.column || 0);
    }

    // Handle statements between program start and end
    while (!this.isAtEnd() && !this.check(TokenType.PROGRAM_END)) {
      try {
        // Skip whitespace and newlines between statements
        while (!this.isAtEnd() && (this.peek().type === TokenType.NEWLINE || this.peek().type === TokenType.WHITESPACE)) {
          this.advance();
        }
        
        // Break if we hit program end
        if (this.check(TokenType.PROGRAM_END)) break;
        
        console.log("About to parse statement, current token:", this.peek());
        const stmt = this.declaration();
        console.log("Parsed statement:", stmt);
        
        if (stmt && stmt.type !== 'EmptyStatement') {
          statements.push(stmt);
          console.log("Added statement to program. Total statements:", statements.length);
        }
      } catch (error) {
        console.error("Error in program parsing:", error);
        this.synchronize();
      }
    }

    // Handle program end if present
    if (this.check(TokenType.PROGRAM_END)) {
      console.log("Found program end token");
      this.advance(); // consume bye_bhai
    } else {
      console.error("No program end token found!");
      throw new CompileError("Program must end with 'bye_bhai'", this.peek().position?.line || 0, this.peek().position?.column || 0);
    }

    console.log(`Program parsed with ${statements.length} statements:`, statements);
    return { type: 'Program', statements };
  }

  private declaration(): ASTNode {
    try {
      // Skip whitespace and newlines
      while (this.peek().lexeme.trim() === '' || this.peek().lexeme === '\n') {
        this.advance();
      }
      
      if (this.match(TokenType.LET, TokenType.CONST)) {
        return this.variableDeclaration();
      }
      
      if (this.match(TokenType.FUNCTION)) {
        return this.functionDeclaration();
      }

      if (this.match(TokenType.CLASS)) {
        return this.classDeclaration();
      }
      
      if (this.match(TokenType.PRINT)) {
        debug('info', "Found PRINT token in declaration");
        return this.printStatement();
      }

      if (this.match(TokenType.IMPORT)) {
        return this.importDeclaration();
      }

      if (this.match(TokenType.EXPORT)) {
        return this.exportDeclaration();
      }
      
      return this.statement();
    } catch (error) {
      debug('error', "Error in declaration parsing:", error);
      this.synchronize();
      return { type: 'EmptyStatement' };
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
    if (this.match(TokenType.PRINT)) {
      return this.printStatement();
    }
    if (this.match(TokenType.SEMICOLON)) {
      return { type: 'EmptyStatement' };
    }
    if (this.check(TokenType.IDENTIFIER)) {
      const token = this.peek();
      const nextToken = this.peekNext();
      // If we see an identifier followed by a left parenthesis, treat it as a function call
      if (nextToken.type === TokenType.LEFT_PAREN) {
        this.advance(); // consume the identifier
        return this.expressionStatement();
      }
    }
    const expr = this.expressionStatement();
    // Make semicolon optional
    if (this.check(TokenType.SEMICOLON)) {
      this.advance();
    }
    return expr;
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
    
    // Make braces optional for function body
    let body: ASTNode[];
    if (this.match(TokenType.LEFT_BRACE)) {
      body = this.block();
    } else {
      body = [this.statement()];
    }
    
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
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after if condition");
    } else {
      condition = this.expression();
    }
    
    // Make braces optional for if body
    let thenBranch: ASTNode;
    if (this.match(TokenType.LEFT_BRACE)) {
      thenBranch = { type: 'BlockStatement' as const, statements: this.block() };
    } else {
      thenBranch = this.statement();
    }
    
    // Handle else branch
    let elseBranch: ASTNode | null = null;
    if (this.match(TokenType.ELSE)) {
      if (this.match(TokenType.LEFT_BRACE)) {
        elseBranch = { type: 'BlockStatement' as const, statements: this.block() };
      } else {
        elseBranch = this.statement();
      }
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
    const printKeyword = this.previous(); // Get the print keyword token
    const expressions: ASTNode[] = [];
    
    // Parse first expression
    expressions.push(this.expression());
    debug('info', "Parsed first expression in print statement:", expressions[0]);
    
    // Parse additional expressions separated by commas
    while (this.match(TokenType.COMMA)) {
      expressions.push(this.expression());
      debug('info', "Parsed additional expression in print statement:", expressions[expressions.length - 1]);
    }
    
    // Expect a semicolon
    this.consume(TokenType.SEMICOLON, "Expect ';' after print statement");
    debug('info', `Completed parsing print statement with ${expressions.length} expressions`);
    
    return {
      type: 'PrintStatement',
      expressions,
      line: printKeyword.position?.line || 0,
      column: printKeyword.position?.column || 0
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
    // Make semicolons optional for all statements
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

      if (expr.type === 'Identifier' || expr.type === 'MemberExpression') {
        return {
          type: 'AssignmentExpression',
          left: expr as IdentifierNode | MemberExpressionNode,
          right: value,
          operator: equals.lexeme
        };
      }

      throw new CompileError("Invalid assignment target", equals.position?.line || 0, equals.position?.column || 0);
    }

    return expr;
  }

  private additive(): ASTNode {
    let expr = this.comparison();

    while (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().lexeme;
      if (operator === '+' || operator === '-') {
        const right = this.comparison();
        expr = {
          type: 'BinaryExpression',
          operator,
          left: expr,
          right
        };
      } else {
        this.current--; // Go back one token since it wasn't a + or -
        break;
      }
    }

    return expr;
  }

  private comparison(): ASTNode {
    let expr = this.term();

    while (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().lexeme;
      if (operator === '<' || operator === '>' || operator === '<=' || operator === '>=' || operator === '==' || operator === '!=') {
        const right = this.term();
        expr = {
          type: 'BinaryExpression',
          operator,
          left: expr,
          right
        };
      } else {
        this.current--; // Go back one token since it wasn't a comparison operator
        break;
      }
    }

    return expr;
  }

  private term(): ASTNode {
    let expr = this.unary();

    while (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().lexeme;
      if (operator === '*' || operator === '/' || operator === '%') {
        const right = this.unary();
        expr = {
          type: 'BinaryExpression',
          operator,
          left: expr,
          right
        };
      } else {
        this.current--; // Go back one token since it wasn't a * or /
        break;
      }
    }

    return expr;
  }

  private unary(): ASTNode {
    if (this.match(TokenType.OPERATOR)) {
      const operator = this.previous().lexeme;
      if (operator === '-' || operator === '!') {
        const right = this.unary();
        return {
          type: 'UnaryExpression',
          operator,
          argument: right
        };
      } else {
        this.current--; // Go back one token since it wasn't a unary operator
      }
    }

    return this.call();
  }

  private primary(): ASTNode {
    if (this.match(TokenType.FALSE)) return { type: 'Literal', value: false };
    if (this.match(TokenType.TRUE)) return { type: 'Literal', value: true };
    if (this.match(TokenType.NULL)) return { type: 'Literal', value: null };
    
    if (this.match(TokenType.THIS)) {
      return { type: 'ThisExpression' };
    }
    
    if (this.match(TokenType.SUPER)) {
      return { type: 'SuperExpression' };
    }
    
    if (this.match(TokenType.NEW)) {
      return this.finishNewExpression();
    }
    
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
      return {
        type: 'GroupingExpression',
        expression: expr
      };
    }
    
    if (this.match(TokenType.LEFT_BRACKET)) {
      const elements: ASTNode[] = [];
      
      if (!this.check(TokenType.RIGHT_BRACKET)) {
        do {
          if (this.check(TokenType.RIGHT_BRACKET)) break;
          elements.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      
      this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array elements");
      
      return {
        type: 'ArrayExpression',
        elements
      };
    }
    
    if (this.match(TokenType.NUMBER)) {
      return { type: 'Literal', value: this.previous().value || Number(this.previous().lexeme) };
    }
    
    if (this.match(TokenType.STRING)) {
      return { type: 'Literal', value: this.previous().value || this.previous().lexeme };
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      const name = token.lexeme;
      
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
          object: { type: 'Identifier', name, token },
          property: index,
          computed: true
        };
      }
      
      // Check for property access with dot notation
      if (this.match(TokenType.DOT)) {
        const propertyToken = this.consume(TokenType.IDENTIFIER, "Expected property name after '.'");
        const propertyName = propertyToken.lexeme;
        
        // Check if this is a method call
        if (this.check(TokenType.LEFT_PAREN)) {
          const expr: MemberExpressionNode = {
            type: 'MemberExpression',
            object: { type: 'Identifier', name, token },
            property: { type: 'Identifier', name: propertyName, token: propertyToken },
            computed: false
          };
          
          // If followed by parentheses, it's a method call
          if (this.match(TokenType.LEFT_PAREN)) {
            return this.finishMethodCall(expr);
          }
          
          return expr;
        }
        
        return {
          type: 'MemberExpression',
          object: { type: 'Identifier', name, token },
          property: { type: 'Identifier', name: propertyName, token: propertyToken },
          computed: false
        };
      }
      
      // At this point, we've matched an identifier but not a function call or array access
      // So this is just a variable reference
      return { type: 'Identifier', name, token };
    }

    throw new CompileError("Expected expression", this.peek().position?.line || 0, this.peek().position?.column || 0);
  }

  private finishCall(name: string): ASTNode {
    const args: ASTNode[] = [];
    
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (this.check(TokenType.RIGHT_PAREN)) break;
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
    
    return {
      type: 'CallExpression',
      callee: { type: 'Identifier', name, token: this.previous() },
      arguments: args
    };
  }

  private finishMethodCall(object: ASTNode): ASTNode {
    const args: ASTNode[] = [];
    
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (this.check(TokenType.RIGHT_PAREN)) break;
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
    
    return {
      type: 'CallExpression',
      callee: object,
      arguments: args
    };
  }

  private finishNewExpression(): ASTNode {
    const classNameToken = this.consume(TokenType.IDENTIFIER, "Expected class name after 'new'");
    const className = classNameToken.lexeme;
    
    this.consume(TokenType.LEFT_PAREN, "Expected '(' after class name in new expression");
    
    const args: ASTNode[] = [];
    
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (this.check(TokenType.RIGHT_PAREN)) break;
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
    
    return {
      type: 'NewExpression',
      callee: { type: 'Identifier', name: className, token: classNameToken },
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

  private peekNext(): Token {
    if (this.current + 1 >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.current + 1];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new CompileError(message, this.peek().position?.line || 0, this.peek().position?.column || 0);
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
        case TokenType.PROGRAM_START:
        case TokenType.PROGRAM_END:
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
      this.advance();
    }
    
    return { type: 'VariableDeclaration', name, init, isConstant };
  }

  private backup(): void {
    this.current--;
  }

  private classDeclaration(): ASTNode {
    // Parse class name
    const name = this.consume(TokenType.IDENTIFIER, "Expected class name").lexeme;
    
    // Check for superclass
    let superClass: string | undefined = undefined;
    if (this.match(TokenType.EXTENDS)) {
      superClass = this.consume(TokenType.IDENTIFIER, "Expected superclass name").lexeme;
    }
    
    // Expect opening brace
    this.consume(TokenType.LEFT_BRACE, "Expected '{' before class body");
    
    // Parse class body
    const methods: Array<{
      name: string;
      body: FunctionDeclaration;
      access?: 'public' | 'private' | 'protected';
    }> = [];
    
    // Parse methods and properties
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      try {
        // Check for access modifiers
        let access: 'public' | 'private' | 'protected' = 'public';
        if (this.match(TokenType.PUBLIC)) {
          access = 'public';
        } else if (this.match(TokenType.PRIVATE)) {
          access = 'private';
        } else if (this.match(TokenType.PROTECTED)) {
          access = 'protected';
        }
        
        // Check for static modifier
        const isStatic = this.match(TokenType.STATIC);
        
        // If it's the constructor
        if (this.match(TokenType.CONSTRUCTOR)) {
          // Parse constructor method
          const methodParams = this.parseParameters();
          
          // Expect method body
          this.consume(TokenType.LEFT_BRACE, "Expected '{' before constructor body");
          const methodBody = this.block();
          
          methods.push({
            name: 'constructor',
            body: {
              name: 'constructor',
              parameters: methodParams,
              body: methodBody,
              isConstructor: true,
              isStatic: false,
              access: access
            } as any
          });
        }
        // If it's a method
        else if (this.check(TokenType.IDENTIFIER)) {
          const methodName = this.consume(TokenType.IDENTIFIER, "Expected method name").lexeme;
          const methodParams = this.parseParameters();
          
          // Expect method body
          this.consume(TokenType.LEFT_BRACE, "Expected '{' before method body");
          const methodBody = this.block();
          
          methods.push({
            name: methodName,
            body: {
              name: methodName,
              parameters: methodParams,
              body: methodBody,
              isStatic: isStatic,
              access: access
            } as any
          });
        }
        // If it's something else (like a property)
        else {
          // Skip until semicolon or end of class
          while (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            this.advance();
          }
          
          if (this.check(TokenType.SEMICOLON)) {
            this.advance(); // Consume the semicolon
          }
        }
      } catch (error) {
        debug('error', "Error parsing class member:", error);
        this.synchronize();
      }
    }
    
    // Expect closing brace
    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after class body");
    
    return {
      type: 'ClassDeclaration',
      name: name,
      superClass: superClass,
      methods: methods
    };
  }

  private importDeclaration(): ASTNode {
    debug('info', "Parsing import declaration");
    const specifiers: any[] = [];
    
    // Parse import specifiers
    if (!this.check(TokenType.FROM)) {
      if (this.match(TokenType.IDENTIFIER)) {
        // Default import: import defaultExport from "./module.ml"
        const local = this.previous().lexeme || '';
        specifiers.push({
          type: 'ImportSpecifier',
          local: { name: local },
          exported: { name: 'default' }
        });
        
        // Check for additional named imports: import defaultExport, { namedExport } from "./module.ml"
        if (this.match(TokenType.COMMA)) {
          this.parseNamedImports(specifiers);
        }
      } else if (this.match(TokenType.OPERATOR) && this.previous().lexeme === '*') {
        // Namespace import: import * as name from "./module.ml"
        this.consume(TokenType.IDENTIFIER, "Expected 'as' after '*'");
        if (this.previous().lexeme !== 'as') {
          throw new CompileError("Expected 'as' after '*'", this.previous().position?.line || 0, this.previous().position?.column || 0);
        }
        
        this.consume(TokenType.IDENTIFIER, "Expected namespace name after 'as'");
        const local = this.previous().lexeme || '';
        
        specifiers.push({
          type: 'ImportSpecifier',
          local: { name: local },
          exported: { name: '*' }
        });
      } else if (this.match(TokenType.LEFT_BRACE)) {
        // Named imports: import { export1, export2 } from "./module.ml"
        this.parseNamedImports(specifiers);
      }
    }
    
    // Parse source
    this.consume(TokenType.FROM, "Expected 'from' after import specifiers");
    this.consume(TokenType.STRING, "Expected module path string after 'from'");
    const source = { value: this.previous().value?.toString() || this.previous().lexeme || '' };
    
    // End of statement
    this.consume(TokenType.SEMICOLON, "Expected ';' after import statement");
    
    return {
      type: 'ImportDeclaration',
      specifiers,
      source
    };
  }
  
  private parseNamedImports(specifiers: any[]): void {
    // Parse named imports: { export1, export2 as alias2 }
    do {
      this.consume(TokenType.IDENTIFIER, "Expected import name");
      const imported = this.previous().lexeme || '';
      let local = imported;
      
      // Handle aliasing: import { export1 as alias1 } from "./module.ml"
      if (this.match(TokenType.IDENTIFIER) && this.previous().lexeme === 'as') {
        this.consume(TokenType.IDENTIFIER, "Expected local name after 'as'");
        local = this.previous().lexeme || '';
      }
      
      specifiers.push({
        type: 'ImportSpecifier',
        local: { name: local },
        exported: { name: imported }
      });
    } while (this.match(TokenType.COMMA) && !this.check(TokenType.RIGHT_BRACE));
    
    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after import specifiers");
  }
  
  private exportDeclaration(): ASTNode {
    debug('info', "Parsing export declaration");
    // Handle export declaration: export function foo() {}
    if (this.match(TokenType.FUNCTION)) {
      const declaration = this.functionDeclaration() as FunctionDeclarationNode;
      return {
        type: 'ExportDeclaration',
        declaration
      };
    }
    
    // Handle export declaration: export const/let foo = bar
    if (this.match(TokenType.CONST, TokenType.LET)) {
      const declaration = this.variableDeclaration() as VariableDeclarationNode;
      return {
        type: 'ExportDeclaration',
        declaration
      };
    }
    
    // Handle export declaration: export class MyClass {}
    if (this.match(TokenType.CLASS)) {
      const declaration = this.classDeclaration() as ClassDeclarationNode;
      return {
        type: 'ExportDeclaration',
        declaration
      };
    }
    
    // Handle default export: export default expression
    if (this.match(TokenType.DEFAULT)) {
      const expr = this.expression();
      this.consume(TokenType.SEMICOLON, "Expected ';' after export");
      
      // Create a synthetic variable declaration to use as the declaration
      const defaultDecl: VariableDeclarationNode = {
        type: 'VariableDeclaration',
        name: {
          type: TokenType.IDENTIFIER,
          lexeme: 'default',
          literal: null,
          value: 'default',
          line: 0,
          position: { line: 0, column: 0 },
          toString: () => 'default'
        },
        init: expr,
        isConstant: true
      };
      
      return {
        type: 'ExportDeclaration',
        declaration: defaultDecl
      };
    }
    
    // Handle named exports: export { foo, bar as baz }
    if (this.match(TokenType.LEFT_BRACE)) {
      const specifiers: any[] = [];
      
      do {
        this.consume(TokenType.IDENTIFIER, "Expected export name");
        const local = this.previous().lexeme || '';
        let exported = local;
        
        // Handle aliasing: export { foo as bar }
        if (this.match(TokenType.IDENTIFIER) && this.previous().lexeme === 'as') {
          this.consume(TokenType.IDENTIFIER, "Expected exported name after 'as'");
          exported = this.previous().lexeme || '';
        }
        
        specifiers.push({
          type: 'ExportSpecifier',
          local: { name: local },
          exported: { name: exported }
        });
      } while (this.match(TokenType.COMMA) && !this.check(TokenType.RIGHT_BRACE));
      
      this.consume(TokenType.RIGHT_BRACE, "Expected '}' after export specifiers");
      
      this.consume(TokenType.SEMICOLON, "Expected ';' after export");
      
      return {
        type: 'ExportDeclaration',
        specifiers
      };
    }
    
    throw new CompileError("Invalid export declaration", this.peek().position?.line || 0, this.peek().position?.column || 0);
  }

  // Helper method to parse parameters
  private parseParameters(): string[] {
    this.consume(TokenType.LEFT_PAREN, "Expected '(' after function name");
    
    const parameters: string[] = [];
    
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          this.error(this.peek(), "Cannot have more than 255 parameters");
        }
        
        const param = this.consume(TokenType.IDENTIFIER, "Expected parameter name");
        parameters.push(param.lexeme);
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
    
    return parameters;
  }

  // Helper method to parse a block statement
  private blockStatement(): any {
    debug('info', "Parsing block statement");
    this.consume(TokenType.LEFT_BRACE, "Expected '{' before block");
    
    const statements: ASTNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.declaration();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after block");
    debug('info', `Parsed block with ${statements.length} statements`);
    
    return { type: 'BlockStatement', statements };
  }

  // Helper method to report an error
  private error(token: Token, message: string): CompileError {
    return new CompileError(message, token.line, token.position?.column || 0);
  }

  private call(): ASTNode {
    let expr = this.primary();
    
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCallExpr(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.consume(TokenType.IDENTIFIER, "Expected property name after '.'");
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: { type: 'Identifier', name: name.lexeme, token: name },
          computed: false
        };
      } else if (this.match(TokenType.LEFT_BRACKET)) {
        const index = this.expression();
        this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after index");
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: index,
          computed: true
        };
      } else {
        break;
      }
    }
    
    return expr;
  }

  private finishCallExpr(callee: ASTNode): ASTNode {
    const args: ASTNode[] = [];
    
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          this.error(this.peek(), "Cannot have more than 255 arguments");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
    
    return {
      type: 'CallExpression',
      callee,
      arguments: args
    };
  }
} 