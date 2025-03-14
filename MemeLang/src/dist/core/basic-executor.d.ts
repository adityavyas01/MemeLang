/**
 * A basic executor that handles only the core MemeLang functionality
 * without using the complex parser, focusing on getting the interpreter working
 */
export declare class BasicExecutor {
    /**
     * Execute MemeLang code with a simplified approach
     */
    execute(code: string): string;
    /**
     * Clean the code by removing comments and trimming whitespace
     */
    private cleanCode;
}
