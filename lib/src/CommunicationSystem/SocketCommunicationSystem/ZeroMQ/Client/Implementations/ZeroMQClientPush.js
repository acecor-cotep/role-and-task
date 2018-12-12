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

var _AZeroMQClientLight2 = require('../AZeroMQClientLight.js');

var _AZeroMQClientLight3 = _interopRequireDefault(_AZeroMQClientLight2);

var _CONSTANT = require('../../../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _PromiseCommandPattern = require('../../../../../Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Implements a zeroMQ Client : Type -> PUSH
 *
 */
var ZeroMQClientPush = function (_AZeroMQClientLight) {
  (0, _inherits3.default)(ZeroMQClientPush, _AZeroMQClientLight);

  function ZeroMQClientPush() {
    (0, _classCallCheck3.default)(this, ZeroMQClientPush);
    return (0, _possibleConstructorReturn3.default)(this, (ZeroMQClientPush.__proto__ || (0, _getPrototypeOf2.default)(ZeroMQClientPush)).apply(this, arguments));
  }

  (0, _createClass3.default)(ZeroMQClientPush, [{
    key: 'start',

    /**
     * Start a ZeroMQ Client
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
          return _this2.startClient({
            ipServer: ipServer,
            portServer: portServer,
            transport: transport,
            identityPrefix: identityPrefix,
            socketType: _CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_PUSH
          });
        }
      });
    }

    /**
     * Stop a ZeroMQ Client
     */

  }, {
    key: 'stop',
    value: function stop() {
      var _this3 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this3.stopClient();
        }
      });
    }

    /**
     * Send a message
     * @param {String} message
     */

  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      this.sendMessageToServer(message);
    }
  }]);
  return ZeroMQClientPush;
}(_AZeroMQClientLight3.default); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports


exports.default = ZeroMQClientPush;
//# sourceMappingURL=ZeroMQClientPush.js.map
