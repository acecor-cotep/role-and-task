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

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _Library = _interopRequireDefault(require("../../src/Library.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports
var instance = null;
/**
 * Define a Simple task which display a message every X seconds
 */

var SimpleTask =
/*#__PURE__*/
function (_library$ATask) {
  (0, _inherits2["default"])(SimpleTask, _library$ATask);

  /**
   * Constructor
   */
  function SimpleTask() {
    var _this;

    (0, _classCallCheck2["default"])(this, SimpleTask);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SimpleTask).call(this));
    if (instance) return (0, _possibleConstructorReturn2["default"])(_this, instance);
    _this.name = 'SimpleTask';
    _this.id = 10; // Pointer to the role it is assigned to

    _this.role = false;
    instance = (0, _assertThisInitialized2["default"])(_this);
    return (0, _possibleConstructorReturn2["default"])(_this, instance);
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


  (0, _createClass2["default"])(SimpleTask, [{
    key: "applyNewProgramState",
    value: function () {
      var _applyNewProgramState = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(programState) {
        var _library$CONSTANT$DEF, READY_PROCESS, ERROR, CLOSE;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _library$CONSTANT$DEF = _Library["default"].CONSTANT.DEFAULT_STATES, READY_PROCESS = _library$CONSTANT$DEF.READY_PROCESS, ERROR = _library$CONSTANT$DEF.ERROR, CLOSE = _library$CONSTANT$DEF.CLOSE;
                console.log(" > ".concat(global.processPid, " : Handling new state ").concat(programState.name)); // Depending on the state of the system we are starting or stoping the dispay
                // If all is ready, we start the display

                if (!(programState.id === READY_PROCESS.id)) {
                  _context.next = 5;
                  break;
                }

                this.startDisplay();
                return _context.abrupt("return");

              case 5:
                // If we close of if we got an error, we stop the display
                if (programState.id === CLOSE.id || programState.id === ERROR.id) {
                  this.stopDisplay();
                }

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function applyNewProgramState(_x) {
        return _applyNewProgramState.apply(this, arguments);
      }

      return applyNewProgramState;
    }()
    /*
     * ======================================================================================================================================
     *                                                 TASK METHODS
     * ======================================================================================================================================
     */

  }, {
    key: "startDisplay",
    value: function startDisplay() {
      console.log(" > ".concat(global.processPid, " : Start Working"));
      this.descriptor = setInterval(function () {
        console.log(" > ".concat(global.processPid, " : working in progress ..."));
      }, 1000);
    }
  }, {
    key: "stopDisplay",
    value: function stopDisplay() {
      console.log(" > ".concat(global.processPid, " : Stop Working"));
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
    key: "start",

    /**
     * Start to run the task
     * @override
     */
    value: function () {
      var _start = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref) {
        var role;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                role = _ref.role;

                if (!this.active) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", true);

              case 3:
                // Attach the Task to the role
                this.role = role;
                this.active = true;
                return _context2.abrupt("return", true);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function start(_x2) {
        return _start.apply(this, arguments);
      }

      return start;
    }()
    /**
     * ELIOT stop to run the task
     * @param {Object} args
     * @override
     */

  }, {
    key: "stop",
    value: function () {
      var _stop = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.active) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", true);

              case 2:
                this.active = false; // Dettach the Task from the role

                this.role = false;
                return _context3.abrupt("return", true);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function stop() {
        return _stop.apply(this, arguments);
      }

      return stop;
    }()
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return instance || new SimpleTask();
    }
  }]);
  return SimpleTask;
}(_Library["default"].ATask);

exports["default"] = SimpleTask;
//# sourceMappingURL=SimpleTask.js.map
