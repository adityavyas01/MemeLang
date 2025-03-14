"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const errors_1 = require("../errors");
class Interpreter {
    constructor() {
        this.environment = this.createGlobalEnvironment();
    }
    createGlobalEnvironment() {
        const env = {
            parent: null,
            variables: new Map(),
            functions: new Map(),
        };
        // Add built-in functions
        env.functions.set("print", console.log);
        env.functions.set("len", (arr) => arr.length);
        env.functions.set("type", (val) => typeof val);
        return env;
    }
    createChildEnvironment() {
        return {
            parent: this.environment,
            variables: new Map(),
            functions: new Map(),
        };
    }
    lookupVariable(name) {
        let env = this.environment;
        while (env) {
            if (env.variables.has(name)) {
                return env.variables.get(name);
            }
            env = env.parent;
        }
        throw new errors_1.RuntimeError(`Undefined variable: ${name}`);
    }
    interpret(node) {
        switch (node.type) {
            case "Program":
                return this.interpretProgram(node);
            case "NumberLiteral":
                return Number(node.value);
            case "StringLiteral":
                return String(node.value);
            case "BooleanLiteral":
                return Boolean(node.value);
            case "NullLiteral":
                return null;
            case "Identifier":
                return this.lookupVariable(node.name);
            case "BinaryExpression":
                return this.interpretBinaryExpression(node);
            case "VariableDeclaration":
                return this.interpretVariableDeclaration(node);
            case "FunctionDeclaration":
                return this.interpretFunctionDeclaration(node);
            case "CallExpression":
                return this.interpretCallExpression(node);
            case "IfStatement":
                return this.interpretIfStatement(node);
            case "WhileStatement":
                return this.interpretWhileStatement(node);
            case "ReturnStatement":
                return this.interpretReturnStatement(node);
            default:
                throw new errors_1.RuntimeError(`Unknown node type: ${node.type}`);
        }
    }
    interpretProgram(node) {
        let result;
        for (const statement of node.body) {
            result = this.interpret(statement);
        }
        return result;
    }
    interpretPrint(node) {
        const value = this.interpret(node.argument);
        console.log(value);
    }
    interpretIf(node) {
        const test = this.interpret(node.test);
        if (test) {
            return this.interpret(node.consequent);
        }
        else if (node.alternate) {
            return this.interpret(node.alternate);
        }
    }
    interpretWhile(node) {
        while (this.interpret(node.test)) {
            for (const statement of node.body) {
                this.interpret(statement);
            }
        }
    }
    interpretIdentifier(node) {
        if (this.environment[node.name] !== undefined) {
            return this.environment[node.name];
        }
        else {
            throw new Error(`Undefined variable: ${node.name}`);
        }
    }
    interpretLiteral(node) {
        // Remove the surrounding quotes from the string literal
        return node.value.replace(/^"|"$/g, "");
    }
    interpretReturn(node) {
        return this.interpret(node.argument);
    }
    interpretBinaryExpression(node) {
        const left = this.interpret(node.left);
        const right = this.interpret(node.right);
        switch (node.operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                return left / right;
            default:
                throw new Error(`Unknown operator: ${node.operator}`);
        }
    }
    interpretFunctionDeclaration(node) {
        this.environment[node.name.name] = node;
    }
    interpretExpressionStatement(node) {
        return this.interpret(node.expression);
    }
}
exports.Interpreter = Interpreter;
