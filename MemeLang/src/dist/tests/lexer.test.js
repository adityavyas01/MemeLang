import { Lexer } from '../lexer/lexer';
describe('Lexer', () => {
    const createToken = (type, value, line = 1, column = 1) => ({
        type,
        value,
        position: { line, column }
    });
    test('tokenizes empty input', () => {
        const lexer = new Lexer('');
        const tokens = lexer.tokenize();
        expect(tokens).toEqual([createToken('EOF', 'EOF')]);
    });
    test('tokenizes numbers', () => {
        const lexer = new Lexer('123 45.67');
        const tokens = lexer.tokenize();
        expect(tokens).toEqual([
            createToken('NUMBER', '123'),
            createToken('NUMBER', '45.67'),
            createToken('EOF', 'EOF')
        ]);
    });
    test('tokenizes strings', () => {
        const lexer = new Lexer('"Hello, World!" "Test"');
        const tokens = lexer.tokenize();
        expect(tokens).toEqual([
            createToken('STRING', 'Hello, World!'),
            createToken('STRING', 'Test'),
            createToken('EOF', 'EOF')
        ]);
    });
    test('tokenizes keywords', () => {
        const lexer = new Lexer('agar warna jabtak karo');
        const tokens = lexer.tokenize();
        expect(tokens).toEqual([
            createToken('KEYWORD', 'IF'),
            createToken('KEYWORD', 'ELSE'),
            createToken('KEYWORD', 'WHILE'),
            createToken('KEYWORD', 'DO'),
            createToken('EOF', 'EOF')
        ]);
    });
    test('tokenizes operators', () => {
        const lexer = new Lexer('+ - * / = == != < > <= >=');
        const tokens = lexer.tokenize();
        expect(tokens).toEqual([
            createToken('OPERATOR', '+'),
            createToken('OPERATOR', '-'),
            createToken('OPERATOR', '*'),
            createToken('OPERATOR', '/'),
            createToken('ASSIGN', '='),
            createToken('OPERATOR', '=='),
            createToken('OPERATOR', '!='),
            createToken('OPERATOR', '<'),
            createToken('OPERATOR', '>'),
            createToken('OPERATOR', '<='),
            createToken('OPERATOR', '>='),
            createToken('EOF', 'EOF')
        ]);
    });
    test('tokenizes identifiers', () => {
        const lexer = new Lexer('variable_name anotherVar _test');
        const tokens = lexer.tokenize();
        expect(tokens).toEqual([
            createToken('IDENTIFIER', 'variable_name'),
            createToken('IDENTIFIER', 'anotherVar'),
            createToken('IDENTIFIER', '_test'),
            createToken('EOF', 'EOF')
        ]);
    });
    test('handles invalid characters', () => {
        const lexer = new Lexer('@#$');
        expect(() => lexer.tokenize()).toThrow();
    });
    test('tracks line and column numbers', () => {
        const lexer = new Lexer('rakho x = 10\nchaap x');
        const tokens = lexer.tokenize();
        expect(tokens).toEqual([
            createToken('KEYWORD', 'LET', 1, 1),
            createToken('IDENTIFIER', 'x', 1, 7),
            createToken('ASSIGN', '=', 1, 9),
            createToken('NUMBER', '10', 1, 11),
            createToken('KEYWORD', 'PRINT', 2, 1),
            createToken('IDENTIFIER', 'x', 2, 7),
            createToken('EOF', 'EOF', 2, 8)
        ]);
    });
});
