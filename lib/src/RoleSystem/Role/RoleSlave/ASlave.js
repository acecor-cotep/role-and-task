'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

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
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 *
 * @interface
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var ASlave = function (_ARole) {
  (0, _inherits3.default)(ASlave, _ARole);

  function ASlave() {
    (0, _classCallCheck3.default)(this, ASlave);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ASlave.__proto__ || (0, _getPrototypeOf2.default)(ASlave)).call(this));

    _this.name = _CONSTANT2.default.DEFAULT_ROLES.ABSTRACT_SLAVE_ROLE.name;
    _this.id = _CONSTANT2.default.DEFAULT_ROLES.ABSTRACT_SLAVE_ROLE.id;
    return _this;
  }

  return ASlave;
}(_ARole3.default);

exports.default = ASlave;
//# sourceMappingURL=ASlave.js.map
