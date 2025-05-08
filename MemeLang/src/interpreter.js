"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Interpreter = void 0;
var lexer_1 = require("./lexer");
var parser_1 = require("./parser");
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
// Conditionally import fs and path only in Node.js environment
var fs = null;
var path = null;
if (typeof window === 'undefined') {
    // Only import in Node.js environment
    // @ts-ignore
    fs = require('fs');
    // @ts-ignore
    path = require('path');
}
// Define method definition interface - now imported from types.ts
// interface MethodDefinition {
//   func: FunctionDeclaration;
//   static: boolean;
//   access: 'public' | 'private' | 'protected';
//   isConstructor?: boolean;
// }
// Define a class for OOP implementation
var MemeLangClass = /** @class */ (function () {
    function MemeLangClass(name, superclass, methods) {
        this.name = name;
        this.superclass = superclass;
        this.methods = methods || new Map();
        this.properties = new Map();
    }
    MemeLangClass.prototype.findMethod = function (name) {
        var method = this.methods.get(name);
        if (method)
            return method;
        if (this.superclass) {
            return this.superclass.findMethod(name);
        }
        return null;
    };
    MemeLangClass.prototype.toString = function () {
        return this.name;
    };
    MemeLangClass.prototype.addMethod = function (name, method) {
        this.methods.set(name, method);
    };
    return MemeLangClass;
}());
// Define a class for instances of MemeLangClass
var MemeLangInstance = /** @class */ (function () {
    function MemeLangInstance(klass, environment) {
        this.klass = klass;
        this.fields = new Map();
        this.environment = environment;
    }
    MemeLangInstance.prototype.isFunctionDeclaration = function (value) {
        return value && typeof value === 'object' && value.type === 'FunctionDeclaration';
    };
    MemeLangInstance.prototype.get = function (name) {
        var _this = this;
        // First check instance fields
        if (this.fields.has(name)) {
            return this.fields.get(name);
        }
        // Then check methods
        var method = this.klass.findMethod(name);
        if (method && !method.static) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // Create a new environment for the method invocation
                var methodEnv = new types_1.Environment(_this.environment);
                // Set up `this` in the method environment
                methodEnv.variables.set('this', { value: _this, isConstant: true });
                // Set up parameters
                var func = method.func;
                if (_this.isFunctionDeclaration(func)) {
                    if (func.parameters) {
                        for (var i = 0; i < Math.min(func.parameters.length, args.length); i++) {
                            methodEnv.variables.set(func.parameters[i], { value: args[i], isConstant: false });
                        }
                    }
                    // Set the method's interpreter to the current environment's interpreter
                    if (_this.environment.interpreter) {
                        methodEnv.interpreter = _this.environment.interpreter;
                        // Save the current 'this' value
                        var prevThis = _this.environment.interpreter.thisEnvironment;
                        // Set 'this' to the current instance for the duration of the method call
                        _this.environment.interpreter.thisEnvironment = _this;
                        try {
                            // Execute method body
                            var result = null;
                            if (func.body && Array.isArray(func.body)) {
                                for (var _a = 0, _b = func.body; _a < _b.length; _a++) {
                                    var statement = _b[_a];
                                    result = methodEnv.interpreter.interpretNode(statement);
                                    if (statement.type === 'ReturnStatement') {
                                        break;
                                    }
                                }
                            }
                            return result;
                        }
                        finally {
                            // Restore the previous 'this' value
                            if (_this.environment.interpreter) {
                                _this.environment.interpreter.thisEnvironment = prevThis;
                            }
                        }
                    }
                    else {
                        throw new errors_1.RuntimeError('Method environment has no interpreter');
                    }
                }
                else {
                    throw new errors_1.RuntimeError('Invalid method type');
                }
            };
        }
        // Finally check class properties
        if (this.klass.properties.has(name)) {
            return this.klass.properties.get(name).value;
        }
        // If not found, check the superclass
        if (this.klass.superclass) {
            // Create a proxy instance for superclass method access
            var superInstance_1 = new MemeLangInstance(this.klass.superclass, this.environment);
            // Copy fields to the superclass instance to ensure consistent state
            this.fields.forEach(function (value, key) {
                superInstance_1.set(key, value);
            });
            try {
                return superInstance_1.get(name);
            }
            catch (e) {
                // If not found in superclass, continue with the original error
            }
        }
        throw new errors_1.RuntimeError("Undefined property '".concat(name, "' in class ").concat(this.klass.name));
    };
    MemeLangInstance.prototype.set = function (name, value) {
        this.fields.set(name, value);
    };
    MemeLangInstance.prototype.toString = function () {
        return "[".concat(this.klass.name, " instance]");
    };
    return MemeLangInstance;
}());
var ReturnValue = /** @class */ (function (_super) {
    __extends(ReturnValue, _super);
    function ReturnValue(value) {
        var _this = _super.call(this, 'Return statement') || this;
        _this.value = value;
        _this.name = 'ReturnValue';
        return _this;
    }
    return ReturnValue;
}(Error));
var Interpreter = /** @class */ (function () {
    function Interpreter(input) {
        if (input === void 0) { input = ''; }
        this.output = [];
        this.thisEnvironment = null;
        this.currentFilePath = null;
        this.importCache = new Map();
        this.globals = new types_1.Environment();
        this.environment = this.globals;
        this.lexer = new lexer_1.Lexer(input);
        this.parser = new parser_1.Parser(this.lexer);
        // Set up the interpreter reference in the environment
        this.environment.interpreter = this;
        // Set up global environment with built-in functions
        this.setupGlobalEnvironment();
    }
    Interpreter.prototype.interpret = function (code, filePath) {
        if (filePath === void 0) { filePath = null; }
        return __awaiter(this, void 0, void 0, function () {
            var tokens, ast, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("STARTING INTERPRETATION"); // Debug log
                        this.currentFilePath = filePath;
                        this.output = []; // Reset output array
                        console.log("OUTPUT ARRAY RESET"); // Debug log
                        // Ensure code is properly set
                        console.log("Setting lexer input:", code);
                        this.lexer.input = code;
                        console.log("Lexer input set, length:", this.lexer.input.length);
                        tokens = this.lexer.tokenize();
                        console.log("TOKENS:", tokens); // Debug log
                        ast = this.parser.parse();
                        console.log("AST:", JSON.stringify(ast, null, 2)); // Debug log
                        return [4 /*yield*/, this.interpretNode(ast)];
                    case 1:
                        result = _a.sent();
                        console.log("INTERPRETATION RESULT:", result); // Debug log
                        console.log("FINAL OUTPUT ARRAY:", this.output); // Debug log
                        return [2 /*return*/, this.output];
                    case 2:
                        error_1 = _a.sent();
                        console.error("INTERPRETATION ERROR:", error_1); // Debug log
                        if (error_1 instanceof errors_1.RuntimeError || error_1 instanceof errors_1.CompileError) {
                            throw error_1;
                        }
                        throw new errors_1.RuntimeError(error_1 instanceof Error ? error_1.message : String(error_1));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.interpretNode = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 52, , 53]);
                        _a = node.type;
                        switch (_a) {
                            case 'Program': return [3 /*break*/, 1];
                            case 'VariableDeclaration': return [3 /*break*/, 3];
                            case 'FunctionDeclaration': return [3 /*break*/, 5];
                            case 'ClassDeclaration': return [3 /*break*/, 7];
                            case 'IfStatement': return [3 /*break*/, 9];
                            case 'WhileStatement': return [3 /*break*/, 11];
                            case 'PrintStatement': return [3 /*break*/, 13];
                            case 'BlockStatement': return [3 /*break*/, 15];
                            case 'ReturnStatement': return [3 /*break*/, 17];
                            case 'ExpressionStatement': return [3 /*break*/, 19];
                            case 'BinaryExpression': return [3 /*break*/, 21];
                            case 'UnaryExpression': return [3 /*break*/, 23];
                            case 'AssignmentExpression': return [3 /*break*/, 25];
                            case 'CallExpression': return [3 /*break*/, 27];
                            case 'MemberExpression': return [3 /*break*/, 29];
                            case 'ThisExpression': return [3 /*break*/, 31];
                            case 'SuperExpression': return [3 /*break*/, 33];
                            case 'NewExpression': return [3 /*break*/, 35];
                            case 'ImportDeclaration': return [3 /*break*/, 37];
                            case 'ExportDeclaration': return [3 /*break*/, 39];
                            case 'Identifier': return [3 /*break*/, 41];
                            case 'Literal': return [3 /*break*/, 43];
                            case 'GroupingExpression': return [3 /*break*/, 45];
                            case 'EmptyStatement': return [3 /*break*/, 47];
                            case 'ArrayExpression': return [3 /*break*/, 48];
                        }
                        return [3 /*break*/, 50];
                    case 1: return [4 /*yield*/, this.interpretProgram(node)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.interpretVariableDeclaration(node)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, this.interpretFunctionDeclaration(node)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: return [4 /*yield*/, this.interpretClassDeclaration(node)];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9: return [4 /*yield*/, this.interpretIfStatement(node)];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11: return [4 /*yield*/, this.interpretWhileStatement(node)];
                    case 12: return [2 /*return*/, _b.sent()];
                    case 13: return [4 /*yield*/, this.interpretPrintStatement(node)];
                    case 14: return [2 /*return*/, _b.sent()];
                    case 15: return [4 /*yield*/, this.interpretBlockStatement(node)];
                    case 16: return [2 /*return*/, _b.sent()];
                    case 17: return [4 /*yield*/, this.interpretReturnStatement(node)];
                    case 18: return [2 /*return*/, _b.sent()];
                    case 19: return [4 /*yield*/, this.interpretExpressionStatement(node)];
                    case 20: return [2 /*return*/, _b.sent()];
                    case 21: return [4 /*yield*/, this.interpretBinaryExpression(node)];
                    case 22: return [2 /*return*/, _b.sent()];
                    case 23: return [4 /*yield*/, this.interpretUnaryExpression(node)];
                    case 24: return [2 /*return*/, _b.sent()];
                    case 25: return [4 /*yield*/, this.interpretAssignmentExpression(node)];
                    case 26: return [2 /*return*/, _b.sent()];
                    case 27: return [4 /*yield*/, this.interpretCallExpression(node)];
                    case 28: return [2 /*return*/, _b.sent()];
                    case 29: return [4 /*yield*/, this.interpretMemberExpression(node)];
                    case 30: return [2 /*return*/, _b.sent()];
                    case 31: return [4 /*yield*/, this.interpretThisExpression(node)];
                    case 32: return [2 /*return*/, _b.sent()];
                    case 33: return [4 /*yield*/, this.interpretSuperExpression(node)];
                    case 34: return [2 /*return*/, _b.sent()];
                    case 35: return [4 /*yield*/, this.interpretNewExpression(node)];
                    case 36: return [2 /*return*/, _b.sent()];
                    case 37: return [4 /*yield*/, this.interpretImportDeclaration(node)];
                    case 38: return [2 /*return*/, _b.sent()];
                    case 39: return [4 /*yield*/, this.interpretExportDeclaration(node)];
                    case 40: return [2 /*return*/, _b.sent()];
                    case 41: return [4 /*yield*/, this.interpretIdentifier(node)];
                    case 42: return [2 /*return*/, _b.sent()];
                    case 43: return [4 /*yield*/, this.interpretLiteral(node)];
                    case 44: return [2 /*return*/, _b.sent()];
                    case 45: return [4 /*yield*/, this.interpretNode(node.expression)];
                    case 46: return [2 /*return*/, _b.sent()];
                    case 47: return [2 /*return*/, null];
                    case 48: return [4 /*yield*/, this.interpretArrayExpression(node)];
                    case 49: return [2 /*return*/, _b.sent()];
                    case 50: throw new errors_1.RuntimeError("Unknown node type: ".concat(node.type));
                    case 51: return [3 /*break*/, 53];
                    case 52:
                        error_2 = _b.sent();
                        debug('error', "Error interpreting ".concat(node.type, " node:"), error_2);
                        throw error_2;
                    case 53: return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.setupGlobalEnvironment = function () {
        var _this = this;
        debug('info', 'Setting up global environment');
        // Add print function
        var printFunction = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("PRINT FUNCTION CALLED WITH:", args); // Debug log
            var message = args.join(' ');
            console.log("MESSAGE TO PRINT:", message); // Debug log
            _this.output.push(message.toString());
            console.log("OUTPUT ARRAY NOW:", _this.output); // Debug log
            return message;
        };
        // Define the chaap function (main output function for MemeLang)
        this.environment.defineFunction('chaap', printFunction);
        this.environment.defineFunction('PRINT', printFunction);
        this.environment.defineFunction('print', printFunction);
        console.log("Global print functions defined"); // Debug log
        // Define the memify function
        var memifyFunction = function (text) {
            var memified = "MEME: ".concat(text);
            _this.output.push(memified);
            return memified;
        };
        this.environment.defineFunction('memify', memifyFunction);
        // Add len function
        this.environment.defineFunction('len', function (arg) {
            if (Array.isArray(arg))
                return arg.length;
            if (typeof arg === 'string')
                return arg.length;
            throw new errors_1.RuntimeError('len() requires a string or array argument');
        });
        // Add type function
        this.environment.defineFunction('type', function (arg) {
            return typeof arg;
        });
        // Add input function
        this.environment.defineFunction('input', function (prompt) {
            return prompt || ''; // In a web environment, we'd use a different implementation
        });
    };
    Interpreter.prototype.createMethodEnvironment = function () {
        return new types_1.Environment(this.environment);
    };
    Interpreter.prototype.createFunctionEnvironment = function () {
        return new types_1.Environment(this.environment);
    };
    Interpreter.prototype.interpretProgram = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, _a, statement, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        debug('info', 'Interpreting program node:', node);
                        results = [];
                        _i = 0, _a = node.statements;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        statement = _a[_i];
                        debug('info', 'Interpreting statement:', statement);
                        return [4 /*yield*/, this.interpretNode(statement)];
                    case 2:
                        result = _b.sent();
                        debug('info', 'Statement result:', result);
                        if (result !== null && result !== undefined) {
                            results.push(result);
                        }
                        debug('info', 'Output array after statement:', this.output);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        debug('info', 'Final program results:', results);
                        debug('info', 'Final output array:', this.output);
                        return [2 /*return*/, this.output];
                }
            });
        });
    };
    Interpreter.prototype.interpretVariableDeclaration = function (node) {
        var value = this.interpretNode(node.init);
        var name = node.name.lexeme || node.name.value;
        // Check if variable is already defined in current scope
        if (this.environment.variables.has(name)) {
            var existing = this.environment.variables.get(name);
            if (existing && existing.isConstant) {
                throw new errors_1.RuntimeError("Cannot reassign to constant variable '".concat(name, "'"));
            }
        }
        // Define the variable in the current environment - ensure numeric values are properly handled
        var numericValue = typeof value === 'number' ? Number(value) : value;
        this.environment.define(name, numericValue, node.isConstant);
        return numericValue;
    };
    Interpreter.prototype.interpretFunctionDeclaration = function (node) {
        var func = {
            type: 'FunctionDeclaration',
            name: node.name,
            parameters: node.parameters,
            body: node.body,
            environment: this.environment
        };
        this.environment.variables.set(node.name, {
            value: func,
            isConstant: false
        });
        return func;
    };
    Interpreter.prototype.interpretIfStatement = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var condition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.interpretNode(node.condition)];
                    case 1:
                        condition = _a.sent();
                        if (!condition) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.interpretNode(node.thenBranch)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        if (!node.elseBranch) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.interpretNode(node.elseBranch)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    Interpreter.prototype.interpretWhileStatement = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.interpretNode(node.condition)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.interpretNode(node.body)];
                    case 3:
                        result = _a.sent();
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    Interpreter.prototype.interpretExpressionStatement = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.interpretNode(node.expression)];
                    case 1: 
                    // Execute the expression but don't add to output - only print statements should add to output
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Interpreter.prototype.interpretBinaryExpression = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var left, right, leftVal, rightVal, leftNum, rightNum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.interpretNode(node.left)];
                    case 1:
                        left = _a.sent();
                        return [4 /*yield*/, this.interpretNode(node.right)];
                    case 2:
                        right = _a.sent();
                        leftVal = left === null || left === undefined ? 0 : left;
                        rightVal = right === null || right === undefined ? 0 : right;
                        leftNum = typeof leftVal === 'number' ? Number(leftVal) : leftVal;
                        rightNum = typeof rightVal === 'number' ? Number(rightVal) : rightVal;
                        switch (node.operator) {
                            case '+':
                                // String concatenation or numeric addition
                                if (typeof leftVal === 'string' || typeof rightVal === 'string') {
                                    return [2 /*return*/, String(leftVal) + String(rightVal)];
                                }
                                return [2 /*return*/, Number(leftNum) + Number(rightNum)];
                            case '-':
                                return [2 /*return*/, Number(leftNum) - Number(rightNum)];
                            case '*':
                                return [2 /*return*/, Number(leftNum) * Number(rightNum)];
                            case '/':
                                if (rightNum === 0) {
                                    throw new errors_1.RuntimeError("अनंत से मिलने की कोशिश? जीरो से डिवाइड!");
                                }
                                return [2 /*return*/, Number(leftNum) / Number(rightNum)];
                            case '%':
                                if (rightNum === 0) {
                                    throw new errors_1.RuntimeError("Zero modulo error");
                                }
                                return [2 /*return*/, Number(leftNum) % Number(rightNum)];
                            case '<':
                                return [2 /*return*/, Number(leftNum) < Number(rightNum)];
                            case '<=':
                                return [2 /*return*/, Number(leftNum) <= Number(rightNum)];
                            case '>':
                                return [2 /*return*/, Number(leftNum) > Number(rightNum)];
                            case '>=':
                                return [2 /*return*/, Number(leftNum) >= Number(rightNum)];
                            case '==':
                                return [2 /*return*/, leftNum == rightNum];
                            case '!=':
                                return [2 /*return*/, leftNum != rightNum];
                            case '&&':
                                return [2 /*return*/, leftVal && rightVal];
                            case '||':
                                return [2 /*return*/, leftVal || rightVal];
                            default:
                                throw new errors_1.RuntimeError("Unknown binary operator: ".concat(node.operator));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.interpretUnaryExpression = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var operator, argument;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        operator = node.operator;
                        return [4 /*yield*/, this.interpretNode(node.argument)];
                    case 1:
                        argument = _a.sent();
                        switch (operator) {
                            case '-':
                                return [2 /*return*/, -argument];
                            case '!':
                                return [2 /*return*/, !argument];
                            default:
                                throw new errors_1.RuntimeError("Unknown unary operator: ".concat(operator), 0, 0);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.interpretLiteral = function (node) {
        return node.value;
    };
    Interpreter.prototype.interpretIdentifier = function (node) {
        var name = node.name;
        var variable = this.lookupVariable(name);
        if (!variable) {
            throw new errors_1.RuntimeError("Variable ".concat(name, " is not defined"));
        }
        return variable.value;
    };
    Interpreter.prototype.interpretCallExpression = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var callee, args;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.interpretNode(node.callee)];
                    case 1:
                        callee = _a.sent();
                        return [4 /*yield*/, Promise.all(node.arguments.map(function (arg) { return _this.interpretNode(arg); }))];
                    case 2:
                        args = _a.sent();
                        // Check if it's a built-in function
                        if (typeof callee === 'function') {
                            return [2 /*return*/, callee.apply(void 0, args)];
                        }
                        // Check if it's a function declaration
                        if (this.isFunctionDeclaration(callee)) {
                            return [2 /*return*/, this.executeUserFunction(callee, args)];
                        }
                        throw new Error("Cannot call non-function value: ".concat(callee));
                }
            });
        });
    };
    Interpreter.prototype.isFunctionDeclaration = function (value) {
        return (value &&
            typeof value === 'object' &&
            'parameters' in value &&
            'body' in value &&
            Array.isArray(value.parameters) &&
            Array.isArray(value.body));
    };
    Interpreter.prototype.executeUserFunction = function (func, args) {
        return __awaiter(this, void 0, void 0, function () {
            var functionEnv, i, paramName, argValue, previousEnv, previousThis, result, _i, _a, statement, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        functionEnv = new types_1.Environment(func.environment || this.environment);
                        // Set up parameters
                        for (i = 0; i < func.parameters.length; i++) {
                            paramName = func.parameters[i];
                            argValue = i < args.length ? args[i] : undefined;
                            functionEnv.variables.set(paramName, {
                                value: argValue,
                                isConstant: false
                            });
                        }
                        previousEnv = this.environment;
                        previousThis = this.thisEnvironment;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        // Set the new environment
                        this.environment = functionEnv;
                        result = null;
                        _i = 0, _a = func.body;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        statement = _a[_i];
                        return [4 /*yield*/, this.interpretNode(statement)];
                    case 3:
                        result = _b.sent();
                        if (statement.type === 'ReturnStatement') {
                            return [3 /*break*/, 5];
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, result];
                    case 6:
                        e_1 = _b.sent();
                        if (e_1 instanceof ReturnValue) {
                            return [2 /*return*/, e_1.value];
                        }
                        throw e_1;
                    case 7:
                        // Restore the previous environment and this context
                        this.environment = previousEnv;
                        this.thisEnvironment = previousThis;
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.interpretPrintStatement = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var values, output;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("INTERPRETING PRINT STATEMENT:", node); // Debug log
                        return [4 /*yield*/, Promise.all(node.expressions.map(function (expr) { return _this.interpretNode(expr); }))];
                    case 1:
                        values = _a.sent();
                        output = values.join(' ');
                        console.log("PRINT STATEMENT VALUE:", output); // Debug log
                        console.log("PUSHING TO OUTPUT:", output); // Debug log
                        this.output.push(output);
                        console.log("OUTPUT ARRAY AFTER PUSH:", this.output); // Debug log
                        return [2 /*return*/, output];
                }
            });
        });
    };
    Interpreter.prototype.interpretReturnStatement = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (node.value === null) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.interpretNode(node.value)];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, value];
                }
            });
        });
    };
    Interpreter.prototype.interpretAssignmentExpression = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var name_1, value, memberExpr, object, value, property_1, _a, property, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(node.left.type === 'Identifier')) return [3 /*break*/, 2];
                        name_1 = node.left.name;
                        return [4 /*yield*/, this.interpretNode(node.right)];
                    case 1:
                        value = _c.sent();
                        this.assignVariable(name_1, value);
                        return [2 /*return*/, value];
                    case 2:
                        if (!(node.left.type === 'MemberExpression')) return [3 /*break*/, 12];
                        memberExpr = node.left;
                        return [4 /*yield*/, this.interpretNode(memberExpr.object)];
                    case 3:
                        object = _c.sent();
                        return [4 /*yield*/, this.interpretNode(node.right)];
                    case 4:
                        value = _c.sent();
                        if (!(object instanceof MemeLangInstance)) return [3 /*break*/, 8];
                        if (!(memberExpr.property.type === 'Identifier')) return [3 /*break*/, 5];
                        _a = memberExpr.property.name;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.interpretNode(memberExpr.property)];
                    case 6:
                        _a = _c.sent();
                        _c.label = 7;
                    case 7:
                        property_1 = _a;
                        object.set(property_1, value);
                        return [2 /*return*/, value];
                    case 8:
                        if (!memberExpr.computed) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.interpretNode(memberExpr.property)];
                    case 9:
                        _b = _c.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        _b = memberExpr.property.name;
                        _c.label = 11;
                    case 11:
                        property = _b;
                        if (object === null || object === undefined) {
                            throw new errors_1.RuntimeError("Cannot set property '".concat(property, "' of ").concat(object));
                        }
                        object[property] = value;
                        return [2 /*return*/, value];
                    case 12: throw new errors_1.RuntimeError('Invalid assignment target');
                }
            });
        });
    };
    Interpreter.prototype.interpretBlockStatement = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var previousEnvironment, _i, _a, statement, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        previousEnvironment = this.environment;
                        this.environment = new types_1.Environment(previousEnvironment);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 6, 7]);
                        _i = 0, _a = node.statements;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        statement = _a[_i];
                        return [4 /*yield*/, this.interpretNode(statement)];
                    case 3:
                        result = _b.sent();
                        if (statement.type === 'ReturnStatement') {
                            return [2 /*return*/, result];
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, null];
                    case 6:
                        this.environment = previousEnvironment;
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.interpretArrayExpression = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var elements;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(node.elements.map(function (element) { return _this.interpretNode(element); }))];
                    case 1:
                        elements = _a.sent();
                        return [2 /*return*/, elements];
                }
            });
        });
    };
    Interpreter.prototype.interpretMemberExpression = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var object, property_2, _a, property_3, property_4, property;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.interpretNode(node.object)];
                    case 1:
                        object = _b.sent();
                        if (!(object instanceof MemeLangInstance)) return [3 /*break*/, 5];
                        if (!(node.property.type === 'Identifier')) return [3 /*break*/, 2];
                        _a = node.property.name;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.interpretNode(node.property)];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        property_2 = _a;
                        return [2 /*return*/, object.get(property_2)];
                    case 5:
                        if (!Array.isArray(object)) return [3 /*break*/, 7];
                        // Handle array length property
                        if (node.property.type === 'Identifier' && node.property.name === 'length') {
                            return [2 /*return*/, object.length];
                        }
                        return [4 /*yield*/, this.interpretNode(node.property)];
                    case 6:
                        property_3 = _b.sent();
                        if (typeof property_3 === 'number') {
                            if (property_3 < 0 || property_3 >= object.length) {
                                throw new errors_1.RuntimeError("Array index out of bounds: ".concat(property_3));
                            }
                            return [2 /*return*/, object[property_3]];
                        }
                        _b.label = 7;
                    case 7:
                        if (!(typeof object !== 'object' || object === null)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.interpretNode(node.property)];
                    case 8:
                        property_4 = _b.sent();
                        throw new errors_1.RuntimeError("Cannot access property '".concat(property_4, "' of non-object"));
                    case 9: return [4 /*yield*/, this.interpretNode(node.property)];
                    case 10:
                        property = _b.sent();
                        return [2 /*return*/, object[property]];
                }
            });
        });
    };
    Interpreter.prototype.interpretClassDeclaration = function (node) {
        var _this = this;
        // Get superclass if it exists
        var superclass = null;
        if (node.superClass) {
            var superclassValue = this.lookupVariable(node.superClass);
            if (!superclassValue || !(superclassValue.value instanceof MemeLangClass)) {
                throw new errors_1.RuntimeError("Superclass ".concat(node.superClass, " must be a class"));
            }
            superclass = superclassValue.value;
        }
        // Process methods
        var methods = new Map();
        node.methods.forEach(function (methodNode) {
            // Convert method to MethodDefinitionNode format
            var methodDefNode = {
                type: 'MethodDefinition',
                key: methodNode.name,
                name: methodNode.name,
                value: methodNode.body,
                kind: methodNode.name === 'constructor' ? 'constructor' : 'method',
                static: false,
                access: methodNode.access || 'public'
            };
            var methodDef = _this.interpretMethodDefinition(methodDefNode);
            methods.set(methodNode.name, methodDef);
        });
        // Create the class
        var klass = new MemeLangClass(node.name, superclass, methods);
        // Add the class to the current environment
        this.environment.define(node.name, klass, true);
        return klass;
    };
    Interpreter.prototype.interpretMethodDefinition = function (node) {
        var _this = this;
        // Convert the FunctionDeclarationNode into a callable function
        var funcDecl = node.value;
        var func = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Create a new environment for the method invocation
            var env = new types_1.Environment(_this.environment);
            // Set up parameters
            if (funcDecl.parameters) {
                for (var i = 0; i < Math.min(funcDecl.parameters.length, args.length); i++) {
                    env.variables.set(funcDecl.parameters[i], { value: args[i], isConstant: false });
                }
            }
            // Save the current environment and interpreter state
            var previousEnv = _this.environment;
            var previousThis = _this.thisEnvironment;
            try {
                // Set the new environment
                _this.environment = env;
                // Execute function body
                var result = null;
                if (funcDecl.body && Array.isArray(funcDecl.body)) {
                    for (var _a = 0, _b = funcDecl.body; _a < _b.length; _a++) {
                        var statement = _b[_a];
                        result = _this.interpretNode(statement);
                        if (statement.type === 'ReturnStatement') {
                            break;
                        }
                    }
                }
                return result;
            }
            finally {
                // Restore the previous environment and this context
                _this.environment = previousEnv;
                _this.thisEnvironment = previousThis;
            }
        };
        return {
            func: func,
            static: node.static,
            access: node.access,
            isConstructor: node.kind === 'constructor'
        };
    };
    Interpreter.prototype.executeBlock = function (statements, environment) {
        var previousEnvironment = this.environment;
        try {
            this.environment = environment;
            var result = null;
            for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
                var statement = statements_1[_i];
                result = this.interpretNode(statement);
            }
            return result;
        }
        finally {
            this.environment = previousEnvironment;
        }
    };
    Interpreter.prototype.createFunction = function (func, params) {
        // Create a wrapper function that maintains the original function's behavior
        var wrappedFunc = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return func.apply(null, args);
        };
        // Add FunctionDeclaration properties without modifying the function's prototype
        var functionProps = {
            name: typeof func.name === 'string' ? func.name : "anonymous",
            parameters: params,
            body: [],
            environment: this.environment
        };
        // Use defineProperties to add non-enumerable properties
        Object.defineProperties(wrappedFunc, {
            parameters: {
                value: functionProps.parameters,
                writable: true,
                enumerable: false
            },
            body: {
                value: functionProps.body,
                writable: true,
                enumerable: false
            },
            environment: {
                value: functionProps.environment,
                writable: true,
                enumerable: false
            }
        });
        return wrappedFunc;
    };
    Interpreter.prototype.evaluate = function (node) {
        return this.interpretNode(node);
    };
    // Find the environment where a variable is defined
    Interpreter.prototype.findEnvironmentForVariable = function (name) {
        var env = this.environment;
        while (env !== null) {
            if (env.variables.has(name)) {
                return env;
            }
            var parent_1 = env.getParent();
            env = parent_1 !== undefined ? parent_1 : null;
        }
        return null;
    };
    Interpreter.prototype.interpretThisExpression = function (node) {
        if (this.thisEnvironment !== null) {
            return this.thisEnvironment;
        }
        throw new errors_1.RuntimeError("Cannot use 'this' outside of a class method. The 'this' keyword is only valid inside class methods.");
    };
    Interpreter.prototype.interpretSuperExpression = function (node) {
        if (this.thisEnvironment === null) {
            throw new errors_1.RuntimeError("Cannot use 'super' outside of a class method.");
        }
        var superclass = this.thisEnvironment.klass.superclass;
        if (superclass === null) {
            throw new errors_1.RuntimeError("Cannot use 'super' in a class with no superclass.");
        }
        return superclass;
    };
    Interpreter.prototype.interpretNewExpression = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var klass, args, instance, previousThis, constructor;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.interpretNode(node.callee)];
                    case 1:
                        klass = _a.sent();
                        if (!(klass instanceof MemeLangClass)) {
                            throw new errors_1.RuntimeError("Cannot use 'new' with non-class value ".concat(klass));
                        }
                        return [4 /*yield*/, Promise.all(node.arguments.map(function (arg) { return _this.interpretNode(arg); }))];
                    case 2:
                        args = _a.sent();
                        instance = new MemeLangInstance(klass, this.environment);
                        previousThis = this.thisEnvironment;
                        this.thisEnvironment = instance;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, , 6, 7]);
                        constructor = klass.findMethod('constructor');
                        if (!constructor) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.callMethod(instance, 'constructor', args)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, instance];
                    case 6:
                        // Restore previous this environment
                        this.thisEnvironment = previousThis;
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.callMethod = function (instance, methodName, args) {
        return __awaiter(this, void 0, void 0, function () {
            var method, methodEnv, previousEnv, previousThis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = instance.klass.findMethod(methodName);
                        if (!method) {
                            throw new errors_1.RuntimeError("Method ".concat(methodName, " not found on class ").concat(instance.klass.name));
                        }
                        methodEnv = new types_1.Environment(this.environment);
                        // Set up this in the method environment
                        methodEnv.variables.set('this', { value: instance, isConstant: true });
                        previousEnv = this.environment;
                        previousThis = this.thisEnvironment;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        // Set the new environment and this context
                        this.environment = methodEnv;
                        this.thisEnvironment = instance;
                        return [4 /*yield*/, method.func.apply(null, args)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        // Restore the previous environment and this context
                        this.environment = previousEnv;
                        this.thisEnvironment = previousThis;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.lookupVariable = function (name) {
        var env = this.environment;
        while (env !== null) {
            var variable = env.variables.get(name);
            if (variable) {
                return variable;
            }
            env = env.parent || null;
        }
        return undefined;
    };
    Interpreter.prototype.assignVariable = function (name, value) {
        var env = this.environment;
        while (env !== null) {
            var variable = env.variables.get(name);
            if (variable) {
                if (variable.isConstant) {
                    throw new errors_1.RuntimeError("Cannot reassign constant variable: ".concat(name));
                }
                env.variables.set(name, { value: value, isConstant: variable.isConstant });
                return;
            }
            env = env.parent || null;
        }
        throw new errors_1.RuntimeError("Variable ".concat(name, " is not defined"));
    };
    Interpreter.prototype.simplifyPath = function (path) {
        var parts = path.split('/').filter(function (part) { return part !== ''; });
        var stack = [];
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            if (part === '..') {
                stack.pop();
            }
            else if (part !== '.') {
                stack.push(part);
            }
        }
        return '/' + stack.join('/');
    };
    Interpreter.prototype.loadModuleFromServer = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/api/modules/".concat(encodeURIComponent(path)))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new errors_1.RuntimeError("Failed to load module: ".concat(path, " (").concat(response.status, ")"));
                        }
                        return [4 /*yield*/, response.text()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        throw new errors_1.RuntimeError("Error loading module: ".concat(error_3 instanceof Error ? error_3.message : String(error_3)));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Interpreter.prototype.interpretImportDeclaration = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var sourcePath, resolvedPath, currentDir, moduleCode, lexer, parser, moduleAst, moduleInterpreter, error_4, moduleExports, _i, _a, specifier, exportedName, localName, exportedValue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sourcePath = node.source.value;
                        resolvedPath = sourcePath;
                        // Handle relative imports
                        if (sourcePath.startsWith('./') || sourcePath.startsWith('../')) {
                            if (this.currentFilePath) {
                                currentDir = this.currentFilePath.includes('/')
                                    ? this.currentFilePath.substring(0, this.currentFilePath.lastIndexOf('/') + 1)
                                    : '';
                                resolvedPath = this.simplifyPath(currentDir + sourcePath);
                            }
                            if (!resolvedPath.endsWith('.ml')) {
                                resolvedPath += '.ml';
                            }
                        }
                        if (!!this.importCache.has(resolvedPath)) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.loadModuleFromServer(resolvedPath)];
                    case 2:
                        moduleCode = _b.sent();
                        lexer = new lexer_1.Lexer(moduleCode);
                        parser = new parser_1.Parser(lexer);
                        moduleAst = parser.parse();
                        moduleInterpreter = new Interpreter();
                        moduleInterpreter.currentFilePath = resolvedPath;
                        return [4 /*yield*/, moduleInterpreter.interpretNode(moduleAst)];
                    case 3:
                        _b.sent();
                        // Store the module's exports
                        this.importCache.set(resolvedPath, moduleInterpreter.environment.exports);
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _b.sent();
                        throw new errors_1.RuntimeError("Error importing module: ".concat(error_4 instanceof Error ? error_4.message : String(error_4)));
                    case 5:
                        moduleExports = this.importCache.get(resolvedPath);
                        if (!moduleExports) {
                            throw new errors_1.RuntimeError("Failed to load module: ".concat(sourcePath));
                        }
                        // Import the specified exports into the current environment
                        for (_i = 0, _a = node.specifiers; _i < _a.length; _i++) {
                            specifier = _a[_i];
                            exportedName = specifier.exported.name;
                            localName = specifier.local.name;
                            exportedValue = moduleExports.get(exportedName);
                            if (exportedValue === undefined) {
                                throw new errors_1.RuntimeError("Export '".concat(exportedName, "' not found in module '").concat(sourcePath, "'"));
                            }
                            // Add the imported value to the current environment
                            this.environment.variables.set(localName, {
                                value: exportedValue,
                                isConstant: true
                            });
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    Interpreter.prototype.interpretExportDeclaration = function (node) {
        // Handle different types of exports
        if (node.declaration) {
            // Export declaration (e.g., export function foo() {})
            var result = this.interpretNode(node.declaration);
            if (node.declaration.type === 'FunctionDeclaration') {
                // Function declarations have string names
                this.environment.exports.set(node.declaration.name, result);
            }
            else if (node.declaration.type === 'VariableDeclaration') {
                // Variable declarations have Token names
                var name_2 = node.declaration.name.lexeme || node.declaration.name.value;
                this.environment.exports.set(name_2, result);
            }
            else if (node.declaration.type === 'ClassDeclaration') {
                // Class declarations have string names
                this.environment.exports.set(node.declaration.name, result);
            }
        }
        else if (node.specifiers) {
            // Named exports (e.g., export { foo, bar })
            for (var _i = 0, _a = node.specifiers; _i < _a.length; _i++) {
                var specifier = _a[_i];
                var localName = specifier.local.name;
                var exportName = specifier.exported.name;
                // Get the value from the current environment
                var value = this.lookupVariable(localName);
                if (!value) {
                    throw new errors_1.RuntimeError("Cannot export undefined variable: ".concat(localName));
                }
                // Add to exports
                this.environment.exports.set(exportName, value.value);
            }
        }
        return null;
    };
    Interpreter.prototype.formatResult = function (result) {
        var _this = this;
        if (result === null || result === undefined) {
            return 'null';
        }
        if (typeof result === 'string') {
            return result;
        }
        if (Array.isArray(result)) {
            return result.map(function (item) { return _this.formatResult(item); });
        }
        if (typeof result === 'object') {
            if (result instanceof MemeLangInstance) {
                return result.toString();
            }
            return JSON.stringify(result, null, 2);
        }
        return String(result);
    };
    return Interpreter;
}());
exports.Interpreter = Interpreter;
