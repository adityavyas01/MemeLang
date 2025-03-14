import { TokenType } from '../types/token';
import { CompileError } from '../errors';
export class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    }
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    consume(type, message) {
        if (this.check(type))
            return this.advance();
        throw new CompileError(message);
    }
    parse() {
        const statements = [];
        // Expect program start
        this.consume(TokenType.PROGRAM_START, 'Program must start with hi_bhai');
        while (!this.check(TokenType.PROGRAM_END) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        // Expect program end
        this.consume(TokenType.PROGRAM_END, 'Program must end with bye_bhai');
        return {
            type: 'Program',
            body: statements
        };
    }
    declaration() {
        if (this.match(TokenType.LET, TokenType.CONST)) {
            return this.variableDeclaration();
        }
        if (this.match(TokenType.FUNCTION)) {
            return this.functionDeclaration();
        }
        return this.statement();
    }
    variableDeclaration() {
        const kind = this.previous().type === TokenType.LET ? 'let' : 'const';
        const name = this.consume(TokenType.IDENTIFIER, 'Expected variable name');
        this.consume(TokenType.ASSIGN, 'Expected "=" after variable name');
        const initializer = this.expression();
        this.consume(TokenType.SEMICOLON, 'Expected ";" after variable declaration');
        return {
            type: 'VariableDeclaration',
            kind,
            identifier: { type: 'Identifier', name: String(name.value) },
            init: initializer
        };
    }
    functionDeclaration() {
        const name = this.consume(TokenType.IDENTIFIER, 'Expected function name');
        this.consume(TokenType.LEFT_PAREN, 'Expected "(" after function name');
        const parameters = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                const param = this.consume(TokenType.IDENTIFIER, 'Expected parameter name');
                parameters.push({ type: 'Identifier', name: String(param.value) });
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after parameters');
        this.consume(TokenType.LEFT_BRACE, 'Expected "{" before function body');
        const body = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            body.push(this.declaration());
        }
        this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after function body');
        return {
            type: 'FunctionDeclaration',
            name: { type: 'Identifier', name: String(name.value) },
            params: parameters,
            body
        };
    }
    statement() {
        if (this.match(TokenType.IF))
            return this.ifStatement();
        if (this.match(TokenType.WHILE))
            return this.whileStatement();
        if (this.match(TokenType.RETURN))
            return this.returnStatement();
        if (this.match(TokenType.PRINT))
            return this.printStatement();
        return this.expressionStatement();
    }
    ifStatement() {
        this.consume(TokenType.LEFT_PAREN, 'Expected "(" after if');
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after if condition');
        this.consume(TokenType.LEFT_BRACE, 'Expected "{" before if body');
        const thenBranch = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            thenBranch.push(this.declaration());
        }
        this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after if body');
        let elseBranch = null;
        if (this.match(TokenType.ELSE)) {
            this.consume(TokenType.LEFT_BRACE, 'Expected "{" before else body');
            elseBranch = [];
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                elseBranch.push(this.declaration());
            }
            this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after else body');
        }
        return {
            type: 'IfStatement',
            test: condition,
            consequent: thenBranch,
            alternate: elseBranch
        };
    }
    whileStatement() {
        this.consume(TokenType.LEFT_PAREN, 'Expected "(" after while');
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after while condition');
        this.consume(TokenType.LEFT_BRACE, 'Expected "{" before while body');
        const body = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            body.push(this.declaration());
        }
        this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after while body');
        return {
            type: 'WhileStatement',
            test: condition,
            body
        };
    }
    returnStatement() {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, 'Expected ";" after return value');
        return {
            type: 'ReturnStatement',
            argument: value
        };
    }
    printStatement() {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, 'Expected ";" after print value');
        return {
            type: 'PrintStatement',
            argument: value
        };
    }
    expressionStatement() {
        const expr = this.expression();
        this.consume(TokenType.SEMICOLON, 'Expected ";" after expression');
        return {
            type: 'ExpressionStatement',
            expression: expr
        };
    }
    expression() {
        return this.assignment();
    }
    assignment() {
        const expr = this.logicalOr();
        if (this.match(TokenType.ASSIGN)) {
            const equals = this.previous();
            const value = this.assignment();
            if (expr.type === 'Identifier') {
                return {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: expr,
                    right: value
                };
            }
            throw new CompileError('Invalid assignment target');
        }
        return expr;
    }
    logicalOr() {
        let expr = this.logicalAnd();
        while (this.match(TokenType.OR)) {
            const operator = String(this.previous().value);
            const right = this.logicalAnd();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }
    logicalAnd() {
        let expr = this.equality();
        while (this.match(TokenType.AND)) {
            const operator = String(this.previous().value);
            const right = this.equality();
            expr = {
                type: 'BinaryExpression',
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }
    equality() {
        let expr = this.comparison();
        while (this.match(TokenType.OPERATOR)) {
            const operator = String(this.previous().value);
            if (operator === '==' || operator === '!=') {
                const right = this.comparison();
                expr = {
                    type: 'BinaryExpression',
                    operator,
                    left: expr,
                    right
                };
            }
            else {
                this.current--;
                break;
            }
        }
        return expr;
    }
    comparison() {
        let expr = this.term();
        while (this.match(TokenType.OPERATOR)) {
            const operator = String(this.previous().value);
            if (operator === '<' || operator === '<=' || operator === '>' || operator === '>=') {
                const right = this.term();
                expr = {
                    type: 'BinaryExpression',
                    operator,
                    left: expr,
                    right
                };
            }
            else {
                this.current--;
                break;
            }
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(TokenType.OPERATOR)) {
            const operator = String(this.previous().value);
            if (operator === '+' || operator === '-') {
                const right = this.factor();
                expr = {
                    type: 'BinaryExpression',
                    operator,
                    left: expr,
                    right
                };
            }
            else {
                this.current--;
                break;
            }
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match(TokenType.OPERATOR)) {
            const operator = String(this.previous().value);
            if (operator === '*' || operator === '/' || operator === '%') {
                const right = this.unary();
                expr = {
                    type: 'BinaryExpression',
                    operator,
                    left: expr,
                    right
                };
            }
            else {
                this.current--;
                break;
            }
        }
        return expr;
    }
    unary() {
        if (this.match(TokenType.NOT, TokenType.OPERATOR)) {
            const operator = String(this.previous().value);
            if (operator === '!' || operator === '-') {
                const right = this.unary();
                return {
                    type: 'UnaryExpression',
                    operator,
                    argument: right
                };
            }
            this.current--;
        }
        return this.primary();
    }
    primary() {
        if (this.match(TokenType.NUMBER)) {
            return {
                type: 'NumberLiteral',
                value: Number(this.previous().value)
            };
        }
        if (this.match(TokenType.STRING)) {
            return {
                type: 'StringLiteral',
                value: String(this.previous().value)
            };
        }
        if (this.match(TokenType.TRUE)) {
            return {
                type: 'BooleanLiteral',
                value: true
            };
        }
        if (this.match(TokenType.FALSE)) {
            return {
                type: 'BooleanLiteral',
                value: false
            };
        }
        if (this.match(TokenType.NULL)) {
            return {
                type: 'NullLiteral',
                value: null
            };
        }
        if (this.match(TokenType.IDENTIFIER)) {
            return {
                type: 'Identifier',
                name: String(this.previous().value)
            };
        }
        if (this.match(TokenType.LEFT_BRACKET)) {
            const elements = [];
            if (!this.check(TokenType.RIGHT_BRACKET)) {
                do {
                    elements.push(this.expression());
                } while (this.match(TokenType.COMMA));
            }
            this.consume(TokenType.RIGHT_BRACKET, 'Expected "]" after array elements');
            return {
                type: 'ArrayExpression',
                elements
            };
        }
        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after expression');
            return expr;
        }
        throw new CompileError(`Unexpected token: ${this.peek().type}`);
    }
}
