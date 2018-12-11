'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
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
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(idRole, args) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.startSomething(idRole, args));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function startRole(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return startRole;
    }()

    /**
     * Stop the given role
     * @param {Number} idRole
     * @param {Array} args
     */

  }, {
    key: 'stopRole',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(idRole, args) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', this.stopSomething(idRole, args));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function stopRole(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return stopRole;
    }()

    /**
     * Stop all the running roles
     * @param {?Array} args
     */

  }, {
    key: 'stopAllRole',
    value: function stopAllRole() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      return this.stopAllSomething(args);
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
}(_AHandler3.default); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports


exports.default = RoleHandler;
//# sourceMappingURL=RoleHandler.js.map
