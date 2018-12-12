'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _AZeroMQServerLight2 = require('../AZeroMQServerLight.js');

var _AZeroMQServerLight3 = _interopRequireDefault(_AZeroMQServerLight2);

var _CONSTANT = require('../../../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _PromiseCommandPattern = require('../../../../../Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

var _Errors = require('../../../../../Utils/Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Implements a zeroMQ Server : Type -> PULL
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var ZeroMQServerPull = function (_AZeroMQServerLight) {
  (0, _inherits3.default)(ZeroMQServerPull, _AZeroMQServerLight);

  function ZeroMQServerPull() {
    (0, _classCallCheck3.default)(this, ZeroMQServerPull);
    return (0, _possibleConstructorReturn3.default)(this, (ZeroMQServerPull.__proto__ || (0, _getPrototypeOf2.default)(ZeroMQServerPull)).apply(this, arguments));
  }

  (0, _createClass3.default)(ZeroMQServerPull, [{
    key: 'start',

    /**
     * Start a ZeroMQ Server
     * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
     */
    value: function start(_ref) {
      var _this2 = this;

      var ipServer = _ref.ipServer,
          portServer = _ref.portServer,
          transport = _ref.transport,
          identityPrefix = _ref.identityPrefix;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this2.startServer({
            ipServer: ipServer,
            portServer: portServer,
            transport: transport,
            identityPrefix: identityPrefix,
            socketType: _CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_PULL
          });
        }
      });
    }

    /**
     * Stop a ZeroMQ Server
     */

  }, {
    key: 'stop',
    value: function stop() {
      var _this3 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this3.stopServer();
        }
      });
    }

    /**
     * Send a message
     * You cannot send a message to client, because the link to client is unidirectionnal
     *
     * @override
     */

  }, {
    key: 'sendMessage',
    value: function sendMessage() {
      throw new _Errors2.default('E7014');
    }
  }]);
  return ZeroMQServerPull;
}(_AZeroMQServerLight3.default);

exports.default = ZeroMQServerPull;
//# sourceMappingURL=ZeroMQServerPull.js.map
