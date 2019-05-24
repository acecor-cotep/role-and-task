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

var _Errors = _interopRequireDefault(require("./Errors.js"));

var _Utils = _interopRequireDefault(require("./Utils.js"));

var _CONSTANT = _interopRequireDefault(require("./CONSTANT/CONSTANT.js"));

//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//
// import

/**
 * Define a pattern that can be used to handle function execution errors easily
 */
var PromiseCommandPattern =
/*#__PURE__*/
function () {
  /**
   * Constructor
   *
   * {{
   *   // Function to execute
   *   func: Function,
   *
   *   // Function to call to handle the error
   *   error: Function,
   * }}
   *
   */
  function PromiseCommandPattern(_ref) {
    var func = _ref.func,
        error = _ref.error;
    (0, _classCallCheck2["default"])(this, PromiseCommandPattern);
    // If we have the old system (with asyn execute new code)
    this.funcToExecute = func;
    this.callerFunctionName = _Utils["default"].getFunctionName(_CONSTANT["default"].NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN);
    this.error = error || false;
    return this.executeAsync();
  }
  /**
   * Execute the fuinction to execute which is the purpose of PromiseCommandPattern
   */


  (0, _createClass2["default"])(PromiseCommandPattern, [{
    key: "executeFunctionToExecute",
    value: function () {
      var _executeFunctionToExecute = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var error;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                return _context.abrupt("return", this.funcToExecute.call(null));

              case 4:
                _context.prev = 4;
                _context.t0 = _context["catch"](0);
                error = !_Errors["default"].staticIsAnError(_context.t0) ? new _Errors["default"]('EUNEXPECTED', String(_context.t0 && _context.t0.stack || _context.t0), this.callerFunctionName) : _context.t0; // If the user have a special error use, use it

                if (!this.error) {
                  _context.next = 12;
                  break;
                }

                _context.next = 10;
                return this.error(error);

              case 10:
                _context.next = 13;
                break;

              case 12:
                throw error;

              case 13:
                return _context.abrupt("return", false);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 4]]);
      }));

      function executeFunctionToExecute() {
        return _executeFunctionToExecute.apply(this, arguments);
      }

      return executeFunctionToExecute;
    }()
    /**
     * Execute the command using async syntax
     */

  }, {
    key: "executeAsync",
    value: function () {
      var _executeAsync = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        var error;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                return _context2.abrupt("return", this.executeFunctionToExecute());

              case 4:
                _context2.prev = 4;
                _context2.t0 = _context2["catch"](0);

                if (!(_context2.t0 === _CONSTANT["default"].QUIT)) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", _context2.t0);

              case 8:
                // PARTICULAR CASE TO HANDLE QUIT
                // PARTICULAR CASE TO HANDLE QUIT
                error = !_Errors["default"].staticIsAnError(_context2.t0) ? new _Errors["default"]('EUNEXPECTED', String(_context2.t0 && _context2.t0.stack || _context2.t0), this.callerFunctionName) : _context2.t0;

                if (!this.stackTrace) {
                  _context2.next = 11;
                  break;
                }

                throw _Errors["default"].shortcutStackTraceSpecial(error, this.callerFunctionName);

              case 11:
                throw error;

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 4]]);
      }));

      function executeAsync() {
        return _executeAsync.apply(this, arguments);
      }

      return executeAsync;
    }()
  }]);
  return PromiseCommandPattern;
}();

exports["default"] = PromiseCommandPattern;
//# sourceMappingURL=PromiseCommandPattern.js.map
