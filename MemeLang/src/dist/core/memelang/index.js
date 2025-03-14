import { readFileSync } from 'fs';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
export class MemeLang {
    constructor() {
        this.interpreter = new Interpreter();
    }
    executeFile(filePath) {
        const sourceCode = readFileSync(filePath, 'utf-8');
        return this.execute(sourceCode);
    }
    execute(sourceCode) {
        this.lexer = new Lexer(sourceCode);
        const tokens = this.lexer.tokenize();
        this.parser = new Parser(tokens);
        const ast = this.parser.parse();
        return this.interpreter.interpret(ast);
    }
    executeRepl() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('MemeLang REPL v1.0.0');
        console.log('Type "exit" to quit');
        console.log('Type "help" for commands');
        const promptUser = () => {
            readline.question('>> ', (input) => {
                if (input.toLowerCase() === 'exit') {
                    readline.close();
                    return;
                }
                if (input.toLowerCase() === 'help') {
                    console.log('\nAvailable commands:');
                    console.log('chaap "text" - Print text');
                    console.log('rakho x = value - Declare variable');
                    console.log('agar (condition) { } - If statement');
                    console.log('jabtak (condition) { } - While loop');
                    console.log('karna functionName() { } - Define function');
                    console.log('\n');
                    promptUser();
                    return;
                }
                try {
                    const result = this.execute(input);
                    if (result !== undefined) {
                        console.log(result);
                    }
                }
                catch (error) {
                    console.error(error);
                }
                promptUser();
            });
        };
        promptUser();
    }
}
// CLI handling
if (require.main === module) {
    const args = process.argv.slice(2);
    const memelang = new MemeLang();
    if (args.length === 0) {
        memelang.executeRepl();
    }
    else if (args.length === 1) {
        memelang.executeFile(args[0]);
    }
    else {
        console.error('Usage: memelang [script]');
        process.exit(1);
    }
}
