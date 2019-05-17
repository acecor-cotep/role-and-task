"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _AHandler2 = _interopRequireDefault(require("./AHandler.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports

/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
var RoleHandler =
/*#__PURE__*/
function (_AHandler) {
  (0, _inherits2["default"])(RoleHandler, _AHandler);

  function RoleHandler() {
    (0, _classCallCheck2["default"])(this, RoleHandler);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(RoleHandler).apply(this, arguments));
  }

  (0, _createClass2["default"])(RoleHandler, [{
    key: "startRole",

    /**
     * Start the given role
     * @param {Number} idRole
     * @param {Array} args
     */
    value: function startRole(idRole, args) {
      var _this = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this.startSomething(idRole, args);
        }
      });
    }
    /**
     * Stop the given role
     * @param {Number} idRole
     * @param {Array} args
     */

  }, {
    key: "stopRole",
    value: function stopRole(idRole, args) {
      var _this2 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this2.stopSomething(idRole, args);
        }
      });
    }
    /**
     * Stop all the running roles
     * @param {?Array} args
     */

  }, {
    key: "stopAllRole",
    value: function stopAllRole() {
      var _this3 = this;

      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this3.stopAllSomething(args);
        }
      });
    }
    /**
     * Get a list of running role status (active or not)
     */

  }, {
    key: "getRoleListStatus",
    value: function getRoleListStatus() {
      return this.getSomethingListStatus();
    }
    /**
     * Get a role
     * @param {idRole}
     */

  }, {
    key: "getRole",
    value: function getRole(idRole) {
      return this.getSomething(idRole);
    }
  }]);
  return RoleHandler;
}(_AHandler2["default"]);

exports["default"] = RoleHandler;
//# sourceMappingURL=RoleHandler.js.map
