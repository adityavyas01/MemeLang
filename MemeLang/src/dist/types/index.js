// Error types
export class CompileError extends Error {
    constructor(message, position) {
        super(message);
        this.position = position;
        this.name = 'CompileError';
    }
}
export class RuntimeError extends Error {
    constructor(message, position) {
        super(message);
        this.position = position;
        this.name = 'RuntimeError';
    }
}
