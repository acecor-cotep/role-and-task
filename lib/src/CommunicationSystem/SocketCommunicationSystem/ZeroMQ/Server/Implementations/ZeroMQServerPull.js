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

var _AZeroMQServerLight2 = _interopRequireDefault(require("../AZeroMQServerLight.js"));

var _CONSTANT = _interopRequireDefault(require("../../../../../Utils/CONSTANT/CONSTANT.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../../../../Utils/PromiseCommandPattern.js"));

var _Errors = _interopRequireDefault(require("../../../../../Utils/Errors.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * Implements a zeroMQ Server : Type -> PULL
 */
var ZeroMQServerPull =
/*#__PURE__*/
function (_AZeroMQServerLight) {
  (0, _inherits2["default"])(ZeroMQServerPull, _AZeroMQServerLight);

  function ZeroMQServerPull() {
    (0, _classCallCheck2["default"])(this, ZeroMQServerPull);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ZeroMQServerPull).apply(this, arguments));
  }

  (0, _createClass2["default"])(ZeroMQServerPull, [{
    key: "start",

    /**
     * Start a ZeroMQ Server
     * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
     */
    value: function start(_ref) {
      var _this = this;

      var ipServer = _ref.ipServer,
          portServer = _ref.portServer,
          transport = _ref.transport,
          identityPrefix = _ref.identityPrefix;
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this.startServer({
            ipServer: ipServer,
            portServer: portServer,
            transport: transport,
            identityPrefix: identityPrefix,
            socketType: _CONSTANT["default"].ZERO_MQ.SOCKET_TYPE.OMQ_PULL
          });
        }
      });
    }
    /**
     * Stop a ZeroMQ Server
     */

  }, {
    key: "stop",
    value: function stop() {
      var _this2 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this2.stopServer();
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
    key: "sendMessage",
    value: function sendMessage() {
      throw new _Errors["default"]('E7014');
    }
  }]);
  return ZeroMQServerPull;
}(_AZeroMQServerLight2["default"]);

exports["default"] = ZeroMQServerPull;
//# sourceMappingURL=ZeroMQServerPull.js.map
