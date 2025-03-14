import { Position, ErrorType } from '../types';
export declare class MemeLangError extends Error {
    type: ErrorType;
    position: Position;
    constructor(type: ErrorType, message: string, position: Position);
    getFriendlyMessage(): string;
}
export declare class SyntaxError extends MemeLangError {
    constructor(message: string, position: Position);
}
export declare class RuntimeError extends MemeLangError {
    constructor(message: string, position: Position);
}
export declare class TypeError extends MemeLangError {
    constructor(message: string, position: Position);
}
export declare class ReferenceError extends MemeLangError {
    constructor(message: string, position: Position);
}
export declare const createSyntaxError: (message: string, position: Position) => SyntaxError;
export declare const createRuntimeError: (message: string, position: Position) => RuntimeError;
export declare const createTypeError: (message: string, position: Position) => TypeError;
export declare const createReferenceError: (message: string, position: Position) => ReferenceError;
