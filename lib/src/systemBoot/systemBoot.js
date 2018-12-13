'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

var _LaunchScenarios = require('./LaunchScenarios.js');

var _LaunchScenarios2 = _interopRequireDefault(_LaunchScenarios);

var _RoleAndTask = require('../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

var _Utils = require('../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Errors = require('../Utils/Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

var _CONSTANT = require('../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _PromiseCommandPattern = require('../Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// We are in the main here
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var SystemBoot = function () {
  /**
   * Constructor
   */
  function SystemBoot() {
    (0, _classCallCheck3.default)(this, SystemBoot);

    // Do we launch master or slave or oldway?
    // Get the options
    this.options = (0, _commandLineArgs2.default)([{
      // Theses must be like --mode optA=12 optB=9
      name: _CONSTANT2.default.PROGRAM_LAUNCHING_PARAMETERS.MODE.name,
      alias: _CONSTANT2.default.PROGRAM_LAUNCHING_PARAMETERS.MODE.alias,
      type: String
    }, {
      // Theses must be like --mode-options optA=12 optB=9
      name: _CONSTANT2.default.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name,
      alias: _CONSTANT2.default.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.alias,
      type: String,
      multiple: true
    }]);

    this.launchingModesMap = _LaunchScenarios2.default.getInstance().getMapLaunchingModes();
  }

  /**
   * System initialization (not PROGRAM)
   */


  (0, _createClass3.default)(SystemBoot, [{
    key: 'initialization',


    /**
     * All initializations
     */
    value: function initialization() {
      SystemBoot.systemInitialization();

      SystemBoot.programInitialization();

      return this;
    }

    /**
     * LaunchScenarios PROGRAM
     */

  }, {
    key: 'launch',
    value: function launch(launchMasterSlaveConfigurationFile) {
      var _this = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var elem;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    // Default launch mode
                    if (!_this.options.mode) _this.options.mode = _CONSTANT2.default.DEFAULT_LAUNCHING_MODE;

                    // Look if we have a mode that correspond to it
                    elem = _this.launchingModesMap.find(function (x) {
                      return x.name === _this.options.mode;
                    });

                    if (elem) {
                      _context.next = 5;
                      break;
                    }

                    _Utils2.default.displayMessage({
                      str: new _Errors2.default('INVALID_LAUNCHING_MODE', 'Invalid launching mode'),

                      tags: [_CONSTANT2.default.MESSAGE_DISPLAY_TAGS.ERROR]
                    });

                    return _context.abrupt('return', true);

                  case 5:
                    _context.prev = 5;
                    _context.next = 8;
                    return elem.func.call(_LaunchScenarios2.default.getInstance(), _this.options, launchMasterSlaveConfigurationFile);

                  case 8:
                    _context.next = 13;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context['catch'](5);

                    _RoleAndTask2.default.getInstance().errorHappened(_context.t0);

                  case 13:
                    return _context.abrupt('return', true);

                  case 14:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this, [[5, 10]]);
          }));

          return function func() {
            return _ref.apply(this, arguments);
          };
        }()
      });
    }
  }], [{
    key: 'systemInitialization',
    value: function systemInitialization() {
      // We catch uncaught exceptions
      process.on(_CONSTANT2.default.PROCESS_EXCEPTION, function (err) {
        //
        // SPECIFIC TO BLESSED PLUGIN
        //
        //
        // Ignore blessed errors because there is a non blocking issue unresolved in the plugin
        //
        //
        if (err && err.stack && err.stack.match(/^.+blessed.+$/im)) return;

        _RoleAndTask2.default.getInstance().errorHappened(err);
      });

      // We catch unhandled promises
      process.on(_CONSTANT2.default.UNHANDLED_PROMISE_REJECTION, function (reason) {
        _RoleAndTask2.default.getInstance().errorHappened(new _Errors2.default('GENERAL_CATCH', '' + String(reason)));
      });

      // We catch warnings
      process.on(_CONSTANT2.default.NODE_WARNING, function (reason) {
        _Utils2.default.displayMessage({
          str: reason,
          out: process.stderr
        });

        if (_RoleAndTask2.default.considerWarningAsErrors) {
          _RoleAndTask2.default.getInstance().errorHappened(new _Errors2.default('GENERAL_CATCH', String(reason)));
        }
      });

      // Set the maximum number of listeners Default is 11
      _events2.default.defaultMaxListeners = _CONSTANT2.default.MAX_NUMBER_OF_LISTENER;
    }

    /**
     * PROGRAM System initialization
     */

  }, {
    key: 'programInitialization',
    value: function programInitialization() {
      // LaunchScenarios the RoleAndTask initialization
      _RoleAndTask2.default.getInstance();
    }
  }]);
  return SystemBoot;
}();

exports.default = SystemBoot;
//# sourceMappingURL=systemBoot.js.map