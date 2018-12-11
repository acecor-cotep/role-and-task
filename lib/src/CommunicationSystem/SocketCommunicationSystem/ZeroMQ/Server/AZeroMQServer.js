'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _zmq = require('zmq');

var _zmq2 = _interopRequireDefault(_zmq);

var _CONSTANT = require('../../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _AZeroMQ2 = require('../AZeroMQ.js');

var _AZeroMQ3 = _interopRequireDefault(_AZeroMQ2);

var _Utils = require('../../../../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Server used when you have Bidirectionnal server (like ROUTER)
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var AZeroMQServer = function (_AZeroMQ) {
  (0, _inherits3.default)(AZeroMQServer, _AZeroMQ);

  function AZeroMQServer() {
    (0, _classCallCheck3.default)(this, AZeroMQServer);

    // Mode we are running in
    var _this = (0, _possibleConstructorReturn3.default)(this, (AZeroMQServer.__proto__ || (0, _getPrototypeOf2.default)(AZeroMQServer)).call(this));

    _this.mode = _CONSTANT2.default.ZERO_MQ.MODE.SERVER;

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


  (0, _createClass3.default)(AZeroMQServer, [{
    key: 'getInfosServer',
    value: function getInfosServer() {
      return this.infosServer;
    }

    /**
     * Return the list of connected clients
     * @return {Array}
     */

  }, {
    key: 'getConnectedClientList',
    value: function getConnectedClientList() {
      return this.clientList.map(function (x) {
        return x.clientIdentityString;
      });
    }

    /**
     * Start a ZeroMQ Server
     * @param {{ipServer: String, portServer: String, socketType: String, transport: String, identityPrefix: String}} args
     */

  }, {
    key: 'startServer',
    value: function startServer(_ref) {
      var _this2 = this;

      var _ref$ipServer = _ref.ipServer,
          ipServer = _ref$ipServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref$ipServer,
          _ref$portServer = _ref.portServer,
          portServer = _ref$portServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref$portServer,
          _ref$socketType = _ref.socketType,
          socketType = _ref$socketType === undefined ? _CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER : _ref$socketType,
          _ref$transport = _ref.transport,
          transport = _ref$transport === undefined ? _CONSTANT2.default.ZERO_MQ.TRANSPORT.TCP : _ref$transport,
          _ref$identityPrefix = _ref.identityPrefix,
          identityPrefix = _ref$identityPrefix === undefined ? _CONSTANT2.default.ZERO_MQ.SERVER_IDENTITY_PREFIX : _ref$identityPrefix;

      return new _promise2.default(function (resolve, reject) {
        // If the server is already up
        if (_this2.active) return resolve(_this2.socket);

        // Check the socket Type
        var check = [_CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER, _CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER].some(function (x) {
          return x === socketType;
        });

        if (!check) return reject(new Error('E2008 : socketType: ' + socketType));

        // Create the server socket
        _this2.socket = _zmq2.default.socket(socketType);

        // Set an identity to the server
        _this2.socket.identity = identityPrefix + '_' + process.pid;

        // Start the monitor that will listen to socket news
        _this2.startMonitor();

        // Bind the server to a port
        return _this2.socket.bind(transport + '://' + ipServer + ':' + portServer, function (err) {
          if (err) {
            // Log something
            console.log('Server ZeroMQ Bind Failed. Transport=' + transport + ' Port=' + portServer + ' IP:' + ipServer);

            // Stop the monitoring
            _this2.stopMonitor();

            // Remove the socket
            delete _this2.socket;

            _this2.socket = false;
            _this2.active = false;

            // Return an error
            return reject(new Error('E2007 : Specific: ' + err));
          }

          // Start to handle client messages
          _this2.treatMessageFromClient();

          _this2.infosServer = {
            ipServer: ipServer,
            portServer: portServer,
            socketType: socketType,
            transport: transport,
            identityPrefix: identityPrefix
          };

          _this2.active = true;

          // We successfuly bind the server
          return resolve(_this2.socket);
        });
      });
    }

    /**
     * Stop a ZeroMQ Server
     */

  }, {
    key: 'stopServer',
    value: function stopServer() {
      var _this3 = this;

      return new _promise2.default(function (resolve, reject) {
        // If the server is already down
        if (!_this3.active) return resolve();

        // Listen to the closure of the socket
        _this3.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.CLOSE, function () {
          // Successfuly close
          // Stop the monitoring
          _this3.stopMonitor();

          // Delete the socket
          delete _this3.socket;

          _this3.socket = false;
          _this3.active = false;

          // Empty the clientList
          _this3.clientList = [];

          _this3.infosServer = false;

          return resolve();
        });

        // Error in closure
        _this3.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.CLOSE_ERROR, function (err, ep) {
          return reject(new Error('E2006 : Endpoint: ' + String(err) + ' ' + ep));
        });

        // Ask for closure
        return _this3.socket.close();
      });
    }

    /**
     * Setup a function that is called when a new client get connected
     * @param {Function} func
     */

  }, {
    key: 'listenNewConnectedClientEvent',
    value: function listenNewConnectedClientEvent(func) {
      if (!this.active) return;

      this.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.ACCEPT, func);
    }

    /**
     * Send a message to every connected client
     * @param {String} message
     */

  }, {
    key: 'sendBroadcastMessage',
    value: function sendBroadcastMessage(message) {
      var _this4 = this;

      this.clientList.forEach(function (x) {
        return _this4.sendMessageToClient(x.clientIdentityByte, x.clientIdentityString, message);
      });
    }

    /**
     * Close a connection to a client
     */

  }, {
    key: 'closeConnectionToClient',
    value: function closeConnectionToClient(clientIdentityByte, clientIdentityString) {
      this.sendMessageToClient(clientIdentityByte, clientIdentityString, _CONSTANT2.default.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER);

      // Remove the client data from the array
      this.removeClientToServer(clientIdentityByte, clientIdentityString);
    }

    /**
     * Disconnect a user because we have got no proof of life from it since too long
     * long defined by CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */

  }, {
    key: 'disconnectClientDueToTimeoutNoProofOfLive',
    value: function disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte, clientIdentityString) {
      // Send a bye message to the client, in case he's coming back
      this.closeConnectionToClient(clientIdentityByte, clientIdentityString);
    }

    /**
     * Handle a new connection of client to the server
     * (Store it into a list that will be useful create clientConnection/clientDisconnection event)
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */

  }, {
    key: 'handleNewClientToServer',
    value: function handleNewClientToServer(clientIdentityByte, clientIdentityString) {
      // We put the client into a list of connected client
      var exist = this.clientList.some(function (x) {
        return x.clientIdentityString === clientIdentityString;
      });

      if (!exist) {
        this.clientList.push({
          clientIdentityString: clientIdentityString,
          clientIdentityByte: clientIdentityByte,
          timeoutAlive: false
        });

        _Utils2.default.fireUp(this.newConnectionListeningFunction, [clientIdentityByte, clientIdentityString]);
      }

      // Call a function that will disconnected the client from the server is he sent nothing
      // in a pre-defined period
      this.timeoutClientConnection(clientIdentityByte, clientIdentityString);
    }

    /**
     * Function that is executed to handle client timeout
     * Not proof of life from too long
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */

  }, {
    key: 'timeoutClientConnection',
    value: function timeoutClientConnection(clientIdentityByte, clientIdentityString) {
      var _this5 = this;

      // Function execution
      var timeout = function timeout() {
        // Disconnect the user to the server
        _this5.disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte, clientIdentityString);
      };

      this.clientList.some(function (x, xi) {
        if (x.clientIdentityString === clientIdentityString) {
          // If we had a pre-existing timeout, relaunch it
          if (_this5.clientList[xi].timeoutAlive) clearTimeout(_this5.clientList[xi].timeoutAlive);

          // Create a timeout
          _this5.clientList[xi].timeoutAlive = setTimeout(function () {
            return timeout();
          }, _CONSTANT2.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);

          return true;
        }

        return false;
      });
    }

    /**
     * Send a message to the client
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     * @param {String} message
     */

  }, {
    key: 'sendMessageToClient',
    value: function sendMessageToClient(clientIdentityByte, clientIdentityString, message) {
      if (this.socket && this.active) {
        this.socket.send([clientIdentityString, message]);
      }
    }

    /**
     * We know that the specified client is alive (he sent something to us)
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */

  }, {
    key: 'handleAliveInformationFromSpecifiedClient',
    value: function handleAliveInformationFromSpecifiedClient(clientIdentityByte, clientIdentityString) {
      var _this6 = this;

      this.clientList.some(function (x) {
        if (clientIdentityString === x.clientIdentityString) {
          // Handle the user timeout
          _this6.timeoutClientConnection(clientIdentityByte, clientIdentityString);

          return true;
        }

        return false;
      });
    }

    /**
     * Remove a client from the clientList array
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */

  }, {
    key: 'removeClientToServer',
    value: function removeClientToServer(clientIdentityByte, clientIdentityString) {
      this.clientList = this.clientList.filter(function (x) {
        return x.clientIdentityString !== clientIdentityString;
      });

      _Utils2.default.fireUp(this.newDisconnectionListeningFunction, [clientIdentityByte, clientIdentityString]);
    }

    /**
     * Treat messages that comes from clients
     */

  }, {
    key: 'treatMessageFromClient',
    value: function treatMessageFromClient() {
      var _this7 = this;

      this.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, function (clientIdentityByte, data) {
        var dataString = String(data);
        var clientIdentityString = String(clientIdentityByte);

        var ret = [
        //
        //
        // Here we treat special strings
        //
        //
        {
          keyStr: _CONSTANT2.default.ZERO_MQ.CLIENT_MESSAGE.ALIVE,
          func: function func() {
            // We got a keepAlive message from client
            // We got something from the client we know he's not disconnected
            _this7.handleAliveInformationFromSpecifiedClient(clientIdentityByte, clientIdentityString);
          }
        }, {
          keyStr: _CONSTANT2.default.ZERO_MQ.CLIENT_MESSAGE.HELLO,
          func: function func() {
            return _this7.handleNewClientToServer(clientIdentityByte, clientIdentityString);
          }
        }].some(function (x) {
          if (x.keyStr === dataString) {
            x.func();

            return true;
          }

          return false;
        });

        // If the user have a function to deal with incoming messages
        if (!ret) {
          _Utils2.default.fireUp(_this7.incomingMessageListeningFunction, [clientIdentityByte, clientIdentityString, dataString]);
        }

        if (!ret) {
          // We got something from the client we know he's not disconnected
          _this7.handleAliveInformationFromSpecifiedClient(clientIdentityByte, clientIdentityString);
        }
      });
    }

    /**
     * Push the function that will get when a new connection is detected
     * @param {Function} func
     * @param {Object} context
     */

  }, {
    key: 'listenClientConnectionEvent',
    value: function listenClientConnectionEvent(func, context) {
      this.newConnectionListeningFunction.push({
        func: func,
        context: context
      });
    }

    /**
     * Push the function that will get when a disconnection is detected
     * @param {Function} func
     * @param {Object} context
     */

  }, {
    key: 'listenClientDisconnectionEvent',
    value: function listenClientDisconnectionEvent(func, context) {
      this.newDisconnectionListeningFunction.push({
        func: func,
        context: context
      });
    }
  }]);
  return AZeroMQServer;
}(_AZeroMQ3.default);

exports.default = AZeroMQServer;
//# sourceMappingURL=AZeroMQServer.js.map
