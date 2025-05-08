"use strict";
exports.__esModule = true;
exports.TokenType = exports.Environment = void 0;
var errors_1 = require("./errors");
var Environment = /** @class */ (function () {
    function Environment(parent) {
        this.variables = new Map();
        this.exports = new Map();
        this.functions = new Map();
        this.parent = parent;
    }
    Environment.prototype.define = function (name, value, isConstant) {
        if (isConstant === void 0) { isConstant = false; }
        this.variables.set(name, { value: value, isConstant: isConstant });
    };
    Environment.prototype.defineFunction = function (name, func) {
        this.functions.set(name, func);
    };
    Environment.prototype.get = function (name) {
        var value = this.variables.get(name);
        if (value !== undefined) {
            return value;
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        return undefined;
    };
    Environment.prototype.getFunction = function (name) {
        var func = this.functions.get(name);
        if (func !== undefined) {
            return func;
        }
        if (this.parent) {
            return this.parent.getFunction(name);
        }
        return undefined;
    };
    Environment.prototype.set = function (name, value) {
        var existing = this.get(name);
        if (existing && existing.isConstant) {
            throw new errors_1.RuntimeError("Cannot reassign constant: ".concat(name));
        }
        this.variables.set(name, { value: value, isConstant: false });
    };
    Environment.prototype.getParent = function () {
        return this.parent;
    };
    return Environment;
}());
exports.Environment = Environment;
var TokenType;
(function (TokenType) {
    // Keywords
    TokenType["PROGRAM_START"] = "PROGRAM_START";
    TokenType["PROGRAM_END"] = "PROGRAM_END";
    TokenType["PRINT"] = "PRINT";
    TokenType["LET"] = "LET";
    TokenType["CONST"] = "CONST";
    TokenType["IF"] = "IF";
    TokenType["ELSE"] = "ELSE";
    TokenType["WHILE"] = "WHILE";
    TokenType["FUNCTION"] = "FUNCTION";
    TokenType["RETURN"] = "RETURN";
    TokenType["TRUE"] = "TRUE";
    TokenType["FALSE"] = "FALSE";
    TokenType["NULL"] = "NULL";
    TokenType["BREAK"] = "BREAK";
    TokenType["CONTINUE"] = "CONTINUE";
    TokenType["AND"] = "AND";
    TokenType["OR"] = "OR";
    TokenType["NOT"] = "NOT";
    // OOP keywords
    TokenType["CLASS"] = "CLASS";
    TokenType["EXTENDS"] = "EXTENDS";
    TokenType["PRIVATE"] = "PRIVATE";
    TokenType["PUBLIC"] = "PUBLIC";
    TokenType["PROTECTED"] = "PROTECTED";
    TokenType["STATIC"] = "STATIC";
    TokenType["CONSTRUCTOR"] = "CONSTRUCTOR";
    TokenType["THIS"] = "THIS";
    TokenType["SUPER"] = "SUPER";
    TokenType["NEW"] = "NEW";
    TokenType["IMPORT"] = "IMPORT";
    TokenType["EXPORT"] = "EXPORT";
    TokenType["FROM"] = "FROM";
    TokenType["DEFAULT"] = "DEFAULT";
    // Single-character tokens
    TokenType["LEFT_PAREN"] = "LEFT_PAREN";
    TokenType["RIGHT_PAREN"] = "RIGHT_PAREN";
    TokenType["LEFT_BRACE"] = "LEFT_BRACE";
    TokenType["RIGHT_BRACE"] = "RIGHT_BRACE";
    TokenType["LEFT_BRACKET"] = "LEFT_BRACKET";
    TokenType["RIGHT_BRACKET"] = "RIGHT_BRACKET";
    TokenType["COMMA"] = "COMMA";
    TokenType["DOT"] = "DOT";
    TokenType["SEMICOLON"] = "SEMICOLON";
    TokenType["ASSIGN"] = "ASSIGN";
    TokenType["OPERATOR"] = "OPERATOR";
    // Literals
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["STRING"] = "STRING";
    TokenType["NUMBER"] = "NUMBER";
    // End of file
    TokenType["EOF"] = "EOF";
    // New additions
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["WHITESPACE"] = "WHITESPACE";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
