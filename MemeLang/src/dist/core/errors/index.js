export class MemeLangError extends Error {
    constructor(type, message, position) {
        super(message);
        this.type = type;
        this.position = position;
        this.name = 'MemeLangError';
    }
    getFriendlyMessage() {
        const location = `Line ${this.position.line}, Column ${this.position.column}`;
        return `${this.type} at ${location}: ${this.message}`;
    }
}
export class SyntaxError extends MemeLangError {
    constructor(message, position) {
        super('SyntaxError', `Bhai, syntax galat hai! ${message}`, position);
    }
}
export class RuntimeError extends MemeLangError {
    constructor(message, position) {
        super('RuntimeError', `Bhai, kuch gadbad ho gayi! ${message}`, position);
    }
}
export class TypeError extends MemeLangError {
    constructor(message, position) {
        super('TypeError', `Bhai, type match nahi kar raha! ${message}`, position);
    }
}
export class ReferenceError extends MemeLangError {
    constructor(message, position) {
        super('ReferenceError', `Bhai, ye variable toh defined hi nahi hai! ${message}`, position);
    }
}
// Helper functions for common errors
export const createSyntaxError = (message, position) => new SyntaxError(message, position);
export const createRuntimeError = (message, position) => new RuntimeError(message, position);
export const createTypeError = (message, position) => new TypeError(message, position);
export const createReferenceError = (message, position) => new ReferenceError(message, position);
