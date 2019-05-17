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

var _child_process = _interopRequireDefault(require("child_process"));

var _Utils = _interopRequireDefault(require("./Utils.js"));

var _Errors = _interopRequireDefault(require("./Errors.js"));

var _RoleAndTask = _interopRequireDefault(require("../RoleAndTask.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// imports
var instance = null;
/**
 * This class handle all processes that are related to PROGRAM instance
 */

var UtilsProcess =
/*#__PURE__*/
function () {
  /**
   * Constructor
   */
  function UtilsProcess() {
    (0, _classCallCheck2["default"])(this, UtilsProcess);
    if (instance) return instance;
    instance = this;
    return instance;
  }
  /**
   * Singleton implementation
   */


  (0, _createClass2["default"])(UtilsProcess, null, [{
    key: "getInstance",
    value: function getInstance() {
      return instance || new UtilsProcess();
    }
    /**
     * Return an array that contains all zombies pids
     * @param {Array} allPids
     * @param {Array} goodPids
     */

  }, {
    key: "getZombieFromAllPid",
    value: function getZombieFromAllPid(allPids, goodPids) {
      return allPids.filter(function (x) {
        return !_Utils["default"].checkThatAtLeastOneElementOfArray1ExistInArray2([x], goodPids);
      });
    }
    /**
     * Evaluate PROGRAM processes and return a list of Zombies and Healthy processes that are actually running
     */

  }, {
    key: "evaluateProgramProcesses",
    value: function () {
      var _evaluateProgramProcesses = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var healthy, allProcess, zombies;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _RoleAndTask["default"].getInstance().getFullSystemPids();

              case 2:
                healthy = _context.sent;
                _context.next = 5;
                return UtilsProcess.evaluateNumberOfProcessThatExist();

              case 5:
                allProcess = _context.sent;
                // Extract the zombies from all pids that get detected
                zombies = UtilsProcess.getZombieFromAllPid(allProcess, healthy);
                return _context.abrupt("return", {
                  zombies: zombies,
                  healthy: healthy
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function evaluateProgramProcesses() {
        return _evaluateProgramProcesses.apply(this, arguments);
      }

      return evaluateProgramProcesses;
    }()
    /**
     * Evaluate the number of processus that exist
     */

  }, {
    key: "evaluateNumberOfProcessThatExist",
    value: function () {
      var _evaluateNumberOfProcessThatExist = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  _child_process["default"].exec(_Utils["default"].monoline([// Display the processes
                  'ps aux', // Give the result to the next command
                  ' | ', // Use a regexp to identify the lines that correspond to PROGRAM processes only [+ tests mocha processes]
                  'grep -oEi \'([0-9].+?node.+src/systemBoot.+)|([0-9].+?node.+node_modules.+?mocha.+)\'']), function (error, stdout, stderr) {
                    // Error of childProcess
                    if (error) return reject(new _Errors["default"]('E8083', "".concat(String(error)))); // Error of the console command

                    if (stderr) return reject(new _Errors["default"]('E8083', "".concat(String(stderr)))); // Pass a second regexp to remove the pid of the commands themselves moreover npm scripts

                    var regexp = /^((?!grep|npm).)+$/img;
                    var filtered = stdout.match(regexp); // Now we extract pid from filtered data

                    var pids = filtered.map(function (x) {
                      return String(x.split(' ')[0]);
                    }); // Exclude processes about the command itself

                    return resolve(pids);
                  });
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function evaluateNumberOfProcessThatExist() {
        return _evaluateNumberOfProcessThatExist.apply(this, arguments);
      }

      return evaluateNumberOfProcessThatExist;
    }()
    /**
     * Kill one process
     */

  }, {
    key: "killOneProcess",
    value: function killOneProcess(pid) {
      return new Promise(function (resolve, reject) {
        _child_process["default"].exec("kill -9 ".concat(pid), function (error, stdout, stderr) {
          // Error of childProcess
          if (error) return reject(new _Errors["default"]('E8083', "".concat(String(error)))); // Error of the console command

          if (stderr) return reject(new _Errors["default"]('E8083', "".concat(String(stderr))));
          return resolve(pid);
        });
      });
    }
  }]);
  return UtilsProcess;
}();

exports["default"] = UtilsProcess;
//# sourceMappingURL=UtilsProcess.js.map
