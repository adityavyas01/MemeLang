import { ASTNode } from './types';
export declare class Interpreter {
    private environment;
    constructor();
    interpret(node: ASTNode): any;
    private evaluate;
    private evaluateProgram;
    private evaluateVariableDeclaration;
    private evaluateFunctionDeclaration;
    private evaluateIfStatement;
    private evaluateWhileStatement;
    private evaluateReturnStatement;
    private evaluatePrintStatement;
    private evaluateExpressionStatement;
    private evaluateAssignmentExpression;
    private evaluateBinaryExpression;
    private evaluateUnaryExpression;
    private evaluateArrayExpression;
    private evaluateIdentifier;
}
