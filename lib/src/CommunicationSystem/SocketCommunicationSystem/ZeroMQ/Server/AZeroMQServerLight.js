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
 * Server used when you have Unidirectionnal server (like PULL)
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var AZeroMQServerLight = function (_AZeroMQ) {
  (0, _inherits3.default)(AZeroMQServerLight, _AZeroMQ);

  function AZeroMQServerLight() {
    (0, _classCallCheck3.default)(this, AZeroMQServerLight);

    // Mode we are running in
    var _this = (0, _possibleConstructorReturn3.default)(this, (AZeroMQServerLight.__proto__ || (0, _getPrototypeOf2.default)(AZeroMQServerLight)).call(this));

    _this.mode = _CONSTANT2.default.ZERO_MQ.MODE.SERVER;
    return _this;
  }

  /**
   * Start a ZeroMQ Server
   * @param {{ipServer: String, portServer: String, socketType: String, transport: String, identityPrefix: String}} args
   */


  (0, _createClass3.default)(AZeroMQServerLight, [{
    key: 'startServer',
    value: function startServer(_ref) {
      var _this2 = this;

      var _ref$ipServer = _ref.ipServer,
          ipServer = _ref$ipServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref$ipServer,
          _ref$portServer = _ref.portServer,
          portServer = _ref$portServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref$portServer,
          _ref$socketType = _ref.socketType,
          socketType = _ref$socketType === undefined ? _CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_PULL : _ref$socketType,
          _ref$transport = _ref.transport,
          transport = _ref$transport === undefined ? _CONSTANT2.default.ZERO_MQ.TRANSPORT.TCP : _ref$transport,
          _ref$identityPrefix = _ref.identityPrefix,
          identityPrefix = _ref$identityPrefix === undefined ? _CONSTANT2.default.ZERO_MQ.SERVER_IDENTITY_PREFIX : _ref$identityPrefix;

      return new _promise2.default(function (resolve, reject) {
        // If the server is already up
        if (_this2.active) return resolve(_this2.socket);

        // Check the socket Type
        var check = [_CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_PULL].some(function (x) {
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
            console.error('Server ZeroMQ Bind Failed. Transport=' + transport + ' Port=' + portServer + ' IP:' + ipServer);

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

          return resolve();
        });

        // Error in closure
        _this3.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.CLOSE_ERROR, function (err, ep) {
          return reject(new Error('E2006 : Endpoint: ' + String(err) + ' - ' + ep));
        });

        // Ask for closure
        return _this3.socket.close();
      });
    }

    /**
     * Treat messages that comes from clients
     * send them to the listeners)
     */

  }, {
    key: 'treatMessageFromClient',
    value: function treatMessageFromClient() {
      var _this4 = this;

      this.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, function (msg) {
        var dataString = String(msg);

        _Utils2.default.fireUp(_this4.incomingMessageListeningFunction, [dataString]);
      });
    }
  }]);
  return AZeroMQServerLight;
}(_AZeroMQ3.default);

exports.default = AZeroMQServerLight;
//# sourceMappingURL=AZeroMQServerLight.js.map
