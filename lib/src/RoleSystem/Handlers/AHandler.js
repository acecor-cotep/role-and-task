'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Utils = require('../../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This class handle something
 */
var AHandler = function () {
  /**
   * @param {Object} data
   * @param {{[String]: Class}} mapSomethingConstantAndObject
   * Map that match the constant of something with the actual Something classes
   */
  function AHandler(data) {
    (0, _classCallCheck3.default)(this, AHandler);

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


  (0, _createClass3.default)(AHandler, [{
    key: 'genericAskingSomethingToDoSomething',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(idSomething, args, funcToCall) {
        var _this = this;

        var elem;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(idSomething === -1)) {
                  _context.next = 2;
                  break;
                }

                throw new Error('E7001');

              case 2:

                // Look in our array if we found the Something
                elem = (0, _keys2.default)(this.something).find(function (x) {
                  return _this.something[x].id === idSomething;
                });

                // Cannot find the given id

                if (elem) {
                  _context.next = 5;
                  break;
                }

                throw new Error('E7002 : idSomething: ' + idSomething);

              case 5:
                if (this.something[elem].obj) {
                  _context.next = 7;
                  break;
                }

                throw new Error('EXXXX : Cannot find the object to apply/disable (obj in the code)');

              case 7:
                return _context.abrupt('return', this.something[elem].obj[funcToCall].call(this.something[elem].obj, args));

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function genericAskingSomethingToDoSomething(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return genericAskingSomethingToDoSomething;
    }()

    /**
     * Start the given Something
     * @param {Number} idSomething
     * @param {Object} args
     */

  }, {
    key: 'startSomething',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(idSomething, args) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', this.genericAskingSomethingToDoSomething(idSomething, args, 'start'));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function startSomething(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return startSomething;
    }()

    /**
     * Stop the given Something
     * @param {Number} idSomething
     * @param {Array} args
     */

  }, {
    key: 'stopSomething',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(idSomething, args) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', this.genericAskingSomethingToDoSomething(idSomething, args, 'stop'));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function stopSomething(_x6, _x7) {
        return _ref3.apply(this, arguments);
      }

      return stopSomething;
    }()

    /**
     * Stop all the running Something
     * @param {?Array} args
     */

  }, {
    key: 'stopAllSomething',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var _this2 = this;

        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var objToStop;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                objToStop = (0, _keys2.default)(this.something).reduce(function (tmp, x) {
                  if (_this2.something[x].obj && _this2.something[x].obj.isActive()) tmp.push(_this2.something[x].id);

                  return tmp;
                }, []);
                return _context4.abrupt('return', _Utils2.default.recursiveCallFunction({
                  context: this,
                  func: this.stopSomething,
                  objToIterate: objToStop,
                  nameToSend: null,
                  nameTakenInDocs: null,
                  additionnalParams: args
                }));

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function stopAllSomething() {
        return _ref4.apply(this, arguments);
      }

      return stopAllSomething;
    }()

    /**
     * Get an object using the id of it
     * @param {String} idSomething
     */

  }, {
    key: 'getSomething',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(idSomething) {
        var _this3 = this;

        var elem;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                elem = (0, _keys2.default)(this.something).find(function (x) {
                  return _this3.something[x].id === idSomething;
                });

                if (elem) {
                  _context5.next = 3;
                  break;
                }

                throw new Error('EXXXX : Cannot find obj in the code ' + idSomething);

              case 3:
                if (this.something[elem].obj) {
                  _context5.next = 5;
                  break;
                }

                throw new Error('EXXXX : Cannot find obj in the code ' + (0, _stringify2.default)(this.something[elem]));

              case 5:
                return _context5.abrupt('return', this.something[elem].obj);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getSomething(_x9) {
        return _ref5.apply(this, arguments);
      }

      return getSomething;
    }()

    /**
     * Get all something in array
     */

  }, {
    key: 'getAllSomething',
    value: function getAllSomething() {
      var _this4 = this;

      return (0, _keys2.default)(this.something).map(function (x) {
        return _this4.something[x].obj;
      });
    }

    /**
     * Get a list of running something status (active or not)
     */

  }, {
    key: 'getSomethingListStatus',
    value: function getSomethingListStatus() {
      var _this5 = this;

      return (0, _keys2.default)(this.something).reduce(function (tmp, x) {
        if (_this5.something[x].obj) {
          return [].concat((0, _toConsumableArray3.default)(tmp), [{
            name: _this5.something[x].name,
            id: _this5.something[x].id,
            isActive: _this5.something[x].obj.isActive()
          }]);
        }

        return [].concat((0, _toConsumableArray3.default)(tmp), [{
          name: _this5.something[x].name,
          id: _this5.something[x].id,
          isActive: false
        }]);
      }, []);
    }
  }]);
  return AHandler;
}(); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports


exports.default = AHandler;
//# sourceMappingURL=AHandler.js.map
