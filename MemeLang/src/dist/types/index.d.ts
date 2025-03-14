export interface Position {
    line: number;
    column: number;
}
export interface Token {
    type: string;
    value: string;
    position: Position;
}
export interface Node {
    type: string;
    position?: Position;
}
export interface Expression extends Node {
    type: string;
}
export interface Statement extends Node {
    type: string;
}
export declare class CompileError extends Error {
    position?: Position | undefined;
    constructor(message: string, position?: Position | undefined);
}
export declare class RuntimeError extends Error {
    position?: Position | undefined;
    constructor(message: string, position?: Position | undefined);
}
export interface Environment {
    [key: string]: any;
}
export interface InterpreterOptions {
    enableDebug?: boolean;
    maxIterations?: number;
}
