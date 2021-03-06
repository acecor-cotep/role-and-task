"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CONSTANT_js_1 = __importDefault(require("../../Utils/CONSTANT/CONSTANT.js"));
var ASocketCommunicationSystem = /** @class */ (function () {
    function ASocketCommunicationSystem() {
        this.name = CONSTANT_js_1.default.SOCKET_COMMUNICATION_SYSTEM.ABSTRACT_SOCKET_COMMUNICATION_SYSTEM;
        this.active = false;
        this.incomingMessageListeningFunction = [];
    }
    ASocketCommunicationSystem.prototype.getName = function () {
        return this.name;
    };
    ASocketCommunicationSystem.prototype.setName = function (name) {
        this.name = name;
    };
    ASocketCommunicationSystem.prototype.isActive = function () {
        return this.active;
    };
    /**
     * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
     */
    ASocketCommunicationSystem.prototype.listenToIncomingMessage = function (func, context) {
        this.incomingMessageListeningFunction.push({
            func: func,
            context: context,
        });
    };
    /**
     * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
     */
    ASocketCommunicationSystem.prototype.unlistenToIncomingMessage = function (func) {
        this.incomingMessageListeningFunction = this.incomingMessageListeningFunction.filter(function (x) { return x.func !== func; });
    };
    return ASocketCommunicationSystem;
}());
exports.default = ASocketCommunicationSystem;
