"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _CONSTANT = _interopRequireDefault(require("../Utils/CONSTANT/CONSTANT.js"));

var _Utils = _interopRequireDefault(require("../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../Utils/Errors.js"));

var _applyConfigurationMasterSlaveLaunch = _interopRequireDefault(require("./applyConfigurationMasterSlaveLaunch.js"));

var _RoleAndTask = _interopRequireDefault(require("../RoleAndTask.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports
var instance = null;
/**
 * This class implement the different launch scenarios of PROGRAM
 */

var LaunchScenarios =
/*#__PURE__*/
function () {
  function LaunchScenarios() {
    (0, _classCallCheck2["default"])(this, LaunchScenarios);
    if (instance) return instance;
    this.lastLaunch = false;
    instance = this;
    return instance;
  }
  /**
   * SINGLETON implementation
   */


  (0, _createClass2["default"])(LaunchScenarios, [{
    key: "getMapLaunchingModes",

    /**
     * Get the map of launching modes
     */
    value: function getMapLaunchingModes() {
      return [{
        name: _CONSTANT["default"].PROGRAM_LAUNCHING_MODE.MASTER,
        func: this.master
      }, {
        name: _CONSTANT["default"].PROGRAM_LAUNCHING_MODE.SLAVE,
        func: this.slave
      }].concat((0, _toConsumableArray2["default"])(_RoleAndTask["default"].getInstance().customLaunchingMode));
    }
    /**
     * Read the Master Slave launch configuration file
     */

  }, {
    key: "master",

    /**
     * Start PROGRAM in master mode
     */
    value: function master(options, launchMasterSlaveConfigurationFile) {
      var _this = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee() {
            var launchConfFileContent;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _this.lastLaunch = {
                      method: _this.master,
                      options: options
                    }; // Say to people in which state we are at launch -> LAUNCHING

                    _context.next = 3;
                    return _RoleAndTask["default"].getInstance().spreadStateToListener();

                  case 3:
                    _context.next = 5;
                    return LaunchScenarios.readLaunchMasterSlaveConfigurationFile(launchMasterSlaveConfigurationFile);

                  case 5:
                    launchConfFileContent = _context.sent;
                    _context.next = 8;
                    return (0, _applyConfigurationMasterSlaveLaunch["default"])(launchConfFileContent);

                  case 8:
                    _context.next = 10;
                    return _RoleAndTask["default"].getInstance().changeProgramState(_CONSTANT["default"].DEFAULT_STATES.READY_PROCESS.id);

                  case 10:
                    return _context.abrupt("return", true);

                  case 11:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function func() {
            return _func.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Takes option-key = ['optA=12', 'optB=78', ...]
     * and return [
     *   optA: '12',
     *   optB: '78',
     * ]
     *
     * @param {Object} options
     * @param {String} name
     */

  }, {
    key: "slave",

    /**
     * Start PROGRAM in slave mode
     */
    value: function slave(options) {
      var _this2 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func2 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee2() {
            var roleHandler, optCreatSlave, parsedOptions;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    roleHandler = _RoleAndTask["default"].getInstance().getRoleHandler();
                    optCreatSlave = {};
                    _this2.lastLaunch = {
                      method: _this2.slave,
                      options: options
                    }; // We have something like mode-options = ['optA=12', 'optB=78', ...]

                    _context2.next = 5;
                    return LaunchScenarios.parseEqualsArrayOptions(options, _CONSTANT["default"].PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name);

                  case 5:
                    parsedOptions = _context2.sent;
                    // Create dynamically the options to create a new slave depending on what the CLI gave to us
                    // Add as enter parameter all parameters that can be taken as Slave start
                    Object.keys(_CONSTANT["default"].SLAVE_START_ARGS).map(function (x) {
                      return _CONSTANT["default"].SLAVE_START_ARGS[x];
                    }).forEach(function (x) {
                      if (parsedOptions[x]) optCreatSlave[x] = parsedOptions[x];
                    });
                    _context2.next = 9;
                    return roleHandler.startRole(_CONSTANT["default"].DEFAULT_ROLES.SLAVE_ROLE.id, optCreatSlave);

                  case 9:
                    return _context2.abrupt("return", true);

                  case 10:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          function func() {
            return _func2.apply(this, arguments);
          }

          return func;
        }()
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return instance || new LaunchScenarios();
    }
  }, {
    key: "readLaunchMasterSlaveConfigurationFile",
    value: function readLaunchMasterSlaveConfigurationFile(filename) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func3 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee3() {
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.t0 = _Utils["default"];
                    _context3.next = 3;
                    return _Utils["default"].readFile(filename);

                  case 3:
                    _context3.t1 = _context3.sent;
                    return _context3.abrupt("return", _context3.t0.parseHjsonContent.call(_context3.t0, _context3.t1));

                  case 5:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          function func() {
            return _func3.apply(this, arguments);
          }

          return func;
        }()
      });
    }
  }, {
    key: "parseEqualsArrayOptions",
    value: function parseEqualsArrayOptions(options, name) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func4 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee4() {
            var tmp, parsedOptions, ret;
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!(!options || !options[name])) {
                      _context4.next = 2;
                      break;
                    }

                    return _context4.abrupt("return", {});

                  case 2:
                    if (options[name] instanceof Array) {
                      _context4.next = 4;
                      break;
                    }

                    throw new _Errors["default"]('INVALID_LAUNCHING_PARAMETER', "Parameter: ".concat(name));

                  case 4:
                    parsedOptions = {};
                    ret = options[name].some(function (x) {
                      tmp = x.split('='); // If the pattern optA=value isn't respected return an error

                      if (tmp.length !== 2) return true;
                      parsedOptions[tmp[0]] = tmp[1];
                      return false;
                    });

                    if (!ret) {
                      _context4.next = 8;
                      break;
                    }

                    throw new _Errors["default"]('INVALID_LAUNCHING_PARAMETER', "Parameter: ".concat(name));

                  case 8:
                    return _context4.abrupt("return", parsedOptions);

                  case 9:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));

          function func() {
            return _func4.apply(this, arguments);
          }

          return func;
        }()
      });
    }
  }]);
  return LaunchScenarios;
}();

exports["default"] = LaunchScenarios;
//# sourceMappingURL=LaunchScenarios.js.map
