import { ASTNode } from '../types';
export declare class Parser {
    private tokens;
    private current;
    constructor(tokens: any[]);
    parse(): ASTNode;
    private statement;
    private expression;
    private isAtEnd;
    private advance;
    private peek;
    private previous;
}
