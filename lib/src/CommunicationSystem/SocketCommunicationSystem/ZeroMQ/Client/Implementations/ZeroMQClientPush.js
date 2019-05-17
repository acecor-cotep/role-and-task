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

var _AZeroMQClientLight2 = _interopRequireDefault(require("../AZeroMQClientLight.js"));

var _CONSTANT = _interopRequireDefault(require("../../../../../Utils/CONSTANT/CONSTANT.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../../../../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * Implements a zeroMQ Client : Type -> PUSH
 *
 */
var ZeroMQClientPush =
/*#__PURE__*/
function (_AZeroMQClientLight) {
  (0, _inherits2["default"])(ZeroMQClientPush, _AZeroMQClientLight);

  function ZeroMQClientPush() {
    (0, _classCallCheck2["default"])(this, ZeroMQClientPush);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ZeroMQClientPush).apply(this, arguments));
  }

  (0, _createClass2["default"])(ZeroMQClientPush, [{
    key: "start",

    /**
     * Start a ZeroMQ Client
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
          return _this.startClient({
            ipServer: ipServer,
            portServer: portServer,
            transport: transport,
            identityPrefix: identityPrefix,
            socketType: _CONSTANT["default"].ZERO_MQ.SOCKET_TYPE.OMQ_PUSH
          });
        }
      });
    }
    /**
     * Stop a ZeroMQ Client
     */

  }, {
    key: "stop",
    value: function stop() {
      var _this2 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this2.stopClient();
        }
      });
    }
    /**
     * Send a message
     * @param {String} message
     */

  }, {
    key: "sendMessage",
    value: function sendMessage(message) {
      this.sendMessageToServer(message);
    }
  }]);
  return ZeroMQClientPush;
}(_AZeroMQClientLight2["default"]);

exports["default"] = ZeroMQClientPush;
//# sourceMappingURL=ZeroMQClientPush.js.map
