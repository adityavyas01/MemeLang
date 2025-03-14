/**
 * A basic executor that handles only the core MemeLang functionality
 * without using the complex parser, focusing on getting the interpreter working
 */
export class BasicExecutor {
    /**
     * Execute MemeLang code with a simplified approach
     */
    execute(code) {
        // Clean the code
        const cleanedCode = this.cleanCode(code);
        const lines = cleanedCode.split('\n');
        let output = '';
        let inProgram = false;
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '')
                continue;
            // Process program structure
            if (trimmedLine === 'hi_bhai') {
                inProgram = true;
                continue;
            }
            if (trimmedLine === 'bye_bhai') {
                inProgram = false;
                continue;
            }
            // Only process lines within a program
            if (!inProgram)
                continue;
            // Process bol_bhai statements
            if (trimmedLine.startsWith('bol_bhai')) {
                const printMatch = trimmedLine.match(/bol_bhai\s+"([^"]*)"/);
                if (printMatch && printMatch[1]) {
                    output += printMatch[1] + '\n';
                }
                // Check for single quotes too
                const singleQuotePrintMatch = trimmedLine.match(/bol_bhai\s+'([^']*)'/);
                if (singleQuotePrintMatch && singleQuotePrintMatch[1]) {
                    output += singleQuotePrintMatch[1] + '\n';
                }
            }
        }
        return output.trim();
    }
    /**
     * Clean the code by removing comments and trimming whitespace
     */
    cleanCode(code) {
        return code.split('\n')
            .map(line => {
            // Remove comments
            const commentIndex = line.indexOf('//');
            if (commentIndex >= 0) {
                return line.substring(0, commentIndex).trim();
            }
            return line.trim();
        })
            .join('\n');
    }
}
