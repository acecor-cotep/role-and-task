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
var PromiseCommandPattern_js_1 = __importDefault(require("../../../../Utils/PromiseCommandPattern.js"));
var Errors_js_1 = __importDefault(require("../../../../Utils/Errors.js"));
/**
 * Client to use when you have an unidirectionnal connection - exemple socketType = Push
 */
var AZeroMQClientLight = /** @class */ (function (_super) {
    __extends(AZeroMQClientLight, _super);
    function AZeroMQClientLight() {
        var _this = _super.call(this) || this;
        // Mode we are running in
        _this.mode = CONSTANT_js_1.default.ZERO_MQ.MODE.CLIENT;
        return _this;
    }
    /**
     * Start a ZeroMQ Client
     * @param {{ipServer: String, portServer: String, socketType: String, transport: String, identityPrefix: String}} args
     */
    AZeroMQClientLight.prototype.startClient = function (_a) {
        var _this = this;
        var _b = _a.ipServer, ipServer = _b === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _b, _c = _a.portServer, portServer = _c === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _c, _d = _a.socketType, socketType = _d === void 0 ? CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER : _d, _e = _a.transport, transport = _e === void 0 ? CONSTANT_js_1.default.ZERO_MQ.TRANSPORT.TCP : _e, _f = _a.identityPrefix, identityPrefix = _f === void 0 ? CONSTANT_js_1.default.ZERO_MQ.CLIENT_IDENTITY_PREFIX : _f;
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                // If the client is already up
                if (_this.active)
                    return resolve();
                // Create the client socket
                _this.socket = zmq_1.default.socket(socketType);
                // Set an identity to the client
                _this.socket.identity = identityPrefix + "_" + process.pid;
                // Set a timeout to the connection
                var timeoutConnect = setTimeout(function () {
                    // Stop the monitoring
                    _this.socket.unmonitor();
                    // Remove the socket
                    delete _this.socket;
                    _this.socket = false;
                    _this.active = false;
                    // Return an error
                    return reject(new Errors_js_1.default('E2005'));
                }, CONSTANT_js_1.default.ZERO_MQ.FIRST_CONNECTION_TIMEOUT);
                // Wait the accept of the socket to the server
                // We successfuly get connected
                _this.socket.once(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.CONNECT, function () {
                    // Clear the connection timeout
                    clearTimeout(timeoutConnect);
                    _this.active = true;
                    return resolve(_this.socket);
                });
                // Start the monitor that will listen to socket news
                _this.startMonitor();
                // Connection to the server
                return _this.socket.connect(transport + "://" + ipServer + ":" + portServer);
            }); },
        });
    };
    /**
     * Stop a ZeroMQ Client
     */
    AZeroMQClientLight.prototype.stopClient = function () {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve) {
                // If the client is already down
                if (!_this.active)
                    return resolve();
                // Stop the monitoring
                _this.stopMonitor();
                // Ask for closure
                _this.socket.close();
                // Delete the socket
                delete _this.socket;
                _this.socket = false;
                _this.active = false;
                return resolve();
            }); },
        });
    };
    /**
     * Setup a function that is calleed when socket get connected
     */
    AZeroMQClientLight.prototype.listenConnectEvent = function (func) {
        if (!this.active)
            return;
        this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.CONNECT, func);
    };
    /**
     * Setup a function that is calleed when socket get disconnected
     */
    AZeroMQClientLight.prototype.listenDisconnectEvent = function (func) {
        if (!this.active)
            return;
        this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.DISCONNECT, func);
    };
    AZeroMQClientLight.prototype.sendMessageToServer = function (message) {
        if (this.socket && this.active)
            this.socket.send(message);
    };
    return AZeroMQClientLight;
}(AZeroMQ_js_1.default));
exports.default = AZeroMQClientLight;
