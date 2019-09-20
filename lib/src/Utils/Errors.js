"use strict";
//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
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
/*
 * This class handle errors in the app
 */
// Includes
var errors_1 = __importDefault(require("@cotep/errors"));
var RoleAndTask_js_1 = __importDefault(require("../RoleAndTask.js"));
var CONSTANT_js_1 = __importDefault(require("./CONSTANT/CONSTANT.js"));
// ----------------------
// To do once
errors_1.default.declareCodes({
    // Special error that say we just want to add some extra stack trace data (but without using new error code)
    ESTACKTRACE: 'Stack Trace',
    // Default error
    E0000: 'No Specified Error',
    // Unexpected error
    EUNEXPECTED: 'Unexpected Error',
    // It's bad, very bad! :()
    OUT_OF_MEMORY: 'Out of memory. Prevent a memory allocation failure',
    // Launching error
    INVALID_LAUNCHING_MODE: 'Invalid launching mode',
    INVALID_LAUNCHING_PARAMETER: 'Invalid launching parameters',
    ERROR_CREATING_FILE_API: 'Impossible ti create the api.json file',
    // Slave Error
    SLAVE_ERROR: 'Slave Error',
    // General catch
    GENERAL_CATCH: 'General Catch',
    // MAINTAINANCE
    MAINTAINANCE: 'Program is in maintainance',
    // Server Error
    E2000: 'Cannot start API server',
    E2001: 'Cannot stop API server',
    E2002: 'Unknown API server at the given port',
    E2003: 'Cannot start OBJ server',
    E2004: 'Cannot stop OBJ server',
    E2005: 'ZeroMQ: Cannot connect the server',
    E2006: 'ZeroMQ: Cannot close the socket',
    E2007: 'ZeroMQ: Cannot bind the server',
    E2008: 'ZeroMQ: Bad socketType for the kind of ZeroMQ implementation you choose',
});
/**
 * Handles errors in application. It contains Error codes and functions to manage them
 */
var Errors = /** @class */ (function (_super) {
    __extends(Errors, _super);
    function Errors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Display the colored error
     * @override
     */
    Errors.prototype.displayColoredError = function () {
        RoleAndTask_js_1.default.getInstance()
            .displayMessage({
            str: this.getColoredErrorString(true) + " - 2",
            tags: [
                CONSTANT_js_1.default.MESSAGE_DISPLAY_TAGS.ERROR,
            ],
        });
    };
    /**
     * Display the recorded error
     * @override
     */
    Errors.prototype.displayError = function () {
        RoleAndTask_js_1.default.getInstance()
            .displayMessage({
            str: (this.getErrorString() + " - 1").red.bold,
            tags: [
                CONSTANT_js_1.default.MESSAGE_DISPLAY_TAGS.ERROR,
            ],
        });
    };
    return Errors;
}(errors_1.default));
exports.default = Errors;
