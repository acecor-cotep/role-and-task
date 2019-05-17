"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Utils = _interopRequireDefault(require("../../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../../Utils/Errors.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * This class handle something
 */
var AHandler =
/*#__PURE__*/
function () {
  /**
   * @param {Object} data
   * @param {{[String]: Class}} mapSomethingConstantAndObject
   * Map that match the constant of something with the actual Something classes
   */
  function AHandler(data) {
    (0, _classCallCheck2["default"])(this, AHandler);
    // List of available roles
    // A Something is defined as SINGLETON
    // A Something can be applied only once
    this.something = data;
  }
  /**
   * Ask something from Something
   * @param {Number} idRole
   * @param {Array} args
   * @param {Function} funcToCall
   */


  (0, _createClass2["default"])(AHandler, [{
    key: "genericAskingSomethingToDoSomething",
    value: function genericAskingSomethingToDoSomething(idSomething, args, funcToCall) {
      var _this = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee() {
            var elem;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(idSomething === -1)) {
                      _context.next = 2;
                      break;
                    }

                    throw new _Errors["default"]('E7001');

                  case 2:
                    // Look in our array if we found the Something
                    elem = Object.keys(_this.something).find(function (x) {
                      return _this.something[x].id === idSomething;
                    }); // Cannot find the given id

                    if (elem) {
                      _context.next = 5;
                      break;
                    }

                    throw new _Errors["default"]('E7002', "idSomething: ".concat(idSomething));

                  case 5:
                    if (_this.something[elem].obj) {
                      _context.next = 7;
                      break;
                    }

                    throw new _Errors["default"]('EXXXX', 'Cannot find the object to apply/disable (obj in the code)');

                  case 7:
                    return _context.abrupt("return", _this.something[elem].obj[funcToCall].call(_this.something[elem].obj, args));

                  case 8:
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
     * Start the given Something
     * @param {Number} idSomething
     * @param {Object} args
     */

  }, {
    key: "startSomething",
    value: function startSomething(idSomething, args) {
      var _this2 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this2.genericAskingSomethingToDoSomething(idSomething, args, 'start');
        }
      });
    }
    /**
     * Stop the given Something
     * @param {Number} idSomething
     * @param {Array} args
     */

  }, {
    key: "stopSomething",
    value: function stopSomething(idSomething, args) {
      var _this3 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this3.genericAskingSomethingToDoSomething(idSomething, args, 'stop');
        }
      });
    }
    /**
     * Stop all the running Something
     * @param {?Array} args
     */

  }, {
    key: "stopAllSomething",
    value: function stopAllSomething() {
      var _this4 = this;

      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func2 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee2() {
            var objToStop;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    objToStop = Object.keys(_this4.something).reduce(function (tmp, x) {
                      if (_this4.something[x].obj && _this4.something[x].obj.isActive()) tmp.push(_this4.something[x].id);
                      return tmp;
                    }, []);
                    return _context2.abrupt("return", _Utils["default"].recursiveCallFunction({
                      context: _this4,
                      func: _this4.stopSomething,
                      objToIterate: objToStop,
                      nameToSend: null,
                      nameTakenInDocs: null,
                      additionnalParams: args
                    }));

                  case 2:
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
     * Get an object using the id of it
     * @param {String} idSomething
     */

  }, {
    key: "getSomething",
    value: function getSomething(idSomething) {
      var _this5 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func3 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee3() {
            var elem;
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    elem = Object.keys(_this5.something).find(function (x) {
                      return _this5.something[x].id === idSomething;
                    });

                    if (elem) {
                      _context3.next = 3;
                      break;
                    }

                    throw new _Errors["default"]('EXXXX', "Cannot find obj in the code ".concat(idSomething));

                  case 3:
                    if (_this5.something[elem].obj) {
                      _context3.next = 5;
                      break;
                    }

                    throw new _Errors["default"]('EXXXX', "Cannot find obj in the code ".concat(JSON.stringify(_this5.something[elem])));

                  case 5:
                    return _context3.abrupt("return", _this5.something[elem].obj);

                  case 6:
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
     * Get all something in array
     */

  }, {
    key: "getAllSomething",
    value: function getAllSomething() {
      var _this6 = this;

      return Object.keys(this.something).map(function (x) {
        return _this6.something[x].obj;
      });
    }
    /**
     * Get a list of running something status (active or not)
     */

  }, {
    key: "getSomethingListStatus",
    value: function getSomethingListStatus() {
      var _this7 = this;

      return Object.keys(this.something).reduce(function (tmp, x) {
        if (_this7.something[x].obj) {
          return [].concat((0, _toConsumableArray2["default"])(tmp), [{
            name: _this7.something[x].name,
            id: _this7.something[x].id,
            isActive: _this7.something[x].obj.isActive()
          }]);
        }

        return [].concat((0, _toConsumableArray2["default"])(tmp), [{
          name: _this7.something[x].name,
          id: _this7.something[x].id,
          isActive: false
        }]);
      }, []);
    }
  }]);
  return AHandler;
}();

exports["default"] = AHandler;
//# sourceMappingURL=AHandler.js.map
