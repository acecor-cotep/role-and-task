'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _Root = require('./ImportedConstant/Root.js');

var _Root2 = _interopRequireDefault(_Root);

var _System = require('./ImportedConstant/System.js');

var _System2 = _interopRequireDefault(_System);

var _ZeroMQ = require('./ImportedConstant/ZeroMQ.js');

var _ZeroMQ2 = _interopRequireDefault(_ZeroMQ);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 **  Every child classes must be instenciate like this :
 **  superclass => return class extends superclass {}
 **
 ** @example
 ** Here is an array of classes :
 **   [
 **     A,
 **     B,
 **     C,
 **     ROOT,
 **   ] array
 **
 ** This function will return a class like this :
 ** class CONSTANT extends recursiveInterface(array)
 **
 ** Is equivalent to :
 **
 ** class CONSTANT extends(class A extends (class B extends (class C extends (class ROOT))))
 **
 ** For example if B needs to access C methods, B needs to extends C, B needs to be before C in the array
 **
 */
function recursiveInterface(arr) {
  var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!arr[i]) {
    return function () {
      function _class() {
        (0, _classCallCheck3.default)(this, _class);
      }

      return _class;
    }();
  }

  return arr[i](recursiveInterface(arr, i + 1));
} //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/**
 * This class is the main CONSTANT that import all child constant files
 */

// Here are import of every child classes locate din ImportedConstant folder

var CONSTANT = function (_recursiveInterface) {
  (0, _inherits3.default)(CONSTANT, _recursiveInterface);

  function CONSTANT() {
    (0, _classCallCheck3.default)(this, CONSTANT);
    return (0, _possibleConstructorReturn3.default)(this, (CONSTANT.__proto__ || (0, _getPrototypeOf2.default)(CONSTANT)).apply(this, arguments));
  }

  return CONSTANT;
}(recursiveInterface([_ZeroMQ2.default, _System2.default,

// Keep Root at the end, this is the root class for the dependencies
_Root2.default]));

exports.default = CONSTANT;
//# sourceMappingURL=CONSTANT.js.map
