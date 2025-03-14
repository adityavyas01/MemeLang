/**
 * A system that integrates both the full MemeLang interpreter
 * and a simplified fallback for the web interface
 */
import { SimpleInterpreter } from './simple-interpreter';
import { InterpreterWrapper } from './interpreter-wrapper';
export class InterpreterSystem {
    constructor(preferFull = true, debugMode = false) {
        this.fullInterpreter = new InterpreterWrapper(debugMode);
        this.simpleInterpreter = new SimpleInterpreter();
        this.preferFull = preferFull;
        this.debugMode = debugMode;
    }
    /**
     * Execute code using the preferred interpreter system,
     * with automatic fallback if needed
     */
    execute(code) {
        // First try with the user's preferred interpreter
        if (this.preferFull) {
            try {
                const result = this.fullInterpreter.execute(code);
                // If there's an error, we'll fall back to the simple interpreter
                if (result.error) {
                    if (this.debugMode) {
                        console.log('Full interpreter error, falling back to simple interpreter:', result.error);
                    }
                    const simpleResult = this.simpleInterpreter.execute(code);
                    return {
                        output: simpleResult,
                        mode: 'simple',
                        error: result.error // Include the original error for reference
                    };
                }
                return {
                    output: result.output,
                    mode: 'full'
                };
            }
            catch (error) {
                if (this.debugMode) {
                    console.error('Unexpected error in full interpreter, falling back:', error);
                }
                // If there's an unexpected error, fall back to the simple interpreter
                try {
                    const simpleResult = this.simpleInterpreter.execute(code);
                    return {
                        output: simpleResult,
                        mode: 'simple',
                        error: error.message
                    };
                }
                catch (simpleError) {
                    // If even the simple interpreter fails, return an error
                    return {
                        output: '',
                        mode: 'simple',
                        error: `Both interpreters failed. Simple error: ${simpleError.message}`
                    };
                }
            }
        }
        else {
            // User prefers the simple interpreter
            try {
                const simpleResult = this.simpleInterpreter.execute(code);
                return {
                    output: simpleResult,
                    mode: 'simple'
                };
            }
            catch (error) {
                return {
                    output: '',
                    mode: 'simple',
                    error: `Simple interpreter error: ${error.message}`
                };
            }
        }
    }
    /**
     * Switch between interpreters
     */
    setPreferFull(preferFull) {
        this.preferFull = preferFull;
    }
    /**
     * Enable or disable debug mode
     */
    setDebugMode(debugMode) {
        this.debugMode = debugMode;
    }
}
