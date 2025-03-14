import { RuntimeError } from './errors';
export class Interpreter {
    constructor() {
        this.environment = {
            parent: null,
            variables: new Map(),
            functions: new Map()
        };
    }
    interpret(node) {
        try {
            return this.evaluate(node);
        }
        catch (error) {
            if (error instanceof RuntimeError) {
                throw error;
            }
            throw new RuntimeError(`Runtime error: ${error.message}`);
        }
    }
    evaluate(node) {
        switch (node.type) {
            case 'Program':
                return this.evaluateProgram(node);
            case 'VariableDeclaration':
                return this.evaluateVariableDeclaration(node);
            case 'FunctionDeclaration':
                return this.evaluateFunctionDeclaration(node);
            case 'IfStatement':
                return this.evaluateIfStatement(node);
            case 'WhileStatement':
                return this.evaluateWhileStatement(node);
            case 'ReturnStatement':
                return this.evaluateReturnStatement(node);
            case 'PrintStatement':
                return this.evaluatePrintStatement(node);
            case 'ExpressionStatement':
                return this.evaluateExpressionStatement(node);
            case 'AssignmentExpression':
                return this.evaluateAssignmentExpression(node);
            case 'BinaryExpression':
                return this.evaluateBinaryExpression(node);
            case 'UnaryExpression':
                return this.evaluateUnaryExpression(node);
            case 'ArrayExpression':
                return this.evaluateArrayExpression(node);
            case 'Identifier':
                return this.evaluateIdentifier(node);
            case 'NumberLiteral':
            case 'StringLiteral':
            case 'BooleanLiteral':
            case 'NullLiteral':
                return node.value;
            default:
                throw new RuntimeError(`Unknown node type: ${node.type}`);
        }
    }
    evaluateProgram(node) {
        let result;
        for (const statement of node.body) {
            result = this.evaluate(statement);
        }
        return result;
    }
    evaluateVariableDeclaration(node) {
        const value = this.evaluate(node.init);
        if (node.kind === 'const' && this.environment.variables.has(node.identifier.name)) {
            throw new RuntimeError(`Cannot reassign constant variable: ${node.identifier.name}`);
        }
        this.environment.variables.set(node.identifier.name, value);
        return value;
    }
    evaluateFunctionDeclaration(node) {
        const func = (...args) => {
            const functionEnv = {
                parent: this.environment,
                variables: new Map(),
                functions: new Map()
            };
            // Set up parameters in the function environment
            node.params.forEach((param, index) => {
                functionEnv.variables.set(param.name, args[index]);
            });
            const prevEnv = this.environment;
            this.environment = functionEnv;
            let result;
            try {
                for (const statement of node.body) {
                    result = this.evaluate(statement);
                    if (statement.type === 'ReturnStatement') {
                        break;
                    }
                }
            }
            finally {
                this.environment = prevEnv;
            }
            return result;
        };
        this.environment.functions.set(node.name.name, func);
    }
    evaluateIfStatement(node) {
        const test = this.evaluate(node.test);
        if (test) {
            for (const statement of node.consequent) {
                this.evaluate(statement);
            }
        }
        else if (node.alternate) {
            for (const statement of node.alternate) {
                this.evaluate(statement);
            }
        }
    }
    evaluateWhileStatement(node) {
        while (this.evaluate(node.test)) {
            for (const statement of node.body) {
                this.evaluate(statement);
            }
        }
    }
    evaluateReturnStatement(node) {
        return this.evaluate(node.argument);
    }
    evaluatePrintStatement(node) {
        const value = this.evaluate(node.argument);
        console.log(value);
        return value;
    }
    evaluateExpressionStatement(node) {
        return this.evaluate(node.expression);
    }
    evaluateAssignmentExpression(node) {
        const value = this.evaluate(node.right);
        const name = node.left.name;
        let env = this.environment;
        while (env) {
            if (env.variables.has(name)) {
                env.variables.set(name, value);
                return value;
            }
            env = env.parent;
        }
        throw new RuntimeError(`Cannot assign to undefined variable: ${name}`);
    }
    evaluateBinaryExpression(node) {
        const left = this.evaluate(node.left);
        const right = this.evaluate(node.right);
        switch (node.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/':
                if (right === 0)
                    throw new RuntimeError('Division by zero');
                return left / right;
            case '%': return left % right;
            case '==': return left === right;
            case '!=': return left !== right;
            case '<': return left < right;
            case '<=': return left <= right;
            case '>': return left > right;
            case '>=': return left >= right;
            case 'aur': return left && right;
            case 'ya': return left || right;
            default:
                throw new RuntimeError(`Unknown operator: ${node.operator}`);
        }
    }
    evaluateUnaryExpression(node) {
        const argument = this.evaluate(node.argument);
        switch (node.operator) {
            case '-': return -argument;
            case '!': return !argument;
            case 'nahi': return !argument;
            default:
                throw new RuntimeError(`Unknown unary operator: ${node.operator}`);
        }
    }
    evaluateArrayExpression(node) {
        return node.elements.map(element => this.evaluate(element));
    }
    evaluateIdentifier(node) {
        let env = this.environment;
        while (env) {
            if (env.variables.has(node.name)) {
                return env.variables.get(node.name);
            }
            if (env.functions.has(node.name)) {
                return env.functions.get(node.name);
            }
            env = env.parent;
        }
        throw new RuntimeError(`Undefined variable or function: ${node.name}`);
    }
}
