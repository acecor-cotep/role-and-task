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
var CONSTANT_js_1 = __importDefault(require("../../../Utils/CONSTANT/CONSTANT.js"));
var ASocketCommunicationSystem_js_1 = __importDefault(require("../ASocketCommunicationSystem.js"));
// With T the zeromq socket type
var AZeroMQ = /** @class */ (function (_super) {
    __extends(AZeroMQ, _super);
    function AZeroMQ() {
        var _this = _super.call(this) || this;
        // Name of the protocol of communication
        _this.name = CONSTANT_js_1.default.SOCKET_COMMUNICATION_SYSTEM.ZEROMQ;
        // Mode we are running in (Server or Client)
        _this.mode = false;
        // Socket
        _this.zmqObject = null;
        return _this;
    }
    /**
     * Return an object that can be used to act the communication system
     * @override
     */
    AZeroMQ.prototype.getSocket = function () {
        return this.zmqObject;
    };
    return AZeroMQ;
}(ASocketCommunicationSystem_js_1.default));
exports.default = AZeroMQ;
