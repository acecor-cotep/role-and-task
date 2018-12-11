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

exports.default = function (superclass) {
  return function (_superclass) {
    (0, _inherits3.default)(CONSTANT, _superclass);

    function CONSTANT() {
      (0, _classCallCheck3.default)(this, CONSTANT);
      return (0, _possibleConstructorReturn3.default)(this, (CONSTANT.__proto__ || (0, _getPrototypeOf2.default)(CONSTANT)).apply(this, arguments));
    }

    (0, _createClass3.default)(CONSTANT, null, [{
      key: 'TIMEOUT_LEAVE_ELIOT_UNPROPER',

      /**
       * Time to wait before to exit unproperly to let the system makes the displays
       */
      get: function get() {
        return 3000;
      }

      /**
       * Return the max number of listener
       */

    }, {
      key: 'MAX_NUMBER_OF_LISTENER',
      get: function get() {
        return 100;
      }

      /**
       * time in ms between two cpu usage lookup for utilsCPUMonitoring
       */

    }, {
      key: 'TIMING_OF_CPU_MONITORING',
      get: function get() {
        return 300;
      }

      /**
       * Signals to treat (When you get them you soft QUIT)
       */

    }, {
      key: 'SIGNAL',
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
      key: 'MAX_PORT_NUMBER',
      get: function get() {
        return 65535;
      }

      /**
       * Process exceptions to catch
       */

    }, {
      key: 'PROCESS_EXCEPTION',
      get: function get() {
        return 'uncaughtException';
      }

      /**
       * Process exceptions to catch
       */

    }, {
      key: 'UNHANDLED_PROMISE_REJECTION',
      get: function get() {
        return 'unhandledRejection';
      }

      /**
       * Process warning to catch
       */

    }, {
      key: 'NODE_WARNING',
      get: function get() {
        return 'warning';
      }

      /**
       * When you get that signal QUIT not properly
       */

    }, {
      key: 'SIGNAL_UNPROPER',
      get: function get() {
        return {
          SIGUSR1: 'SIGUSR1'
        };
      }

      /**
       * When we launch a new slave (before the connection) (master1_0)
       */

    }, {
      key: 'SIGNAL_TO_KILL_SLAVE_COMMAND',
      get: function get() {
        return 'SIGTERM';
      }
    }]);
    return CONSTANT;
  }(superclass);
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=System.js.map
