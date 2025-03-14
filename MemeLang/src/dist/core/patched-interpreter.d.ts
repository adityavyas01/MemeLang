/**
 * A patched version of the MemeLang interpreter that properly handles
 * comments and forward slashes
 */
export declare class PatchedInterpreter {
    constructor();
    /**
     * Execute MemeLang code
     */
    execute(source: string): any;
    /**
     * Pre-process the source code to handle comments properly
     */
    private preProcessComments;
}
