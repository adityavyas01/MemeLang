export class CompileError extends Error {
    constructor(message) {
        super(`Compile Error: ${message}`);
        this.name = 'CompileError';
    }
}
export class RuntimeError extends Error {
    constructor(message) {
        super(`Runtime Error: ${message}`);
        this.name = 'RuntimeError';
    }
}
export class TypeError extends Error {
    constructor(message) {
        super(`Type Error: ${message}`);
        this.name = 'TypeError';
    }
}
export class SyntaxError extends Error {
    constructor(message) {
        super(`Syntax Error: ${message}`);
        this.name = 'SyntaxError';
    }
}
