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

var _Utils = _interopRequireDefault(require("../../../../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../../../../Utils/Errors.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../../../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * Server used when you have Unidirectionnal server (like PULL)
 */
var AZeroMQServerLight =
/*#__PURE__*/
function (_AZeroMQ) {
  (0, _inherits2["default"])(AZeroMQServerLight, _AZeroMQ);

  function AZeroMQServerLight() {
    var _this;

    (0, _classCallCheck2["default"])(this, AZeroMQServerLight);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AZeroMQServerLight).call(this)); // Mode we are running in

    _this.mode = _CONSTANT["default"].ZERO_MQ.MODE.SERVER;
    return _this;
  }
  /**
   * Start a ZeroMQ Server
   * @param {{ipServer: String, portServer: String, socketType: String, transport: String, identityPrefix: String}} args
   */


  (0, _createClass2["default"])(AZeroMQServerLight, [{
    key: "startServer",
    value: function startServer(_ref) {
      var _this2 = this;

      var _ref$ipServer = _ref.ipServer,
          ipServer = _ref$ipServer === void 0 ? _CONSTANT["default"].ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref$ipServer,
          _ref$portServer = _ref.portServer,
          portServer = _ref$portServer === void 0 ? _CONSTANT["default"].ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref$portServer,
          _ref$socketType = _ref.socketType,
          socketType = _ref$socketType === void 0 ? _CONSTANT["default"].ZERO_MQ.SOCKET_TYPE.OMQ_PULL : _ref$socketType,
          _ref$transport = _ref.transport,
          transport = _ref$transport === void 0 ? _CONSTANT["default"].ZERO_MQ.TRANSPORT.TCP : _ref$transport,
          _ref$identityPrefix = _ref.identityPrefix,
          identityPrefix = _ref$identityPrefix === void 0 ? _CONSTANT["default"].ZERO_MQ.SERVER_IDENTITY_PREFIX : _ref$identityPrefix;
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return new Promise(function (resolve, reject) {
            // If the server is already up
            if (_this2.active) return resolve(_this2.socket); // Check the socket Type

            var check = [_CONSTANT["default"].ZERO_MQ.SOCKET_TYPE.OMQ_PULL].some(function (x) {
              return x === socketType;
            });
            if (!check) return reject(new _Errors["default"]('E2008', "socketType: ".concat(socketType))); // Create the server socket

            _this2.socket = _zeromq["default"].socket(socketType); // Set an identity to the server

            _this2.socket.identity = "".concat(identityPrefix, "_").concat(process.pid); // Start the monitor that will listen to socket news

            _this2.startMonitor(); // Bind the server to a port


            return _this2.socket.bind("".concat(transport, "://").concat(ipServer, ":").concat(portServer), function (err) {
              if (err) {
                // Log something
                console.error("Server ZeroMQ Bind Failed. Transport=".concat(transport, " Port=").concat(portServer, " IP:").concat(ipServer)); // Stop the monitoring

                _this2.stopMonitor(); // Remove the socket


                delete _this2.socket;
                _this2.socket = false;
                _this2.active = false; // Return an error

                return reject(new _Errors["default"]('E2007', "Specific: ".concat(err)));
              } // Start to handle client messages


              _this2.treatMessageFromClient();

              _this2.active = true; // We successfuly bind the server

              return resolve(_this2.socket);
            });
          });
        }
      });
    }
    /**
     * Stop a ZeroMQ Server
     */

  }, {
    key: "stopServer",
    value: function stopServer() {
      var _this3 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return new Promise(function (resolve, reject) {
            // If the server is already down
            if (!_this3.active) return resolve(); // Listen to the closure of the socket

            _this3.socket.on(_CONSTANT["default"].ZERO_MQ.KEYWORDS_OMQ.CLOSE, function () {
              // Successfuly close
              // Stop the monitoring
              _this3.stopMonitor(); // Delete the socket


              delete _this3.socket;
              _this3.socket = false;
              _this3.active = false;
              return resolve();
            }); // Error in closure


            _this3.socket.on(_CONSTANT["default"].ZERO_MQ.KEYWORDS_OMQ.CLOSE_ERROR, function (err, ep) {
              return reject(new _Errors["default"]('E2006', "Endpoint: ".concat(String(err), " - ").concat(ep)));
            }); // Ask for closure


            return _this3.socket.close();
          });
        }
      });
    }
    /**
     * Treat messages that comes from clients
     * send them to the listeners)
     */

  }, {
    key: "treatMessageFromClient",
    value: function treatMessageFromClient() {
      var _this4 = this;

      this.socket.on(_CONSTANT["default"].ZERO_MQ.KEYWORDS_OMQ.MESSAGE, function (msg) {
        var dataString = String(msg);

        _Utils["default"].fireUp(_this4.incomingMessageListeningFunction, [dataString]);
      });
    }
  }]);
  return AZeroMQServerLight;
}(_AZeroMQ2["default"]);

exports["default"] = AZeroMQServerLight;
//# sourceMappingURL=AZeroMQServerLight.js.map
