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

var _CONSTANT = _interopRequireDefault(require("../../../Utils/CONSTANT/CONSTANT.js"));

var _ASocketCommunicationSystem = _interopRequireDefault(require("../ASocketCommunicationSystem.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports
var AZeroMQ =
/*#__PURE__*/
function (_ASocketCommunication) {
  (0, _inherits2["default"])(AZeroMQ, _ASocketCommunication);

  function AZeroMQ() {
    var _this;

    (0, _classCallCheck2["default"])(this, AZeroMQ);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AZeroMQ).call(this)); // Name of the protocol of communication

    _this.name = _CONSTANT["default"].SOCKET_COMMUNICATION_SYSTEM.ZEROMQ; // Mode we are running in (Server or Client)

    _this.mode = false; // Socket

    _this.socket = false; // Store a ptr to monitor restart timeout

    _this.monitorTimeout = false;
    return _this;
  }
  /**
   * Return an object that can be used to act the communication system
   * @override
   */


  (0, _createClass2["default"])(AZeroMQ, [{
    key: "getSocket",
    value: function getSocket() {
      return this.socket;
    }
    /**
     * Stop the monitor
     */

  }, {
    key: "stopMonitor",
    value: function stopMonitor() {
      if (this.monitorTimeout) clearTimeout(this.monitorTimeout);
      this.monitorTimeout = false;
      if (this.socket) this.socket.unmonitor();
    }
    /**
     * Start the monitor that will listen to socket news
     * Check for events every 500ms and get all available events.
     */

  }, {
    key: "startMonitor",
    value: function startMonitor() {
      var _this2 = this;

      // Handle monitor error
      this.socket.on(_CONSTANT["default"].ZERO_MQ.KEYWORDS_OMQ.MONITOR_ERROR, function () {
        if (_this2.socket) {
          // Restart the monitor if it fail
          _this2.monitorTimeout = setTimeout(function () {
            if (_this2.socket) {
              _this2.socket.monitor(_CONSTANT["default"].ZERO_MQ.MONITOR_TIME_CHECK, 0);
            }
          }, _CONSTANT["default"].ZERO_MQ.MONITOR_RELAUNCH_TIME);
        }
      }); // Call monitor, check for events every 50ms and get all available events.

      this.socket.monitor(_CONSTANT["default"].ZERO_MQ.MONITOR_TIME_CHECK, 0);
    }
  }]);
  return AZeroMQ;
}(_ASocketCommunicationSystem["default"]);

exports["default"] = AZeroMQ;
//# sourceMappingURL=AZeroMQ.js.map
