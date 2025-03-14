import { MemeLang } from '../core';
import { readFileSync } from 'fs';
export class MemeLangRunner {
    constructor() {
        this.memelang = new MemeLang();
    }
    runFile(filePath) {
        try {
            const source = readFileSync(filePath, 'utf-8');
            return this.memelang.execute(source);
        }
        catch (error) {
            console.error(`Error running file ${filePath}:`);
            console.error(error);
            process.exit(1);
        }
    }
    runCode(source) {
        try {
            return this.memelang.execute(source);
        }
        catch (error) {
            console.error('Error running code:');
            console.error(error);
            throw error;
        }
    }
}
