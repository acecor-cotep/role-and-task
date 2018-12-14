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

var _errors = require('@cotep/errors');

var _errors2 = _interopRequireDefault(_errors);

var _RoleAndTask = require('../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

var _CONSTANT = require('./CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------

// To do once

_errors2.default.declareCodes({
  // Special error that say we just want to add some extra stack trace data (but without using new error code)
  ESTACKTRACE: 'Stack Trace',

  // Default error
  E0000: 'No Specified Error',

  // Unexpected error
  EUNEXPECTED: 'Unexpected Error',

  // Launching error
  INVALID_LAUNCHING_MODE: 'Invalid launching mode',
  INVALID_LAUNCHING_PARAMETER: 'Invalid launching parameters',
  ERROR_CREATING_FILE_API: 'Impossible ti create the api.json file',

  // Slave Error
  SLAVE_ERROR: 'Slave Error',

  // General catch
  GENERAL_CATCH: 'General Catch',

  // MAINTAINANCE
  MAINTAINANCE: 'Program is in maintainance',

  // Server Error
  E2000: 'Cannot start API server',
  E2001: 'Cannot stop API server',
  E2002: 'Unknown API server at the given port',
  E2003: 'Cannot start OBJ server',
  E2004: 'Cannot stop OBJ server',
  E2005: 'ZeroMQ: Cannot connect the server',
  E2006: 'ZeroMQ: Cannot close the socket',
  E2007: 'ZeroMQ: Cannot bind the server',
  E2008: 'ZeroMQ: Bad socketType for the kind of ZeroMQ implementation you choose'
});

/**
 * Handles errors in application. It contains Error codes and functions to manage them
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * This class handle errors in the app
 */

// Includes

var Errors = function (_ErrorsLibrary) {
  (0, _inherits3.default)(Errors, _ErrorsLibrary);

  function Errors() {
    (0, _classCallCheck3.default)(this, Errors);
    return (0, _possibleConstructorReturn3.default)(this, (Errors.__proto__ || (0, _getPrototypeOf2.default)(Errors)).apply(this, arguments));
  }

  (0, _createClass3.default)(Errors, [{
    key: 'displayColoredError',

    /**
     * Display the colored error
     * @override
     */
    value: function displayColoredError() {
      _RoleAndTask2.default.getInstance().displayMessage({
        str: this.getColoredErrorString(true) + ' - 2',

        tags: [_CONSTANT2.default.MESSAGE_DISPLAY_TAGS.ERROR]
      });
    }

    /**
     * Display the recorded error
     * @override
     */

  }, {
    key: 'displayError',
    value: function displayError() {
      _RoleAndTask2.default.getInstance().displayMessage({
        str: (this.getErrorString() + ' - 1').red.bold,
        tags: [_CONSTANT2.default.MESSAGE_DISPLAY_TAGS.ERROR]
      });
    }
  }]);
  return Errors;
}(_errors2.default);

exports.default = Errors;
//# sourceMappingURL=Errors.js.map
