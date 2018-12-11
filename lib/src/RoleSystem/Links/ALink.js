'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Utils = require('../../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _CONSTANT = require('../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Define the pattern of a link between two tasks
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var ALink = function () {
  /**
   * Constructor
   */
  function ALink() {
    (0, _classCallCheck3.default)(this, ALink);

    this.linkFrom = false;
    this.linkTo = false;
  }

  /**
   * Connect to the given task
   * @abstract
   */


  (0, _createClass3.default)(ALink, [{
    key: 'connectToTask',
    value: function connectToTask() {
      throw new Error('Function ' + _Utils2.default.getFunctionName() + ' must be redefined in child');
    }

    /**
     * Stop the current connections
     * @abstract
     */

  }, {
    key: 'stop',
    value: function stop() {
      throw new Error('Function ' + _Utils2.default.getFunctionName() + ' must be redefined in child');
    }

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
  }]);
  return ALink;
}();

exports.default = ALink;
//# sourceMappingURL=ALink.js.map
