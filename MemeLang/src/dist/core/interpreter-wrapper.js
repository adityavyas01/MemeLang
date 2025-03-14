/**
 * A wrapper for the MemeLang interpreter that provides enhanced error handling
 * and debugging capabilities for the web interface
 */
import { MemeLang } from './memelang';
export class InterpreterWrapper {
    constructor(debugMode = false) {
        this.interpreter = new MemeLang();
        this.debugMode = debugMode;
    }
    /**
     * Execute MemeLang code with detailed error handling
     */
    execute(code) {
        if (this.debugMode) {
            console.log('Code to execute:', code);
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
            // Execute the code
            const result = this.interpreter.execute(code);
            // Restore original console.log
            console.log = originalConsoleLog;
            // Format the response
            let finalOutput = outputBuffer.trim();
            if (result !== undefined && result !== null) {
                finalOutput += finalOutput ? '\nResult: ' + result : 'Result: ' + result;
            }
            return {
                output: finalOutput || 'Code executed successfully (no output)'
            };
        }
        catch (error) {
            // Log the full error in debug mode
            if (this.debugMode) {
                console.error('Interpreter error:', error);
            }
            // Provide a user-friendly error message
            return {
                output: '',
                error: this.formatErrorMessage(error)
            };
        }
    }
    /**
     * Format error messages to be more user-friendly
     */
    formatErrorMessage(error) {
        const message = error.message || 'Unknown error occurred';
        if (message.includes('Unexpected token')) {
            const tokenMatch = message.match(/Unexpected token: (.+)/);
            const token = tokenMatch ? tokenMatch[1] : 'unknown';
            return `Bhai, ye token samajh nahi aaya: ${token} 🤔`;
        }
        if (message.includes('Undefined variable')) {
            const varMatch = message.match(/Undefined variable: (.+)/);
            const variable = varMatch ? varMatch[1] : 'unknown';
            return `Bhai, ye variable toh define hi nahi kiya: ${variable} 😕`;
        }
        if (message.includes('Unknown node type')) {
            return 'Bhai, ye kya likh diya? Samajh nahi aa raha! 🤔';
        }
        // Default error message
        return `Error: ${message}`;
    }
}
