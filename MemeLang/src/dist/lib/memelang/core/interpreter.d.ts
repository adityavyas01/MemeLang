import { ASTNode } from './types';
export declare class Interpreter {
    private environment;
    constructor();
    interpret(node: ASTNode): any;
    private interpretProgram;
    private interpretPrint;
    private interpretExpressionStatement;
    private getVariable;
    private setVariable;
}
