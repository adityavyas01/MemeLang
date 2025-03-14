/**
 * A patched parser implementation that fixes the issue with slash characters
 * and properly handles comments in the MemeLang syntax
 */
import { CompileError } from './memelang/errors';
export class PatchedParser {
    constructor(tokens) {
        this.tokens = [];
        this.current = 0;
        this.tokens = tokens.filter(token => {
            // Filter out comments before parsing
            return !(token.type === 'COMMENT');
        });
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            try {
                statements.push(this.statement());
            }
            catch (error) {
                // Skip to next statement on error
                this.synchronize();
            }
        }
        return statements;
    }
    isAtEnd() {
        return this.current >= this.tokens.length;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
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
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            // Skip until we find a likely statement boundary
            if (this.previous().type === "SEMICOLON")
                return;
            switch (this.peek().type) {
                case "FUNCTION":
                case "LET":
                case "CONST":
                case "IF":
                case "WHILE":
                case "PRINT":
                case "RETURN":
                    return;
            }
            this.advance();
        }
    }
    statement() {
        // Program start/end
        if (this.match("PROGRAM_START")) {
            return {
                type: "ProgramStart"
            };
        }
        if (this.match("PROGRAM_END")) {
            return {
                type: "ProgramEnd"
            };
        }
        // Print statement
        if (this.match("PRINT")) {
            const value = this.expression();
            return {
                type: "PrintStatement",
                value
            };
        }
        // Default: expression statement
        const expr = this.expression();
        return {
            type: "ExpressionStatement",
            expression: expr
        };
    }
    expression() {
        // Handle literals
        if (this.match("STRING")) {
            return {
                type: "StringLiteral",
                value: this.previous().value
            };
        }
        if (this.match("NUMBER")) {
            return {
                type: "NumberLiteral",
                value: Number(this.previous().value)
            };
        }
        if (this.match("IDENTIFIER")) {
            return {
                type: "Identifier",
                name: this.previous().value
            };
        }
        if (this.match("TRUE", "FALSE")) {
            return {
                type: "BooleanLiteral",
                value: this.previous().value === "TRUE"
            };
        }
        if (this.match("NULL")) {
            return {
                type: "NullLiteral",
                value: null
            };
        }
        throw new CompileError(`Unexpected token: ${this.peek().value}`);
    }
}
