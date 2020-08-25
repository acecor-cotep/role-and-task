"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var CONSTANT_js_1 = __importDefault(require("../../Utils/CONSTANT/CONSTANT.js"));
/**
 * Define what a Task is
 *
 * A Task is a job PROGRAM have to perform (For example, Log, ServerAPI, Calcul... are all tasks)
 * @interface
 */
var ATask = /** @class */ (function () {
    function ATask() {
        this.role = false;
        this.name = CONSTANT_js_1.default.DEFAULT_TASK.ABSTRACT_TASK.name;
        this.id = CONSTANT_js_1.default.DEFAULT_TASK.ABSTRACT_TASK.id;
        this.active = false;
    }
    /**
     * Is the Task active?
     */
    ATask.prototype.isActive = function () {
        return this.active;
    };
    /**
     * Get some infos from the task
     */
    ATask.prototype.gatherInfosFromTask = function () {
        return new Promise(function (resolve) { return resolve({}); });
    };
    ATask.prototype.buildHeadBodyMessage = function (head, body) {
        var _a;
        return JSON.stringify((_a = {},
            _a[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.HEAD] = head,
            _a[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.BODY] = body,
            _a));
    };
    return ATask;
}());
exports.default = ATask;
