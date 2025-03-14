import { CompileError } from '../errors';
export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }
    parse() {
        try {
            const statements = [];
            while (!this.isAtEnd()) {
                statements.push(this.statement());
            }
            return {
                type: 'Program',
                body: statements
            };
        }
        catch (error) {
            if (error instanceof CompileError) {
                throw error;
            }
            throw new CompileError('Parser error');
        }
    }
    statement() {
        const token = this.peek();
        if (!token) {
            throw new CompileError('Unexpected end of input');
        }
        // Handle program start/end
        if (token.value === 'hi_bhai') {
            this.advance();
            return { type: 'ProgramStart' };
        }
        if (token.value === 'bye_bhai') {
            this.advance();
            return { type: 'ProgramEnd' };
        }
        // Handle print statements
        if (token.value === 'bol_bhai') {
            this.advance();
            const argument = this.expression();
            return {
                type: 'Print',
                argument
            };
        }
        // Default to expression statement
        return {
            type: 'ExpressionStatement',
            expression: this.expression()
        };
    }
    expression() {
        const token = this.advance();
        // Handle string literals
        if (token.type === 'STRING') {
            return {
                type: 'StringLiteral',
                value: token.value
            };
        }
        // Handle number literals
        if (token.type === 'NUMBER') {
            return {
                type: 'NumberLiteral',
                value: Number(token.value)
            };
        }
        // Handle identifiers
        if (token.type === 'IDENTIFIER') {
            return {
                type: 'Identifier',
                name: token.value
            };
        }
        throw new CompileError(`Unexpected token: ${token.value}`);
    }
    isAtEnd() {
        return this.current >= this.tokens.length;
    }
    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
}
