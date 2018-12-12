'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _AHandler2 = require('./AHandler.js');

var _AHandler3 = _interopRequireDefault(_AHandler2);

var _RoleAndTask = require('../../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

var _PromiseCommandPattern = require('../../Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This class handle Task for the process
 * Meaning launching a Task, stop a Task
 *
 * data => [{
 *    name: String,
 *    color: String,
 *    id: Number,
 *    idsAllowedRole: [Number],
 *    obj: ATask,
 * }],
 *
 * (For example with Role)
 *
 * Call -> constructor(data, mapTaskConstantAndObject);
 */
var TaskHandler = function (_AHandler) {
  (0, _inherits3.default)(TaskHandler, _AHandler);

  function TaskHandler() {
    (0, _classCallCheck3.default)(this, TaskHandler);
    return (0, _possibleConstructorReturn3.default)(this, (TaskHandler.__proto__ || (0, _getPrototypeOf2.default)(TaskHandler)).apply(this, arguments));
  }

  (0, _createClass3.default)(TaskHandler, [{
    key: 'getAllActiveTasks',

    /**
     * Get all active task in array
     */
    value: function getAllActiveTasks() {
      return this.getAllSomething().filter(function (x) {
        return x.isActive();
      });
    }

    /**
     * Get infos tasks relative to the type of tasks
     */

  }, {
    key: 'getInfosFromAllActiveTasks',
    value: function getInfosFromAllActiveTasks() {
      var _this2 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var activeTasks, ret;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    activeTasks = _this2.getAllActiveTasks();

                    // If there is no active tasks, no infos to retrieve

                    if (activeTasks.length) {
                      _context.next = 3;
                      break;
                    }

                    return _context.abrupt('return', []);

                  case 3:
                    _context.next = 5;
                    return _promise2.default.all(activeTasks.map(function (x) {
                      return x.gatherInfosFromTask();
                    }));

                  case 5:
                    _context.t0 = _context.sent;

                    if (_context.t0) {
                      _context.next = 8;
                      break;
                    }

                    _context.t0 = [];

                  case 8:
                    ret = _context.t0;
                    return _context.abrupt('return', ret.map(function (x, xi) {
                      return (0, _extends3.default)({}, x, {

                        idTask: activeTasks[xi].id
                      });
                    }));

                  case 10:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2);
          }));

          return function func() {
            return _ref.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * To all tasks apply the new program state
     * @param {Number} programState
     * @param {Number} oldProgramState
     */

  }, {
    key: 'applyNewProgramState',
    value: function applyNewProgramState(programState, oldProgramState) {
      var _this3 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            var activeTasks;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    activeTasks = _this3.getAllActiveTasks();

                    // If there is no active tasks, no infos to retrieve

                    if (activeTasks.length) {
                      _context2.next = 3;
                      break;
                    }

                    return _context2.abrupt('return', []);

                  case 3:
                    _context2.next = 5;
                    return _promise2.default.all(activeTasks.map(function (x) {
                      return x.applyNewProgramState(programState, oldProgramState);
                    }));

                  case 5:
                    return _context2.abrupt('return', true);

                  case 6:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this3);
          }));

          return function func() {
            return _ref2.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Start the given Task
     * @param {Number} idTask
     * @param {Object} args
     */

  }, {
    key: 'startTask',
    value: function startTask(idTask, args) {
      var _this4 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var ret;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return _this4.startSomething(idTask, args);

                  case 2:
                    ret = _context3.sent;


                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: ('[TaskHandler] Task N\xB0' + idTask + ' started').green
                    });

                    return _context3.abrupt('return', ret);

                  case 5:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this4);
          }));

          return function func() {
            return _ref3.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Stop the given Task
     * @param {Number} idTask
     * @param {Object} args
     */

  }, {
    key: 'stopTask',
    value: function stopTask(idTask, args) {
      var _this5 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var ret;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: ('[TaskHandler] Ask Task N\xB0' + idTask + ' to stop').blue
                    });

                    _context4.next = 3;
                    return _this5.stopSomething(idTask, args);

                  case 3:
                    ret = _context4.sent;


                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: ('[TaskHandler] Task N\xB0' + idTask + ' stoped').green
                    });

                    return _context4.abrupt('return', ret);

                  case 6:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, _this5);
          }));

          return function func() {
            return _ref4.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Stop all the running Tasks
     * @param {?Object} args
     */

  }, {
    key: 'stopAllTask',
    value: function stopAllTask() {
      var _this6 = this;

      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this6.stopAllSomething(args);
        }
      });
    }

    /**
     * Get a list of running Task status (active or not)
     */

  }, {
    key: 'getTaskListStatus',
    value: function getTaskListStatus() {
      return this.getSomethingListStatus();
    }

    /**
     * Get a task
     * @param {idTask}
     */

  }, {
    key: 'getTask',
    value: function getTask(idTask) {
      var _this7 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this7.getSomething(idTask);
        }
      });
    }
  }]);
  return TaskHandler;
}(_AHandler3.default); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports


exports.default = TaskHandler;
//# sourceMappingURL=TaskHandler.js.map
