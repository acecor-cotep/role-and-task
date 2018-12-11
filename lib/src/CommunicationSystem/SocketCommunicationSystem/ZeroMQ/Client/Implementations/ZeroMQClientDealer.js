'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _AZeroMQClient2 = require('../AZeroMQClient.js');

var _AZeroMQClient3 = _interopRequireDefault(_AZeroMQClient2);

var _CONSTANT = require('../../../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Implements a zeroMQ Client : Type -> DEALER
 *
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var ZeroMQClientDealer = function (_AZeroMQClient) {
  (0, _inherits3.default)(ZeroMQClientDealer, _AZeroMQClient);

  function ZeroMQClientDealer() {
    (0, _classCallCheck3.default)(this, ZeroMQClientDealer);
    return (0, _possibleConstructorReturn3.default)(this, (ZeroMQClientDealer.__proto__ || (0, _getPrototypeOf2.default)(ZeroMQClientDealer)).apply(this, arguments));
  }

  (0, _createClass3.default)(ZeroMQClientDealer, [{
    key: 'start',

    /**
     * Start a ZeroMQ Client
     * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var ipServer = _ref2.ipServer,
            portServer = _ref2.portServer,
            transport = _ref2.transport,
            identityPrefix = _ref2.identityPrefix;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.startClient({
                  ipServer: ipServer,
                  portServer: portServer,
                  transport: transport,
                  identityPrefix: identityPrefix,
                  socketType: _CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start(_x) {
        return _ref.apply(this, arguments);
      }

      return start;
    }()

    /**
     * Stop a ZeroMQ Client
     */

  }, {
    key: 'stop',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', this.stopClient());

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function stop() {
        return _ref3.apply(this, arguments);
      }

      return stop;
    }()

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
  return ZeroMQClientDealer;
}(_AZeroMQClient3.default);

exports.default = ZeroMQClientDealer;
//# sourceMappingURL=ZeroMQClientDealer.js.map
