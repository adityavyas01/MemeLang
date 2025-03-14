/**
 * ImprovedExecutor that supports core MemeLang keywords
 * Focuses on fixing variable values, loops, and core functionality
 */
// Custom error class for runtime errors
class RuntimeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RuntimeError';
    }
}
export class ImprovedExecutor {
    constructor(debug = false) {
        this.variables = new Map();
        this.constants = new Set();
        this.functions = new Map();
        this.output = [];
        this.breakLoop = false;
        this.continueLoop = false;
        // Debug flag
        this.debug = false;
        this.debug = debug;
    }
    /**
     * Execute MemeLang code with support for multiple keywords
     */
    execute(code) {
        // Reset state
        this.variables = new Map();
        this.constants = new Set();
        this.functions = new Map();
        this.output = [];
        this.returnValue = undefined;
        this.breakLoop = false;
        this.continueLoop = false;
        // Clean the code
        const cleanedCode = this.cleanCode(code);
        const lines = cleanedCode.split('\n');
        // Add predefined constants for null and undefined
        this.variables.set('null_hai', null);
        this.constants.add('null_hai');
        this.variables.set('sahi_hai', true);
        this.constants.add('sahi_hai');
        this.variables.set('galat_hai', false);
        this.constants.add('galat_hai');
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
        let blockElse = [];
        let hasElseBlock = false;
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
                // Handle nested blocks by counting braces
                if (line === '{') {
                    blockLevel++;
                }
                else if (line === '}') {
                    blockLevel--;
                }
                if (blockLevel === 0) {
                    // Process else block if present
                    if (i < lines.length && (lines[i].trim() === 'warna_bhai' ||
                        lines[i].trim().startsWith('warna_bhai '))) {
                        const elseLine = lines[i].trim();
                        i++; // Skip the else line
                        // Check if it's followed by '{'
                        if (i < lines.length && lines[i].trim() === '{') {
                            blockLevel = 1;
                            i++; // Skip the opening brace
                            hasElseBlock = true;
                            // Collect else block
                            blockElse = [];
                            let nestedLevel = 1;
                            while (i < lines.length && nestedLevel > 0) {
                                const elseLine = lines[i].trim();
                                i++;
                                if (elseLine === '{') {
                                    nestedLevel++;
                                }
                                else if (elseLine === '}') {
                                    nestedLevel--;
                                }
                                if (nestedLevel > 0) {
                                    blockElse.push(elseLine);
                                }
                            }
                            // Now we have both if and else blocks collected
                            if (blockType === 'agar_bhai') {
                                const condition = this.evaluateCondition(blockCondition);
                                this.log(`Condition evaluated: ${condition}`);
                                if (condition) {
                                    // Execute if block only
                                    this.executeBlock(currentBlock);
                                }
                                else if (hasElseBlock) {
                                    // Execute else block only if condition is false
                                    this.executeBlock(blockElse);
                                }
                            }
                        }
                    }
                    else {
                        // No else block, just execute if condition is true
                        if (blockType === 'agar_bhai') {
                            const condition = this.evaluateCondition(blockCondition);
                            this.log(`Simple if condition evaluated: ${condition}`);
                            if (condition) {
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
                                    this.breakLoop = false;
                                    this.continueLoop = false;
                                    // Execute the loop body line by line
                                    for (let j = 0; j < currentBlock.length; j++) {
                                        this.executeStatement(currentBlock[j]);
                                        // Check for break or continue
                                        if (this.breakLoop) {
                                            this.log('Break detected in loop, exiting loop');
                                            break;
                                        }
                                        if (this.continueLoop) {
                                            this.log('Continue detected in loop, skipping to next iteration');
                                            this.continueLoop = false;
                                            break;
                                        }
                                    }
                                    // Check for break statement
                                    if (this.breakLoop) {
                                        break;
                                    }
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
                    }
                    // Reset after processing
                    currentBlock = [];
                    blockElse = [];
                    blockType = '';
                    blockCondition = '';
                    blockName = '';
                    blockParams = [];
                    hasElseBlock = false;
                    continue;
                }
                // Add line to current block (if we didn't just process the block end)
                if (blockLevel > 0) {
                    currentBlock.push(line);
                }
                continue;
            }
            // Check for block start
            if (line.startsWith('agar_bhai')) {
                blockType = 'agar_bhai';
                // Extract condition from agar_bhai (if) statement
                const conditionMatch = line.match(/agar_bhai\s*\(?(.*?)\)?(\s*\{)?$/);
                if (conditionMatch) {
                    blockCondition = conditionMatch[1].trim();
                }
                else {
                    blockCondition = line.substring('agar_bhai'.length).replace('{', '').trim();
                }
                // If the line ends with '{', we already have it opened
                if (line.endsWith('{')) {
                    blockLevel = 1;
                }
                else if (i < lines.length && lines[i].trim() === '{') {
                    blockLevel = 1;
                    i++; // Skip the opening brace
                }
                else {
                    throw new RuntimeError('Expected "{" after condition');
                }
                continue;
            }
            if (line.startsWith('ghoom_bhai')) {
                blockType = 'ghoom_bhai';
                // Extract condition from ghoom_bhai (loop) statement
                const conditionMatch = line.match(/ghoom_bhai\s*\(?(.*?)\)?(\s*\{)?$/);
                if (conditionMatch) {
                    blockCondition = conditionMatch[1].trim();
                }
                else {
                    blockCondition = line.substring('ghoom_bhai'.length).replace('{', '').trim();
                }
                // If the line ends with '{', we already have it opened
                if (line.endsWith('{')) {
                    blockLevel = 1;
                }
                else if (i < lines.length && lines[i].trim() === '{') {
                    blockLevel = 1;
                    i++; // Skip the opening brace
                }
                else {
                    throw new RuntimeError('Expected "{" after loop condition');
                }
                continue;
            }
            if (line.startsWith('bana_bhai')) {
                blockType = 'bana_bhai';
                // Extract function name and parameters
                const funcMatch = line.match(/bana_bhai\s+(\w+)\s*\((.*?)\)(\s*\{)?$/);
                if (funcMatch) {
                    blockName = funcMatch[1];
                    blockParams = funcMatch[2].split(',').map(param => param.trim()).filter(param => param !== '');
                }
                else {
                    throw new RuntimeError('Invalid function declaration');
                }
                // If the line ends with '{', we already have it opened
                if (line.endsWith('{')) {
                    blockLevel = 1;
                }
                else if (i < lines.length && lines[i].trim() === '{') {
                    blockLevel = 1;
                    i++; // Skip the opening brace
                }
                else {
                    throw new RuntimeError('Expected "{" after function declaration');
                }
                continue;
            }
            // Process simple statements
            this.executeStatement(line);
        }
        // Return the combined output
        return this.output.join('\n');
    }
    /**
     * Execute a single statement
     */
    executeStatement(statement) {
        const trimmedLine = statement.trim();
        // Skip empty lines and comment lines
        if (trimmedLine === '' || trimmedLine.startsWith('//')) {
            return;
        }
        this.log(`Executing statement: ${trimmedLine}`);
        // Check for basic assignments (existing variables)
        if (/^\w+\s*=/.test(trimmedLine)) {
            const assignMatch = trimmedLine.match(/^(\w+)\s*=\s*(.+?)(?:;)?$/);
            if (assignMatch) {
                const varName = assignMatch[1];
                const valueExpr = assignMatch[2];
                // Check if it's a constant
                if (this.constants.has(varName)) {
                    throw new RuntimeError(`Cannot reassign constant '${varName}'`);
                }
                // Check if the variable exists
                if (!this.variables.has(varName)) {
                    throw new RuntimeError(`Variable '${varName}' is not defined`);
                }
                // Update the variable
                const value = this.evaluateExpression(valueExpr);
                this.variables.set(varName, value);
                this.log(`Updated ${varName} = ${value}`);
            }
            return;
        }
        // Variable declarations
        if (trimmedLine.startsWith('bhai_ye_hai')) {
            this.handleVariableAssignment(trimmedLine, false);
            return;
        }
        // Constant declarations
        if (trimmedLine.startsWith('constant_hai')) {
            this.handleVariableAssignment(trimmedLine, true);
            return;
        }
        // Print statements
        if (trimmedLine.startsWith('bol_bhai')) {
            const value = this.extractPrintValue(trimmedLine);
            if (value !== null) {
                this.output.push(String(value));
                this.log(`Printed: ${value}`);
            }
            return;
        }
        // Break statements
        if (trimmedLine === 'bas_bhai' || trimmedLine === 'bas_bhai;') {
            this.breakLoop = true;
            this.log('Set breakLoop to true');
            return;
        }
        // Continue statements
        if (trimmedLine === 'chalu_bhai' || trimmedLine === 'chalu_bhai;') {
            this.continueLoop = true;
            this.log('Set continueLoop to true');
            return;
        }
        // Return statements
        if (trimmedLine.startsWith('de_bhai')) {
            const returnMatch = trimmedLine.match(/de_bhai\s+(.+?)(?:;)?$/);
            if (returnMatch) {
                const returnExpr = returnMatch[1].trim();
                this.returnValue = this.evaluateExpression(returnExpr);
                this.log(`Set return value to: ${this.returnValue}`);
            }
            else {
                this.returnValue = null;
                this.log('Set return value to null');
            }
            return;
        }
        // Function calls
        const funcCallMatch = trimmedLine.match(/^(\w+)\s*\((.*?)\)(?:;)?$/);
        if (funcCallMatch && this.functions.has(funcCallMatch[1])) {
            const funcName = funcCallMatch[1];
            const argsStr = funcCallMatch[2];
            const func = this.functions.get(funcName);
            const argValues = argsStr ? argsStr.split(',')
                .map(arg => arg.trim())
                .map(arg => this.evaluateExpression(arg)) : [];
            this.log(`Calling function ${funcName} with args: ${argValues}`);
            // Save current state
            const oldVariables = new Map(this.variables);
            const oldReturnValue = this.returnValue;
            this.returnValue = undefined;
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
            this.log(`Function ${funcName} returned: ${this.returnValue}`);
            // Reset return value after function execution
            this.returnValue = oldReturnValue;
            return;
        }
        // Input statements
        if (trimmedLine.startsWith('sun_bhai')) {
            // For now, just return a placeholder value
            const inputMatch = trimmedLine.match(/sun_bhai\s+(\w+)(?:;)?$/);
            if (inputMatch) {
                const varName = inputMatch[1];
                // In a real implementation, this would prompt for user input
                this.variables.set(varName, "Dummy Input Value");
            }
            return;
        }
    }
    /**
     * Execute a block of code lines
     */
    executeBlock(lines) {
        this.log(`Executing block with ${lines.length} lines`);
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Skip execution if break was encountered
            if (this.breakLoop) {
                this.log(`Early exit from block due to break`);
                return;
            }
            // Return from function if return value was set
            if (this.returnValue !== undefined) {
                this.log(`Early exit from block due to return`);
                return;
            }
            // Skip the rest of the iteration if continue was encountered
            if (this.continueLoop) {
                this.log('Continue encountered, skipping to next iteration');
                return;
            }
            this.executeStatement(line);
        }
    }
    /**
     * Log debug messages if debug mode is enabled
     */
    log(message) {
        if (this.debug) {
            console.log(`[DEBUG] ${message}`);
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
    handleVariableAssignment(line, isConstant) {
        // Remove semicolon if present
        line = line.replace(/;$/, '');
        const keyword = isConstant ? 'constant_hai' : 'bhai_ye_hai';
        const assignMatch = line.match(new RegExp(`${keyword}\\s+(\\w+)\\s*=\\s*(.+)`));
        if (assignMatch) {
            const varName = assignMatch[1];
            const valueExpr = assignMatch[2];
            // Check for function calls and evaluate them
            const funcCallMatch = valueExpr.match(/^(\w+)\((.*?)\)$/);
            if (funcCallMatch && this.functions.has(funcCallMatch[1])) {
                const funcName = funcCallMatch[1];
                const argsStr = funcCallMatch[2];
                const func = this.functions.get(funcName);
                const argValues = argsStr.split(',')
                    .map(arg => arg.trim())
                    .map(arg => this.evaluateExpression(arg));
                this.log(`Calling function ${funcName} with args: ${argValues} for assignment to ${varName}`);
                // Save current state
                const oldVariables = new Map(this.variables);
                this.returnValue = undefined;
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
                // Get return value
                const returnVal = this.returnValue;
                // Restore old scope
                this.variables = oldVariables;
                // Store the variable with the return value
                this.variables.set(varName, returnVal !== undefined ? returnVal : null);
                this.log(`Assigned result of ${funcName} to ${varName}: ${returnVal}`);
            }
            else {
                // Evaluate the expression normally
                const value = this.evaluateExpression(valueExpr);
                // Store the variable
                this.variables.set(varName, value);
                this.log(`Assigned ${varName} = ${value}`);
            }
            // If it's a constant, add to constants set
            if (isConstant) {
                this.constants.add(varName);
                this.log(`Marked ${varName} as constant`);
            }
        }
        else {
            throw new RuntimeError('Invalid variable assignment');
        }
    }
    /**
     * Evaluate a condition expression
     */
    evaluateCondition(condition) {
        this.log(`Evaluating condition: ${condition}`);
        // Handle parentheses
        const parenthesesMatch = condition.match(/^\((.*)\)$/);
        if (parenthesesMatch) {
            return this.evaluateCondition(parenthesesMatch[1]);
        }
        // Support for logical operators
        // Check for 'aur_bhi' (AND)
        const andMatch = condition.match(/(.+?)\s+aur_bhi\s+(.+)/);
        if (andMatch) {
            const leftCond = this.evaluateCondition(andMatch[1]);
            // Short-circuit evaluation - only check right if left is true
            if (!leftCond)
                return false;
            const rightCond = this.evaluateCondition(andMatch[2]);
            return leftCond && rightCond;
        }
        // Check for 'ya_fir' (OR)
        const orMatch = condition.match(/(.+?)\s+ya_fir\s+(.+)/);
        if (orMatch) {
            const leftCond = this.evaluateCondition(orMatch[1]);
            // Short-circuit evaluation - only check right if left is false
            if (leftCond)
                return true;
            const rightCond = this.evaluateCondition(orMatch[2]);
            return leftCond || rightCond;
        }
        // Check for 'nahi_hai' (NOT)
        if (condition.startsWith('nahi_hai')) {
            let subCond = condition.substring('nahi_hai'.length).trim();
            // Handle parentheses
            if (subCond.startsWith('(') && subCond.endsWith(')')) {
                subCond = subCond.substring(1, subCond.length - 1).trim();
            }
            return !this.evaluateCondition(subCond);
        }
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
        const equalityMatch = condition.match(/(.+?)\s*==\s*(.+)/);
        if (equalityMatch) {
            const left = this.evaluateExpression(equalityMatch[1]);
            const right = this.evaluateExpression(equalityMatch[2]);
            const result = left === right;
            this.log(`Equality check: ${left} == ${right} = ${result}`);
            return result;
        }
        // Check inequality
        const inequalityMatch = condition.match(/(.+?)\s*!=\s*(.+)/);
        if (inequalityMatch) {
            const left = this.evaluateExpression(inequalityMatch[1]);
            const right = this.evaluateExpression(inequalityMatch[2]);
            const result = left !== right;
            this.log(`Inequality check: ${left} != ${right} = ${result}`);
            return result;
        }
        // Greater than
        const greaterThanMatch = condition.match(/(.+?)\s*>\s*(.+)/);
        if (greaterThanMatch) {
            const left = this.evaluateExpression(greaterThanMatch[1]);
            const right = this.evaluateExpression(greaterThanMatch[2]);
            const result = Number(left) > Number(right);
            this.log(`Greater than check: ${left} > ${right} = ${result}`);
            return result;
        }
        // Less than
        const lessThanMatch = condition.match(/(.+?)\s*<\s*(.+)/);
        if (lessThanMatch) {
            const left = this.evaluateExpression(lessThanMatch[1]);
            const right = this.evaluateExpression(lessThanMatch[2]);
            const result = Number(left) < Number(right);
            this.log(`Less than check: ${left} < ${right} = ${result}`);
            return result;
        }
        // Greater than or equal
        const greaterOrEqualMatch = condition.match(/(.+?)\s*>=\s*(.+)/);
        if (greaterOrEqualMatch) {
            const left = this.evaluateExpression(greaterOrEqualMatch[1]);
            const right = this.evaluateExpression(greaterOrEqualMatch[2]);
            const result = Number(left) >= Number(right);
            this.log(`Greater or equal check: ${left} >= ${right} = ${result}`);
            return result;
        }
        // Less than or equal
        const lessOrEqualMatch = condition.match(/(.+?)\s*<=\s*(.+)/);
        if (lessOrEqualMatch) {
            const left = this.evaluateExpression(lessOrEqualMatch[1]);
            const right = this.evaluateExpression(lessOrEqualMatch[2]);
            const result = Number(left) <= Number(right);
            this.log(`Less or equal check: ${left} <= ${right} = ${result}`);
            return result;
        }
        // Modulo for even/odd checking
        const moduloMatch = condition.match(/(.+?)\s*%\s*(.+?)\s*==\s*(.+)/);
        if (moduloMatch) {
            const left = Number(this.evaluateExpression(moduloMatch[1]));
            const modValue = Number(this.evaluateExpression(moduloMatch[2]));
            const remainder = Number(this.evaluateExpression(moduloMatch[3]));
            this.log(`Modulo check: ${left} % ${modValue} === ${remainder}`);
            const result = (left % modValue) === remainder;
            this.log(`Modulo result: ${result}`);
            return result;
        }
        // Simplified modulo check (just for odd/even)
        const simpleModMatch = condition.match(/(.+?)\s*%\s*(.+?)\s*!=\s*(.+)/);
        if (simpleModMatch) {
            const left = Number(this.evaluateExpression(simpleModMatch[1]));
            const modValue = Number(this.evaluateExpression(simpleModMatch[2]));
            const remainder = Number(this.evaluateExpression(simpleModMatch[3]));
            this.log(`Simple mod check: ${left} % ${modValue} !== ${remainder}`);
            const result = (left % modValue) !== remainder;
            this.log(`Simple mod result: ${result}`);
            return result;
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
        // Check for parenthesized expressions
        if (expr.startsWith('(') && expr.endsWith(')')) {
            return this.evaluateExpression(expr.slice(1, -1));
        }
        // Function calls
        const funcCallMatch = expr.match(/^(\w+)\((.*?)\)$/);
        if (funcCallMatch && this.functions.has(funcCallMatch[1])) {
            const funcName = funcCallMatch[1];
            const argsStr = funcCallMatch[2];
            const func = this.functions.get(funcName);
            const argValues = argsStr ? argsStr.split(',')
                .map(arg => arg.trim())
                .map(arg => this.evaluateExpression(arg)) : [];
            this.log(`Evaluating function ${funcName} with args: ${argValues}`);
            // Save current state
            const oldVariables = new Map(this.variables);
            const oldReturnValue = this.returnValue;
            this.returnValue = undefined;
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
            // Get return value
            const returnVal = this.returnValue;
            this.log(`Function ${funcName} returned: ${returnVal}`);
            // Restore old scope
            this.variables = oldVariables;
            this.returnValue = oldReturnValue;
            return returnVal !== undefined ? returnVal : null;
        }
        // Variable references
        if (/^\w+$/.test(expr)) {
            if (this.variables.has(expr)) {
                const value = this.variables.get(expr);
                return value !== undefined ? value : null;
            }
            else {
                throw new RuntimeError(`Variable '${expr}' is not defined`);
            }
        }
        // Handle arithmetic expressions with proper order of operations
        // Check for addition last (lowest precedence)
        const additionMatch = expr.match(/(.+?)\s*\+\s*(.+)/);
        if (additionMatch) {
            const left = this.evaluateExpression(additionMatch[1]);
            const right = this.evaluateExpression(additionMatch[2]);
            this.log(`Addition: ${left} + ${right}`);
            // For string concatenation with any type
            if (typeof left === 'string' || typeof right === 'string') {
                return String(left) + String(right);
            }
            // Ensure both operands are numbers for arithmetic
            if (typeof left === 'number' && typeof right === 'number') {
                return left + right;
            }
            throw new RuntimeError(`Invalid operands for addition: ${left} and ${right}`);
        }
        // Subtraction has the same precedence as addition
        const subtractionMatch = expr.match(/(.+?)\s*-\s*(.+)/);
        if (subtractionMatch) {
            const left = this.evaluateExpression(subtractionMatch[1]);
            const right = this.evaluateExpression(subtractionMatch[2]);
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw new RuntimeError(`Invalid operands for subtraction: ${left} and ${right}`);
            }
            this.log(`Subtraction: ${left} - ${right}`);
            return Number(left) - Number(right);
        }
        // Multiplication has higher precedence
        const multiplicationMatch = expr.match(/(.+?)\s*\*\s*(.+)/);
        if (multiplicationMatch) {
            const left = this.evaluateExpression(multiplicationMatch[1]);
            const right = this.evaluateExpression(multiplicationMatch[2]);
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw new RuntimeError(`Invalid operands for multiplication: ${left} and ${right}`);
            }
            this.log(`Multiplication: ${left} * ${right}`);
            return Number(left) * Number(right);
        }
        // Division has same precedence as multiplication
        const divisionMatch = expr.match(/(.+?)\s*\/\s*(.+)/);
        if (divisionMatch) {
            const left = this.evaluateExpression(divisionMatch[1]);
            const right = this.evaluateExpression(divisionMatch[2]);
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw new RuntimeError(`Invalid operands for division: ${left} and ${right}`);
            }
            if (Number(right) === 0) {
                throw new RuntimeError("Division by zero");
            }
            this.log(`Division: ${left} / ${right}`);
            return Number(left) / Number(right);
        }
        // Modulus has same precedence as multiplication
        const modulusMatch = expr.match(/(.+?)\s*%\s*(.+)/);
        if (modulusMatch) {
            const left = this.evaluateExpression(modulusMatch[1]);
            const right = this.evaluateExpression(modulusMatch[2]);
            if (typeof left !== 'number' || typeof right !== 'number') {
                throw new RuntimeError(`Invalid operands for modulo: ${left} and ${right}`);
            }
            if (Number(right) === 0) {
                throw new RuntimeError("Modulo by zero");
            }
            const result = Number(left) % Number(right);
            this.log(`Modulo expression: ${left} % ${right} = ${result}`);
            return result;
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
