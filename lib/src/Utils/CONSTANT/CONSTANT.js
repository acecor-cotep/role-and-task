"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class is the main CONSTANT that import all child constant files
 */
// Here are import of every child classes locate din ImportedConstant folder
var Root_js_1 = __importDefault(require("./ImportedConstant/Root.js"));
var System_js_1 = __importDefault(require("./ImportedConstant/System.js"));
var ZeroMQ_js_1 = __importDefault(require("./ImportedConstant/ZeroMQ.js"));
/**
 **  Every child classes must be instenciate like this :
 **  superclass => return class extends superclass {}
 **
 ** @example
 ** Here is an array of classes :
 **   [
 **     A,
 **     B,
 **     C,
 **     ROOT,
 **   ] array
 **
 ** This function will return a class like this :
 ** class CONSTANT extends recursiveInterface(array)
 **
 ** Is equivalent to :
 **
 ** class CONSTANT extends(class A extends (class B extends (class C extends (class ROOT))))
 **
 ** For example if B needs to access C methods, B needs to extends C, B needs to be before C in the array
 **
 */
function recursiveInterface(arr, i) {
    if (i === void 0) { i = 0; }
    if (!arr[i]) {
        return /** @class */ (function () {
            function class_1() {
            }
            return class_1;
        }());
    }
    return arr[i](recursiveInterface(arr, i + 1));
}
var CONSTANT = /** @class */ (function (_super) {
    __extends(CONSTANT, _super);
    function CONSTANT() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CONSTANT;
}(recursiveInterface([
    ZeroMQ_js_1.default,
    System_js_1.default,
    // Keep Root at the end, this is the root class for the dependencies
    Root_js_1.default,
])));
exports.default = CONSTANT;
