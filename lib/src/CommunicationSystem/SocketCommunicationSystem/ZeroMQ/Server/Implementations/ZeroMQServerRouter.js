"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _AZeroMQServer2 = _interopRequireDefault(require("../AZeroMQServer.js"));

var _CONSTANT = _interopRequireDefault(require("../../../../../Utils/CONSTANT/CONSTANT.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../../../../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * Implements a zeroMQ Server : Type -> ROUTER
 *
 */
var ZeroMQServerRouter =
/*#__PURE__*/
function (_AZeroMQServer) {
  (0, _inherits2["default"])(ZeroMQServerRouter, _AZeroMQServer);

  function ZeroMQServerRouter() {
    (0, _classCallCheck2["default"])(this, ZeroMQServerRouter);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ZeroMQServerRouter).apply(this, arguments));
  }

  (0, _createClass2["default"])(ZeroMQServerRouter, [{
    key: "start",

    /**
     * Start a ZeroMQ Server
     * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
     */
    value: function () {
      var _start = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var _this = this;

        var ipServer, portServer, transport, identityPrefix;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ipServer = _ref.ipServer, portServer = _ref.portServer, transport = _ref.transport, identityPrefix = _ref.identityPrefix;
                return _context.abrupt("return", new _PromiseCommandPattern["default"]({
                  func: function func() {
                    return _this.startServer({
                      ipServer: ipServer,
                      portServer: portServer,
                      transport: transport,
                      identityPrefix: identityPrefix,
                      socketType: _CONSTANT["default"].ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER
                    });
                  }
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function start(_x) {
        return _start.apply(this, arguments);
      }

      return start;
    }()
    /**
     * Stop a ZeroMQ Server
     */

  }, {
    key: "stop",
    value: function () {
      var _stop = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.stopServer());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function stop() {
        return _stop.apply(this, arguments);
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
    key: "sendMessage",
    value: function sendMessage(clientIdentityByte, clientIdentityString, message) {
      this.sendMessageToClient(clientIdentityByte, clientIdentityString, message);
    }
  }]);
  return ZeroMQServerRouter;
}(_AZeroMQServer2["default"]);

exports["default"] = ZeroMQServerRouter;
//# sourceMappingURL=ZeroMQServerRouter.js.map
