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
// Imports
var ARole_js_1 = __importDefault(require("../ARole.js"));
var CONSTANT_js_1 = __importDefault(require("../../../Utils/CONSTANT/CONSTANT.js"));
/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 *
 * @interface
 */
var ASlave = /** @class */ (function (_super) {
    __extends(ASlave, _super);
    function ASlave() {
        var _this = _super.call(this) || this;
        _this.name = CONSTANT_js_1.default.DEFAULT_ROLES.ABSTRACT_SLAVE_ROLE.name;
        _this.id = CONSTANT_js_1.default.DEFAULT_ROLES.ABSTRACT_SLAVE_ROLE.id;
        return _this;
    }
    return ASlave;
}(ARole_js_1.default));
exports.default = ASlave;
