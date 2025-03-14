/**
 * Base error class for MemeLang
 */
export declare class MemeLangError extends Error {
    constructor(message: string);
}
/**
 * Runtime error during code execution
 */
export declare class RuntimeError extends MemeLangError {
    constructor(message: string);
}
/**
 * Lexical analysis error
 */
export declare class LexerError extends MemeLangError {
    constructor(message: string, line: number);
}
/**
 * Parsing error
 */
export declare class ParserError extends MemeLangError {
    constructor(message: string, line: number);
}
/**
 * Type error during execution
 */
export declare class TypeError extends MemeLangError {
    constructor(message: string);
}
