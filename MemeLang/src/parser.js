"use strict";
exports.__esModule = true;
exports.Parser = void 0;
var types_1 = require("./types");
var errors_1 = require("./errors");
// Debug function that only logs essential info
function debug(type, message, data) {
    if (type === 'error') {
        console.error(message, data || '');
    }
    else if (process.env.DEBUG === 'true') {
        // Only log info in debug mode
        console.log(message, data || '');
    }
}
var Parser = /** @class */ (function () {
    function Parser(lexer) {
        var _a, _b;
        this.lexer = lexer;
        this.tokens = [];
        this.current = 0;
        this.tokens = lexer.tokenize();
        this.tokens.push({
            type: types_1.TokenType.EOF,
            lexeme: '',
            literal: null,
            value: null,
            line: this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].line : 1,
            position: {
                line: this.tokens.length > 0 ? ((_a = this.tokens[this.tokens.length - 1].position) === null || _a === void 0 ? void 0 : _a.line) || 1 : 1,
                column: this.tokens.length > 0 ? ((_b = this.tokens[this.tokens.length - 1].position) === null || _b === void 0 ? void 0 : _b.column) || 1 : 1
            },
            toString: function () { return "EOF"; }
        });
    }
    Parser.prototype.parse = function () {
        return this.program();
    };
    Parser.prototype.program = function () {
        var _a, _b, _c, _d;
        var statements = [];
        console.log("Starting program parsing");
        // Reset current token pointer
        this.current = 0;
        console.log("Current token:", this.peek());
        // Skip initial whitespace and newlines
        while (!this.isAtEnd() && (this.peek().type === types_1.TokenType.NEWLINE || this.peek().type === types_1.TokenType.WHITESPACE)) {
            this.advance();
        }
        // Handle program start if present
        if (this.check(types_1.TokenType.PROGRAM_START)) {
            console.log("Found program start token");
            this.advance(); // consume hi_bhai
            console.log("After program start, current token:", this.peek());
        }
        else {
            console.error("No program start token found!");
            throw new errors_1.CompileError("Program must start with 'hi_bhai'", ((_a = this.peek().position) === null || _a === void 0 ? void 0 : _a.line) || 0, ((_b = this.peek().position) === null || _b === void 0 ? void 0 : _b.column) || 0);
        }
        // Handle statements between program start and end
        while (!this.isAtEnd() && !this.check(types_1.TokenType.PROGRAM_END)) {
            try {
                // Skip whitespace and newlines between statements
                while (!this.isAtEnd() && (this.peek().type === types_1.TokenType.NEWLINE || this.peek().type === types_1.TokenType.WHITESPACE)) {
                    this.advance();
                }
                // Break if we hit program end
                if (this.check(types_1.TokenType.PROGRAM_END))
                    break;
                console.log("About to parse statement, current token:", this.peek());
                var stmt = this.declaration();
                console.log("Parsed statement:", stmt);
                if (stmt && stmt.type !== 'EmptyStatement') {
                    statements.push(stmt);
                    console.log("Added statement to program. Total statements:", statements.length);
                }
            }
            catch (error) {
                console.error("Error in program parsing:", error);
                this.synchronize();
            }
        }
        // Handle program end if present
        if (this.check(types_1.TokenType.PROGRAM_END)) {
            console.log("Found program end token");
            this.advance(); // consume bye_bhai
        }
        else {
            console.error("No program end token found!");
            throw new errors_1.CompileError("Program must end with 'bye_bhai'", ((_c = this.peek().position) === null || _c === void 0 ? void 0 : _c.line) || 0, ((_d = this.peek().position) === null || _d === void 0 ? void 0 : _d.column) || 0);
        }
        console.log("Program parsed with ".concat(statements.length, " statements:"), statements);
        return { type: 'Program', statements: statements };
    };
    Parser.prototype.declaration = function () {
        try {
            // Skip whitespace and newlines
            while (this.peek().lexeme.trim() === '' || this.peek().lexeme === '\n') {
                this.advance();
            }
            if (this.match(types_1.TokenType.LET, types_1.TokenType.CONST)) {
                return this.variableDeclaration();
            }
            if (this.match(types_1.TokenType.FUNCTION)) {
                return this.functionDeclaration();
            }
            if (this.match(types_1.TokenType.CLASS)) {
                return this.classDeclaration();
            }
            if (this.match(types_1.TokenType.PRINT)) {
                debug('info', "Found PRINT token in declaration");
                return this.printStatement();
            }
            if (this.match(types_1.TokenType.IMPORT)) {
                return this.importDeclaration();
            }
            if (this.match(types_1.TokenType.EXPORT)) {
                return this.exportDeclaration();
            }
            return this.statement();
        }
        catch (error) {
            debug('error', "Error in declaration parsing:", error);
            this.synchronize();
            return { type: 'EmptyStatement' };
        }
    };
    Parser.prototype.statement = function () {
        if (this.match(types_1.TokenType.IF)) {
            return this.ifStatement();
        }
        if (this.match(types_1.TokenType.WHILE)) {
            return this.whileStatement();
        }
        if (this.match(types_1.TokenType.LEFT_BRACE)) {
            return { type: 'BlockStatement', statements: this.block() };
        }
        if (this.match(types_1.TokenType.RETURN)) {
            return this.returnStatement();
        }
        if (this.match(types_1.TokenType.PRINT)) {
            return this.printStatement();
        }
        if (this.match(types_1.TokenType.SEMICOLON)) {
            return { type: 'EmptyStatement' };
        }
        if (this.check(types_1.TokenType.IDENTIFIER)) {
            var token = this.peek();
            var nextToken = this.peekNext();
            // If we see an identifier followed by a left parenthesis, treat it as a function call
            if (nextToken.type === types_1.TokenType.LEFT_PAREN) {
                this.advance(); // consume the identifier
                return this.expressionStatement();
            }
        }
        var expr = this.expressionStatement();
        // Make semicolon optional
        if (this.check(types_1.TokenType.SEMICOLON)) {
            this.advance();
        }
        return expr;
    };
    Parser.prototype.block = function () {
        var statements = [];
        while (!this.check(types_1.TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume(types_1.TokenType.RIGHT_BRACE, "Expected '}' after block");
        return statements;
    };
    Parser.prototype.functionDeclaration = function () {
        var nameToken = this.consume(types_1.TokenType.IDENTIFIER, "Expected function name");
        var name = nameToken.lexeme;
        // Make parentheses optional for function declarations
        var parameters = [];
        if (this.match(types_1.TokenType.LEFT_PAREN)) {
            if (!this.check(types_1.TokenType.RIGHT_PAREN)) {
                do {
                    var paramToken = this.consume(types_1.TokenType.IDENTIFIER, "Expected parameter name");
                    parameters.push(paramToken.lexeme);
                } while (this.match(types_1.TokenType.COMMA));
            }
            this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after parameters");
        }
        else {
            // If no parentheses, parse parameters until we see a left brace
            while (!this.check(types_1.TokenType.LEFT_BRACE) && !this.isAtEnd()) {
                var paramToken = this.consume(types_1.TokenType.IDENTIFIER, "Expected parameter name");
                parameters.push(paramToken.lexeme);
                if (!this.check(types_1.TokenType.LEFT_BRACE)) {
                    this.consume(types_1.TokenType.COMMA, "Expected ',' between parameters");
                }
            }
        }
        // Make braces optional for function body
        var body;
        if (this.match(types_1.TokenType.LEFT_BRACE)) {
            body = this.block();
        }
        else {
            body = [this.statement()];
        }
        return {
            type: 'FunctionDeclaration',
            name: name,
            parameters: parameters,
            body: body
        };
    };
    Parser.prototype.ifStatement = function () {
        // Make parentheses optional for if statements
        var condition;
        if (this.match(types_1.TokenType.LEFT_PAREN)) {
            condition = this.expression();
            this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after if condition");
        }
        else {
            condition = this.expression();
        }
        // Make braces optional for if body
        var thenBranch;
        if (this.match(types_1.TokenType.LEFT_BRACE)) {
            thenBranch = { type: 'BlockStatement', statements: this.block() };
        }
        else {
            thenBranch = this.statement();
        }
        // Handle else branch
        var elseBranch = null;
        if (this.match(types_1.TokenType.ELSE)) {
            if (this.match(types_1.TokenType.LEFT_BRACE)) {
                elseBranch = { type: 'BlockStatement', statements: this.block() };
            }
            else {
                elseBranch = this.statement();
            }
        }
        return {
            type: 'IfStatement',
            condition: condition,
            thenBranch: thenBranch,
            elseBranch: elseBranch
        };
    };
    Parser.prototype.whileStatement = function () {
        // Make parentheses optional for while loops
        var condition;
        if (this.match(types_1.TokenType.LEFT_PAREN)) {
            condition = this.expression();
            this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after condition");
        }
        else {
            condition = this.expression();
        }
        var body = this.statement();
        return {
            type: 'WhileStatement',
            condition: condition,
            body: body
        };
    };
    Parser.prototype.printStatement = function () {
        var _a, _b;
        var printKeyword = this.previous(); // Get the print keyword token
        var expressions = [];
        // Parse first expression
        expressions.push(this.expression());
        debug('info', "Parsed first expression in print statement:", expressions[0]);
        // Parse additional expressions separated by commas
        while (this.match(types_1.TokenType.COMMA)) {
            expressions.push(this.expression());
            debug('info', "Parsed additional expression in print statement:", expressions[expressions.length - 1]);
        }
        // Expect a semicolon
        this.consume(types_1.TokenType.SEMICOLON, "Expect ';' after print statement");
        debug('info', "Completed parsing print statement with ".concat(expressions.length, " expressions"));
        return {
            type: 'PrintStatement',
            expressions: expressions,
            line: ((_a = printKeyword.position) === null || _a === void 0 ? void 0 : _a.line) || 0,
            column: ((_b = printKeyword.position) === null || _b === void 0 ? void 0 : _b.column) || 0
        };
    };
    Parser.prototype.returnStatement = function () {
        var keyword = this.previous();
        var value = null;
        if (!this.check(types_1.TokenType.SEMICOLON) && !this.check(types_1.TokenType.RIGHT_BRACE)) {
            value = this.expression();
        }
        // Make semicolons optional for return statements
        if (this.check(types_1.TokenType.SEMICOLON)) {
            this.consume(types_1.TokenType.SEMICOLON, "Expected ';' after return value");
        }
        return {
            type: 'ReturnStatement',
            value: value
        };
    };
    Parser.prototype.expressionStatement = function () {
        var expr = this.expression();
        // Make semicolons optional for all statements
        if (this.check(types_1.TokenType.SEMICOLON)) {
            this.consume(types_1.TokenType.SEMICOLON, "Expected ';' after expression");
        }
        return { type: 'ExpressionStatement', expression: expr };
    };
    Parser.prototype.expression = function () {
        return this.assignment();
    };
    Parser.prototype.assignment = function () {
        var _a, _b;
        var expr = this.additive();
        if (this.match(types_1.TokenType.ASSIGN)) {
            var equals = this.previous();
            var value = this.assignment();
            if (expr.type === 'Identifier' || expr.type === 'MemberExpression') {
                return {
                    type: 'AssignmentExpression',
                    left: expr,
                    right: value,
                    operator: equals.lexeme
                };
            }
            throw new errors_1.CompileError("Invalid assignment target", ((_a = equals.position) === null || _a === void 0 ? void 0 : _a.line) || 0, ((_b = equals.position) === null || _b === void 0 ? void 0 : _b.column) || 0);
        }
        return expr;
    };
    Parser.prototype.additive = function () {
        var expr = this.comparison();
        while (this.match(types_1.TokenType.OPERATOR)) {
            var operator = this.previous().lexeme;
            if (operator === '+' || operator === '-') {
                var right = this.comparison();
                expr = {
                    type: 'BinaryExpression',
                    operator: operator,
                    left: expr,
                    right: right
                };
            }
            else {
                this.current--; // Go back one token since it wasn't a + or -
                break;
            }
        }
        return expr;
    };
    Parser.prototype.comparison = function () {
        var expr = this.term();
        while (this.match(types_1.TokenType.OPERATOR)) {
            var operator = this.previous().lexeme;
            if (operator === '<' || operator === '>' || operator === '<=' || operator === '>=' || operator === '==' || operator === '!=') {
                var right = this.term();
                expr = {
                    type: 'BinaryExpression',
                    operator: operator,
                    left: expr,
                    right: right
                };
            }
            else {
                this.current--; // Go back one token since it wasn't a comparison operator
                break;
            }
        }
        return expr;
    };
    Parser.prototype.term = function () {
        var expr = this.unary();
        while (this.match(types_1.TokenType.OPERATOR)) {
            var operator = this.previous().lexeme;
            if (operator === '*' || operator === '/' || operator === '%') {
                var right = this.unary();
                expr = {
                    type: 'BinaryExpression',
                    operator: operator,
                    left: expr,
                    right: right
                };
            }
            else {
                this.current--; // Go back one token since it wasn't a * or /
                break;
            }
        }
        return expr;
    };
    Parser.prototype.unary = function () {
        if (this.match(types_1.TokenType.OPERATOR)) {
            var operator = this.previous().lexeme;
            if (operator === '-' || operator === '!') {
                var right = this.unary();
                return {
                    type: 'UnaryExpression',
                    operator: operator,
                    argument: right
                };
            }
            else {
                this.current--; // Go back one token since it wasn't a unary operator
            }
        }
        return this.call();
    };
    Parser.prototype.primary = function () {
        var _a, _b;
        if (this.match(types_1.TokenType.FALSE))
            return { type: 'Literal', value: false };
        if (this.match(types_1.TokenType.TRUE))
            return { type: 'Literal', value: true };
        if (this.match(types_1.TokenType.NULL))
            return { type: 'Literal', value: null };
        if (this.match(types_1.TokenType.THIS)) {
            return { type: 'ThisExpression' };
        }
        if (this.match(types_1.TokenType.SUPER)) {
            return { type: 'SuperExpression' };
        }
        if (this.match(types_1.TokenType.NEW)) {
            return this.finishNewExpression();
        }
        if (this.match(types_1.TokenType.LEFT_PAREN)) {
            var expr = this.expression();
            this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after expression");
            return {
                type: 'GroupingExpression',
                expression: expr
            };
        }
        if (this.match(types_1.TokenType.LEFT_BRACKET)) {
            var elements = [];
            if (!this.check(types_1.TokenType.RIGHT_BRACKET)) {
                do {
                    if (this.check(types_1.TokenType.RIGHT_BRACKET))
                        break;
                    elements.push(this.expression());
                } while (this.match(types_1.TokenType.COMMA));
            }
            this.consume(types_1.TokenType.RIGHT_BRACKET, "Expected ']' after array elements");
            return {
                type: 'ArrayExpression',
                elements: elements
            };
        }
        if (this.match(types_1.TokenType.NUMBER)) {
            return { type: 'Literal', value: this.previous().value || Number(this.previous().lexeme) };
        }
        if (this.match(types_1.TokenType.STRING)) {
            return { type: 'Literal', value: this.previous().value || this.previous().lexeme };
        }
        if (this.match(types_1.TokenType.IDENTIFIER)) {
            var token = this.previous();
            var name_1 = token.lexeme;
            // Check if this is a function call with parentheses
            if (this.match(types_1.TokenType.LEFT_PAREN)) {
                return this.finishCall(name_1);
            }
            // Check for array access
            if (this.match(types_1.TokenType.LEFT_BRACKET)) {
                var index = this.expression();
                this.consume(types_1.TokenType.RIGHT_BRACKET, "Expected ']' after array index");
                return {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: name_1, token: token },
                    property: index,
                    computed: true
                };
            }
            // Check for property access with dot notation
            if (this.match(types_1.TokenType.DOT)) {
                var propertyToken = this.consume(types_1.TokenType.IDENTIFIER, "Expected property name after '.'");
                var propertyName = propertyToken.lexeme;
                // Check if this is a method call
                if (this.check(types_1.TokenType.LEFT_PAREN)) {
                    var expr = {
                        type: 'MemberExpression',
                        object: { type: 'Identifier', name: name_1, token: token },
                        property: { type: 'Identifier', name: propertyName, token: propertyToken },
                        computed: false
                    };
                    // If followed by parentheses, it's a method call
                    if (this.match(types_1.TokenType.LEFT_PAREN)) {
                        return this.finishMethodCall(expr);
                    }
                    return expr;
                }
                return {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: name_1, token: token },
                    property: { type: 'Identifier', name: propertyName, token: propertyToken },
                    computed: false
                };
            }
            // At this point, we've matched an identifier but not a function call or array access
            // So this is just a variable reference
            return { type: 'Identifier', name: name_1, token: token };
        }
        throw new errors_1.CompileError("Expected expression", ((_a = this.peek().position) === null || _a === void 0 ? void 0 : _a.line) || 0, ((_b = this.peek().position) === null || _b === void 0 ? void 0 : _b.column) || 0);
    };
    Parser.prototype.finishCall = function (name) {
        var args = [];
        if (!this.check(types_1.TokenType.RIGHT_PAREN)) {
            do {
                if (this.check(types_1.TokenType.RIGHT_PAREN))
                    break;
                args.push(this.expression());
            } while (this.match(types_1.TokenType.COMMA));
        }
        this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after arguments");
        return {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: name, token: this.previous() },
            arguments: args
        };
    };
    Parser.prototype.finishMethodCall = function (object) {
        var args = [];
        if (!this.check(types_1.TokenType.RIGHT_PAREN)) {
            do {
                if (this.check(types_1.TokenType.RIGHT_PAREN))
                    break;
                args.push(this.expression());
            } while (this.match(types_1.TokenType.COMMA));
        }
        this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after arguments");
        return {
            type: 'CallExpression',
            callee: object,
            arguments: args
        };
    };
    Parser.prototype.finishNewExpression = function () {
        var classNameToken = this.consume(types_1.TokenType.IDENTIFIER, "Expected class name after 'new'");
        var className = classNameToken.lexeme;
        this.consume(types_1.TokenType.LEFT_PAREN, "Expected '(' after class name in new expression");
        var args = [];
        if (!this.check(types_1.TokenType.RIGHT_PAREN)) {
            do {
                if (this.check(types_1.TokenType.RIGHT_PAREN))
                    break;
                args.push(this.expression());
            } while (this.match(types_1.TokenType.COMMA));
        }
        this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after arguments");
        return {
            type: 'NewExpression',
            callee: { type: 'Identifier', name: className, token: classNameToken },
            arguments: args
        };
    };
    Parser.prototype.match = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        for (var _a = 0, types_2 = types; _a < types_2.length; _a++) {
            var type = types_2[_a];
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    };
    Parser.prototype.check = function (type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    };
    Parser.prototype.advance = function () {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    };
    Parser.prototype.isAtEnd = function () {
        return this.peek().type === types_1.TokenType.EOF;
    };
    Parser.prototype.peek = function () {
        return this.tokens[this.current];
    };
    Parser.prototype.peekNext = function () {
        if (this.current + 1 >= this.tokens.length) {
            return this.tokens[this.tokens.length - 1];
        }
        return this.tokens[this.current + 1];
    };
    Parser.prototype.previous = function () {
        return this.tokens[this.current - 1];
    };
    Parser.prototype.consume = function (type, message) {
        var _a, _b;
        if (this.check(type))
            return this.advance();
        throw new errors_1.CompileError(message, ((_a = this.peek().position) === null || _a === void 0 ? void 0 : _a.line) || 0, ((_b = this.peek().position) === null || _b === void 0 ? void 0 : _b.column) || 0);
    };
    Parser.prototype.synchronize = function () {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type === types_1.TokenType.SEMICOLON)
                return;
            switch (this.peek().type) {
                case types_1.TokenType.FUNCTION:
                case types_1.TokenType.LET:
                case types_1.TokenType.CONST:
                case types_1.TokenType.IF:
                case types_1.TokenType.WHILE:
                case types_1.TokenType.PRINT:
                case types_1.TokenType.RETURN:
                case types_1.TokenType.PROGRAM_START:
                case types_1.TokenType.PROGRAM_END:
                    return;
            }
            this.advance();
        }
    };
    Parser.prototype.variableDeclaration = function () {
        var isConstant = this.previous().type === types_1.TokenType.CONST;
        var name = this.consume(types_1.TokenType.IDENTIFIER, "Expected variable name");
        this.consume(types_1.TokenType.ASSIGN, "Expected '=' after variable name");
        var init = this.expression();
        // Make semicolons optional for variable declarations
        if (this.check(types_1.TokenType.SEMICOLON)) {
            this.advance();
        }
        return { type: 'VariableDeclaration', name: name, init: init, isConstant: isConstant };
    };
    Parser.prototype.backup = function () {
        this.current--;
    };
    Parser.prototype.classDeclaration = function () {
        // Parse class name
        var name = this.consume(types_1.TokenType.IDENTIFIER, "Expected class name").lexeme;
        // Check for superclass
        var superClass = undefined;
        if (this.match(types_1.TokenType.EXTENDS)) {
            superClass = this.consume(types_1.TokenType.IDENTIFIER, "Expected superclass name").lexeme;
        }
        // Expect opening brace
        this.consume(types_1.TokenType.LEFT_BRACE, "Expected '{' before class body");
        // Parse class body
        var methods = [];
        // Parse methods and properties
        while (!this.check(types_1.TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            try {
                // Check for access modifiers
                var access = 'public';
                if (this.match(types_1.TokenType.PUBLIC)) {
                    access = 'public';
                }
                else if (this.match(types_1.TokenType.PRIVATE)) {
                    access = 'private';
                }
                else if (this.match(types_1.TokenType.PROTECTED)) {
                    access = 'protected';
                }
                // Check for static modifier
                var isStatic = this.match(types_1.TokenType.STATIC);
                // If it's the constructor
                if (this.match(types_1.TokenType.CONSTRUCTOR)) {
                    // Parse constructor method
                    var methodParams = this.parseParameters();
                    // Expect method body
                    this.consume(types_1.TokenType.LEFT_BRACE, "Expected '{' before constructor body");
                    var methodBody = this.block();
                    methods.push({
                        name: 'constructor',
                        body: {
                            name: 'constructor',
                            parameters: methodParams,
                            body: methodBody,
                            isConstructor: true,
                            isStatic: false,
                            access: access
                        }
                    });
                }
                // If it's a method
                else if (this.check(types_1.TokenType.IDENTIFIER)) {
                    var methodName = this.consume(types_1.TokenType.IDENTIFIER, "Expected method name").lexeme;
                    var methodParams = this.parseParameters();
                    // Expect method body
                    this.consume(types_1.TokenType.LEFT_BRACE, "Expected '{' before method body");
                    var methodBody = this.block();
                    methods.push({
                        name: methodName,
                        body: {
                            name: methodName,
                            parameters: methodParams,
                            body: methodBody,
                            isStatic: isStatic,
                            access: access
                        }
                    });
                }
                // If it's something else (like a property)
                else {
                    // Skip until semicolon or end of class
                    while (!this.check(types_1.TokenType.SEMICOLON) && !this.check(types_1.TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                        this.advance();
                    }
                    if (this.check(types_1.TokenType.SEMICOLON)) {
                        this.advance(); // Consume the semicolon
                    }
                }
            }
            catch (error) {
                debug('error', "Error parsing class member:", error);
                this.synchronize();
            }
        }
        // Expect closing brace
        this.consume(types_1.TokenType.RIGHT_BRACE, "Expected '}' after class body");
        return {
            type: 'ClassDeclaration',
            name: name,
            superClass: superClass,
            methods: methods
        };
    };
    Parser.prototype.importDeclaration = function () {
        var _a, _b, _c;
        debug('info', "Parsing import declaration");
        var specifiers = [];
        // Parse import specifiers
        if (!this.check(types_1.TokenType.FROM)) {
            if (this.match(types_1.TokenType.IDENTIFIER)) {
                // Default import: import defaultExport from "./module.ml"
                var local = this.previous().lexeme || '';
                specifiers.push({
                    type: 'ImportSpecifier',
                    local: { name: local },
                    exported: { name: 'default' }
                });
                // Check for additional named imports: import defaultExport, { namedExport } from "./module.ml"
                if (this.match(types_1.TokenType.COMMA)) {
                    this.parseNamedImports(specifiers);
                }
            }
            else if (this.match(types_1.TokenType.OPERATOR) && this.previous().lexeme === '*') {
                // Namespace import: import * as name from "./module.ml"
                this.consume(types_1.TokenType.IDENTIFIER, "Expected 'as' after '*'");
                if (this.previous().lexeme !== 'as') {
                    throw new errors_1.CompileError("Expected 'as' after '*'", ((_a = this.previous().position) === null || _a === void 0 ? void 0 : _a.line) || 0, ((_b = this.previous().position) === null || _b === void 0 ? void 0 : _b.column) || 0);
                }
                this.consume(types_1.TokenType.IDENTIFIER, "Expected namespace name after 'as'");
                var local = this.previous().lexeme || '';
                specifiers.push({
                    type: 'ImportSpecifier',
                    local: { name: local },
                    exported: { name: '*' }
                });
            }
            else if (this.match(types_1.TokenType.LEFT_BRACE)) {
                // Named imports: import { export1, export2 } from "./module.ml"
                this.parseNamedImports(specifiers);
            }
        }
        // Parse source
        this.consume(types_1.TokenType.FROM, "Expected 'from' after import specifiers");
        this.consume(types_1.TokenType.STRING, "Expected module path string after 'from'");
        var source = { value: ((_c = this.previous().value) === null || _c === void 0 ? void 0 : _c.toString()) || this.previous().lexeme || '' };
        // End of statement
        this.consume(types_1.TokenType.SEMICOLON, "Expected ';' after import statement");
        return {
            type: 'ImportDeclaration',
            specifiers: specifiers,
            source: source
        };
    };
    Parser.prototype.parseNamedImports = function (specifiers) {
        // Parse named imports: { export1, export2 as alias2 }
        do {
            this.consume(types_1.TokenType.IDENTIFIER, "Expected import name");
            var imported = this.previous().lexeme || '';
            var local = imported;
            // Handle aliasing: import { export1 as alias1 } from "./module.ml"
            if (this.match(types_1.TokenType.IDENTIFIER) && this.previous().lexeme === 'as') {
                this.consume(types_1.TokenType.IDENTIFIER, "Expected local name after 'as'");
                local = this.previous().lexeme || '';
            }
            specifiers.push({
                type: 'ImportSpecifier',
                local: { name: local },
                exported: { name: imported }
            });
        } while (this.match(types_1.TokenType.COMMA) && !this.check(types_1.TokenType.RIGHT_BRACE));
        this.consume(types_1.TokenType.RIGHT_BRACE, "Expected '}' after import specifiers");
    };
    Parser.prototype.exportDeclaration = function () {
        var _a, _b;
        debug('info', "Parsing export declaration");
        // Handle export declaration: export function foo() {}
        if (this.match(types_1.TokenType.FUNCTION)) {
            var declaration = this.functionDeclaration();
            return {
                type: 'ExportDeclaration',
                declaration: declaration
            };
        }
        // Handle export declaration: export const/let foo = bar
        if (this.match(types_1.TokenType.CONST, types_1.TokenType.LET)) {
            var declaration = this.variableDeclaration();
            return {
                type: 'ExportDeclaration',
                declaration: declaration
            };
        }
        // Handle export declaration: export class MyClass {}
        if (this.match(types_1.TokenType.CLASS)) {
            var declaration = this.classDeclaration();
            return {
                type: 'ExportDeclaration',
                declaration: declaration
            };
        }
        // Handle default export: export default expression
        if (this.match(types_1.TokenType.DEFAULT)) {
            var expr = this.expression();
            this.consume(types_1.TokenType.SEMICOLON, "Expected ';' after export");
            // Create a synthetic variable declaration to use as the declaration
            var defaultDecl = {
                type: 'VariableDeclaration',
                name: {
                    type: types_1.TokenType.IDENTIFIER,
                    lexeme: 'default',
                    literal: null,
                    value: 'default',
                    line: 0,
                    position: { line: 0, column: 0 },
                    toString: function () { return 'default'; }
                },
                init: expr,
                isConstant: true
            };
            return {
                type: 'ExportDeclaration',
                declaration: defaultDecl
            };
        }
        // Handle named exports: export { foo, bar as baz }
        if (this.match(types_1.TokenType.LEFT_BRACE)) {
            var specifiers = [];
            do {
                this.consume(types_1.TokenType.IDENTIFIER, "Expected export name");
                var local = this.previous().lexeme || '';
                var exported = local;
                // Handle aliasing: export { foo as bar }
                if (this.match(types_1.TokenType.IDENTIFIER) && this.previous().lexeme === 'as') {
                    this.consume(types_1.TokenType.IDENTIFIER, "Expected exported name after 'as'");
                    exported = this.previous().lexeme || '';
                }
                specifiers.push({
                    type: 'ExportSpecifier',
                    local: { name: local },
                    exported: { name: exported }
                });
            } while (this.match(types_1.TokenType.COMMA) && !this.check(types_1.TokenType.RIGHT_BRACE));
            this.consume(types_1.TokenType.RIGHT_BRACE, "Expected '}' after export specifiers");
            this.consume(types_1.TokenType.SEMICOLON, "Expected ';' after export");
            return {
                type: 'ExportDeclaration',
                specifiers: specifiers
            };
        }
        throw new errors_1.CompileError("Invalid export declaration", ((_a = this.peek().position) === null || _a === void 0 ? void 0 : _a.line) || 0, ((_b = this.peek().position) === null || _b === void 0 ? void 0 : _b.column) || 0);
    };
    // Helper method to parse parameters
    Parser.prototype.parseParameters = function () {
        this.consume(types_1.TokenType.LEFT_PAREN, "Expected '(' after function name");
        var parameters = [];
        if (!this.check(types_1.TokenType.RIGHT_PAREN)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), "Cannot have more than 255 parameters");
                }
                var param = this.consume(types_1.TokenType.IDENTIFIER, "Expected parameter name");
                parameters.push(param.lexeme);
            } while (this.match(types_1.TokenType.COMMA));
        }
        this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after parameters");
        return parameters;
    };
    // Helper method to parse a block statement
    Parser.prototype.blockStatement = function () {
        debug('info', "Parsing block statement");
        this.consume(types_1.TokenType.LEFT_BRACE, "Expected '{' before block");
        var statements = [];
        while (!this.check(types_1.TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            var stmt = this.declaration();
            if (stmt) {
                statements.push(stmt);
            }
        }
        this.consume(types_1.TokenType.RIGHT_BRACE, "Expected '}' after block");
        debug('info', "Parsed block with ".concat(statements.length, " statements"));
        return { type: 'BlockStatement', statements: statements };
    };
    // Helper method to report an error
    Parser.prototype.error = function (token, message) {
        var _a;
        return new errors_1.CompileError(message, token.line, ((_a = token.position) === null || _a === void 0 ? void 0 : _a.column) || 0);
    };
    Parser.prototype.call = function () {
        var expr = this.primary();
        while (true) {
            if (this.match(types_1.TokenType.LEFT_PAREN)) {
                expr = this.finishCallExpr(expr);
            }
            else if (this.match(types_1.TokenType.DOT)) {
                var name_2 = this.consume(types_1.TokenType.IDENTIFIER, "Expected property name after '.'");
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property: { type: 'Identifier', name: name_2.lexeme, token: name_2 },
                    computed: false
                };
            }
            else if (this.match(types_1.TokenType.LEFT_BRACKET)) {
                var index = this.expression();
                this.consume(types_1.TokenType.RIGHT_BRACKET, "Expected ']' after index");
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property: index,
                    computed: true
                };
            }
            else {
                break;
            }
        }
        return expr;
    };
    Parser.prototype.finishCallExpr = function (callee) {
        var args = [];
        if (!this.check(types_1.TokenType.RIGHT_PAREN)) {
            do {
                if (args.length >= 255) {
                    this.error(this.peek(), "Cannot have more than 255 arguments");
                }
                args.push(this.expression());
            } while (this.match(types_1.TokenType.COMMA));
        }
        this.consume(types_1.TokenType.RIGHT_PAREN, "Expected ')' after arguments");
        return {
            type: 'CallExpression',
            callee: callee,
            arguments: args
        };
    };
    return Parser;
}());
exports.Parser = Parser;
