"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _CONSTANT = _interopRequireDefault(require("../../Utils/CONSTANT/CONSTANT.js"));

var _Utils = _interopRequireDefault(require("../../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../../Utils/Errors.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * PROGRAM process have 0 or + defined Role
 *
 * A Role can be described as a purpose to fulfill
 *
 * Example: Master or Slave -> (The purpose of Master is to manage Slave)
 *
 * A ROLE MUST BE DEFINED AS A SINGLETON (Which means the implementation of getInstance)
 *
 * A ROLE CAN BE APPLIED ONLY ONCE (Ex: You can apply the ServerAPI only once, can't apply twice the ServerAPI Role for a PROGRAM instance)
 * @interface
 */
var ARole =
/*#__PURE__*/
function () {
  function ARole() {
    (0, _classCallCheck2["default"])(this, ARole);
    this.name = _CONSTANT["default"].DEFAULT_ROLES.ABSTRACT_ROLE.name;
    this.id = _CONSTANT["default"].DEFAULT_ROLES.ABSTRACT_ROLE.id;
    this.active = false; // Tasks handled (You need one)

    this.taskHandler = false;
  }
  /**
   * Setup a taskHandler to the role
   * Every Role have its specific tasks
   * @param {TaskHandler} taskHandler
   */


  (0, _createClass2["default"])(ARole, [{
    key: "setTaskHandler",
    value: function setTaskHandler(taskHandler) {
      this.taskHandler = taskHandler;
    }
    /**
     * Return the task handler
     */

  }, {
    key: "getTaskHandler",
    value: function getTaskHandler() {
      return this.taskHandler;
    }
    /**
     * Return the given task
     * @param {Number} idTask
     */

  }, {
    key: "getTask",
    value: function () {
      var _getTask = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(idTask) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.taskHandler) {
                  _context.next = 2;
                  break;
                }

                throw new _Errors["default"]('EXXXX', 'No taskHandler defined');

              case 2:
                return _context.abrupt("return", this.taskHandler.getTask(idTask));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTask(_x) {
        return _getTask.apply(this, arguments);
      }

      return getTask;
    }()
    /**
     * Start a new task inside the role
     * @param {String} idTask
     * @param {Object} args
     */

  }, {
    key: "startTask",
    value: function () {
      var _startTask = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(idTask, args) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.taskHandler) {
                  _context2.next = 2;
                  break;
                }

                throw new _Errors["default"]('EXXXX', 'No taskHandler defined');

              case 2:
                return _context2.abrupt("return", this.taskHandler.startTask(idTask, _objectSpread({}, args, {
                  role: this
                })));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function startTask(_x2, _x3) {
        return _startTask.apply(this, arguments);
      }

      return startTask;
    }()
    /**
     * Stop a task inside a role
     * @param {String} idTask
     */

  }, {
    key: "stopTask",
    value: function () {
      var _stopTask = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(idTask) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.taskHandler) {
                  _context3.next = 2;
                  break;
                }

                throw new _Errors["default"]('EXXXX', 'No taskHandler defined');

              case 2:
                return _context3.abrupt("return", this.taskHandler.stopTask(idTask));

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function stopTask(_x4) {
        return _stopTask.apply(this, arguments);
      }

      return stopTask;
    }()
    /**
     * Get tasks that are available to the role
     */

  }, {
    key: "stopAllTask",
    value: function () {
      var _stopAllTask = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.taskHandler) {
                  _context4.next = 2;
                  break;
                }

                throw new _Errors["default"]('EXXXX', 'No taskHandler defined');

              case 2:
                return _context4.abrupt("return", this.taskHandler.stopAllTask());

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function stopAllTask() {
        return _stopAllTask.apply(this, arguments);
      }

      return stopAllTask;
    }()
    /**
     * Return the list of tasks and theirs status (isActive: true/false)
     */

  }, {
    key: "getTaskListStatus",
    value: function getTaskListStatus() {
      if (!this.taskHandler) return new _Errors["default"]('EXXXX', 'No taskHandler defined');
      return this.taskHandler.getTaskListStatus();
    }
    /**
     * Get the name of the Role
     * @return {String}
     */

  }, {
    key: "isActive",

    /**
     * Is the Role active?
     */
    value: function isActive() {
      return this.active;
    }
    /**
     * SINGLETON implementation
     * @abstract
     */

  }, {
    key: "start",

    /**
     * PROGRAM start to play the role
     * @param {Object} args
     * @abstract
     */
    value: function () {
      var _start = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                throw new _Errors["default"]('EXXXX', "Unimplemented getInstance methods in ".concat(_Utils["default"].getFunctionName(), " child"));

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }()
    /**
     * PROGRAM stop to play the role
     * @param {Object} args
     * @abstract
     */

  }, {
    key: "stop",
    value: function () {
      var _stop = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                throw new _Errors["default"]('EXXXX', "Unimplemented getInstance methods in ".concat(_Utils["default"].getFunctionName(), " child"));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function stop() {
        return _stop.apply(this, arguments);
      }

      return stop;
    }()
    /**
     * Build an head/body pattern message
     * @param {String} head
     * @param {Object} body
     */

  }, {
    key: "buildHeadBodyMessage",
    value: function buildHeadBodyMessage(head, body) {
      var _JSON$stringify;

      return JSON.stringify((_JSON$stringify = {}, (0, _defineProperty2["default"])(_JSON$stringify, _CONSTANT["default"].PROTOCOL_KEYWORDS.HEAD, head), (0, _defineProperty2["default"])(_JSON$stringify, _CONSTANT["default"].PROTOCOL_KEYWORDS.BODY, body), _JSON$stringify));
    }
  }], [{
    key: "getInstance",
    value: function () {
      var _getInstance = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                throw new _Errors["default"]('EXXXX', "Unimplemented getInstance methods in ".concat(_Utils["default"].getFunctionName(), " child"));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function getInstance() {
        return _getInstance.apply(this, arguments);
      }

      return getInstance;
    }()
  }, {
    key: "name",
    get: function get() {
      return this.name;
    }
  }]);
  return ARole;
}();

exports["default"] = ARole;
//# sourceMappingURL=ARole.js.map
