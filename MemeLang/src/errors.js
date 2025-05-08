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
exports.__esModule = true;
exports.SyntaxError = exports.TypeError = exports.RuntimeError = exports.CompileError = void 0;
var custom_error_messages_1 = require("./custom-error-messages");
var CompileError = /** @class */ (function (_super) {
    __extends(CompileError, _super);
    function CompileError(message, line, column) {
        var _this = 
        // Apply meme-enhanced message
        _super.call(this, "".concat(message)) || this;
        _this.line = line;
        _this.column = column;
        _this.name = 'CompileError';
        return _this;
    }
    CompileError.prototype.toString = function () {
        // Apply enhanced error message with meme
        return custom_error_messages_1.enhanceErrorMessage(this);
    };
    return CompileError;
}(Error));
exports.CompileError = CompileError;
var RuntimeError = /** @class */ (function (_super) {
    __extends(RuntimeError, _super);
    function RuntimeError(message, line, column) {
        var _this = 
        // Apply meme-enhanced message
        _super.call(this, "".concat(message)) || this;
        _this.line = line;
        _this.column = column;
        _this.name = 'RuntimeError';
        return _this;
    }
    RuntimeError.prototype.toString = function () {
        // Apply enhanced error message with meme
        return custom_error_messages_1.enhanceErrorMessage(this);
    };
    return RuntimeError;
}(Error));
exports.RuntimeError = RuntimeError;
var TypeError = /** @class */ (function (_super) {
    __extends(TypeError, _super);
    function TypeError(message, line, column) {
        var _this = 
        // Apply meme-enhanced message
        _super.call(this, "Type Error: ".concat(message)) || this;
        _this.line = line;
        _this.column = column;
        _this.name = 'TypeError';
        // Ensure line and column are accessible
        if (line !== undefined)
            _this.line = line;
        if (column !== undefined)
            _this.column = column;
        return _this;
    }
    TypeError.prototype.toString = function () {
        // Apply enhanced error message with meme
        return custom_error_messages_1.enhanceErrorMessage(this);
    };
    return TypeError;
}(Error));
exports.TypeError = TypeError;
var SyntaxError = /** @class */ (function (_super) {
    __extends(SyntaxError, _super);
    function SyntaxError(message, line, column) {
        var _this = 
        // Apply meme-enhanced message
        _super.call(this, "Syntax Error: ".concat(message)) || this;
        _this.line = line;
        _this.column = column;
        _this.name = 'SyntaxError';
        // Ensure line and column are accessible
        if (line !== undefined)
            _this.line = line;
        if (column !== undefined)
            _this.column = column;
        return _this;
    }
    SyntaxError.prototype.toString = function () {
        // Apply enhanced error message with meme
        return custom_error_messages_1.enhanceErrorMessage(this);
    };
    return SyntaxError;
}(Error));
exports.SyntaxError = SyntaxError;
// Function to get a random meme error suffix - keeping for reference but no longer used
function getRandomMemeErrorSuffix() {
    var memeSuffixes = [
        "Ye kya kar diya tune bhai?",
        "Aise kaise chalega?",
        "Kuch toh gadbad hai Daya!",
        "Rasode mein kaun tha? Error tha!",
        "Bade harami ho beta tum!",
        "Error 404: Logic not found!",
        "Abey Saale!",
        "Dekh ke coding kar, andha hai kya?",
        "Ye toh hona hi tha!",
        "Aap chronology samajhiye!",
        "Itni galti kaise kar di tune?",
        "Thoda dhyan kidhar hai bhai?",
        "Ye error nahi hai, ye emotion hai!",
        "Kehna kya chahte ho?",
        "Jor jor se bolke sabko scheme bata de!",
        "Pappu pass ho gaya!",
        "Babu bhaiya, yeh galat hai!",
        "Abba dabba jabba!",
        "Utha le re baba, utha le!",
        "Control Uday, control!", // Control yourself Uday! (Welcome reference)
    ];
    return memeSuffixes[Math.floor(Math.random() * memeSuffixes.length)];
}
