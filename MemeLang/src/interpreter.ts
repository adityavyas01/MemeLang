import { Lexer } from './lexer';
import { Parser } from './parser';
import { 
  ASTNode, 
  Environment, 
  FunctionDeclaration, 
  Token,
  TokenType,
  ProgramNode,
  VariableDeclarationNode,
  FunctionDeclarationNode,
  IfStatementNode,
  WhileStatementNode,
  ExpressionStatementNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  LiteralNode,
  IdentifierNode,
  CallExpressionNode,
  PrintStatementNode,
  ReturnNode,
  AssignmentExpressionNode,
  BlockStatementNode,
  MemberExpressionNode
} from './types';
import { RuntimeError } from './errors';

export class Interpreter {
  private environment: Environment;
  private output: string[] = [];

  constructor() {
    this.environment = {
      parent: null,
      variables: new Map(),
      functions: new Map()
    };

    // Add built-in functions
    this.environment.variables.set('chaap', {
      value: (arg: any) => {
        this.output.push(String(arg));
        return arg;
      },
      isConstant: true
    });

    // Add PRINT as an alias for chaap
    this.environment.variables.set('PRINT', {
      value: (arg: any) => {
        this.output.push(String(arg));
        return arg;
      },
      isConstant: true
    });

    // Add input function
    this.environment.variables.set('input', {
      value: () => {
        // For testing purposes, return a default value
        return "42";
      },
      isConstant: true
    });
  }

  public interpret(input: string | ASTNode): string[] {
    this.output = []; // Reset output for each interpretation
    if (typeof input === 'string') {
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const ast = parser.parse();
      this.interpretAST(ast);
    } else {
      this.interpretAST(input);
    }
    return this.output;
  }

  private interpretAST(node: ASTNode): any {
    switch (node.type) {
      case 'Program':
        return this.interpretProgram(node);
      case 'VariableDeclaration':
        return this.interpretVariableDeclaration(node);
      case 'FunctionDeclaration':
        return this.interpretFunctionDeclaration(node);
      case 'IfStatement':
        return this.interpretIfStatement(node);
      case 'WhileStatement':
        return this.interpretWhileStatement(node);
      case 'ExpressionStatement':
        return this.interpretExpressionStatement(node);
      case 'BinaryExpression':
        return this.interpretBinaryExpression(node);
      case 'UnaryExpression':
        return this.interpretUnaryExpression(node);
      case 'Literal':
        return this.interpretLiteral(node);
      case 'Identifier':
        return this.interpretIdentifier(node);
      case 'CallExpression':
        return this.interpretCallExpression(node);
      case 'PrintStatement':
        return this.interpretPrintStatement(node);
      case 'ReturnStatement':
        return this.interpretReturnStatement(node);
      case 'AssignmentExpression':
        return this.interpretAssignmentExpression(node);
      case 'BlockStatement':
        return this.interpretBlockStatement(node);
      case 'ArrayExpression':
        return this.interpretArrayExpression(node);
      case 'MemberExpression':
        return this.interpretMemberExpression(node);
      case 'GroupingExpression':
        return this.interpretGroupingExpression(node);
      case 'EmptyStatement':
        return null;
      default:
        throw new RuntimeError(`Unknown node type: ${(node as any).type}`, 0, 0);
    }
  }

  private interpretProgram(node: ProgramNode): any {
    let result = null;
    for (const statement of node.statements) {
      result = this.interpretAST(statement);
    }
    return result;
  }

  private interpretVariableDeclaration(node: VariableDeclarationNode): any {
    const name = typeof node.name === 'string' ? node.name : node.name.lexeme || node.name.value;
    const value = this.interpretAST(node.init);
    const isConstant = node.isConstant;

    if (this.environment.variables.has(name)) {
      const variable = this.environment.variables.get(name)!;
      if (variable.isConstant) {
        throw new RuntimeError(`Cannot reassign constant variable: ${name}`, node.name.position.line, node.name.position.column);
      }
    }

    this.environment.variables.set(name, { value, isConstant });
    return value;
  }

  private interpretFunctionDeclaration(node: FunctionDeclarationNode): any {
    const name = node.name;
    const parameters = node.parameters;
    const body = Array.isArray(node.body) ? node.body : [node.body];
    
    // Store the function in the environment
    this.environment.variables.set(name, {
      value: {
        parameters,
        body,
        environment: this.environment
      },
      isConstant: true
    });
    
    // Return the function itself
    return {
      parameters,
      body,
      environment: this.environment
    };
  }

  private interpretIfStatement(node: IfStatementNode): any {
    const condition = this.interpretAST(node.condition);

    if (condition) {
      return this.interpretAST(node.thenBranch);
    } else if (node.elseBranch) {
      return this.interpretAST(node.elseBranch);
    }
  }

  private interpretWhileStatement(node: WhileStatementNode): any {
    let result = null;
    while (this.interpretAST(node.condition)) {
      result = this.interpretAST(node.body);
    }
    return result;
  }

  private interpretExpressionStatement(node: ExpressionStatementNode): any {
    return this.interpretAST(node.expression);
  }

  private interpretBinaryExpression(node: BinaryExpressionNode): any {
    const left = this.interpretAST(node.left);
    const right = this.interpretAST(node.right);
    const operator = node.operator;

    console.log(`Binary expression: ${left} ${operator} ${right}`);

    switch (operator) {
      case '+':
        // Special handling for string concatenation
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        if (right === 0) throw new RuntimeError('Division by zero', node.position?.line || 0, node.position?.column || 0);
        return left / right;
      case '%':
        return left % right;
      case '==':
        return left == right;
      case '!=':
        return left != right;
      case '<':
        return left < right;
      case '<=':
        return left <= right;
      case '>':
        return left > right;
      case '>=':
        return left >= right;
      case '=':
        return right;
      case '&&':
        return left && right;
      case '||':
        return left || right;
      default:
        throw new RuntimeError(`Unknown operator: ${operator}`, node.position?.line || 0, node.position?.column || 0);
    }
  }

  private interpretUnaryExpression(node: UnaryExpressionNode): any {
    const operator = node.operator;
    const argument = this.interpretAST(node.argument);

    switch (operator) {
      case '-':
        return -argument;
      case '!':
        return !argument;
      default:
        throw new RuntimeError(`Unknown unary operator: ${operator}`, node.position?.line || 0, node.position?.column || 0);
    }
  }

  private interpretLiteral(node: LiteralNode): any {
    return node.value;
  }

  private interpretIdentifier(node: IdentifierNode): any {
    const name = node.name;
    const variable = this.lookupVariable(name);
    if (!variable) {
      throw new RuntimeError(`Variable ${name} is not defined`, node.position?.line || 0, node.position?.column || 0);
    }
    return variable.value;
  }

  private interpretCallExpression(node: CallExpressionNode): any {
    console.log('Call expression node:', JSON.stringify(node));
    const callee = this.interpretAST(node.callee);
    console.log('Callee:', callee);
    const args = node.arguments.map(arg => {
      const argValue = this.interpretAST(arg);
      console.log('Argument:', argValue);
      return argValue;
    });
    
    if (typeof callee === 'function') {
      return callee(...args);
    }
    
    if (callee && typeof callee === 'object' && 'parameters' in callee && 'body' in callee && 'environment' in callee) {
      const func = callee;
      console.log('Function parameters:', func.parameters);
      console.log('Function body:', JSON.stringify(func.body));
      const previousEnv = this.environment;
      
      // Create a new environment for the function call
      this.environment = {
        parent: func.environment,
        variables: new Map(),
        functions: new Map()
      };
      
      // Bind arguments to parameters
      for (let i = 0; i < func.parameters.length; i++) {
        const paramName = func.parameters[i];
        const argValue = i < args.length ? args[i] : undefined;
        console.log(`Binding ${paramName} to ${argValue}`);
        
        if (paramName) {
          this.environment.variables.set(paramName, {
            value: argValue,
            isConstant: false
          });
        }
      }
      
      // Execute function body
      let returnValue = undefined;
      try {
        for (const statement of func.body) {
          console.log('Executing statement:', JSON.stringify(statement));
          const result = this.interpretAST(statement);
          console.log('Statement result:', result);
          
          // Check if this is a return statement or a block containing a return statement
          if (statement.type === 'ReturnStatement') {
            returnValue = result;
            break;
          } else if (statement.type === 'IfStatement' || statement.type === 'BlockStatement') {
            // If statements and blocks might contain return statements
            // If the result is defined, it might be a return value
            if (result !== undefined) {
              returnValue = result;
              break;
            }
          }
        }
      } finally {
        // Restore previous environment
        this.environment = previousEnv;
      }
      
      console.log('Return value:', returnValue);
      return returnValue;
    }
    
    throw new RuntimeError(`Cannot call ${callee} as a function`, node.position?.line || 0, node.position?.column || 0);
  }

  private interpretPrintStatement(node: PrintStatementNode): any {
    const value = this.interpretAST(node.argument);
    this.output.push(String(value));
    return value;
  }

  private interpretReturnStatement(node: ReturnNode): any {
    if (node.value === null) {
      return null;
    }
    const value = this.interpretAST(node.value);
    console.log(`Return statement value: ${value}`);
    return value;
  }

  private interpretAssignmentExpression(node: AssignmentExpressionNode): any {
    let name: string;
    let object: any;
    let property: string | number;
    
    if ('name' in node && node.name) {
      // Handle simple variable assignment
      name = typeof node.name === 'string' ? node.name : (node.name as Token).lexeme || (node.name as IdentifierNode).name;
      const value = this.interpretAST(node.value);
      this.assignVariable(name, value);
      return value;
    } else if ('object' in node && node.object && 'property' in node && node.property) {
      // Handle member expression assignment (array[index] = value)
      object = this.interpretAST(node.object);
      property = node.computed ? this.interpretAST(node.property) : (node.property as any).name;
      
      if (object === null || object === undefined) {
        throw new RuntimeError(`Cannot set property '${property}' of ${object}`, node.position?.line || 0, node.position?.column || 0);
      }
      
      const value = this.interpretAST(node.value);
      object[property] = value;
      return value;
    } else {
      throw new RuntimeError('Invalid assignment target', node.position?.line || 0, node.position?.column || 0);
    }
  }

  private interpretBlockStatement(node: BlockStatementNode): any {
    // Save the previous environment
    const previousEnv = this.environment;
    
    // Create a new environment with the current one as parent
    this.environment = {
      parent: this.environment,
      variables: new Map(),
      functions: new Map()
    };
    
    let result = null;
    try {
      for (const statement of node.statements) {
        result = this.interpretAST(statement);
        // Check if we've hit a return statement
        if (statement.type === 'ReturnStatement') {
          break;
        }
      }
    } finally {
      // Restore the previous environment
      this.environment = previousEnv;
    }
    
    return result;
  }

  private interpretArrayExpression(node: any): any {
    return node.elements.map((element: ASTNode) => this.interpretAST(element));
  }

  private interpretMemberExpression(node: MemberExpressionNode): any {
    const object = this.interpretAST(node.object);
    if (node.computed) {
      const property = this.interpretAST(node.property);
      return object[property];
    }
    if (node.property.type !== 'Identifier') {
      throw new RuntimeError('Property must be an identifier', node.position?.line || 0, node.position?.column || 0);
    }
    return object[node.property.name];
  }

  private interpretGroupingExpression(node: any): any {
    return this.interpretAST(node.expression);
  }

  private lookupVariable(name: string): { value: any; isConstant: boolean } | undefined {
    let env: Environment | null = this.environment;
    while (env) {
      const variable = env.variables.get(name);
      if (variable) {
        return variable;
      }
      env = env.parent;
    }
    return undefined;
  }

  private assignVariable(name: string, value: any): void {
    let env: Environment | null = this.environment;
    while (env) {
      const variable = env.variables.get(name);
      if (variable) {
        if (variable.isConstant) {
          throw new RuntimeError(`Cannot reassign constant variable: ${name}`, 0, 0);
        }
        env.variables.set(name, { value, isConstant: variable.isConstant });
        return;
      }
      env = env.parent;
    }
    throw new RuntimeError(`Variable ${name} is not defined`, 0, 0);
  }
} 