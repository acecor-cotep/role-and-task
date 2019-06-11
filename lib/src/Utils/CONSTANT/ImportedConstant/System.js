"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

/* ************************************************************************************* */

/* *********************************** SYSTEM ****************************************** */

/* ************************************************************************************* */
function _default(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(CONSTANT, _superclass);

      function CONSTANT() {
        (0, _classCallCheck2["default"])(this, CONSTANT);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CONSTANT).apply(this, arguments));
      }

      (0, _createClass2["default"])(CONSTANT, null, [{
        key: "TIMEOUT_LEAVE_PROGRAM_UNPROPER",

        /**
         * Time to wait before to exit unproperly to let the system makes the displays
         */
        get: function get() {
          return 200;
        }
        /**
         * Return the max number of listener
         */

      }, {
        key: "MAX_NUMBER_OF_LISTENER",
        get: function get() {
          return 100;
        }
        /**
         * time in ms between two cpu usage lookup for utilsCPUMonitoring
         */

      }, {
        key: "TIMING_OF_CPU_MONITORING",
        get: function get() {
          return 300;
        }
        /**
         * Signals to treat (When you get them you soft QUIT)
         */

      }, {
        key: "SIGNAL",
        get: function get() {
          return {
            SIGINT: 'SIGINT',
            SIGHUP: 'SIGHUP',
            SIGQUIT: 'SIGQUIT',
            SIGABRT: 'SIGABRT',
            SIGTERM: 'SIGTERM'
          };
        }
        /**
         * Port number is from 0 to 65535
         */

      }, {
        key: "MAX_PORT_NUMBER",
        get: function get() {
          return 65535;
        }
        /**
         * Process exceptions to catch
         */

      }, {
        key: "PROCESS_EXCEPTION",
        get: function get() {
          return 'uncaughtException';
        }
        /**
         * Process exceptions to catch
         */

      }, {
        key: "UNHANDLED_PROMISE_REJECTION",
        get: function get() {
          return 'unhandledRejection';
        }
        /**
         * Process warning to catch
         */

      }, {
        key: "NODE_WARNING",
        get: function get() {
          return 'warning';
        }
        /**
         * When you get that signal QUIT not properly
         */

      }, {
        key: "SIGNAL_UNPROPER",
        get: function get() {
          return {
            SIGUSR1: 'SIGUSR1'
          };
        }
        /**
         * When we launch a new slave (before the connection) (master1_0)
         */

      }, {
        key: "SIGNAL_TO_KILL_SLAVE_COMMAND",
        get: function get() {
          return 'SIGTERM';
        }
      }]);
      return CONSTANT;
    }(superclass)
  );
}
//# sourceMappingURL=System.js.map
