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
/**
 * Client to use when you have an Bidirectionnal connection - exemple socketType = DEALER
 * This class include custom KeepAlive
 */
var AZeroMQClient = /** @class */ (function (_super) {
    __extends(AZeroMQClient, _super);
    function AZeroMQClient(keepAliveTime) {
        if (keepAliveTime === void 0) { keepAliveTime = CONSTANT_js_1.default.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME; }
        var _this = _super.call(this) || this;
        _this.timeoutAlive = null;
        // Mode we are running in
        _this.mode = CONSTANT_js_1.default.ZERO_MQ.MODE.CLIENT;
        // Maximal time between messages (if you pass that time between two message, the server will probably say your disconnected)
        _this.keepAliveTime = keepAliveTime;
        // Last time the client sent something to the server
        _this.lastMessageSent = false;
        return _this;
    }
    /**
     * Start a ZeroMQ Client
     */
    AZeroMQClient.prototype.startClient = function (_a) {
        var _this = this;
        var _b = _a.ipServer, ipServer = _b === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _b, _c = _a.portServer, portServer = _c === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _c, _d = _a.socketType, socketType = _d === void 0 ? CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER : _d, _e = _a.transport, transport = _e === void 0 ? CONSTANT_js_1.default.ZERO_MQ.TRANSPORT.TCP : _e, _f = _a.identityPrefix, identityPrefix = _f === void 0 ? CONSTANT_js_1.default.ZERO_MQ.CLIENT_IDENTITY_PREFIX : _f;
        return new Promise(function (resolve, reject) {
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
                _this.socket = null;
                _this.active = false;
                // Return an error
                return reject(new Errors_js_1.default('E2005'));
            }, CONSTANT_js_1.default.ZERO_MQ.FIRST_CONNECTION_TIMEOUT);
            // Wait the accept of the socket to the server
            // We successfuly get connected
            _this.socket.once(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.CONNECT, function () {
                // Clear the connection timeout
                clearTimeout(timeoutConnect);
                // Set the last time message we sent a message as now
                _this.lastMessageSent = Date.now();
                _this.active = true;
                // Treat messages that comes from the server
                _this.treatMessageFromServer();
                // First message to send to be declared on the server
                _this.clientSayHelloToServer();
                // Send messages every x ms for the server to know you are alive
                _this.clientSayHeIsAlive();
                return resolve(_this.socket);
            });
            // Start the monitor that will listen to socket news
            _this.startMonitor();
            // Connection to the server
            return _this.socket.connect(transport + "://" + ipServer + ":" + portServer);
        });
    };
    /**
     * Stop a ZeroMQ Client
     */
    AZeroMQClient.prototype.stopClient = function () {
        var _this = this;
        return new Promise(function (resolve) {
            // If the client is already down
            if (!_this.active || !_this.socket) {
                return resolve();
            }
            // Stop the monitoring
            _this.stopMonitor();
            // Ask for closure
            _this.socket.close();
            // Delete the socket
            delete _this.socket;
            _this.socket = null;
            _this.active = false;
            // Stop the keepAliveTime
            if (_this.timeoutAlive) {
                clearTimeout(_this.timeoutAlive);
            }
            return resolve();
        });
    };
    /**
     * Setup a function that is calleed when socket get connected
     */
    AZeroMQClient.prototype.listenConnectEvent = function (func) {
        var _a;
        if (!this.active)
            return;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.CONNECT, func);
    };
    /**
     * Setup a function that is calleed when socket get disconnected
     */
    AZeroMQClient.prototype.listenDisconnectEvent = function (func) {
        var _a;
        if (!this.active)
            return;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.DISCONNECT, func);
    };
    /**
     * Send a message to the server
     */
    AZeroMQClient.prototype.sendMessageToServer = function (message) {
        if (this.socket && this.active) {
            this.socket.send(message);
        }
    };
    /**
     * Treat messages that comes from server
     */
    AZeroMQClient.prototype.treatMessageFromServer = function () {
        var _this = this;
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, function (data) {
            var dataString = String(data);
            var ret = [{
                    //
                    //
                    // Here we treat special strings
                    //
                    //
                    keyStr: CONSTANT_js_1.default.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER,
                    func: function () {
                        // Call the stop
                        _this.stop();
                    },
                }].some(function (x) {
                if (x.keyStr === dataString) {
                    x.func();
                    return true;
                }
                return false;
            });
            // If the user have a function to deal with incoming messages
            if (!ret)
                Utils_js_1.default.fireUp(_this.incomingMessageListeningFunction, [dataString]);
        });
    };
    /**
     * First message to send to the server to be regristered into it
     */
    AZeroMQClient.prototype.clientSayHelloToServer = function () {
        this.sendMessageToServer(CONSTANT_js_1.default.ZERO_MQ.CLIENT_MESSAGE.HELLO);
    };
    /**
     * Say to the server that you are alive
     */
    AZeroMQClient.prototype.clientSayHeIsAlive = function () {
        var _this = this;
        // Send a message to the server, to him know that you are alive
        this.timeoutAlive = setTimeout(function () {
            // If the communication is not active anymore
            if (!_this.active)
                return;
            // Set the last time message we sent a message as now
            _this.lastMessageSent = Date.now();
            // Send a message to the server
            _this.sendMessageToServer(CONSTANT_js_1.default.ZERO_MQ.CLIENT_MESSAGE.ALIVE);
            // Call again
            _this.clientSayHeIsAlive();
        }, this.keepAliveTime);
    };
    return AZeroMQClient;
}(AZeroMQ_js_1.default));
exports.default = AZeroMQClient;
