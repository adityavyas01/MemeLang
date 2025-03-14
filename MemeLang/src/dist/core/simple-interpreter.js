/**
 * A simplified interpreter for MemeLang that handles basic commands
 * for the web interface while the full interpreter is being fixed
 */
export class SimpleInterpreter {
    constructor() {
        this.output = [];
        this.variables = {};
    }
    /**
     * Execute MemeLang code and return the output
     */
    execute(code) {
        this.output = [];
        this.variables = {};
        // Split the code into lines and process each line
        const lines = code.split('\n');
        let inProgram = false;
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Skip empty lines and comments
            if (trimmedLine === '' || trimmedLine.startsWith('//')) {
                continue;
            }
            // Check for program start/end
            if (trimmedLine === 'hi_bhai') {
                inProgram = true;
                continue;
            }
            if (trimmedLine === 'bye_bhai') {
                inProgram = false;
                continue;
            }
            // Only process lines if we're in a program
            if (!inProgram) {
                continue;
            }
            // Handle print statements
            if (trimmedLine.startsWith('bol_bhai')) {
                this.handlePrint(trimmedLine);
            }
            // Handle variable assignments
            else if (trimmedLine.startsWith('rakho_bhai')) {
                this.handleAssignment(trimmedLine);
            }
            // Handle if statements (simplified)
            else if (trimmedLine.startsWith('agar_bhai')) {
                this.output.push("[Conditional statement recognized]");
            }
            // Handle loops (simplified)
            else if (trimmedLine.startsWith('tabtak_bhai')) {
                this.output.push("[Loop statement recognized]");
            }
            // Handle functions (simplified)
            else if (trimmedLine.startsWith('karna_bhai')) {
                this.output.push("[Function definition recognized]");
            }
            else {
                this.output.push(`Command not recognized: ${trimmedLine}`);
            }
        }
        return this.output.join('\n');
    }
    /**
     * Handle print statements like bol_bhai "Hello World"
     */
    handlePrint(line) {
        // Extract content between quotes
        const match = line.match(/"([^"]*)"/) || line.match(/'([^']*)'/);
        if (match && match[1]) {
            this.output.push(match[1]);
        }
        else {
            // Check if it's a variable reference
            const varMatch = line.match(/bol_bhai\s+(\w+)/);
            if (varMatch && varMatch[1]) {
                const varName = varMatch[1];
                if (this.variables[varName] !== undefined) {
                    this.output.push(String(this.variables[varName]));
                }
                else {
                    this.output.push(`Error: Variable '${varName}' not defined`);
                }
            }
            else {
                this.output.push("Error: Invalid print statement");
            }
        }
    }
    /**
     * Handle variable assignments like rakho_bhai x = 10
     */
    handleAssignment(line) {
        const match = line.match(/rakho_bhai\s+(\w+)\s*=\s*(.+)/);
        if (match && match[1] && match[2]) {
            const varName = match[1];
            const valueStr = match[2].trim();
            // Try to parse the value
            let value;
            // Check if it's a string
            const stringMatch = valueStr.match(/^"([^"]*)"$/) || valueStr.match(/^'([^']*)'$/);
            if (stringMatch) {
                value = stringMatch[1];
            }
            // Check if it's a number
            else if (!isNaN(Number(valueStr))) {
                value = Number(valueStr);
            }
            // Default to treating it as a string
            else {
                value = valueStr;
            }
            this.variables[varName] = value;
            this.output.push(`Variable '${varName}' set to ${JSON.stringify(value)}`);
        }
        else {
            this.output.push("Error: Invalid variable assignment");
        }
    }
}
