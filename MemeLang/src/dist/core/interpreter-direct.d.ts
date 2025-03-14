/**
 * A direct wrapper for the MemeLang interpreter with enhanced error handling
 */
export declare class DirectInterpreter {
    private interpreter;
    private debugMode;
    constructor(debugMode?: boolean);
    /**
     * Execute MemeLang code with proper error handling
     */
    execute(code: string): string;
}
