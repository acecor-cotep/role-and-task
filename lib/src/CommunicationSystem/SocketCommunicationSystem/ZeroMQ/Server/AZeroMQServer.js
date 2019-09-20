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
var zeromq_1 = __importDefault(require("zeromq"));
var CONSTANT_js_1 = __importDefault(require("../../../../Utils/CONSTANT/CONSTANT.js"));
var AZeroMQ_js_1 = __importDefault(require("../AZeroMQ.js"));
var Utils_js_1 = __importDefault(require("../../../../Utils/Utils.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../../../Utils/PromiseCommandPattern.js"));
var Errors_js_1 = __importDefault(require("../../../../Utils/Errors.js"));
/**
 * Server used when you have Bidirectionnal server (like ROUTER)
 */
var AZeroMQServer = /** @class */ (function (_super) {
    __extends(AZeroMQServer, _super);
    function AZeroMQServer() {
        var _this = _super.call(this) || this;
        // Mode we are running in
        _this.mode = CONSTANT_js_1.default.ZERO_MQ.MODE.SERVER;
        // List of server client
        _this.clientList = [];
        // Infos about server options
        _this.infosServer = false;
        // Function to deal with the incoming regular messages
        _this.newConnectionListeningFunction = [];
        _this.newDisconnectionListeningFunction = [];
        return _this;
    }
    /**
     * Get infos from the server -> ip/port ...etc
     */
    AZeroMQServer.prototype.getInfosServer = function () {
        return this.infosServer;
    };
    /**
     * Return the list of connected clients
     * @return {Array}
     */
    AZeroMQServer.prototype.getConnectedClientList = function () {
        return this.clientList.map(function (x) { return x.clientIdentityString; });
    };
    /**
     * Start a ZeroMQ Server
     */
    AZeroMQServer.prototype.startServer = function (_a) {
        var _this = this;
        var _b = _a.ipServer, ipServer = _b === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _b, _c = _a.portServer, portServer = _c === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _c, _d = _a.socketType, socketType = _d === void 0 ? CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER : _d, _e = _a.transport, transport = _e === void 0 ? CONSTANT_js_1.default.ZERO_MQ.TRANSPORT.TCP : _e, _f = _a.identityPrefix, identityPrefix = _f === void 0 ? CONSTANT_js_1.default.ZERO_MQ.SERVER_IDENTITY_PREFIX : _f;
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                // If the server is already up
                if (_this.active)
                    return resolve(_this.socket);
                // Check the socket Type
                var check = [
                    CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER,
                    CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER,
                ].some(function (x) { return x === socketType; });
                if (!check)
                    return reject(new Errors_js_1.default('E2008', "socketType: " + socketType));
                // Create the server socket
                _this.socket = zeromq_1.default.socket(socketType);
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
                    _this.infosServer = {
                        ipServer: ipServer,
                        portServer: portServer,
                        socketType: socketType,
                        transport: transport,
                        identityPrefix: identityPrefix,
                    };
                    _this.active = true;
                    // We successfuly bind the server
                    return resolve(_this.socket);
                });
            }); },
        });
    };
    /**
     * Stop a ZeroMQ Server
     */
    AZeroMQServer.prototype.stopServer = function () {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                // If the server is already down
                if (!_this.active) {
                    return resolve();
                }
                // Listen to the closure of the socket
                _this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.CLOSE, function () {
                    // Successfuly close
                    // Stop the monitoring
                    _this.stopMonitor();
                    // Delete the socket
                    delete _this.socket;
                    _this.socket = false;
                    _this.active = false;
                    // Empty the clientList
                    _this.clientList = [];
                    _this.infosServer = false;
                    return resolve();
                });
                // Error in closure
                _this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.CLOSE_ERROR, function (err, ep) { return reject(new Errors_js_1.default('E2006', "Endpoint: " + String(err) + " " + ep)); });
                // Ask for closure
                return _this.socket.close();
            }); },
        });
    };
    /**
     * Setup a function that is called when a new client get connected
     * @param {Function} func
     */
    AZeroMQServer.prototype.listenNewConnectedClientEvent = function (func) {
        if (!this.active)
            return;
        this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.ACCEPT, func);
    };
    /**
     * Send a message to every connected client
     * @param {String} message
     */
    AZeroMQServer.prototype.sendBroadcastMessage = function (message) {
        var _this = this;
        this.clientList.forEach(function (x) { return _this.sendMessageToClient(x.clientIdentityByte, x.clientIdentityString, message); });
    };
    /**
     * Close a connection to a client
     */
    AZeroMQServer.prototype.closeConnectionToClient = function (clientIdentityByte, clientIdentityString) {
        this.sendMessageToClient(clientIdentityByte, clientIdentityString, CONSTANT_js_1.default.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER);
        // Remove the client data from the array
        this.removeClientToServer(clientIdentityByte, clientIdentityString);
    };
    /**
     * Disconnect a user because we have got no proof of life from it since too long
     * long defined by CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE
     */
    AZeroMQServer.prototype.disconnectClientDueToTimeoutNoProofOfLive = function (clientIdentityByte, clientIdentityString) {
        // Send a bye message to the client, in case he's coming back
        this.closeConnectionToClient(clientIdentityByte, clientIdentityString);
    };
    /**
     * Handle a new connection of client to the server
     * (Store it into a list that will be useful create clientConnection/clientDisconnection event)
     */
    AZeroMQServer.prototype.handleNewClientToServer = function (clientIdentityByte, clientIdentityString) {
        // We put the client into a list of connected client
        var exist = this.clientList.some(function (x) { return x.clientIdentityString === clientIdentityString; });
        if (!exist) {
            this.clientList.push({
                clientIdentityString: clientIdentityString,
                clientIdentityByte: clientIdentityByte,
                timeoutAlive: false,
            });
            Utils_js_1.default.fireUp(this.newConnectionListeningFunction, [
                clientIdentityByte,
                clientIdentityString,
            ]);
        }
        // Call a function that will disconnected the client from the server is he sent nothing
        // in a pre-defined period
        this.timeoutClientConnection(clientIdentityByte, clientIdentityString);
    };
    /**
     * Function that is executed to handle client timeout
     * Not proof of life from too long
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */
    AZeroMQServer.prototype.timeoutClientConnection = function (clientIdentityByte, clientIdentityString) {
        var _this = this;
        // Function execution
        var timeout = function () {
            // Disconnect the user to the server
            _this.disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte, clientIdentityString);
        };
        this.clientList.some(function (x, xi) {
            if (x.clientIdentityString === clientIdentityString) {
                // If we had a pre-existing timeout, relaunch it
                if (_this.clientList[xi].timeoutAlive)
                    clearTimeout(_this.clientList[xi].timeoutAlive);
                // Create a timeout
                _this.clientList[xi].timeoutAlive = setTimeout(function () { return timeout(); }, CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);
                return true;
            }
            return false;
        });
    };
    AZeroMQServer.prototype.sendMessageToClient = function (_, clientIdentityString, message) {
        if (this.socket && this.active) {
            this.socket.send([
                clientIdentityString,
                message,
            ]);
        }
    };
    /**
     * We know that the specified client is alive (he sent something to us)
     */
    AZeroMQServer.prototype.handleAliveInformationFromSpecifiedClient = function (clientIdentityByte, clientIdentityString) {
        var _this = this;
        this.clientList.some(function (x) {
            if (clientIdentityString === x.clientIdentityString) {
                // Handle the user timeout
                _this.timeoutClientConnection(clientIdentityByte, clientIdentityString);
                return true;
            }
            return false;
        });
    };
    /**
     * Remove a client from the clientList array
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */
    AZeroMQServer.prototype.removeClientToServer = function (clientIdentityByte, clientIdentityString) {
        this.clientList = this.clientList.filter(function (x) { return x.clientIdentityString !== clientIdentityString; });
        Utils_js_1.default.fireUp(this.newDisconnectionListeningFunction, [
            clientIdentityByte,
            clientIdentityString,
        ]);
    };
    /**
     * Treat messages that comes from clients
     */
    AZeroMQServer.prototype.treatMessageFromClient = function () {
        var _this = this;
        this.socket.on(CONSTANT_js_1.default.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, function (clientIdentityByte, data) {
            var dataString = String(data);
            var clientIdentityString = String(clientIdentityByte);
            var ret = [
                //
                //
                // Here we treat special strings
                //
                //
                {
                    keyStr: CONSTANT_js_1.default.ZERO_MQ.CLIENT_MESSAGE.ALIVE,
                    func: function () {
                        // We got a keepAlive message from client
                        // We got something from the client we know he's not disconnected
                        _this.handleAliveInformationFromSpecifiedClient(clientIdentityByte, clientIdentityString);
                    },
                }, {
                    keyStr: CONSTANT_js_1.default.ZERO_MQ.CLIENT_MESSAGE.HELLO,
                    func: function () { return _this.handleNewClientToServer(clientIdentityByte, clientIdentityString); },
                },
            ].some(function (x) {
                if (x.keyStr === dataString) {
                    x.func();
                    return true;
                }
                return false;
            });
            // If the user have a function to deal with incoming messages
            if (!ret) {
                Utils_js_1.default.fireUp(_this.incomingMessageListeningFunction, [
                    clientIdentityByte,
                    clientIdentityString,
                    dataString,
                ]);
            }
            if (!ret) {
                // We got something from the client we know he's not disconnected
                _this.handleAliveInformationFromSpecifiedClient(clientIdentityByte, clientIdentityString);
            }
        });
    };
    /**
     * Push the function that will get when a new connection is detected
     * @param {Function} func
     * @param {Object} context
     */
    AZeroMQServer.prototype.listenClientConnectionEvent = function (func, context) {
        this.newConnectionListeningFunction.push({
            func: func,
            context: context,
        });
    };
    /**
     * Push the function that will get when a disconnection is detected
     * @param {Function} func
     * @param {Object} context
     */
    AZeroMQServer.prototype.listenClientDisconnectionEvent = function (func, context) {
        this.newDisconnectionListeningFunction.push({
            func: func,
            context: context,
        });
    };
    return AZeroMQServer;
}(AZeroMQ_js_1.default));
exports.default = AZeroMQServer;
