import { Position } from './lexer/types';
export declare class CompileTimeError extends Error {
    position?: Position;
    constructor(message: string, position?: Position);
}
export declare class RuntimeError extends Error {
    position?: Position;
    constructor(message: string, position?: Position);
}
export declare class TypeMismatchError extends Error {
    position?: Position;
    constructor(expected: string, got: string, position?: Position);
}
export declare class ClassError extends Error {
    position?: Position;
    constructor(message: string, position?: Position);
}
