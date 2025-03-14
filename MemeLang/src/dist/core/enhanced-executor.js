/**
 * A more comprehensive executor that supports most MemeLang keywords and features
 */
// Custom error class for runtime errors
class RuntimeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RuntimeError';
    }
}
export class EnhancedExecutor {
    constructor() {
        this.variables = new Map();
        this.functions = new Map();
        this.output = [];
    }
    /**
     * Execute MemeLang code with support for multiple keywords
     */
    execute(code) {
        // Reset state
        this.variables = new Map();
        this.functions = new Map();
        this.output = [];
        this.returnValue = undefined;
        // Clean the code
        const cleanedCode = this.cleanCode(code);
        const lines = cleanedCode.split('\n');
        // Debug: Print code before execution
        console.log("Executing code:", cleanedCode);
        // Check if the program has proper start/end structure
        const hasStart = lines.some(line => line.trim() === 'hi_bhai');
        const hasEnd = lines.some(line => line.trim() === 'bye_bhai');
        if (!hasStart || !hasEnd) {
            throw new RuntimeError('Program must start with hi_bhai and end with bye_bhai');
        }
        let inProgram = false;
        let currentBlock = [];
        let blockType = '';
        let blockCondition = '';
        let blockName = '';
        let blockParams = [];
        let skipBlock = false;
        let blockLevel = 0;
        let i = 0;
        while (i < lines.length) {
            const line = lines[i].trim();
            i++;
            // Skip empty lines
            if (line === '')
                continue;
            // Process program structure
            if (line === 'hi_bhai') {
                inProgram = true;
                continue;
            }
            if (line === 'bye_bhai') {
                inProgram = false;
                break;
            }
            // Only process lines within a program
            if (!inProgram)
                continue;
            // Process block structures (conditionals, loops, functions)
            if (blockLevel > 0) {
                // Check for end of block
                if (line === '}') {
                    blockLevel--;
                    if (blockLevel === 0) {
                        // Process the collected block
                        if (blockType === 'agar_bhai') {
                            const condition = this.evaluateCondition(blockCondition);
                            if (condition && !skipBlock) {
                                this.executeBlock(currentBlock);
                            }
                        }
                        else if (blockType === 'ghoom_bhai') {
                            // For loops, we need to keep evaluating the condition and executing the block
                            // until the condition becomes false
                            try {
                                let loopCount = 0;
                                const maxLoops = 1000; // safety to prevent infinite loops
                                while (this.evaluateCondition(blockCondition) && loopCount < maxLoops) {
                                    // Execute the loop body
                                    this.executeBlock(currentBlock);
                                    loopCount++;
                                    // Check if we hit the loop limit
                                    if (loopCount >= maxLoops) {
                                        throw new RuntimeError('Loop ran too many times (possibly infinite)');
                                    }
                                }
                            }
                            catch (error) {
                                if (error instanceof Error) {
                                    console.error('Loop error:', error.message);
                                }
                                throw error;
                            }
                        }
                        else if (blockType === 'bana_bhai') {
                            // Just store the function, don't execute
                            this.functions.set(blockName, {
                                params: blockParams,
                                body: currentBlock
                            });
                        }
                        // Reset
                        currentBlock = [];
                        blockType = '';
                        blockCondition = '';
                        blockName = '';
                        blockParams = [];
                        skipBlock = false;
                        continue;
                    }
                }
                // Add line to current block
                currentBlock.push(line);
                continue;
            }
            // Check for block start
            if (line.startsWith('agar_bhai')) {
                blockType = 'agar_bhai';
                // Extract condition from agar_bhai (if) statement
                const conditionMatch = line.match(/agar_bhai\s*\(?(.*?)\)?\s*\{/);
                if (conditionMatch) {
                    blockCondition = conditionMatch[1].trim();
                }
                else {
                    blockCondition = line.substring('agar_bhai'.length).replace('{', '').trim();
                }
                blockLevel = 1;
                continue;
            }
            if (line.startsWith('ghoom_bhai')) {
                blockType = 'ghoom_bhai';
                // Extract condition from ghoom_bhai (while) statement
                const conditionMatch = line.match(/ghoom_bhai\s*\(?(.*?)\)?\s*\{/);
                if (conditionMatch) {
                    blockCondition = conditionMatch[1].trim();
                }
                else {
                    blockCondition = line.substring('ghoom_bhai'.length).replace('{', '').trim();
                }
                blockLevel = 1;
                continue;
            }
            if (line.startsWith('bana_bhai')) {
                blockType = 'bana_bhai';
                const funcDef = line.substring('bana_bhai'.length).trim();
                // Extract function name and parameters
                const funcNameMatch = funcDef.match(/(\w+)\s*\((.*?)\)\s*\{/);
                if (funcNameMatch) {
                    blockName = funcNameMatch[1];
                    const paramsStr = funcNameMatch[2];
                    blockParams = paramsStr.split(',').map(p => p.trim());
                }
                blockLevel = 1;
                continue;
            }
            // Process non-block statements
            // Print statements
            if (line.startsWith('bol_bhai')) {
                const value = this.extractPrintValue(line);
                if (value !== null) {
                    this.output.push(String(value));
                }
                continue;
            }
            // Variable assignments
            if (line.startsWith('bhai_ye_hai')) {
                this.handleVariableAssignment(line);
                continue;
            }
            // Variable reassignments
            const assignmentMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
            if (assignmentMatch) {
                const varName = assignmentMatch[1];
                const valueExpr = assignmentMatch[2].replace(/;$/, ''); // Remove trailing semicolon if present
                if (this.variables.has(varName)) {
                    const value = this.evaluateExpression(valueExpr);
                    this.variables.set(varName, value);
                }
                else {
                    throw new RuntimeError(`Variable '${varName}' is not defined`);
                }
                continue;
            }
            // Function calls
            const funcCallMatch = line.match(/^(\w+)\((.*?)\);?$/);
            if (funcCallMatch) {
                const funcName = funcCallMatch[1];
                const argsStr = funcCallMatch[2];
                if (this.functions.has(funcName)) {
                    const func = this.functions.get(funcName);
                    const argValues = argsStr.split(',')
                        .map(arg => arg.trim())
                        .map(arg => this.evaluateExpression(arg));
                    // Create a new scope with parameters
                    const oldVariables = new Map(this.variables);
                    // Add arguments to scope
                    func.params.forEach((param, index) => {
                        if (index < argValues.length) {
                            this.variables.set(param, argValues[index]);
                        }
                        else {
                            this.variables.set(param, null);
                        }
                    });
                    // Execute function body
                    this.executeBlock(func.body);
                    // Restore old scope
                    this.variables = oldVariables;
                }
                else {
                    throw new RuntimeError(`Function '${funcName}' is not defined`);
                }
                continue;
            }
        }
        return this.output.join('\n');
    }
    /**
     * Execute a block of code lines
     */
    executeBlock(lines) {
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '' || trimmedLine === '{' || trimmedLine === '}')
                continue;
            // Print statements
            if (trimmedLine.startsWith('bol_bhai')) {
                const value = this.extractPrintValue(trimmedLine);
                if (value !== null) {
                    this.output.push(String(value));
                }
                continue;
            }
            // Variable assignments
            if (trimmedLine.startsWith('bhai_ye_hai')) {
                this.handleVariableAssignment(trimmedLine);
                continue;
            }
            // Variable reassignments
            const assignmentMatch = trimmedLine.match(/^(\w+)\s*=\s*(.+)$/);
            if (assignmentMatch) {
                const varName = assignmentMatch[1];
                const valueExpr = assignmentMatch[2].replace(/;$/, ''); // Remove trailing semicolon if present
                if (this.variables.has(varName)) {
                    const value = this.evaluateExpression(valueExpr);
                    this.variables.set(varName, value);
                }
                else {
                    throw new RuntimeError(`Variable '${varName}' is not defined in block`);
                }
                continue;
            }
            // Return statements
            if (trimmedLine.startsWith('de_bhai')) {
                const returnExpr = trimmedLine.substring('de_bhai'.length).trim();
                this.returnValue = this.evaluateExpression(returnExpr);
                return; // Exit the block
            }
        }
    }
    /**
     * Extract the value to be printed from a bol_bhai statement
     */
    extractPrintValue(line) {
        // Remove semicolon if present
        line = line.replace(/;$/, '');
        // Check for string literals with concatenation
        const concatMatch = line.match(/bol_bhai\s+"([^"]*)"\s*\+\s*(.+)/);
        if (concatMatch) {
            const stringPart = concatMatch[1];
            const exprPart = concatMatch[2].trim();
            const exprValue = this.evaluateExpression(exprPart);
            return stringPart + String(exprValue);
        }
        // Check for simple string literals
        const stringMatch = line.match(/bol_bhai\s+"([^"]*)"/);
        if (stringMatch && stringMatch[1]) {
            return stringMatch[1];
        }
        const singleQuoteStringMatch = line.match(/bol_bhai\s+'([^']*)'/);
        if (singleQuoteStringMatch && singleQuoteStringMatch[1]) {
            return singleQuoteStringMatch[1];
        }
        // Check for expressions with concatenation or other operators
        const exprMatch = line.match(/bol_bhai\s+(.+)/);
        if (exprMatch && exprMatch[1]) {
            try {
                const result = this.evaluateExpression(exprMatch[1]);
                // Log for debugging
                console.log(`Evaluated expression: ${exprMatch[1]} to:`, result);
                return result;
            }
            catch (error) {
                console.error('Error evaluating print expression:', error);
                throw error;
            }
        }
        return null;
    }
    /**
     * Handle variable assignment statements
     */
    handleVariableAssignment(line) {
        // Remove semicolon if present
        line = line.replace(/;$/, '');
        const assignMatch = line.match(/bhai_ye_hai\s+(\w+)\s*=\s*(.+)/);
        if (assignMatch) {
            const varName = assignMatch[1];
            const valueExpr = assignMatch[2];
            // Evaluate the expression
            const value = this.evaluateExpression(valueExpr);
            // Store the variable
            this.variables.set(varName, value);
        }
        else {
            throw new RuntimeError('Invalid variable assignment');
        }
    }
    /**
     * Evaluate a condition expression
     */
    evaluateCondition(condition) {
        // Simple condition evaluation
        if (condition === 'sahi_hai')
            return true;
        if (condition === 'galat_hai')
            return false;
        // Check variable reference
        if (this.variables.has(condition)) {
            const value = this.variables.get(condition);
            return Boolean(value);
        }
        // Check equality comparison
        const equalityMatch = condition.match(/(.+)\s*==\s*(.+)/);
        if (equalityMatch) {
            const left = this.evaluateExpression(equalityMatch[1]);
            const right = this.evaluateExpression(equalityMatch[2]);
            return left === right;
        }
        // Check inequality
        const inequalityMatch = condition.match(/(.+)\s*!=\s*(.+)/);
        if (inequalityMatch) {
            const left = this.evaluateExpression(inequalityMatch[1]);
            const right = this.evaluateExpression(inequalityMatch[2]);
            return left !== right;
        }
        // Greater than
        const greaterThanMatch = condition.match(/(.+)\s*>\s*(.+)/);
        if (greaterThanMatch) {
            const left = this.evaluateExpression(greaterThanMatch[1]);
            const right = this.evaluateExpression(greaterThanMatch[2]);
            return Number(left) > Number(right);
        }
        // Less than
        const lessThanMatch = condition.match(/(.+)\s*<\s*(.+)/);
        if (lessThanMatch) {
            const left = this.evaluateExpression(lessThanMatch[1]);
            const right = this.evaluateExpression(lessThanMatch[2]);
            return Number(left) < Number(right);
        }
        // By default, evaluate as expression and check truthiness
        return Boolean(this.evaluateExpression(condition));
    }
    /**
     * Evaluate an expression to a value
     */
    evaluateExpression(expr) {
        expr = expr.trim();
        // String literals
        if (expr.startsWith('"') && expr.endsWith('"')) {
            return expr.slice(1, -1);
        }
        if (expr.startsWith("'") && expr.endsWith("'")) {
            return expr.slice(1, -1);
        }
        // Number literals
        if (/^-?\d+(\.\d+)?$/.test(expr)) {
            return Number(expr);
        }
        // Boolean literals
        if (expr === 'sahi_hai')
            return true;
        if (expr === 'galat_hai')
            return false;
        if (expr === 'null_hai')
            return null;
        // Variable references
        if (/^\w+$/.test(expr)) {
            if (this.variables.has(expr)) {
                return this.variables.get(expr) || null;
            }
            else {
                throw new RuntimeError(`Variable '${expr}' is not defined`);
            }
        }
        // Simple arithmetic expressions
        const additionMatch = expr.match(/(.+?)\s*\+\s*(.+)/);
        if (additionMatch) {
            try {
                const left = this.evaluateExpression(additionMatch[1]);
                const right = this.evaluateExpression(additionMatch[2]);
                console.log(`String concatenation: '${left}' (${typeof left}) + '${right}' (${typeof right})`);
                // For string concatenation with any type
                if (typeof left === 'string' || typeof right === 'string') {
                    const result = String(left) + String(right);
                    console.log(`Result of concatenation: '${result}'`);
                    return result;
                }
                // For numeric addition
                if (typeof left === 'number' && typeof right === 'number') {
                    return left + right;
                }
                // Default fallback for other types
                const result = String(left) + String(right);
                console.log(`Fallback concatenation result: '${result}'`);
                return result;
            }
            catch (error) {
                console.error('Error in addition/concatenation:', error);
                throw error;
            }
        }
        const subtractionMatch = expr.match(/(.+?)\s*-\s*(.+)/);
        if (subtractionMatch) {
            const left = this.evaluateExpression(subtractionMatch[1]);
            const right = this.evaluateExpression(subtractionMatch[2]);
            return Number(left) - Number(right);
        }
        const multiplicationMatch = expr.match(/(.+?)\s*\*\s*(.+)/);
        if (multiplicationMatch) {
            const left = this.evaluateExpression(multiplicationMatch[1]);
            const right = this.evaluateExpression(multiplicationMatch[2]);
            return Number(left) * Number(right);
        }
        const divisionMatch = expr.match(/(.+?)\s*\/\s*(.+)/);
        if (divisionMatch) {
            const left = this.evaluateExpression(divisionMatch[1]);
            const right = this.evaluateExpression(divisionMatch[2]);
            return Number(left) / Number(right);
        }
        // If nothing matches, return the expression as a string
        return expr;
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
