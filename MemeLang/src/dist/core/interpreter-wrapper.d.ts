/**
 * A wrapper for the MemeLang interpreter that provides enhanced error handling
 * and debugging capabilities for the web interface
 */
export declare class InterpreterWrapper {
    private interpreter;
    private debugMode;
    constructor(debugMode?: boolean);
    /**
     * Execute MemeLang code with detailed error handling
     */
    execute(code: string): {
        output: string;
        error?: string;
    };
    /**
     * Format error messages to be more user-friendly
     */
    private formatErrorMessage;
}
