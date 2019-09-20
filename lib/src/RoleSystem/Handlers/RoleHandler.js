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
var AHandler_js_1 = __importDefault(require("./AHandler.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../Utils/PromiseCommandPattern.js"));
/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
var RoleHandler = /** @class */ (function (_super) {
    __extends(RoleHandler, _super);
    function RoleHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Start the given role
     */
    RoleHandler.prototype.startRole = function (idRole, args) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.startSomething(idRole, args); },
        });
    };
    /**
     * Stop the given role
     */
    RoleHandler.prototype.stopRole = function (idRole, args) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.stopSomething(idRole, args); },
        });
    };
    /**
     * Stop all the running roles
     */
    RoleHandler.prototype.stopAllRole = function (args) {
        var _this = this;
        if (args === void 0) { args = []; }
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.stopAllSomething(args); },
        });
    };
    /**
     * Get a list of running role status (active or not)
     */
    RoleHandler.prototype.getRoleListStatus = function () {
        return this.getSomethingListStatus();
    };
    /**
     * Get a role
     */
    RoleHandler.prototype.getRole = function (idRole) {
        return this.getSomething(idRole);
    };
    return RoleHandler;
}(AHandler_js_1.default));
exports.default = RoleHandler;
