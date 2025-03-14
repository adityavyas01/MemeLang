/**
 * A system that integrates both the full MemeLang interpreter
 * and a simplified fallback for the web interface
 */
export declare class InterpreterSystem {
    private fullInterpreter;
    private simpleInterpreter;
    private preferFull;
    private debugMode;
    constructor(preferFull?: boolean, debugMode?: boolean);
    /**
     * Execute code using the preferred interpreter system,
     * with automatic fallback if needed
     */
    execute(code: string): {
        output: string;
        mode: 'full' | 'simple';
        error?: string;
    };
    /**
     * Switch between interpreters
     */
    setPreferFull(preferFull: boolean): void;
    /**
     * Enable or disable debug mode
     */
    setDebugMode(debugMode: boolean): void;
}
