"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const errors_1 = require("../errors");
class Parser {
    constructor(tokens) {
        this.tokens = [];
        this.current = 0;
        this.tokens = tokens;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    isAtEnd() {
        return this.peek().type === "EOF";
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
        throw new errors_1.CompileTimeError(message, this.peek().position);
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }
        return {
            type: "Program",
            body: statements,
            position: { line: 1, column: 1 },
        };
    }
    declaration() {
        try {
            if (this.match("KEYWORD")) {
                switch (this.previous().value) {
                    case "LET":
                        return this.variableDeclaration("let");
                    case "CONST":
                        return this.variableDeclaration("const");
                    case "FUNCTION":
                        return this.functionDeclaration();
                }
            }
            return this.statement();
        }
        catch (error) {
            this.synchronize();
            throw error;
        }
    }
    variableDeclaration(kind) {
        const name = this.consume("IDENTIFIER", "Expected variable name.");
        let init;
        if (this.match("ASSIGN")) {
            init = this.expression();
        }
        else if (kind === "const") {
            throw new errors_1.CompileTimeError("Const declarations must be initialized", name.position);
        }
        this.consume("SYMBOL", "Expected ';' after variable declaration.");
        return {
            type: "VariableDeclaration",
            kind,
            identifier: {
                type: "Identifier",
                name: name.value,
                position: name.position,
            },
            init,
            position: name.position,
        };
    }
    functionDeclaration() {
        const name = this.consume("IDENTIFIER", "Expected function name.");
        this.consume("SYMBOL", "Expected '(' after function name.");
        const params = [];
        if (!this.check("SYMBOL")) {
            do {
                const param = this.consume("IDENTIFIER", "Expected parameter name.");
                params.push({
                    type: "Identifier",
                    name: param.value,
                    position: param.position,
                });
            } while (this.match("SYMBOL")); // Matches comma
        }
        this.consume("SYMBOL", "Expected ')' after parameters.");
        this.consume("SYMBOL", "Expected '{' before function body.");
        const body = [];
        while (!this.check("SYMBOL") && !this.isAtEnd()) {
            body.push(this.declaration());
        }
        this.consume("SYMBOL", "Expected '}' after function body.");
        return {
            type: "FunctionDeclaration",
            name: {
                type: "Identifier",
                name: name.value,
                position: name.position,
            },
            params,
            body,
            position: name.position,
        };
    }
    statement() {
        if (this.match("KEYWORD")) {
            switch (this.previous().value) {
                case "IF":
                    return this.ifStatement();
                case "WHILE":
                    return this.whileStatement();
                case "RETURN":
                    return this.returnStatement();
                case "PRINT":
                    return this.printStatement();
            }
        }
        return this.expressionStatement();
    }
    ifStatement() {
        this.consume("SYMBOL", "Expected '(' after 'if'.");
        const test = this.expression();
        this.consume("SYMBOL", "Expected ')' after if condition.");
        this.consume("SYMBOL", "Expected '{' before if body.");
        const consequent = [];
        while (!this.check("SYMBOL") && !this.isAtEnd()) {
            consequent.push(this.declaration());
        }
        this.consume("SYMBOL", "Expected '}' after if body.");
        let alternate;
        if (this.match("KEYWORD") && this.previous().value === "ELSE") {
            this.consume("SYMBOL", "Expected '{' before else body.");
            alternate = [];
            while (!this.check("SYMBOL") && !this.isAtEnd()) {
                alternate.push(this.declaration());
            }
            this.consume("SYMBOL", "Expected '}' after else body.");
        }
        return {
            type: "IfStatement",
            test,
            consequent,
            alternate,
            position: this.previous().position,
        };
    }
    whileStatement() {
        this.consume("SYMBOL", "Expected '(' after 'while'.");
        const test = this.expression();
        this.consume("SYMBOL", "Expected ')' after while condition.");
        this.consume("SYMBOL", "Expected '{' before while body.");
        const body = [];
        while (!this.check("SYMBOL") && !this.isAtEnd()) {
            body.push(this.declaration());
        }
        this.consume("SYMBOL", "Expected '}' after while body.");
        return {
            type: "WhileStatement",
            test,
            body,
            position: this.previous().position,
        };
    }
    returnStatement() {
        const keyword = this.previous();
        let argument;
        if (!this.check("SYMBOL")) {
            argument = this.expression();
        }
        this.consume("SYMBOL", "Expected ';' after return value.");
        return {
            type: "ReturnStatement",
            argument,
            position: keyword.position,
        };
    }
    printStatement() {
        const argument = this.expression();
        this.consume("SYMBOL", "Expected ';' after value.");
        return {
            type: "ExpressionStatement",
            expression: {
                type: "CallExpression",
                callee: {
                    type: "Identifier",
                    name: "print",
                    position: this.previous().position,
                },
                arguments: [argument],
                position: this.previous().position,
            },
            position: this.previous().position,
        };
    }
    expressionStatement() {
        const expr = this.expression();
        this.consume("SYMBOL", "Expected ';' after expression.");
        return {
            type: "ExpressionStatement",
            expression: expr,
            position: this.previous().position,
        };
    }
    expression() {
        return this.assignment();
    }
    assignment() {
        const expr = this.logicalOr();
        if (this.match("ASSIGN")) {
            const equals = this.previous();
            const value = this.assignment();
            if (expr.type === "Identifier") {
                return {
                    type: "AssignmentExpression",
                    name: expr,
                    value: value,
                    position: equals.position,
                };
            }
            throw new errors_1.CompileTimeError("Invalid assignment target", equals.position);
        }
        return expr;
    }
    logicalOr() {
        let expr = this.logicalAnd();
        while (this.match("KEYWORD") && this.previous().value === "OR") {
            const operator = this.previous();
            const right = this.logicalAnd();
            expr = {
                type: "BinaryExpression",
                operator: "||",
                left: expr,
                right: right,
                position: operator.position,
            };
        }
        return expr;
    }
    logicalAnd() {
        let expr = this.equality();
        while (this.match("KEYWORD") && this.previous().value === "AND") {
            const operator = this.previous();
            const right = this.equality();
            expr = {
                type: "BinaryExpression",
                operator: "&&",
                left: expr,
                right: right,
                position: operator.position,
            };
        }
        return expr;
    }
    equality() {
        let expr = this.comparison();
        while (this.match("EQUALS", "NOT_EQUALS")) {
            const operator = this.previous();
            const right = this.comparison();
            expr = {
                type: "BinaryExpression",
                operator: operator.type === "EQUALS" ? "==" : "!=",
                left: expr,
                right: right,
                position: operator.position,
            };
        }
        return expr;
    }
    comparison() {
        let expr = this.term();
        while (this.match("LESS_THAN", "GREATER_THAN", "LESS_EQUALS", "GREATER_EQUALS")) {
            const operator = this.previous();
            const right = this.term();
            expr = {
                type: "BinaryExpression",
                operator: operator.value,
                left: expr,
                right: right,
                position: operator.position,
            };
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match("PLUS", "MINUS")) {
            const operator = this.previous();
            const right = this.factor();
            expr = {
                type: "BinaryExpression",
                operator: operator.type === "PLUS" ? "+" : "-",
                left: expr,
                right: right,
                position: operator.position,
            };
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match("MULTIPLY", "DIVIDE", "MODULO")) {
            const operator = this.previous();
            const right = this.unary();
            const op = operator.type === "MULTIPLY"
                ? "*"
                : operator.type === "DIVIDE"
                    ? "/"
                    : "%";
            expr = {
                type: "BinaryExpression",
                operator: op,
                left: expr,
                right: right,
                position: operator.position,
            };
        }
        return expr;
    }
    unary() {
        if (this.match("MINUS", "NOT")) {
            const operator = this.previous();
            const right = this.unary();
            return {
                type: "UnaryExpression",
                operator: operator.type === "MINUS" ? "-" : "!",
                argument: right,
                position: operator.position,
            };
        }
        return this.call();
    }
    call() {
        let expr = this.primary();
        while (true) {
            if (this.match("SYMBOL") && this.previous().value === "(") {
                expr = this.finishCall(expr);
            }
            else {
                break;
            }
        }
        return expr;
    }
    finishCall(callee) {
        const args = [];
        if (!this.check("SYMBOL")) {
            do {
                args.push(this.expression());
            } while (this.match("SYMBOL") && this.previous().value === ",");
        }
        const paren = this.consume("SYMBOL", "Expected ')' after arguments.");
        return {
            type: "CallExpression",
            callee,
            arguments: args,
            position: paren.position,
        };
    }
    primary() {
        if (this.match("NUMBER")) {
            return {
                type: "Literal",
                value: Number(this.previous().value),
                position: this.previous().position,
            };
        }
        if (this.match("STRING")) {
            return {
                type: "Literal",
                value: String(this.previous().value),
                position: this.previous().position,
            };
        }
        if (this.match("TRUE", "FALSE")) {
            return {
                type: "Literal",
                value: this.previous().value === "TRUE",
                position: this.previous().position,
            };
        }
        if (this.match("NULL")) {
            return {
                type: "Literal",
                value: null,
                position: this.previous().position,
            };
        }
        if (this.match("IDENTIFIER")) {
            return {
                type: "Identifier",
                name: this.previous().value,
                position: this.previous().position,
            };
        }
        if (this.match("SYMBOL") && this.previous().value === "[") {
            const elements = [];
            if (!this.check("SYMBOL")) {
                do {
                    elements.push(this.expression());
                } while (this.match("SYMBOL") && this.previous().value === ",");
            }
            this.consume("SYMBOL", "Expected ']' after array elements.");
            return {
                type: "ArrayExpression",
                elements,
                position: this.previous().position,
            };
        }
        if (this.match("SYMBOL") && this.previous().value === "(") {
            const expr = this.expression();
            this.consume("SYMBOL", "Expected ')' after expression.");
            return expr;
        }
        throw new errors_1.CompileTimeError(`Unexpected token: ${this.peek().value}`, this.peek().position);
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().value === ";")
                return;
            switch (this.peek().value) {
                case "IF":
                case "WHILE":
                case "FUNCTION":
                case "LET":
                case "CONST":
                case "RETURN":
                case "PRINT":
                    return;
            }
            this.advance();
        }
    }
}
exports.Parser = Parser;
