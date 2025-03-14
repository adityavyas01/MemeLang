export declare class MemeLang {
    private interpreter;
    constructor();
    executeFile(filePath: string): any;
    execute(source: string): any;
    executeRepl(): void;
}
export { ImprovedExecutor } from './executor';
export { RuntimeError } from './errors';
export type { Value } from './types';
