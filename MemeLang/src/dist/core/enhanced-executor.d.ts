/**
 * A more comprehensive executor that supports most MemeLang keywords and features
 */
export declare class EnhancedExecutor {
    private variables;
    private functions;
    private output;
    private returnValue;
    /**
     * Execute MemeLang code with support for multiple keywords
     */
    execute(code: string): string;
    /**
     * Execute a block of code lines
     */
    private executeBlock;
    /**
     * Extract the value to be printed from a bol_bhai statement
     */
    private extractPrintValue;
    /**
     * Handle variable assignment statements
     */
    private handleVariableAssignment;
    /**
     * Evaluate a condition expression
     */
    private evaluateCondition;
    /**
     * Evaluate an expression to a value
     */
    private evaluateExpression;
    /**
     * Clean the code by removing comments and trimming whitespace
     */
    private cleanCode;
}
