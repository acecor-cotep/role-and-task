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
var AZeroMQ = /** @class */ (function (_super) {
    __extends(AZeroMQ, _super);
    function AZeroMQ() {
        var _this = _super.call(this) || this;
        // Name of the protocol of communication
        _this.name = CONSTANT_js_1.default.SOCKET_COMMUNICATION_SYSTEM.ZEROMQ;
        // Mode we are running in (Server or Client)
        _this.mode = false;
        // Socket
        _this.socket = null;
        // Store a ptr to monitor restart timeout
        _this.monitorTimeout = false;
        return _this;
    }
    /**
     * Return an object that can be used to act the communication system
     * @override
     */
    AZeroMQ.prototype.getSocket = function () {
        return this.socket;
    };
    /**
     * Stop the monitor
     */
    AZeroMQ.prototype.stopMonitor = function () {
        if (this.monitorTimeout) {
            clearTimeout(this.monitorTimeout);
        }
        this.monitorTimeout = false;
        if (this.socket) {
            this.socket.unmonitor();
        }
    };
    /**
     * Start the monitor that will listen to socket news
     * Check for events every 500ms and get all available events.
     */
    AZeroMQ.prototype.startMonitor = function () {
        var _this = this;
        if (!this.socket) {
            return;
        }
        // Handle monitor error
        this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.MONITOR_ERROR, function () {
            if (_this.socket) {
                // Restart the monitor if it fail
                _this.monitorTimeout = setTimeout(function () {
                    if (_this.socket) {
                        _this.socket.monitor(CONSTANT_js_1.default.ZERO_MQ.MONITOR_TIME_CHECK, 0);
                    }
                }, CONSTANT_js_1.default.ZERO_MQ.MONITOR_RELAUNCH_TIME);
            }
        });
        // Call monitor, check for events every 50ms and get all available events.
        this.socket.monitor(CONSTANT_js_1.default.ZERO_MQ.MONITOR_TIME_CHECK, 0);
    };
    return AZeroMQ;
}(ASocketCommunicationSystem_js_1.default));
exports.default = AZeroMQ;
