"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _ARole2 = _interopRequireDefault(require("../ARole.js"));

var _CONSTANT = _interopRequireDefault(require("../../../Utils/CONSTANT/CONSTANT.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 *
 * @interface
 */
var AMaster =
/*#__PURE__*/
function (_ARole) {
  (0, _inherits2["default"])(AMaster, _ARole);

  function AMaster() {
    var _this;

    (0, _classCallCheck2["default"])(this, AMaster);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AMaster).call(this));
    _this.name = _CONSTANT["default"].DEFAULT_ROLES.ABSTRACT_MASTER_ROLE.name;
    _this.id = _CONSTANT["default"].DEFAULT_ROLES.ABSTRACT_MASTER_ROLE.id;
    return _this;
  }

  return AMaster;
}(_ARole2["default"]);

exports["default"] = AMaster;
//# sourceMappingURL=AMaster.js.map
