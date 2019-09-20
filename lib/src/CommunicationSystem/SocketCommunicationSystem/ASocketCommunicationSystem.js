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
 * This abstract class described what a socket communication system class must offer
 */
var ASocketCommunicationSystem = /** @class */ (function () {
    function ASocketCommunicationSystem() {
        // Setup a name
        this.name = CONSTANT_js_1.default.SOCKET_COMMUNICATION_SYSTEM.ABSTRACT_SOCKET_COMMUNICATION_SYSTEM;
        // Say the communication system is not active
        this.active = false;
        // Function that get called when a new message get received
        this.incomingMessageListeningFunction = [];
    }
    /**
     * Getter
     * @return {String}
     */
    ASocketCommunicationSystem.prototype.getName = function () {
        return this.name;
    };
    /**
     * Setter
     * @param {String} name
     */
    ASocketCommunicationSystem.prototype.setName = function (name) {
        this.name = name;
    };
    /**
     * Is the communication sytem active?
     * @return {Boolean}
     */
    ASocketCommunicationSystem.prototype.isActive = function () {
        return this.active;
    };
    /**
     * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
     * @param {Function} func
     * @param {Object} context
     */
    ASocketCommunicationSystem.prototype.listenToIncomingMessage = function (func, context) {
        this.incomingMessageListeningFunction.push({
            func: func,
            context: context,
        });
    };
    /**
     * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
     * @param {Function} func
     */
    ASocketCommunicationSystem.prototype.unlistenToIncomingMessage = function (func) {
        this.incomingMessageListeningFunction = this.incomingMessageListeningFunction.filter(function (x) { return x.func !== func; });
    };
    return ASocketCommunicationSystem;
}());
exports.default = ASocketCommunicationSystem;
