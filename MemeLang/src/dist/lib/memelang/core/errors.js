/**
 * Base error class for MemeLang
 */
export class MemeLangError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
/**
 * Runtime error during code execution
 */
export class RuntimeError extends MemeLangError {
    constructor(message) {
        super(message);
    }
}
/**
 * Lexical analysis error
 */
export class LexerError extends MemeLangError {
    constructor(message, line) {
        super(`Line ${line}: ${message}`);
    }
}
/**
 * Parsing error
 */
export class ParserError extends MemeLangError {
    constructor(message, line) {
        super(`Line ${line}: ${message}`);
    }
}
/**
 * Type error during execution
 */
export class TypeError extends MemeLangError {
    constructor(message) {
        super(message);
    }
}
