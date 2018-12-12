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

var _AZeroMQServer2 = require('../AZeroMQServer.js');

var _AZeroMQServer3 = _interopRequireDefault(_AZeroMQServer2);

var _CONSTANT = require('../../../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _PromiseCommandPattern = require('../../../../../Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Implements a zeroMQ Server : Type -> ROUTER
 *
 */
var ZeroMQServerRouter = function (_AZeroMQServer) {
  (0, _inherits3.default)(ZeroMQServerRouter, _AZeroMQServer);

  function ZeroMQServerRouter() {
    (0, _classCallCheck3.default)(this, ZeroMQServerRouter);
    return (0, _possibleConstructorReturn3.default)(this, (ZeroMQServerRouter.__proto__ || (0, _getPrototypeOf2.default)(ZeroMQServerRouter)).apply(this, arguments));
  }

  (0, _createClass3.default)(ZeroMQServerRouter, [{
    key: 'start',

    /**
     * Start a ZeroMQ Server
     * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var _this2 = this;

        var ipServer = _ref2.ipServer,
            portServer = _ref2.portServer,
            transport = _ref2.transport,
            identityPrefix = _ref2.identityPrefix;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new _PromiseCommandPattern2.default({
                  func: function func() {
                    return _this2.startServer({
                      ipServer: ipServer,
                      portServer: portServer,
                      transport: transport,
                      identityPrefix: identityPrefix,
                      socketType: _CONSTANT2.default.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER
                    });
                  }
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
     * Stop a ZeroMQ Server
     */

  }, {
    key: 'stop',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', this.stopServer());

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
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     * @param {String} message
     */

  }, {
    key: 'sendMessage',
    value: function sendMessage(clientIdentityByte, clientIdentityString, message) {
      this.sendMessageToClient(clientIdentityByte, clientIdentityString, message);
    }
  }]);
  return ZeroMQServerRouter;
}(_AZeroMQServer3.default); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports


exports.default = ZeroMQServerRouter;
//# sourceMappingURL=ZeroMQServerRouter.js.map
