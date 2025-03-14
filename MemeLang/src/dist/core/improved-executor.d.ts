/**
 * ImprovedExecutor that supports core MemeLang keywords
 * Focuses on fixing variable values, loops, and core functionality
 */
export declare class ImprovedExecutor {
    private variables;
    private constants;
    private functions;
    private output;
    private returnValue;
    private breakLoop;
    private continueLoop;
    private debug;
    constructor(debug?: boolean);
    /**
     * Execute MemeLang code with support for multiple keywords
     */
    execute(code: string): string;
    /**
     * Execute a single statement
     */
    private executeStatement;
    /**
     * Execute a block of code lines
     */
    private executeBlock;
    /**
     * Log debug messages if debug mode is enabled
     */
    private log;
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
