import { RuntimeError } from './errors';
export class Interpreter {
    constructor() {
        this.environment = new Map();
    }
    interpret(node) {
        switch (node.type) {
            case 'Program':
                return this.interpretProgram(node);
            case 'ProgramStart':
                return null;
            case 'ProgramEnd':
                return null;
            case 'Print':
                return this.interpretPrint(node);
            case 'ExpressionStatement':
                return this.interpretExpressionStatement(node);
            case 'StringLiteral':
                return node.value;
            case 'NumberLiteral':
                return Number(node.value);
            case 'Identifier':
                return this.getVariable(node.name || '');
            default:
                throw new RuntimeError(`Unknown node type: ${node.type}`);
        }
    }
    interpretProgram(node) {
        let result;
        if (Array.isArray(node.body)) {
            for (const statement of node.body) {
                result = this.interpret(statement);
            }
        }
        return result;
    }
    interpretPrint(node) {
        if (!node.argument) {
            throw new RuntimeError('Print statement requires an argument');
        }
        const value = this.interpret(node.argument);
        console.log(value);
        return value;
    }
    interpretExpressionStatement(node) {
        if (!node.expression) {
            throw new RuntimeError('Expression statement requires an expression');
        }
        return this.interpret(node.expression);
    }
    getVariable(name) {
        if (this.environment.has(name)) {
            return this.environment.get(name);
        }
        throw new RuntimeError(`Undefined variable: ${name}`);
    }
    setVariable(name, value) {
        this.environment.set(name, value);
    }
}
