"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _Root = _interopRequireDefault(require("./ImportedConstant/Root.js"));

var _System = _interopRequireDefault(require("./ImportedConstant/System.js"));

var _ZeroMQ = _interopRequireDefault(require("./ImportedConstant/ZeroMQ.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/**
 * This class is the main CONSTANT that import all child constant files
 */
// Here are import of every child classes locate din ImportedConstant folder

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
    return (
      /*#__PURE__*/
      function () {
        function _class() {
          (0, _classCallCheck2["default"])(this, _class);
        }

        return _class;
      }()
    );
  }

  return arr[i](recursiveInterface(arr, i + 1));
}

var CONSTANT =
/*#__PURE__*/
function (_recursiveInterface) {
  (0, _inherits2["default"])(CONSTANT, _recursiveInterface);

  function CONSTANT() {
    (0, _classCallCheck2["default"])(this, CONSTANT);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CONSTANT).apply(this, arguments));
  }

  return CONSTANT;
}(recursiveInterface([_ZeroMQ["default"], _System["default"], // Keep Root at the end, this is the root class for the dependencies
_Root["default"]]));

exports["default"] = CONSTANT;
//# sourceMappingURL=CONSTANT.js.map
