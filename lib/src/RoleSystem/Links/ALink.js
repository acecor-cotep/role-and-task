"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CONSTANT_js_1 = __importDefault(require("../../Utils/CONSTANT/CONSTANT.js"));
/**
 * Define the pattern of a link between two tasks
 */
var ALink = /** @class */ (function () {
    function ALink() {
    }
    /**
     * Build an head/body pattern message
     */
    ALink.prototype.buildHeadBodyMessage = function (head, body) {
        var _a;
        return JSON.stringify((_a = {},
            _a[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.HEAD] = head,
            _a[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.BODY] = body,
            _a));
    };
    return ALink;
}());
exports.default = ALink;
