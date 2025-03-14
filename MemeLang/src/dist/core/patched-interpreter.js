/**
 * A patched version of the MemeLang interpreter that properly handles
 * comments and forward slashes
 */
import { Lexer } from './memelang/lexer';
import { PatchedParser } from './patched-parser';
export class PatchedInterpreter {
    constructor() { }
    /**
     * Execute MemeLang code
     */
    execute(source) {
        try {
            // First, process the source code to handle comments properly
            source = this.preProcessComments(source);
            // Tokenize the code using the original lexer
            const lexer = new Lexer(source);
            const tokens = lexer.tokenize();
            // Use our patched parser
            const parser = new PatchedParser(tokens);
            const ast = parser.parse();
            // Simple interpretation - print statements are executed
            let output = '';
            for (const node of ast) {
                if (node.type === 'PrintStatement' && node.value.type === 'StringLiteral') {
                    output += node.value.value + '\n';
                }
            }
            return output.trim();
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Pre-process the source code to handle comments properly
     */
    preProcessComments(source) {
        // Remove line comments
        const noComments = source.split('\n')
            .map(line => {
            const commentIndex = line.indexOf('//');
            if (commentIndex >= 0) {
                return line.substring(0, commentIndex);
            }
            return line;
        })
            .join('\n');
        return noComments;
    }
}
