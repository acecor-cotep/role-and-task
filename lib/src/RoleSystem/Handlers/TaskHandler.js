"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _AHandler2 = _interopRequireDefault(require("./AHandler.js"));

var _RoleAndTask = _interopRequireDefault(require("../../RoleAndTask.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../Utils/PromiseCommandPattern.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
var TaskHandler =
/*#__PURE__*/
function (_AHandler) {
  (0, _inherits2["default"])(TaskHandler, _AHandler);

  function TaskHandler() {
    (0, _classCallCheck2["default"])(this, TaskHandler);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TaskHandler).apply(this, arguments));
  }

  (0, _createClass2["default"])(TaskHandler, [{
    key: "getAllActiveTasks",

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
    key: "getInfosFromAllActiveTasks",
    value: function getInfosFromAllActiveTasks() {
      var _this = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee() {
            var activeTasks, ret;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    activeTasks = _this.getAllActiveTasks(); // If there is no active tasks, no infos to retrieve

                    if (activeTasks.length) {
                      _context.next = 3;
                      break;
                    }

                    return _context.abrupt("return", []);

                  case 3:
                    _context.next = 5;
                    return Promise.all(activeTasks.map(function (x) {
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
                    return _context.abrupt("return", ret.map(function (x, xi) {
                      return _objectSpread({}, x, {
                        idTask: activeTasks[xi].id
                      });
                    }));

                  case 10:
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
     * To all tasks apply the new program state
     * @param {Number} programState
     * @param {Number} oldProgramState
     */

  }, {
    key: "applyNewProgramState",
    value: function applyNewProgramState(programState, oldProgramState) {
      var _this2 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func2 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee2() {
            var activeTasks;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    activeTasks = _this2.getAllActiveTasks(); // If there is no active tasks, no infos to retrieve

                    if (activeTasks.length) {
                      _context2.next = 3;
                      break;
                    }

                    return _context2.abrupt("return", []);

                  case 3:
                    _context2.next = 5;
                    return Promise.all(activeTasks.map(function (x) {
                      return x.applyNewProgramState(programState, oldProgramState);
                    }));

                  case 5:
                    return _context2.abrupt("return", true);

                  case 6:
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
     * Start the given Task
     * @param {Number} idTask
     * @param {Object} args
     */

  }, {
    key: "startTask",
    value: function startTask(idTask, args) {
      var _this3 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func3 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee3() {
            var ret;
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return _this3.startSomething(idTask, args);

                  case 2:
                    ret = _context3.sent;

                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: "[TaskHandler] Task N\xB0".concat(idTask, " started").green
                    });

                    return _context3.abrupt("return", ret);

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
    /**
     * Stop the given Task
     * @param {Number} idTask
     * @param {Object} args
     */

  }, {
    key: "stopTask",
    value: function stopTask(idTask, args) {
      var _this4 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func4 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee4() {
            var ret;
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: "[TaskHandler] Ask Task N\xB0".concat(idTask, " to stop").blue
                    });

                    _context4.next = 3;
                    return _this4.stopSomething(idTask, args);

                  case 3:
                    ret = _context4.sent;

                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: "[TaskHandler] Task N\xB0".concat(idTask, " stoped").green
                    });

                    return _context4.abrupt("return", ret);

                  case 6:
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
    /**
     * Stop all the running Tasks
     * @param {?Object} args
     */

  }, {
    key: "stopAllTask",
    value: function stopAllTask() {
      var _this5 = this;

      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this5.stopAllSomething(args);
        }
      });
    }
    /**
     * Get a list of running Task status (active or not)
     */

  }, {
    key: "getTaskListStatus",
    value: function getTaskListStatus() {
      return this.getSomethingListStatus();
    }
    /**
     * Get a task
     * @param {idTask}
     */

  }, {
    key: "getTask",
    value: function getTask(idTask) {
      var _this6 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this6.getSomething(idTask);
        }
      });
    }
  }]);
  return TaskHandler;
}(_AHandler2["default"]);

exports["default"] = TaskHandler;
//# sourceMappingURL=TaskHandler.js.map
