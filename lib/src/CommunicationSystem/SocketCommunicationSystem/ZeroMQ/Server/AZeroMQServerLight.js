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
var zmq_1 = __importDefault(require("zmq"));
var CONSTANT_js_1 = __importDefault(require("../../../../Utils/CONSTANT/CONSTANT.js"));
var AZeroMQ_js_1 = __importDefault(require("../AZeroMQ.js"));
var Utils_js_1 = __importDefault(require("../../../../Utils/Utils.js"));
var Errors_js_1 = __importDefault(require("../../../../Utils/Errors.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../../../Utils/PromiseCommandPattern.js"));
/**
 * Server used when you have Unidirectionnal server (like PULL)
 */
var AZeroMQServerLight = /** @class */ (function (_super) {
    __extends(AZeroMQServerLight, _super);
    function AZeroMQServerLight() {
        var _this = _super.call(this) || this;
        // Mode we are running in
        _this.mode = CONSTANT_js_1.default.ZERO_MQ.MODE.SERVER;
        return _this;
    }
    AZeroMQServerLight.prototype.startServer = function (_a) {
        var _this = this;
        var _b = _a.ipServer, ipServer = _b === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _b, _c = _a.portServer, portServer = _c === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _c, _d = _a.socketType, socketType = _d === void 0 ? CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_PULL : _d, _e = _a.transport, transport = _e === void 0 ? CONSTANT_js_1.default.ZERO_MQ.TRANSPORT.TCP : _e, _f = _a.identityPrefix, identityPrefix = _f === void 0 ? CONSTANT_js_1.default.ZERO_MQ.SERVER_IDENTITY_PREFIX : _f;
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                // If the server is already up
                if (_this.active)
                    return resolve(_this.socket);
                // Check the socket Type
                var check = [
                    CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_PULL,
                ].some(function (x) { return x === socketType; });
                if (!check)
                    return reject(new Errors_js_1.default('E2008', "socketType: " + socketType));
                // Create the server socket
                _this.socket = zmq_1.default.socket(socketType);
                // Set an identity to the server
                _this.socket.identity = identityPrefix + "_" + process.pid;
                // Start the monitor that will listen to socket news
                _this.startMonitor();
                // Bind the server to a port
                return _this.socket.bind(transport + "://" + ipServer + ":" + portServer, function (err) {
                    if (err) {
                        // Log something
                        console.error("Server ZeroMQ Bind Failed. Transport=" + transport + " Port=" + portServer + " IP:" + ipServer);
                        // Stop the monitoring
                        _this.stopMonitor();
                        // Remove the socket
                        delete _this.socket;
                        _this.socket = false;
                        _this.active = false;
                        // Return an error
                        return reject(new Errors_js_1.default('E2007', "Specific: " + err));
                    }
                    // Start to handle client messages
                    _this.treatMessageFromClient();
                    _this.active = true;
                    // We successfuly bind the server
                    return resolve(_this.socket);
                });
            }); },
        });
    };
    AZeroMQServerLight.prototype.stopServer = function () {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                // If the server is already down
                if (!_this.active)
                    return resolve();
                // Listen to the closure of the socket
                _this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.CLOSE, function () {
                    // Successfuly close
                    // Stop the monitoring
                    _this.stopMonitor();
                    // Delete the socket
                    delete _this.socket;
                    _this.socket = false;
                    _this.active = false;
                    return resolve();
                });
                // Error in closure
                _this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.CLOSE_ERROR, function (err, ep) {
                    return reject(new Errors_js_1.default('E2006', "Endpoint: " + String(err) + " - " + ep));
                });
                // Ask for closure
                return _this.socket.close();
            }); },
        });
    };
    /**
     * Treat messages that comes from clients
     * send them to the listeners
     */
    AZeroMQServerLight.prototype.treatMessageFromClient = function () {
        var _this = this;
        this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, function (msg) {
            var dataString = String(msg);
            Utils_js_1.default.fireUp(_this.incomingMessageListeningFunction, [dataString]);
        });
    };
    return AZeroMQServerLight;
}(AZeroMQ_js_1.default));
exports.default = AZeroMQServerLight;
