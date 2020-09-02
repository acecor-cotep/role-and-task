"use strict";
//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import
var Errors_js_1 = __importDefault(require("./Errors.js"));
var Utils_js_1 = __importDefault(require("./Utils.js"));
var CONSTANT_js_1 = __importDefault(require("./CONSTANT/CONSTANT.js"));
/**
 * Define a pattern that can be used to handle function execution errors easily
 */
var PromiseCommandPattern = /** @class */ (function () {
    /**
     *
     * {{
     *   // Function to execute
     *   func: Function,
     *
     *   // Function to call to handle the error
     *   error: Function,
     * }}
     *
     */
    function PromiseCommandPattern(_a) {
        var func = _a.func, error = _a.error;
        this.stackTrace = false;
        // If we have the old system (with asyn execute new code)
        this.funcToExecute = func;
        this.callerFunctionName = Utils_js_1.default.getFunctionName(CONSTANT_js_1.default.NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN);
        this.error = error || false;
    }
    /**
     * Execute the fuinction to execute which is the purpose of PromiseCommandPattern
     */
    PromiseCommandPattern.prototype.executeFunctionToExecute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 1, , 5]);
                        // Classes the user asked for
                        // Functions the users wants to access @example Spread a news
                        return [2 /*return*/, this.funcToExecute.call(null)];
                    case 1:
                        err_1 = _a.sent();
                        error = !Errors_js_1.default.staticIsAnError(err_1) ?
                            new Errors_js_1.default('EUNEXPECTED', String((err_1 && err_1.stack) || err_1), this.callerFunctionName) :
                            err_1;
                        if (!this.error) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.error(error)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw error;
                    case 4: return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Execute the command using async syntax
     */
    PromiseCommandPattern.prototype.executeAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                try {
                    // Execute the function to execute (purpose of PromiseCommandPattern)
                    return [2 /*return*/, this.executeFunctionToExecute()];
                }
                catch (err) {
                    // PARTICULAR CASE TO HANDLE QUIT
                    // PARTICULAR CASE TO HANDLE QUIT
                    if (err === CONSTANT_js_1.default.QUIT) {
                        return [2 /*return*/, err];
                    }
                    error = !Errors_js_1.default.staticIsAnError(err) ?
                        new Errors_js_1.default('EUNEXPECTED', String((err && err.stack) || err), this.callerFunctionName) :
                        err;
                    if (this.stackTrace) {
                        throw Errors_js_1.default.shortcutStackTraceSpecial(error, this.callerFunctionName);
                    }
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    return PromiseCommandPattern;
}());
/**
 * Wrapper used because we cannot call executeAsync into the constructor of PromiseCommandPattern directly, and we want a simple and quick use of it
 */
function PromiseCommandPatternFunc(_a) {
    var func = _a.func, error = _a.error;
    var promiseObj = new PromiseCommandPattern({
        func: func,
        error: error,
    });
    return promiseObj.executeAsync();
}
exports.default = PromiseCommandPatternFunc;
