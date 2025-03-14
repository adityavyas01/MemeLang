import { MemeLang } from './core/memelang';
import { readFileSync } from 'fs';
const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide a file path to execute');
    process.exit(1);
}
// Read and log the source code
const sourceCode = readFileSync(filePath, 'utf-8');
console.log('\n=== Source Code ===\n');
console.log(sourceCode);
console.log('\n=== Execution Output ===\n');
const memelang = new MemeLang();
try {
    const result = memelang.executeFile(filePath);
    if (result !== undefined) {
        console.log('\n=== Return Value ===\n');
        console.log(result);
    }
}
catch (error) {
    console.error('\n=== Error ===\n');
    console.error('Error executing program:', error);
    process.exit(1);
}
