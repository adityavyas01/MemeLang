import { Parser } from '../parser/parser';
import { Lexer } from '../lexer/lexer';
describe('Parser', () => {
    const parse = (input) => {
        const lexer = new Lexer(input);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        return parser.parse();
    };
    test('parses empty program', () => {
        const ast = parse('');
        expect(ast.type).toBe('Program');
        expect(ast.body).toHaveLength(0);
    });
    test('parses variable declarations', () => {
        const ast = parse('rakho x = 42;');
        expect(ast.body).toHaveLength(1);
        const decl = ast.body[0];
        expect(decl.type).toBe('VariableDeclaration');
        expect(decl.kind).toBe('let');
        expect(decl.identifier.name).toBe('x');
        expect(decl.init.value).toBe('42');
    });
    test('parses function declarations', () => {
        const ast = parse('karna add(x, y) { wapis x + y; }');
        expect(ast.body).toHaveLength(1);
        const func = ast.body[0];
        expect(func.type).toBe('FunctionDeclaration');
        expect(func.name.name).toBe('add');
        expect(func.params).toHaveLength(2);
        expect(func.params[0].name).toBe('x');
        expect(func.params[1].name).toBe('y');
    });
    test('parses if statements', () => {
        const ast = parse('agar (x > 0) { chaap x; } warna { chaap -x; }');
        expect(ast.body).toHaveLength(1);
        const ifStmt = ast.body[0];
        expect(ifStmt.type).toBe('IfStatement');
        expect(ifStmt.test.type).toBe('BinaryExpression');
        expect(ifStmt.consequent).toBeDefined();
        expect(ifStmt.alternate).toBeDefined();
    });
    test('parses while loops', () => {
        const ast = parse('jabtak (i < 10) { chaap i; i = i + 1; }');
        expect(ast.body).toHaveLength(1);
        const whileStmt = ast.body[0];
        expect(whileStmt.type).toBe('WhileStatement');
        expect(whileStmt.test.type).toBe('BinaryExpression');
        expect(whileStmt.body).toHaveLength(2);
    });
    test('parses binary expressions', () => {
        const ast = parse('rakho result = 2 + 3 * 4;');
        expect(ast.body).toHaveLength(1);
        const decl = ast.body[0];
        const init = decl.init;
        expect(init.type).toBe('BinaryExpression');
        expect(init.operator).toBe('+');
        expect(init.left.value).toBe('2');
        const right = init.right;
        expect(right.operator).toBe('*');
        expect(right.left.value).toBe('3');
        expect(right.right.value).toBe('4');
    });
    test('handles syntax errors', () => {
        expect(() => parse('rakho x')).toThrow(); // Missing semicolon
        expect(() => parse('agar (x > 0) chaap x;')).toThrow(); // Missing braces
        expect(() => parse('karna add(x, y) wapis x + y;')).toThrow(); // Missing braces
    });
    test('parses array expressions', () => {
        const ast = parse('rakho arr = [1, 2, 3];');
        expect(ast.body).toHaveLength(1);
        const decl = ast.body[0];
        const init = decl.init;
        expect(init.type).toBe('ArrayExpression');
        expect(init.elements).toHaveLength(3);
    });
    test('parses function calls', () => {
        const ast = parse('add(1, 2);');
        expect(ast.body).toHaveLength(1);
        const expr = ast.body[0];
        const call = expr.expression;
        expect(call.type).toBe('CallExpression');
        expect(call.arguments).toHaveLength(2);
    });
});
