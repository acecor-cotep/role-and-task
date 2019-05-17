"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Utils = _interopRequireDefault(require("../../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../../Utils/Errors.js"));

var _CONSTANT = _interopRequireDefault(require("../../Utils/CONSTANT/CONSTANT.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * Define the pattern of a link between two tasks
 */
var ALink =
/*#__PURE__*/
function () {
  /**
   * Constructor
   */
  function ALink() {
    (0, _classCallCheck2["default"])(this, ALink);
    this.linkFrom = false;
    this.linkTo = false;
  }
  /**
   * Connect to the given task
   * @abstract
   */


  (0, _createClass2["default"])(ALink, [{
    key: "connectToTask",
    value: function connectToTask() {
      throw new _Errors["default"]('EXXXX', "Function ".concat(_Utils["default"].getFunctionName(), " must be redefined in child"));
    }
    /**
     * Stop the current connections
     * @abstract
     */

  }, {
    key: "stop",
    value: function stop() {
      throw new _Errors["default"]('EXXXX', "Function ".concat(_Utils["default"].getFunctionName(), " must be redefined in child"));
    }
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
  }]);
  return ALink;
}();

exports["default"] = ALink;
//# sourceMappingURL=ALink.js.map
