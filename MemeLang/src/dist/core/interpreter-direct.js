/**
 * A direct wrapper for the MemeLang interpreter with enhanced error handling
 */
import { MemeLang } from './memelang';
export class DirectInterpreter {
    constructor(debugMode = false) {
        this.interpreter = new MemeLang();
        this.debugMode = debugMode;
    }
    /**
     * Execute MemeLang code with proper error handling
     */
    execute(code) {
        if (this.debugMode) {
            console.log('Executing code:', code);
        }
        try {
            // Capture console output
            let outputBuffer = '';
            const originalConsoleLog = console.log;
            // Override console.log to capture output
            console.log = (...args) => {
                const output = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
                outputBuffer += output + '\n';
                if (this.debugMode) {
                    // Still log to the actual console in debug mode
                    originalConsoleLog(...args);
                }
            };
            // Actually execute the code with the interpreter
            const result = this.interpreter.execute(code);
            // Restore original console.log
            console.log = originalConsoleLog;
            // Format the response
            let finalOutput = outputBuffer.trim();
            if (result !== undefined && result !== null) {
                finalOutput += finalOutput ? '\nResult: ' + result : 'Result: ' + result;
            }
            return finalOutput || 'Code executed successfully (no output)';
        }
        catch (error) {
            // Log the error in debug mode
            if (this.debugMode) {
                console.error('Interpreter execution error:', error);
            }
            // Re-throw the error with a more descriptive message if needed
            throw error;
        }
    }
}
