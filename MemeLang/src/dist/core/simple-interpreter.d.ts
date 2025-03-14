/**
 * A simplified interpreter for MemeLang that handles basic commands
 * for the web interface while the full interpreter is being fixed
 */
export declare class SimpleInterpreter {
    private output;
    private variables;
    /**
     * Execute MemeLang code and return the output
     */
    execute(code: string): string;
    /**
     * Handle print statements like bol_bhai "Hello World"
     */
    private handlePrint;
    /**
     * Handle variable assignments like rakho_bhai x = 10
     */
    private handleAssignment;
}
