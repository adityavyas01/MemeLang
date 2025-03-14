export declare class MemeLang {
    private lexer;
    private parser;
    private interpreter;
    constructor();
    executeFile(filePath: string): any;
    execute(sourceCode: string): any;
    executeRepl(): void;
}
