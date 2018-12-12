'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _CONSTANT = require('../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _Utils = require('../../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ELIOT process have 0 or + defined Role
 *
 * A Role can be described as a purpose to fulfill
 *
 * Example: Master or Slave -> (The purpose of Master is to manage Slave)
 *
 * A ROLE MUST BE DEFINED AS A SINGLETON (Which means the implementation of getInstance)
 *
 * A ROLE CAN BE APPLIED ONLY ONCE (Ex: You can apply the ServerAPI only once, can't apply twice the ServerAPI Role for a ELIOT instance)
 * @interface
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var ARole = function () {
  function ARole() {
    (0, _classCallCheck3.default)(this, ARole);

    this.name = _CONSTANT2.default.DEFAULT_ROLES.ABSTRACT_ROLE.name;

    this.id = _CONSTANT2.default.DEFAULT_ROLES.ABSTRACT_ROLE.id;

    this.active = false;

    // Tasks handled (You need one)
    this.taskHandler = false;
  }

  /**
   * Setup a taskHandler to the role
   * Every Role have its specific tasks
   * @param {TaskHandler} taskHandler
   */


  (0, _createClass3.default)(ARole, [{
    key: 'setTaskHandler',
    value: function setTaskHandler(taskHandler) {
      this.taskHandler = taskHandler;
    }

    /**
     * Return the task handler
     */

  }, {
    key: 'getTaskHandler',
    value: function getTaskHandler() {
      return this.taskHandler;
    }

    /**
     * Return the given task
     * @param {Number} idTask
     */

  }, {
    key: 'getTask',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(idTask) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.taskHandler) {
                  _context.next = 2;
                  break;
                }

                throw new Error('EXXXX : No taskHandler defined');

              case 2:
                return _context.abrupt('return', this.taskHandler.getTask(idTask));

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTask(_x) {
        return _ref.apply(this, arguments);
      }

      return getTask;
    }()

    /**
     * Start a new task inside the role
     * @param {String} idTask
     * @param {Object} args
     */

  }, {
    key: 'startTask',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(idTask, args) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.taskHandler) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('EXXXX : No taskHandler defined');

              case 2:
                return _context2.abrupt('return', this.taskHandler.startTask(idTask, (0, _extends3.default)({}, args, {
                  role: this
                })));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function startTask(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return startTask;
    }()

    /**
     * Stop a task inside a role
     * @param {String} idTask
     */

  }, {
    key: 'stopTask',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(idTask) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.taskHandler) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('EXXXX : No taskHandler defined');

              case 2:
                return _context3.abrupt('return', this.taskHandler.stopTask(idTask));

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function stopTask(_x4) {
        return _ref3.apply(this, arguments);
      }

      return stopTask;
    }()

    /**
     * Get tasks that are available to the role
     */

  }, {
    key: 'stopAllTask',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.taskHandler) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('EXXXX : No taskHandler defined');

              case 2:
                return _context4.abrupt('return', this.taskHandler.stopAllTask());

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function stopAllTask() {
        return _ref4.apply(this, arguments);
      }

      return stopAllTask;
    }()

    /**
     * Return the list of tasks and theirs status (isActive: true/false)
     */

  }, {
    key: 'getTaskListStatus',
    value: function getTaskListStatus() {
      if (!this.taskHandler) return new Error('EXXXX : No taskHandler defined');

      return this.taskHandler.getTaskListStatus();
    }

    /**
     * Get the name of the Role
     * @return {String}
     */

  }, {
    key: 'isActive',


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
    key: 'start',


    /**
     * ELIOT start to play the role
     * @param {Object} args
     * @abstract
     */
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                throw new Error('Unimplemented getInstance methods in ' + _Utils2.default.getFunctionName() + ' child');

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function start() {
        return _ref5.apply(this, arguments);
      }

      return start;
    }()

    /**
     * ELIOT stop to play the role
     * @param {Object} args
     * @abstract
     */

  }, {
    key: 'stop',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                throw new Error('Unimplemented getInstance methods in ' + _Utils2.default.getFunctionName() + ' child');

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function stop() {
        return _ref6.apply(this, arguments);
      }

      return stop;
    }()

    /**
     * Build an head/body pattern message
     * @param {String} head
     * @param {Object} body
     */

  }, {
    key: 'buildHeadBodyMessage',
    value: function buildHeadBodyMessage(head, body) {
      var _JSON$stringify2;

      return (0, _stringify2.default)((_JSON$stringify2 = {}, (0, _defineProperty3.default)(_JSON$stringify2, _CONSTANT2.default.PROTOCOL_KEYWORDS.HEAD, head), (0, _defineProperty3.default)(_JSON$stringify2, _CONSTANT2.default.PROTOCOL_KEYWORDS.BODY, body), _JSON$stringify2));
    }
  }], [{
    key: 'getInstance',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                throw new Error('Unimplemented getInstance methods in ' + _Utils2.default.getFunctionName() + ' child');

              case 1:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getInstance() {
        return _ref7.apply(this, arguments);
      }

      return getInstance;
    }()
  }, {
    key: 'name',
    get: function get() {
      return this.name;
    }
  }]);
  return ARole;
}();

exports.default = ARole;
//# sourceMappingURL=ARole.js.map
