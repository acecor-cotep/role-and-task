'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _Utils = require('./Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Errors = require('./Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

var _RoleAndTask = require('../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// imports
var instance = null;

/**
 * This class handle all processes that are related to PROGRAM instance
 */

var UtilsProcess = function () {
  /**
   * Constructor
   */
  function UtilsProcess() {
    (0, _classCallCheck3.default)(this, UtilsProcess);

    if (instance) return instance;

    instance = this;

    return instance;
  }

  /**
   * Singleton implementation
   */


  (0, _createClass3.default)(UtilsProcess, null, [{
    key: 'getInstance',
    value: function getInstance() {
      return instance || new UtilsProcess();
    }

    /**
     * Return an array that contains all zombies pids
     * @param {Array} allPids
     * @param {Array} goodPids
     */

  }, {
    key: 'getZombieFromAllPid',
    value: function getZombieFromAllPid(allPids, goodPids) {
      return allPids.filter(function (x) {
        return !_Utils2.default.checkThatAtLeastOneElementOfArray1ExistInArray2([x], goodPids);
      });
    }

    /**
     * Evaluate PROGRAM processes and return a list of Zombies and Healthy processes that are actually running
     */

  }, {
    key: 'evaluateProgramProcesses',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var healthy, allProcess, zombies;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _RoleAndTask2.default.getInstance().getFullSystemPids();

              case 2:
                healthy = _context.sent;
                _context.next = 5;
                return UtilsProcess.evaluateNumberOfProcessThatExist();

              case 5:
                allProcess = _context.sent;


                // Extract the zombies from all pids that get detected
                zombies = UtilsProcess.getZombieFromAllPid(allProcess, healthy);
                return _context.abrupt('return', {
                  zombies: zombies,
                  healthy: healthy
                });

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function evaluateProgramProcesses() {
        return _ref.apply(this, arguments);
      }

      return evaluateProgramProcesses;
    }()

    /**
     * Evaluate the number of processus that exist
     */

  }, {
    key: 'evaluateNumberOfProcessThatExist',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new _promise2.default(function (resolve, reject) {
                  _child_process2.default.exec(_Utils2.default.monoline([
                  // Display the processes
                  'ps aux',

                  // Give the result to the next command
                  ' | ',

                  // Use a regexp to identify the lines that correspond to PROGRAM processes only [+ tests mocha processes]
                  'grep -oEi \'([0-9].+?node.+src/systemBoot.+)|([0-9].+?node.+node_modules.+?mocha.+)\'']

                  //
                  // WARNING problem here, ps aux return the processes created by the command itself
                  // so we need to exclude it later using another regexp
                  //
                  // WARNING problem here, ps return the processes created by npm
                  // so we need to exclude it later using another regexp
                  //
                  ), function (error, stdout, stderr) {
                    // Error of childProcess
                    if (error) return reject(new _Errors2.default('E8083', '' + String(error)));

                    // Error of the console command
                    if (stderr) return reject(new _Errors2.default('E8083', '' + String(stderr)));

                    // Pass a second regexp to remove the pid of the commands themselves moreover npm scripts
                    var regexp = /^((?!grep|npm).)+$/img;

                    var filtered = stdout.match(regexp);

                    // Now we extract pid from filtered data
                    var pids = filtered.map(function (x) {
                      return String(x.split(' ')[0]);
                    });

                    // Exclude processes about the command itself
                    return resolve(pids);
                  });
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function evaluateNumberOfProcessThatExist() {
        return _ref2.apply(this, arguments);
      }

      return evaluateNumberOfProcessThatExist;
    }()

    /**
     * Kill one process
     */

  }, {
    key: 'killOneProcess',
    value: function killOneProcess(pid) {
      return new _promise2.default(function (resolve, reject) {
        _child_process2.default.exec('kill -9 ' + pid, function (error, stdout, stderr) {
          // Error of childProcess
          if (error) return reject(new _Errors2.default('E8083', '' + String(error)));

          // Error of the console command
          if (stderr) return reject(new _Errors2.default('E8083', '' + String(stderr)));

          return resolve(pid);
        });
      });
    }
  }]);
  return UtilsProcess;
}();

exports.default = UtilsProcess;
//# sourceMappingURL=UtilsProcess.js.map
