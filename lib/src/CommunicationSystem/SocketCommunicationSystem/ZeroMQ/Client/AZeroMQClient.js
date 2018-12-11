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
 * Client to use when you have an Bidirectionnal connection - exemple socketType = DEALER
 * This class include custom KeepAlive
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var AZeroMQClient = function (_AZeroMQ) {
  (0, _inherits3.default)(AZeroMQClient, _AZeroMQ);

  function AZeroMQClient() {
    var keepAliveTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _CONSTANT2.default.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME;
    (0, _classCallCheck3.default)(this, AZeroMQClient);

    // Mode we are running in
    var _this = (0, _possibleConstructorReturn3.default)(this, (AZeroMQClient.__proto__ || (0, _getPrototypeOf2.default)(AZeroMQClient)).call(this));

    _this.mode = _CONSTANT2.default.ZERO_MQ.MODE.CLIENT;

    // Maximal time between messages (if you pass that time between two message, the server will probably say your disconnected)
    _this.keepAliveTime = keepAliveTime;

    // Last time the client sent something to the server
    _this.lastMessageSent = false;
    return _this;
  }

  /**
   * Start a ZeroMQ Client
   * @param {{ipServer: String, portServer: String, socketType: String, transport: String, identityPrefix: String}} args
   */


  (0, _createClass3.default)(AZeroMQClient, [{
    key: 'startClient',
    value: function startClient(_ref) {
      var _this2 = this;

      var _ref$ipServer = _ref.ipServer,
          ipServer = _ref$ipServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref$ipServer,
          _ref$portServer = _ref.portServer,
          portServer = _ref$portServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref$portServer,
          _ref$socketType = _ref.socketType,
          socketType = _ref$socketType === undefined ? _CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER : _ref$socketType,
          _ref$transport = _ref.transport,
          transport = _ref$transport === undefined ? _CONSTANT2.default.ZERO_MQ.TRANSPORT.TCP : _ref$transport,
          _ref$identityPrefix = _ref.identityPrefix,
          identityPrefix = _ref$identityPrefix === undefined ? _CONSTANT2.default.ZERO_MQ.CLIENT_IDENTITY_PREFIX : _ref$identityPrefix;

      return new _promise2.default(function (resolve, reject) {
        // If the client is already up
        if (_this2.active) return resolve();

        // Create the client socket
        _this2.socket = _zmq2.default.socket(socketType);

        // Set an identity to the client
        _this2.socket.identity = identityPrefix + '_' + process.pid;

        // Set a timeout to the connection
        var timeoutConnect = setTimeout(function () {
          // Stop the monitoring
          _this2.socket.unmonitor();

          // Remove the socket
          delete _this2.socket;

          _this2.socket = false;
          _this2.active = false;

          // Return an error
          return reject(new Error('E2005'));
        }, _CONSTANT2.default.ZERO_MQ.FIRST_CONNECTION_TIMEOUT);

        // Wait the accept of the socket to the server
        // We successfuly get connected
        _this2.socket.once(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.CONNECT, function () {
          // Clear the connection timeout
          clearTimeout(timeoutConnect);

          // Set the last time message we sent a message as now
          _this2.lastMessageSent = Date.now();

          _this2.active = true;

          // Treat messages that comes from the server
          _this2.treatMessageFromServer();

          // First message to send to be declared on the server
          _this2.clientSayHelloToServer();

          // Send messages every x ms for the server to know you are alive
          _this2.clientSayHeIsAlive();

          return resolve(_this2.socket);
        });

        // Start the monitor that will listen to socket news
        _this2.startMonitor();

        // Connection to the server
        return _this2.socket.connect(transport + '://' + ipServer + ':' + portServer);
      });
    }

    /**
     * Stop a ZeroMQ Client
     */

  }, {
    key: 'stopClient',
    value: function stopClient() {
      var _this3 = this;

      return new _promise2.default(function (resolve) {
        // If the client is already down
        if (!_this3.active) return resolve();

        // Stop the monitoring
        _this3.stopMonitor();

        // Ask for closure
        _this3.socket.close();

        // Delete the socket
        delete _this3.socket;

        _this3.socket = false;
        _this3.active = false;

        // Stop the keepAliveTime
        clearTimeout(_this3.timeoutAlive);

        return resolve();
      });
    }

    /**
     * Setup a function that is calleed when socket get connected
     * @param {Function} func
     * @param {Object} context
     */

  }, {
    key: 'listenConnectEvent',
    value: function listenConnectEvent(func) {
      if (!this.active) return;

      this.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.CONNECT, func);
    }

    /**
     * Setup a function that is calleed when socket get disconnected
     * @param {Function} func
     */

  }, {
    key: 'listenDisconnectEvent',
    value: function listenDisconnectEvent(func) {
      if (!this.active) return;

      this.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.DISCONNECT, func);
    }

    /**
     * Send a message to the server
     */

  }, {
    key: 'sendMessageToServer',
    value: function sendMessageToServer(message) {
      if (this.socket && this.active) {
        this.socket.send(message);
      }
    }

    /**
     * Treat messages that comes from server
     */

  }, {
    key: 'treatMessageFromServer',
    value: function treatMessageFromServer() {
      var _this4 = this;

      this.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, function (data) {
        var dataString = String(data);

        var ret = [{
          //
          //
          // Here we treat special strings
          //
          //
          keyStr: _CONSTANT2.default.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER,

          func: function func() {
            // Call the stop
            _this4.stop();
          }
        }].some(function (x) {
          if (x.keyStr === dataString) {
            x.func();

            return true;
          }

          return false;
        });

        // If the user have a function to deal with incoming messages
        if (!ret) _Utils2.default.fireUp(_this4.incomingMessageListeningFunction, [dataString]);
      });
    }

    /**
     * First message to send to the server to be regristered into it
     */

  }, {
    key: 'clientSayHelloToServer',
    value: function clientSayHelloToServer() {
      this.sendMessageToServer(_CONSTANT2.default.ZERO_MQ.CLIENT_MESSAGE.HELLO);
    }

    /**
     * Say to the server that you are alive
     */

  }, {
    key: 'clientSayHeIsAlive',
    value: function clientSayHeIsAlive() {
      var _this5 = this;

      // Send a message to the server, to him know that you are alive
      this.timeoutAlive = setTimeout(function () {
        // If the communication is not active anymore
        if (!_this5.active) return;

        // Set the last time message we sent a message as now
        _this5.lastMessageSent = Date.now();

        // Send a message to the server
        _this5.sendMessageToServer(_CONSTANT2.default.ZERO_MQ.CLIENT_MESSAGE.ALIVE);

        // Call again
        _this5.clientSayHeIsAlive();
      }, this.keepAliveTime);
    }
  }]);
  return AZeroMQClient;
}(_AZeroMQ3.default);

exports.default = AZeroMQClient;
//# sourceMappingURL=AZeroMQClient.js.map
