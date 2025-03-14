/**
 * A patched parser implementation that fixes the issue with slash characters
 * and properly handles comments in the MemeLang syntax
 */
import { ASTNode } from './memelang/types';
type Token = {
    type: string;
    value: string;
    position?: {
        line: number;
        column: number;
    };
};
export declare class PatchedParser {
    private tokens;
    private current;
    constructor(tokens: Token[]);
    parse(): ASTNode[];
    private isAtEnd;
    private peek;
    private previous;
    private advance;
    private check;
    private match;
    private consume;
    private synchronize;
    private statement;
    private expression;
}
export {};
