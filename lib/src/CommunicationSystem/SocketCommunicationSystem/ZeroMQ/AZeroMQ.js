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

var _CONSTANT = require('../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _ASocketCommunicationSystem = require('../ASocketCommunicationSystem.js');

var _ASocketCommunicationSystem2 = _interopRequireDefault(_ASocketCommunicationSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var AZeroMQ = function (_ASocketCommunication) {
  (0, _inherits3.default)(AZeroMQ, _ASocketCommunication);

  function AZeroMQ() {
    (0, _classCallCheck3.default)(this, AZeroMQ);

    // Name of the protocol of communication
    var _this = (0, _possibleConstructorReturn3.default)(this, (AZeroMQ.__proto__ || (0, _getPrototypeOf2.default)(AZeroMQ)).call(this));

    _this.name = _CONSTANT2.default.SOCKET_COMMUNICATION_SYSTEM.ZEROMQ;

    // Mode we are running in (Server or Client)
    _this.mode = false;

    // Socket
    _this.socket = false;

    // Store a ptr to monitor restart timeout
    _this.monitorTimeout = false;
    return _this;
  }

  /**
   * Return an object that can be used to act the communication system
   * @override
   */


  (0, _createClass3.default)(AZeroMQ, [{
    key: 'getSocket',
    value: function getSocket() {
      return this.socket;
    }

    /**
     * Stop the monitor
     */

  }, {
    key: 'stopMonitor',
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
    key: 'startMonitor',
    value: function startMonitor() {
      var _this2 = this;

      // Handle monitor error
      this.socket.on(_CONSTANT2.default.ZERO_MQ.KEYWORDS_OMQ.MONITOR_ERROR, function () {
        if (_this2.socket) {
          // Restart the monitor if it fail
          _this2.monitorTimeout = setTimeout(function () {
            if (_this2.socket) {
              _this2.socket.monitor(_CONSTANT2.default.ZERO_MQ.MONITOR_TIME_CHECK, 0);
            }
          }, _CONSTANT2.default.ZERO_MQ.MONITOR_RELAUNCH_TIME);
        }
      });

      // Call monitor, check for events every 50ms and get all available events.
      this.socket.monitor(_CONSTANT2.default.ZERO_MQ.MONITOR_TIME_CHECK, 0);
    }
  }]);
  return AZeroMQ;
}(_ASocketCommunicationSystem2.default);

exports.default = AZeroMQ;
//# sourceMappingURL=AZeroMQ.js.map
