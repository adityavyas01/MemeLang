import { Lexer } from './lexer';
import { Parser } from './parser';
import { 
  ASTNode,
  ProgramNode, 
  BinaryExpressionNode, 
  UnaryExpressionNode, 
  LiteralNode, 
  VariableDeclarationNode, 
  IdentifierNode, 
  WhileStatementNode, 
  ExpressionStatementNode,
  FunctionDeclarationNode, 
  CallExpressionNode, 
  ReturnNode,
  BlockStatementNode,
  ArrayExpressionNode, 
  MemberExpressionNode, 
  ClassDeclarationNode, 
  MethodDefinitionNode, 
  MethodDefinition,
  SuperExpressionNode, 
  NewExpressionNode, 
  ThisExpressionNode, 
  FunctionDeclaration,
  Environment,
  Token,
  Position,
  IfStatementNode,
  PrintStatementNode,
  AssignmentExpressionNode,
  ImportDeclarationNode,
  ExportDeclarationNode
} from './types';
import { RuntimeError, CompileError } from './errors';

// Debug function that only logs essential info
function debug(type: 'error' | 'info', message: string, data?: any) {
  if (type === 'error') {
    console.error(message, data || '');
  } else if (process.env.DEBUG === 'true') {
    // Only log info in debug mode
    console.log(message, data || '');
  }
}

// Conditionally import fs and path only in Node.js environment
let fs: any = null;
let path: any = null;
if (typeof window === 'undefined') {
  // Only import in Node.js environment
  // @ts-ignore
  fs = require('fs');
  // @ts-ignore
  path = require('path');
}

// Define method definition interface - now imported from types.ts
// interface MethodDefinition {
//   func: FunctionDeclaration;
//   static: boolean;
//   access: 'public' | 'private' | 'protected';
//   isConstructor?: boolean;
// }

// Define a class for OOP implementation
class MemeLangClass {
  readonly name: string;
  readonly superclass: MemeLangClass | null;
  readonly methods: Map<string, MethodDefinition>;
  readonly properties: Map<string, { value: any, isConstant: boolean }>;
  
  constructor(name: string, superclass: MemeLangClass | null, methods?: Map<string, MethodDefinition>) {
    this.name = name;
    this.superclass = superclass;
    this.methods = methods || new Map();
    this.properties = new Map();
  }
  
  findMethod(name: string): MethodDefinition | null {
    const method = this.methods.get(name);
    if (method) return method;
    if (this.superclass) {
      return this.superclass.findMethod(name);
    }
    return null;
  }
  
  toString(): string {
    return this.name;
  }
  
  addMethod(name: string, method: MethodDefinition): void {
    this.methods.set(name, method);
  }
}

// Define a class for instances of MemeLangClass
class MemeLangInstance {
  public fields: Map<string, any> = new Map();
  private environment: Environment;

  constructor(public klass: MemeLangClass, environment: Environment) {
    this.environment = environment;
  }

  private isFunctionDeclaration(value: any): value is FunctionDeclaration {
    return value && typeof value === 'object' && value.type === 'FunctionDeclaration';
  }

  get(name: string): any {
    // First check instance fields
    if (this.fields.has(name)) {
      return this.fields.get(name);
    }

    // Then check methods
    const method = this.klass.findMethod(name);
    if (method && !method.static) {
      return (...args: any[]) => {
        // Create a new environment for the method invocation
        const methodEnv = new Environment(this.environment);

        // Set up `this` in the method environment
        methodEnv.variables.set('this', { value: this, isConstant: true });
        
        // Set up parameters
        const func = method.func;
        if (this.isFunctionDeclaration(func)) {
          if (func.parameters) {
            for (let i = 0; i < Math.min(func.parameters.length, args.length); i++) {
              methodEnv.variables.set(func.parameters[i], { value: args[i], isConstant: false });
            }
          }
          
          // Set the method's interpreter to the current environment's interpreter
          if (this.environment.interpreter) {
            methodEnv.interpreter = this.environment.interpreter;
            
            // Save the current 'this' value
            const prevThis = this.environment.interpreter.thisEnvironment;
            
            // Set 'this' to the current instance for the duration of the method call
            this.environment.interpreter.thisEnvironment = this;
            
            try {
              // Execute method body
              let result = null;
              if (func.body && Array.isArray(func.body)) {
                for (const statement of func.body) {
                  result = methodEnv.interpreter.interpretNode(statement);
                  if (statement.type === 'ReturnStatement') {
                    break;
                  }
                }
              }
              return result;
            } finally {
              // Restore the previous 'this' value
              if (this.environment.interpreter) {
                this.environment.interpreter.thisEnvironment = prevThis;
              }
            }
          } else {
            throw new RuntimeError('Method environment has no interpreter');
          }
        } else {
          throw new RuntimeError('Invalid method type');
        }
      };
    }

    // Finally check class properties
    if (this.klass.properties.has(name)) {
      return this.klass.properties.get(name)!.value;
    }

    // If not found, check the superclass
    if (this.klass.superclass) {
      // Create a proxy instance for superclass method access
      const superInstance = new MemeLangInstance(this.klass.superclass, this.environment);
      // Copy fields to the superclass instance to ensure consistent state
      this.fields.forEach((value, key) => {
        superInstance.set(key, value);
      });
      
      try {
        return superInstance.get(name);
      } catch (e) {
        // If not found in superclass, continue with the original error
      }
    }

    throw new RuntimeError(`Undefined property '${name}' in class ${this.klass.name}`);
  }

  set(name: string, value: any): void {
    this.fields.set(name, value);
  }

  toString(): string {
    return `[${this.klass.name} instance]`;
  }
}

class ReturnValue extends Error {
  constructor(public readonly value: any) {
    super('Return statement');
    this.name = 'ReturnValue';
  }
}

export class Interpreter {
  private environment: Environment;
  private globals: Environment;
  private parser: Parser;
  private lexer: Lexer;
  private output: string[] = [];
  public thisEnvironment: MemeLangInstance | null = null;
  private currentFilePath: string | null = null;
  private importCache: Map<string, any> = new Map();

  constructor(input: string = '') {
    this.globals = new Environment();
    this.environment = this.globals;
    this.lexer = new Lexer(input);
    this.parser = new Parser(this.lexer);
    
    // Set up the interpreter reference in the environment
    this.environment.interpreter = this;
    
    // Set up global environment with built-in functions
    this.setupGlobalEnvironment();
  }

  public async interpret(code: string, filePath: string | null = null): Promise<string[]> {
    try {
      console.log("STARTING INTERPRETATION");  // Debug log
      this.currentFilePath = filePath;
      this.output = []; // Reset output array
      console.log("OUTPUT ARRAY RESET");  // Debug log
      
      // Ensure code is properly set
      console.log("Setting lexer input:", code);
      this.lexer.input = code;
      console.log("Lexer input set, length:", this.lexer.input.length);
      
      const tokens = this.lexer.tokenize();
      console.log("TOKENS:", tokens);  // Debug log
      
      const ast = this.parser.parse();
      console.log("AST:", JSON.stringify(ast, null, 2));  // Debug log
      
      const result = await this.interpretNode(ast);
      console.log("INTERPRETATION RESULT:", result);  // Debug log
      console.log("FINAL OUTPUT ARRAY:", this.output);  // Debug log
      return this.output;
    } catch (error) {
      console.error("INTERPRETATION ERROR:", error);  // Debug log
      if (error instanceof RuntimeError || error instanceof CompileError) {
        throw error;
      }
      throw new RuntimeError(error instanceof Error ? error.message : String(error));
    }
  }

  public async interpretNode(node: ASTNode): Promise<any> {
    try {
    switch (node.type) {
      case 'Program':
          return await this.interpretProgram(node);
      case 'VariableDeclaration':
          return await this.interpretVariableDeclaration(node as VariableDeclarationNode);
      case 'FunctionDeclaration':
          return await this.interpretFunctionDeclaration(node as FunctionDeclarationNode);
        case 'ClassDeclaration':
          return await this.interpretClassDeclaration(node as ClassDeclarationNode);
      case 'IfStatement':
          return await this.interpretIfStatement(node as IfStatementNode);
      case 'WhileStatement':
          return await this.interpretWhileStatement(node as WhileStatementNode);
        case 'PrintStatement':
          return await this.interpretPrintStatement(node as PrintStatementNode);
        case 'BlockStatement':
          return await this.interpretBlockStatement(node as BlockStatementNode);
        case 'ReturnStatement':
          return await this.interpretReturnStatement(node as ReturnNode);
      case 'ExpressionStatement':
          return await this.interpretExpressionStatement(node as ExpressionStatementNode);
      case 'BinaryExpression':
          return await this.interpretBinaryExpression(node as BinaryExpressionNode);
      case 'UnaryExpression':
          return await this.interpretUnaryExpression(node as UnaryExpressionNode);
      case 'AssignmentExpression':
          return await this.interpretAssignmentExpression(node as AssignmentExpressionNode);
        case 'CallExpression':
          return await this.interpretCallExpression(node as CallExpressionNode);
      case 'MemberExpression':
          return await this.interpretMemberExpression(node as MemberExpressionNode);
      case 'ThisExpression':
          return await this.interpretThisExpression(node as ThisExpressionNode);
      case 'SuperExpression':
          return await this.interpretSuperExpression(node as SuperExpressionNode);
      case 'NewExpression':
          return await this.interpretNewExpression(node as NewExpressionNode);
      case 'ImportDeclaration':
          return await this.interpretImportDeclaration(node as ImportDeclarationNode);
      case 'ExportDeclaration':
          return await this.interpretExportDeclaration(node as ExportDeclarationNode);
        case 'Identifier':
          return await this.interpretIdentifier(node as IdentifierNode);
        case 'Literal':
          return await this.interpretLiteral(node as LiteralNode);
      case 'GroupingExpression':
          return await this.interpretNode((node as any).expression);
      case 'EmptyStatement':
        return null;
      case 'ArrayExpression':
        return await this.interpretArrayExpression(node as ArrayExpressionNode);
      default:
          throw new RuntimeError(`Unknown node type: ${(node as any).type}`);
      }
    } catch (error) {
      debug('error', `Error interpreting ${node.type} node:`, error);
      throw error;
    }
  }

  private setupGlobalEnvironment(): void {
    debug('info', 'Setting up global environment');
    // Add print function
    const printFunction = (...args: any[]) => {
      console.log("PRINT FUNCTION CALLED WITH:", args);  // Debug log
      const message = args.join(' ');
      console.log("MESSAGE TO PRINT:", message);  // Debug log
      this.output.push(message.toString());
      console.log("OUTPUT ARRAY NOW:", this.output);  // Debug log
      return message;
    };
    
    // Define the chaap function (main output function for MemeLang)
    this.environment.defineFunction('chaap', printFunction);
    this.environment.defineFunction('PRINT', printFunction);
    this.environment.defineFunction('print', printFunction);
    console.log("Global print functions defined");  // Debug log
    
    // Define the memify function
    const memifyFunction = (text: string) => {
      const memified = `MEME: ${text}`;
      this.output.push(memified);
      return memified;
    };
    this.environment.defineFunction('memify', memifyFunction);

    // Add len function
    this.environment.defineFunction('len', (arg: any) => {
      if (Array.isArray(arg)) return arg.length;
      if (typeof arg === 'string') return arg.length;
      throw new RuntimeError('len() requires a string or array argument');
    });

    // Add type function
    this.environment.defineFunction('type', (arg: any) => {
      return typeof arg;
    });

    // Add input function
    this.environment.defineFunction('input', (prompt: string) => {
      return prompt || '';  // In a web environment, we'd use a different implementation
    });
  }

  private createMethodEnvironment(): Environment {
    return new Environment(this.environment);
  }

  private createFunctionEnvironment(): Environment {
    return new Environment(this.environment);
  }

  private async interpretProgram(node: ProgramNode): Promise<any[]> {
    debug('info', 'Interpreting program node:', node);
    const results: any[] = [];
    
    for (const statement of node.statements) {
      debug('info', 'Interpreting statement:', statement);
      const result = await this.interpretNode(statement);
      debug('info', 'Statement result:', result);
      if (result !== null && result !== undefined) {
        results.push(result);
      }
      debug('info', 'Output array after statement:', this.output);
    }
    
    debug('info', 'Final program results:', results);
    debug('info', 'Final output array:', this.output);
    return this.output;
  }

  private interpretVariableDeclaration(node: VariableDeclarationNode): any {
    const value = this.interpretNode(node.init);
    const name = node.name.lexeme || node.name.value;

    // Check if variable is already defined in current scope
    if (this.environment.variables.has(name)) {
      const existing = this.environment.variables.get(name);
      if (existing && existing.isConstant) {
        throw new RuntimeError(`Cannot reassign to constant variable '${name}'`);
      }
    }
    
    // Define the variable in the current environment - ensure numeric values are properly handled
    const numericValue = typeof value === 'number' ? Number(value) : value;
    this.environment.define(name, numericValue, node.isConstant);
    return numericValue;
  }

  private interpretFunctionDeclaration(node: FunctionDeclarationNode): FunctionDeclaration {
    const func: FunctionDeclaration = {
      type: 'FunctionDeclaration',
      name: node.name,
      parameters: node.parameters,
      body: node.body,
      environment: this.environment
    };
    
    this.environment.variables.set(node.name, {
      value: func,
      isConstant: false
    });
    
    return func;
  }

  private async interpretIfStatement(node: IfStatementNode): Promise<any> {
    const condition = await this.interpretNode(node.condition);
    if (condition) {
      return await this.interpretNode(node.thenBranch);
    } else if (node.elseBranch) {
      return await this.interpretNode(node.elseBranch);
    }
    return null;
  }

  private async interpretWhileStatement(node: WhileStatementNode): Promise<void> {
    let result = null;
    while (await this.interpretNode(node.condition)) {
      result = await this.interpretNode(node.body);
    }
    return result;
  }

  private async interpretExpressionStatement(node: ExpressionStatementNode): Promise<any> {
    // Execute the expression but don't add to output - only print statements should add to output
    return await this.interpretNode(node.expression);
  }

  private async interpretBinaryExpression(node: BinaryExpressionNode): Promise<any> {
    const left = await this.interpretNode(node.left);
    const right = await this.interpretNode(node.right);

    // Handle null and undefined gracefully
    const leftVal = left === null || left === undefined ? 0 : left;
    const rightVal = right === null || right === undefined ? 0 : right;

    // Ensure numeric values are properly handled for comparisons
    const leftNum = typeof leftVal === 'number' ? Number(leftVal) : leftVal;
    const rightNum = typeof rightVal === 'number' ? Number(rightVal) : rightVal;

    switch (node.operator) {
      case '+':
        // String concatenation or numeric addition
        if (typeof leftVal === 'string' || typeof rightVal === 'string') {
          return String(leftVal) + String(rightVal);
        }
        return Number(leftNum) + Number(rightNum);
      case '-':
        return Number(leftNum) - Number(rightNum);
      case '*':
        return Number(leftNum) * Number(rightNum);
      case '/':
        if (rightNum === 0) {
          throw new RuntimeError("अनंत से मिलने की कोशिश? जीरो से डिवाइड!");
        }
        return Number(leftNum) / Number(rightNum);
      case '%':
        if (rightNum === 0) {
          throw new RuntimeError("Zero modulo error");
        }
        return Number(leftNum) % Number(rightNum);
      case '<':
        return Number(leftNum) < Number(rightNum);
      case '<=':
        return Number(leftNum) <= Number(rightNum);
      case '>':
        return Number(leftNum) > Number(rightNum);
      case '>=':
        return Number(leftNum) >= Number(rightNum);
      case '==':
        return leftNum == rightNum;
      case '!=':
        return leftNum != rightNum;
      case '&&':
        return leftVal && rightVal;
      case '||':
        return leftVal || rightVal;
      default:
        throw new RuntimeError(`Unknown binary operator: ${node.operator}`);
    }
  }

  private async interpretUnaryExpression(node: UnaryExpressionNode): Promise<any> {
    const operator = node.operator;
    const argument = await this.interpretNode(node.argument);

    switch (operator) {
      case '-':
        return -argument;
      case '!':
        return !argument;
      default:
        throw new RuntimeError(`Unknown unary operator: ${operator}`, 0, 0);
    }
  }

  private interpretLiteral(node: LiteralNode): any {
    return node.value;
  }

  private interpretIdentifier(node: IdentifierNode): any {
    const name = node.name;
    const variable = this.lookupVariable(name);
    if (!variable) {
      throw new RuntimeError(`Variable ${name} is not defined`);
    }
    return variable.value;
  }

  private async interpretCallExpression(node: CallExpressionNode): Promise<any> {
    const callee = await this.interpretNode(node.callee);
    const args = await Promise.all(node.arguments.map(arg => this.interpretNode(arg)));

    // Check if it's a built-in function
    if (typeof callee === 'function') {
      return callee(...args);
    }

    // Check if it's a function declaration
    if (this.isFunctionDeclaration(callee)) {
      return this.executeUserFunction(callee, args);
    }

    throw new Error(`Cannot call non-function value: ${callee}`);
  }

  private isFunctionDeclaration(value: any): value is FunctionDeclaration {
    return (
      value &&
      typeof value === 'object' &&
      'parameters' in value &&
      'body' in value &&
      Array.isArray(value.parameters) &&
      Array.isArray(value.body)
    );
  }

  private async executeUserFunction(func: FunctionDeclaration, args: any[]): Promise<any> {
    // Create a new environment for the function execution
    const functionEnv = new Environment(func.environment || this.environment);
    
    // Set up parameters
    for (let i = 0; i < func.parameters.length; i++) {
      const paramName = func.parameters[i];
      const argValue = i < args.length ? args[i] : undefined;
      functionEnv.variables.set(paramName, {
        value: argValue,
        isConstant: false
      });
    }
    
    // Save the current environment and interpreter state
    const previousEnv = this.environment;
    const previousThis = this.thisEnvironment;
    
    try {
      // Set the new environment
      this.environment = functionEnv;
      
      // Execute the function body
      let result = null;
      for (const statement of func.body) {
        result = await this.interpretNode(statement);
        if (statement.type === 'ReturnStatement') {
          break;
        }
      }
      return result;
    } catch (e) {
      if (e instanceof ReturnValue) {
        return e.value;
      }
      throw e;
    } finally {
      // Restore the previous environment and this context
      this.environment = previousEnv;
      this.thisEnvironment = previousThis;
    }
  }

  private async interpretPrintStatement(node: PrintStatementNode): Promise<string> {
    console.log("INTERPRETING PRINT STATEMENT:", node);  // Debug log
    // Evaluate all expressions and join them with spaces
    const values = await Promise.all(node.expressions.map(expr => this.interpretNode(expr)));
    const output = values.join(' ');
    console.log("PRINT STATEMENT VALUE:", output);  // Debug log
    console.log("PUSHING TO OUTPUT:", output);  // Debug log
    this.output.push(output);
    console.log("OUTPUT ARRAY AFTER PUSH:", this.output);  // Debug log
    return output;
  }

  private async interpretReturnStatement(node: ReturnNode): Promise<any> {
    if (node.value === null) {
      return null;
    }
    const value = await this.interpretNode(node.value);
    return value;
  }

  private async interpretAssignmentExpression(node: AssignmentExpressionNode): Promise<any> {
    if (node.left.type === 'Identifier') {
      // Handle simple variable assignment
      const name = (node.left as IdentifierNode).name;
      const value = await this.interpretNode(node.right);
      this.assignVariable(name, value);
      return value;
    } else if (node.left.type === 'MemberExpression') {
      // Handle member expression assignment (object.property = value)
      const memberExpr = node.left as MemberExpressionNode;
      const object = await this.interpretNode(memberExpr.object);
      const value = await this.interpretNode(node.right);
      
      if (object instanceof MemeLangInstance) {
        // Handle instance property assignment
        const property = memberExpr.property.type === 'Identifier'
          ? (memberExpr.property as IdentifierNode).name
          : await this.interpretNode(memberExpr.property);
        
        object.set(property, value);
        return value;
      }
      
      // Handle regular object property assignment
      const property = memberExpr.computed ? 
        await this.interpretNode(memberExpr.property) : 
        (memberExpr.property as IdentifierNode).name;
      
      if (object === null || object === undefined) {
        throw new RuntimeError(`Cannot set property '${property}' of ${object}`);
      }
      
      object[property] = value;
      return value;
    } else {
      throw new RuntimeError('Invalid assignment target');
    }
  }

  private async interpretBlockStatement(node: BlockStatementNode): Promise<any> {
    const previousEnvironment = this.environment;
    this.environment = new Environment(previousEnvironment);
    
    try {
      for (const statement of node.statements) {
        const result = await this.interpretNode(statement);
        if (statement.type === 'ReturnStatement') {
          return result;
        }
      }
      return null;
    } finally {
      this.environment = previousEnvironment;
    }
  }

  private async interpretArrayExpression(node: ArrayExpressionNode): Promise<any[]> {
    const elements = await Promise.all(node.elements.map(element => this.interpretNode(element)));
    return elements;
  }

  private async interpretMemberExpression(node: MemberExpressionNode): Promise<any> {
    const object = await this.interpretNode(node.object);
    
    if (object instanceof MemeLangInstance) {
      // Handle instance member access
      const property = node.property.type === 'Identifier' 
        ? (node.property as IdentifierNode).name
        : await this.interpretNode(node.property);
      
      return object.get(property);
    }
    
    if (Array.isArray(object)) {
      // Handle array length property
      if (node.property.type === 'Identifier' && (node.property as IdentifierNode).name === 'length') {
        return object.length;
      }
      
      // Handle array index access
      const property = await this.interpretNode(node.property);
      if (typeof property === 'number') {
        if (property < 0 || property >= object.length) {
          throw new RuntimeError(`Array index out of bounds: ${property}`);
        }
        return object[property];
      }
    }
    
    if (typeof object !== 'object' || object === null) {
      const property = await this.interpretNode(node.property);
      throw new RuntimeError(`Cannot access property '${property}' of non-object`);
    }
    
    const property = await this.interpretNode(node.property);
    return object[property];
  }

  private interpretClassDeclaration(node: ClassDeclarationNode): any {
    // Get superclass if it exists
    let superclass = null;
    if (node.superClass) {
      const superclassValue = this.lookupVariable(node.superClass);
      if (!superclassValue || !(superclassValue.value instanceof MemeLangClass)) {
        throw new RuntimeError(`Superclass ${node.superClass} must be a class`);
      }
      superclass = superclassValue.value;
    }

    // Process methods
    const methods = new Map<string, MethodDefinition>();
    node.methods.forEach(methodNode => {
      // Convert method to MethodDefinitionNode format
      const methodDefNode: MethodDefinitionNode = {
        type: 'MethodDefinition',
        key: methodNode.name,
        name: methodNode.name,
        value: methodNode.body,
        kind: methodNode.name === 'constructor' ? 'constructor' : 'method',
        static: false, // Default to non-static
        access: methodNode.access || 'public'
      };
      
      const methodDef = this.interpretMethodDefinition(methodDefNode);
      methods.set(methodNode.name, methodDef);
    });

    // Create the class
    const klass = new MemeLangClass(node.name, superclass, methods);
    
    // Add the class to the current environment
    this.environment.define(node.name, klass, true);
    
    return klass;
  }

  private interpretMethodDefinition(node: MethodDefinitionNode): MethodDefinition {
    // Convert the FunctionDeclarationNode into a callable function
    const funcDecl = node.value;
    const func = (...args: any[]) => {
      // Create a new environment for the method invocation
      const env = new Environment(this.environment);
      
      // Set up parameters
      if (funcDecl.parameters) {
        for (let i = 0; i < Math.min(funcDecl.parameters.length, args.length); i++) {
          env.variables.set(funcDecl.parameters[i], { value: args[i], isConstant: false });
        }
      }
      
      // Save the current environment and interpreter state
      const previousEnv = this.environment;
      const previousThis = this.thisEnvironment;
      
      try {
        // Set the new environment
        this.environment = env;
        
        // Execute function body
        let result = null;
        if (funcDecl.body && Array.isArray(funcDecl.body)) {
          for (const statement of funcDecl.body) {
            result = this.interpretNode(statement);
            if (statement.type === 'ReturnStatement') {
              break;
            }
          }
        }
        return result;
      } finally {
        // Restore the previous environment and this context
        this.environment = previousEnv;
        this.thisEnvironment = previousThis;
      }
    };

    return {
      func: func,
      static: node.static,
      access: node.access,
      isConstructor: node.kind === 'constructor'
    };
  }

  private executeBlock(statements: ASTNode[], environment: Environment): any {
    const previousEnvironment = this.environment;
    try {
      this.environment = environment;
      let result: any = null;
      for (const statement of statements) {
        result = this.interpretNode(statement);
      }
      return result;
    } finally {
      this.environment = previousEnvironment;
    }
  }

  private createFunction(func: Function, params: string[]): Function {
    // Create a wrapper function that maintains the original function's behavior
    const wrappedFunc = (...args: any[]) => func.apply(null, args);
    
    // Add FunctionDeclaration properties without modifying the function's prototype
    const functionProps = {
      name: typeof func.name === 'string' ? func.name : "anonymous",
      parameters: params,
      body: [],
      environment: this.environment
    };
    
    // Use defineProperties to add non-enumerable properties
    Object.defineProperties(wrappedFunc, {
      parameters: {
        value: functionProps.parameters,
        writable: true,
        enumerable: false
      },
      body: {
        value: functionProps.body,
        writable: true,
        enumerable: false
      },
      environment: {
        value: functionProps.environment,
        writable: true,
        enumerable: false
      }
    });
    
    return wrappedFunc;
  }

  private evaluate(node: ASTNode): any {
    return this.interpretNode(node);
  }

  // Find the environment where a variable is defined
  private findEnvironmentForVariable(name: string): Environment | null {
    let env: Environment | null = this.environment;
    while (env !== null) {
      if (env.variables.has(name)) {
        return env;
      }
      const parent = env.getParent();
      env = parent !== undefined ? parent : null;
    }
    return null;
  }

  private interpretThisExpression(node: ThisExpressionNode): any {
    if (this.thisEnvironment !== null) {
    return this.thisEnvironment;
    }
    
    throw new RuntimeError("Cannot use 'this' outside of a class method. The 'this' keyword is only valid inside class methods.");
  }

  private interpretSuperExpression(node: SuperExpressionNode): any {
    if (this.thisEnvironment === null) {
      throw new RuntimeError("Cannot use 'super' outside of a class method.");
    }
    
    const superclass = this.thisEnvironment.klass.superclass;
    if (superclass === null) {
      throw new RuntimeError("Cannot use 'super' in a class with no superclass.");
    }
    
    return superclass;
  }

  private async interpretNewExpression(node: NewExpressionNode): Promise<any> {
    const klass = await this.interpretNode(node.callee);
    if (!(klass instanceof MemeLangClass)) {
      throw new RuntimeError(`Cannot use 'new' with non-class value ${klass}`);
    }

    const args = await Promise.all(node.arguments.map(arg => this.interpretNode(arg)));
    const instance = new MemeLangInstance(klass, this.environment);
    
    // Set up this environment for constructor
    const previousThis = this.thisEnvironment;
    this.thisEnvironment = instance;
    
    try {
      // Call constructor if it exists
      const constructor = klass.findMethod('constructor');
      if (constructor) {
        await this.callMethod(instance, 'constructor', args);
      }
      return instance;
    } finally {
      // Restore previous this environment
      this.thisEnvironment = previousThis;
    }
  }

  private async callMethod(instance: MemeLangInstance, methodName: string, args: any[]): Promise<any> {
    const method = instance.klass.findMethod(methodName);
    if (!method) {
      throw new RuntimeError(`Method ${methodName} not found on class ${instance.klass.name}`);
    }

    // Create a new environment for the method call
    const methodEnv = new Environment(this.environment);
    
    // Set up this in the method environment
    methodEnv.variables.set('this', { value: instance, isConstant: true });
    
    // Save the current environment and interpreter state
    const previousEnv = this.environment;
    const previousThis = this.thisEnvironment;
    
    try {
      // Set the new environment and this context
      this.environment = methodEnv;
      this.thisEnvironment = instance;
      
      return await method.func.apply(null, args);
    } finally {
      // Restore the previous environment and this context
      this.environment = previousEnv;
      this.thisEnvironment = previousThis;
    }
  }

  private lookupVariable(name: string): { value: any; isConstant: boolean } | undefined {
    let env: Environment | null = this.environment;
    while (env !== null) {
      const variable = env.variables.get(name);
      if (variable) {
        return variable;
      }
      env = env.parent || null;
    }
    return undefined;
  }

  private assignVariable(name: string, value: any): void {
    let env: Environment | null = this.environment;
    while (env !== null) {
      const variable = env.variables.get(name);
      if (variable) {
        if (variable.isConstant) {
          throw new RuntimeError(`Cannot reassign constant variable: ${name}`);
        }
        env.variables.set(name, { value, isConstant: variable.isConstant });
        return;
      }
      env = env.parent || null;
    }
    throw new RuntimeError(`Variable ${name} is not defined`);
  }

  private simplifyPath(path: string): string {
    const parts = path.split('/').filter(part => part !== '');
    const stack: string[] = [];
    
    for (const part of parts) {
      if (part === '..') {
          stack.pop();
      } else if (part !== '.') {
        stack.push(part);
      }
    }
    
    return '/' + stack.join('/');
  }

  private async loadModuleFromServer(path: string): Promise<string> {
    try {
      const response = await fetch(`/api/modules/${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new RuntimeError(`Failed to load module: ${path} (${response.status})`);
      }
      return await response.text();
    } catch (error) {
      throw new RuntimeError(`Error loading module: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async interpretImportDeclaration(node: ImportDeclarationNode): Promise<any> {
    const sourcePath = node.source.value as string;
    
    // Resolve the module path
    let resolvedPath = sourcePath;
    
    // Handle relative imports
    if (sourcePath.startsWith('./') || sourcePath.startsWith('../')) {
      if (this.currentFilePath) {
        const currentDir = this.currentFilePath.includes('/') 
          ? this.currentFilePath.substring(0, this.currentFilePath.lastIndexOf('/') + 1) 
          : '';
        resolvedPath = this.simplifyPath(currentDir + sourcePath);
      }
      
      if (!resolvedPath.endsWith('.ml')) {
        resolvedPath += '.ml';
      }
    }
    
    // Check if the module is already loaded
    if (!this.importCache.has(resolvedPath)) {
      try {
        // Load module from server
        const moduleCode = await this.loadModuleFromServer(resolvedPath);
        
        // Parse and interpret the module
          const lexer = new Lexer(moduleCode);
          const parser = new Parser(lexer);
        const moduleAst = parser.parse();
          
          // Create a new interpreter for the module
          const moduleInterpreter = new Interpreter();
          moduleInterpreter.currentFilePath = resolvedPath;
        await moduleInterpreter.interpretNode(moduleAst);
          
          // Store the module's exports
        this.importCache.set(resolvedPath, moduleInterpreter.environment.exports);
      } catch (error) {
        throw new RuntimeError(`Error importing module: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Get the module's exports
    const moduleExports = this.importCache.get(resolvedPath);
    if (!moduleExports) {
      throw new RuntimeError(`Failed to load module: ${sourcePath}`);
    }
    
    // Import the specified exports into the current environment
      for (const specifier of node.specifiers) {
      const exportedName = specifier.exported.name;
      const localName = specifier.local.name;
      
      // Check if the export exists in the module
      const exportedValue = moduleExports.get(exportedName);
      if (exportedValue === undefined) {
        throw new RuntimeError(`Export '${exportedName}' not found in module '${sourcePath}'`);
      }
      
      // Add the imported value to the current environment
          this.environment.variables.set(localName, {
        value: exportedValue,
            isConstant: true
          });
    }
    
    return null;
  }

  private interpretExportDeclaration(node: ExportDeclarationNode): any {
    // Handle different types of exports
    if (node.declaration) {
      // Export declaration (e.g., export function foo() {})
      const result = this.interpretNode(node.declaration);
      
      if (node.declaration.type === 'FunctionDeclaration') {
        // Function declarations have string names
        this.environment.exports.set(node.declaration.name, result);
      } else if (node.declaration.type === 'VariableDeclaration') {
        // Variable declarations have Token names
        const name = node.declaration.name.lexeme || node.declaration.name.value;
        this.environment.exports.set(name, result);
      } else if (node.declaration.type === 'ClassDeclaration') {
        // Class declarations have string names
        this.environment.exports.set(node.declaration.name, result);
      }
    } else if (node.specifiers) {
      // Named exports (e.g., export { foo, bar })
      for (const specifier of node.specifiers) {
        const localName = specifier.local.name;
        const exportName = specifier.exported.name;
        
        // Get the value from the current environment
        const value = this.lookupVariable(localName);
        if (!value) {
          throw new RuntimeError(`Cannot export undefined variable: ${localName}`);
        }
        
        // Add to exports
        this.environment.exports.set(exportName, value.value);
      }
    }
    
    return null;
  }

  formatResult(result: any): any {
    if (result === null || result === undefined) {
      return 'null';
    }
    if (typeof result === 'string') {
      return result;
    }
    if (Array.isArray(result)) {
      return result.map(item => this.formatResult(item));
    }
    if (typeof result === 'object') {
      if (result instanceof MemeLangInstance) {
        return result.toString();
      }
      return JSON.stringify(result, null, 2);
    }
    return String(result);
  }
} 