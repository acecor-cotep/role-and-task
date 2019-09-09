"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _zeromq = _interopRequireDefault(require("zeromq"));

var _CONSTANT = _interopRequireDefault(require("../../../../Utils/CONSTANT/CONSTANT.js"));

var _AZeroMQ2 = _interopRequireDefault(require("../AZeroMQ.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../../../Utils/PromiseCommandPattern.js"));

var _Errors = _interopRequireDefault(require("../../../../Utils/Errors.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * Client to use when you have an unidirectionnal connection - exemple socketType = Push
 */
var AZeroMQClientLight =
/*#__PURE__*/
function (_AZeroMQ) {
  (0, _inherits2["default"])(AZeroMQClientLight, _AZeroMQ);

  function AZeroMQClientLight() {
    var _this;

    (0, _classCallCheck2["default"])(this, AZeroMQClientLight);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AZeroMQClientLight).call(this)); // Mode we are running in

    _this.mode = _CONSTANT["default"].ZERO_MQ.MODE.CLIENT;
    return _this;
  }
  /**
   * Start a ZeroMQ Client
   * @param {{ipServer: String, portServer: String, socketType: String, transport: String, identityPrefix: String}} args
   */


  (0, _createClass2["default"])(AZeroMQClientLight, [{
    key: "startClient",
    value: function startClient(_ref) {
      var _this2 = this;

      var _ref$ipServer = _ref.ipServer,
          ipServer = _ref$ipServer === void 0 ? _CONSTANT["default"].ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref$ipServer,
          _ref$portServer = _ref.portServer,
          portServer = _ref$portServer === void 0 ? _CONSTANT["default"].ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref$portServer,
          _ref$socketType = _ref.socketType,
          socketType = _ref$socketType === void 0 ? _CONSTANT["default"].ZERO_MQ.SOCKET_TYPE.OMQ_DEALER : _ref$socketType,
          _ref$transport = _ref.transport,
          transport = _ref$transport === void 0 ? _CONSTANT["default"].ZERO_MQ.TRANSPORT.TCP : _ref$transport,
          _ref$identityPrefix = _ref.identityPrefix,
          identityPrefix = _ref$identityPrefix === void 0 ? _CONSTANT["default"].ZERO_MQ.CLIENT_IDENTITY_PREFIX : _ref$identityPrefix;
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return new Promise(function (resolve, reject) {
            // If the client is already up
            if (_this2.active) return resolve(); // Create the client socket

            _this2.socket = _zeromq["default"].socket(socketType); // Set an identity to the client

            _this2.socket.identity = "".concat(identityPrefix, "_").concat(process.pid); // Set a timeout to the connection

            var timeoutConnect = setTimeout(function () {
              // Stop the monitoring
              _this2.socket.unmonitor(); // Remove the socket


              delete _this2.socket;
              _this2.socket = false;
              _this2.active = false; // Return an error

              return reject(new _Errors["default"]('E2005'));
            }, _CONSTANT["default"].ZERO_MQ.FIRST_CONNECTION_TIMEOUT); // Wait the accept of the socket to the server
            // We successfuly get connected

            _this2.socket.once(_CONSTANT["default"].ZERO_MQ.KEYWORDS_OMQ.CONNECT, function () {
              // Clear the connection timeout
              clearTimeout(timeoutConnect);
              _this2.active = true;
              return resolve(_this2.socket);
            }); // Start the monitor that will listen to socket news


            _this2.startMonitor(); // Connection to the server


            return _this2.socket.connect("".concat(transport, "://").concat(ipServer, ":").concat(portServer));
          });
        }
      });
    }
    /**
     * Stop a ZeroMQ Client
     */

  }, {
    key: "stopClient",
    value: function stopClient() {
      var _this3 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return new Promise(function (resolve) {
            // If the client is already down
            if (!_this3.active) return resolve(); // Stop the monitoring

            _this3.stopMonitor(); // Ask for closure


            _this3.socket.close(); // Delete the socket


            delete _this3.socket;
            _this3.socket = false;
            _this3.active = false;
            return resolve();
          });
        }
      });
    }
    /**
     * Setup a function that is calleed when socket get connected
     * @param {Function} func
     * @param {Object} context
     */

  }, {
    key: "listenConnectEvent",
    value: function listenConnectEvent(func) {
      if (!this.active) return;
      this.socket.on(_CONSTANT["default"].ZERO_MQ.KEYWORDS_OMQ.CONNECT, func);
    }
    /**
     * Setup a function that is calleed when socket get disconnected
     * @param {Function} func
     */

  }, {
    key: "listenDisconnectEvent",
    value: function listenDisconnectEvent(func) {
      if (!this.active) return;
      this.socket.on(_CONSTANT["default"].ZERO_MQ.KEYWORDS_OMQ.DISCONNECT, func);
    }
    /**
     * Send a message to the server
     */

  }, {
    key: "sendMessageToServer",
    value: function sendMessageToServer(message) {
      if (this.socket && this.active) this.socket.send(message);
    }
  }]);
  return AZeroMQClientLight;
}(_AZeroMQ2["default"]);

exports["default"] = AZeroMQClientLight;
//# sourceMappingURL=AZeroMQClientLight.js.map
