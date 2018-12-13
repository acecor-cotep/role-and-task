'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var _Library = require('../../src/Library.js');

var _Library2 = _interopRequireDefault(_Library);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Imports
var instance = null;

/**
 * Define a Simple task which display a message every X seconds
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

var SimpleTask = function (_library$ATask) {
  (0, _inherits3.default)(SimpleTask, _library$ATask);

  /**
   * Constructor
   */
  function SimpleTask() {
    var _ret, _ret2;

    (0, _classCallCheck3.default)(this, SimpleTask);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleTask.__proto__ || (0, _getPrototypeOf2.default)(SimpleTask)).call(this));

    if (instance) return _ret = instance, (0, _possibleConstructorReturn3.default)(_this, _ret);

    _this.name = 'SimpleTask';

    _this.id = 10;

    // Pointer to the role it is assigned to
    _this.role = false;

    instance = _this;

    return _ret2 = instance, (0, _possibleConstructorReturn3.default)(_this, _ret2);
  }

  /*
   * ======================================================================================================================================
   *                                                  HANDLE STATE CHANGE
   * ======================================================================================================================================
   */

  /**
   * apply the eliot state on the task
   * @param {Number} programState
   * @param {Number} oldEliotState
   * @override
   */


  (0, _createClass3.default)(SimpleTask, [{
    key: 'applyNewProgramState',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(programState) {
        var _library$CONSTANT$DEF, READY_PROCESS, ERROR, CLOSE;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _library$CONSTANT$DEF = _Library2.default.CONSTANT.DEFAULT_STATES, READY_PROCESS = _library$CONSTANT$DEF.READY_PROCESS, ERROR = _library$CONSTANT$DEF.ERROR, CLOSE = _library$CONSTANT$DEF.CLOSE;


                console.log(' > ' + global.processPid + ' : Handling new state ' + programState.name);

                // Depending on the state of the system we are starting or stoping the dispay

                // If all is ready, we start the display

                if (!(programState.id === READY_PROCESS.id)) {
                  _context.next = 5;
                  break;
                }

                this.startDisplay();

                return _context.abrupt('return');

              case 5:

                // If we close of if we got an error, we stop the display
                if (programState.id === CLOSE.id || programState.id === ERROR.id) {
                  this.stopDisplay();
                }

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function applyNewProgramState(_x) {
        return _ref.apply(this, arguments);
      }

      return applyNewProgramState;
    }()

    /*
     * ======================================================================================================================================
     *                                                 TASK METHODS
     * ======================================================================================================================================
     */

  }, {
    key: 'startDisplay',
    value: function startDisplay() {
      console.log(' > ' + global.processPid + ' : Start Working');

      this.descriptor = setInterval(function () {
        console.log(' > ' + global.processPid + ' : working in progress ...');
      }, 1000);
    }
  }, {
    key: 'stopDisplay',
    value: function stopDisplay() {
      console.log(' > ' + global.processPid + ' : Stop Working');

      clearInterval(this.descriptor);
    }

    /*
     * ======================================================================================================================================
     *                                                 OVERRIDE BASICS
     * ======================================================================================================================================
     */

    /**
     * SINGLETON implementation
     * @override
     */

  }, {
    key: 'start',


    /**
     * Start to run the task
     * @override
     */
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref3) {
        var role = _ref3.role;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.active) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', true);

              case 2:

                // Attach the Task to the role
                this.role = role;

                this.active = true;

                return _context2.abrupt('return', true);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function start(_x2) {
        return _ref2.apply(this, arguments);
      }

      return start;
    }()

    /**
     * ELIOT stop to run the task
     * @param {Object} args
     * @override
     */

  }, {
    key: 'stop',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.active) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return', true);

              case 2:

                this.active = false;

                // Dettach the Task from the role
                this.role = false;

                return _context3.abrupt('return', true);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function stop() {
        return _ref4.apply(this, arguments);
      }

      return stop;
    }()
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      return instance || new SimpleTask();
    }
  }]);
  return SimpleTask;
}(_Library2.default.ATask);

exports.default = SimpleTask;
//# sourceMappingURL=SimpleTask.js.map
