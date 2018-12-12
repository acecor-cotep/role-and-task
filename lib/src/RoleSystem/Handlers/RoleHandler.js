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

var _AHandler2 = require('./AHandler.js');

var _AHandler3 = _interopRequireDefault(_AHandler2);

var _PromiseCommandPattern = require('../../Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var RoleHandler = function (_AHandler) {
  (0, _inherits3.default)(RoleHandler, _AHandler);

  function RoleHandler() {
    (0, _classCallCheck3.default)(this, RoleHandler);
    return (0, _possibleConstructorReturn3.default)(this, (RoleHandler.__proto__ || (0, _getPrototypeOf2.default)(RoleHandler)).apply(this, arguments));
  }

  (0, _createClass3.default)(RoleHandler, [{
    key: 'startRole',

    /**
     * Start the given role
     * @param {Number} idRole
     * @param {Array} args
     */
    value: function startRole(idRole, args) {
      var _this2 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this2.startSomething(idRole, args);
        }
      });
    }

    /**
     * Stop the given role
     * @param {Number} idRole
     * @param {Array} args
     */

  }, {
    key: 'stopRole',
    value: function stopRole(idRole, args) {
      var _this3 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this3.stopSomething(idRole, args);
        }
      });
    }

    /**
     * Stop all the running roles
     * @param {?Array} args
     */

  }, {
    key: 'stopAllRole',
    value: function stopAllRole() {
      var _this4 = this;

      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this4.stopAllSomething(args);
        }
      });
    }

    /**
     * Get a list of running role status (active or not)
     */

  }, {
    key: 'getRoleListStatus',
    value: function getRoleListStatus() {
      return this.getSomethingListStatus();
    }

    /**
     * Get a role
     * @param {idRole}
     */

  }, {
    key: 'getRole',
    value: function getRole(idRole) {
      return this.getSomething(idRole);
    }
  }]);
  return RoleHandler;
}(_AHandler3.default);

exports.default = RoleHandler;
//# sourceMappingURL=RoleHandler.js.map
