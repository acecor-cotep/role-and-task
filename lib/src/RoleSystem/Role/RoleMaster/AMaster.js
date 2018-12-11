'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _ARole2 = require('../ARole.js');

var _ARole3 = _interopRequireDefault(_ARole2);

var _CONSTANT = require('../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 *
 * @interface
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var AMaster = function (_ARole) {
  (0, _inherits3.default)(AMaster, _ARole);

  function AMaster() {
    (0, _classCallCheck3.default)(this, AMaster);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AMaster.__proto__ || (0, _getPrototypeOf2.default)(AMaster)).call(this));

    _this.name = _CONSTANT2.default.DEFAULT_ROLE.ABSTRACT_MASTER_ROLE.name;
    _this.id = _CONSTANT2.default.DEFAULT_ROLE.ABSTRACT_MASTER_ROLE.id;
    return _this;
  }

  /**
   * Getter
   */


  (0, _createClass3.default)(AMaster, [{
    key: 'getDisplayTask',
    value: function getDisplayTask() {
      return this.displayTask;
    }

    /**
     * Set the task which will gonna handle the display, if there is not specified, the display is going to be made in stdout
     */

  }, {
    key: 'setDisplayTask',
    value: function setDisplayTask(displayTask) {
      this.displayTask = displayTask;
    }

    /**
     * Getter
     */

  }, {
    key: 'getPathToEntryFile',
    value: function getPathToEntryFile() {
      return this.pathToEntryFile;
    }

    /**
     * Setup the entry point of your program
     *
     * We we are launching new slaves, we gonna use it
     */

  }, {
    key: 'setPathToEntryFile',
    value: function setPathToEntryFile(pathToEntryFile) {
      this.pathToEntryFile = pathToEntryFile;
    }
  }]);
  return AMaster;
}(_ARole3.default);

exports.default = AMaster;
//# sourceMappingURL=AMaster.js.map
