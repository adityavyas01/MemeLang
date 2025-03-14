import { MemeLang } from '../core';
import * as readline from 'readline';
export class MemeLangREPL {
    constructor() {
        this.memelang = new MemeLang();
    }
    start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('MemeLang REPL v1.0.0');
        console.log('Type "exit" to quit');
        console.log('Type "help" for commands');
        this.promptUser(rl);
    }
    promptUser(rl) {
        rl.question('>> ', (input) => {
            if (input.toLowerCase() === 'exit') {
                rl.close();
                return;
            }
            if (input.toLowerCase() === 'help') {
                this.showHelp();
                this.promptUser(rl);
                return;
            }
            try {
                const result = this.memelang.execute(input);
                if (result !== undefined) {
                    console.log(result);
                }
            }
            catch (error) {
                console.error(error);
            }
            this.promptUser(rl);
        });
    }
    showHelp() {
        console.log('\nAvailable commands:');
        console.log('chaap "text" - Print text');
        console.log('rakho x = value - Declare variable');
        console.log('agar (condition) { } - If statement');
        console.log('jabtak (condition) { } - While loop');
        console.log('karna functionName() { } - Define function');
        console.log('\n');
    }
}
