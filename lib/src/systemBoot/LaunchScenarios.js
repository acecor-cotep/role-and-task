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

var _applyConfigurationMasterSlaveLaunch = _interopRequireDefault(require("./applyConfigurationMasterSlaveLaunch.js"));

var _RoleAndTask = _interopRequireDefault(require("../RoleAndTask.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//
// Imports

/**
 * This class implement the different launch scenarios of PROGRAM
 */
var LaunchScenarios =
/*#__PURE__*/
function () {
  function LaunchScenarios() {
    (0, _classCallCheck2["default"])(this, LaunchScenarios);
  }

  (0, _createClass2["default"])(LaunchScenarios, null, [{
    key: "getMapLaunchingModes",

    /**
     * Get the map of launching modes
     */
    value: function getMapLaunchingModes() {
      return [{
        name: _CONSTANT["default"].PROGRAM_LAUNCHING_MODE.MASTER,
        func: LaunchScenarios.master
      }, {
        name: _CONSTANT["default"].PROGRAM_LAUNCHING_MODE.SLAVE,
        func: LaunchScenarios.slave
      }].concat((0, _toConsumableArray2["default"])(_RoleAndTask["default"].getInstance().customLaunchingMode));
    }
    /**
     * Read the Master Slave launch configuration file
     */

  }, {
    key: "readLaunchMasterSlaveConfigurationFile",
    value: function readLaunchMasterSlaveConfigurationFile(filename) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee() {
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.t0 = _Utils["default"];
                    _context.next = 3;
                    return _Utils["default"].readFile(filename);

                  case 3:
                    _context.t1 = _context.sent;
                    return _context.abrupt("return", _context.t0.parseHjsonContent.call(_context.t0, _context.t1));

                  case 5:
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
     * Start PROGRAM in master mode
     */

  }, {
    key: "master",
    value: function master(options, launchMasterSlaveConfigurationFile) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func2 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee2() {
            var launchConfFileContent;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return _RoleAndTask["default"].getInstance().spreadStateToListener();

                  case 2:
                    _context2.next = 4;
                    return LaunchScenarios.readLaunchMasterSlaveConfigurationFile(launchMasterSlaveConfigurationFile);

                  case 4:
                    launchConfFileContent = _context2.sent;
                    _context2.next = 7;
                    return (0, _applyConfigurationMasterSlaveLaunch["default"])(launchConfFileContent);

                  case 7:
                    _context2.next = 9;
                    return _RoleAndTask["default"].getInstance().changeProgramState(_CONSTANT["default"].DEFAULT_STATES.READY_PROCESS.id);

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
    /**
     * Start PROGRAM in slave mode
     */

  }, {
    key: "slave",
    value: function slave(options) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func3 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee3() {
            var roleHandler;
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    roleHandler = _RoleAndTask["default"].getInstance().getRoleHandler();
                    _context3.next = 3;
                    return roleHandler.startRole(_CONSTANT["default"].DEFAULT_ROLES.SLAVE_ROLE.id, options.modeoptions);

                  case 3:
                    return _context3.abrupt("return", true);

                  case 4:
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
  }]);
  return LaunchScenarios;
}();

exports["default"] = LaunchScenarios;
//# sourceMappingURL=LaunchScenarios.js.map
