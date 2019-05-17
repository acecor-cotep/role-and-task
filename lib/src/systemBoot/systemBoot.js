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

var _events = _interopRequireDefault(require("events"));

var _commandLineArgs = _interopRequireDefault(require("command-line-args"));

var _LaunchScenarios = _interopRequireDefault(require("./LaunchScenarios.js"));

var _RoleAndTask = _interopRequireDefault(require("../RoleAndTask.js"));

var _Utils = _interopRequireDefault(require("../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../Utils/Errors.js"));

var _CONSTANT = _interopRequireDefault(require("../Utils/CONSTANT/CONSTANT.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports
// We are in the main here
var SystemBoot =
/*#__PURE__*/
function () {
  /**
   * Constructor
   */
  function SystemBoot() {
    (0, _classCallCheck2["default"])(this, SystemBoot);
    // Do we launch master or slave or oldway?
    // Get the options
    this.options = (0, _commandLineArgs["default"])([{
      // Theses must be like --mode optA=12 optB=9
      name: _CONSTANT["default"].PROGRAM_LAUNCHING_PARAMETERS.MODE.name,
      alias: _CONSTANT["default"].PROGRAM_LAUNCHING_PARAMETERS.MODE.alias,
      type: String
    }, {
      // Theses must be like --mode-options optA=12 optB=9
      name: _CONSTANT["default"].PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name,
      alias: _CONSTANT["default"].PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.alias,
      type: String,
      multiple: true
    }]);
    this.launchingModesMap = _LaunchScenarios["default"].getInstance().getMapLaunchingModes();
  }
  /**
   * System initialization (not PROGRAM)
   */


  (0, _createClass2["default"])(SystemBoot, [{
    key: "initialization",

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
    key: "launch",
    value: function launch(launchMasterSlaveConfigurationFile) {
      var _this = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee() {
            var elem;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    // Default launch mode
                    if (!_this.options.mode) _this.options.mode = _CONSTANT["default"].DEFAULT_LAUNCHING_MODE; // Look if we have a mode that correspond to it

                    elem = _this.launchingModesMap.find(function (x) {
                      return x.name === _this.options.mode;
                    });

                    if (elem) {
                      _context.next = 5;
                      break;
                    }

                    _Utils["default"].displayMessage({
                      str: new _Errors["default"]('INVALID_LAUNCHING_MODE', 'Invalid launching mode'),
                      tags: [_CONSTANT["default"].MESSAGE_DISPLAY_TAGS.ERROR]
                    });

                    return _context.abrupt("return", true);

                  case 5:
                    _context.prev = 5;
                    _context.next = 8;
                    return elem.func.call(_LaunchScenarios["default"].getInstance(), _this.options, launchMasterSlaveConfigurationFile);

                  case 8:
                    _context.next = 13;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context["catch"](5);

                    _RoleAndTask["default"].getInstance().errorHappened(_context.t0);

                  case 13:
                    return _context.abrupt("return", true);

                  case 14:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, null, [[5, 10]]);
          }));

          function func() {
            return _func.apply(this, arguments);
          }

          return func;
        }()
      });
    }
  }], [{
    key: "systemInitialization",
    value: function systemInitialization() {
      // We catch uncaught exceptions
      process.on(_CONSTANT["default"].PROCESS_EXCEPTION, function (err) {
        //
        // SPECIFIC TO BLESSED PLUGIN
        //
        //
        // Ignore blessed errors because there is a non blocking issue unresolved in the plugin
        //
        //
        if (err && err.stack && err.stack.match(/^.+blessed.+$/im)) return;

        _RoleAndTask["default"].getInstance().errorHappened(err);
      }); // We catch unhandled promises

      process.on(_CONSTANT["default"].UNHANDLED_PROMISE_REJECTION, function (reason) {
        _RoleAndTask["default"].getInstance().errorHappened(new _Errors["default"]('GENERAL_CATCH', "".concat(String(reason))));
      }); // We catch warnings

      process.on(_CONSTANT["default"].NODE_WARNING, function (reason) {
        _Utils["default"].displayMessage({
          str: reason,
          out: process.stderr
        });

        if (_RoleAndTask["default"].considerWarningAsErrors) {
          _RoleAndTask["default"].getInstance().errorHappened(new _Errors["default"]('GENERAL_CATCH', String(reason)));
        }
      }); // Set the maximum number of listeners Default is 11

      _events["default"].defaultMaxListeners = _CONSTANT["default"].MAX_NUMBER_OF_LISTENER;
    }
    /**
     * PROGRAM System initialization
     */

  }, {
    key: "programInitialization",
    value: function programInitialization() {
      // LaunchScenarios the RoleAndTask initialization
      _RoleAndTask["default"].getInstance();
    }
  }]);
  return SystemBoot;
}();

exports["default"] = SystemBoot;
//# sourceMappingURL=systemBoot.js.map
