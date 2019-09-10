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

var _errors = _interopRequireDefault(require("@cotep/errors"));

var _RoleAndTask = _interopRequireDefault(require("../RoleAndTask.js"));

var _CONSTANT = _interopRequireDefault(require("./CONSTANT/CONSTANT.js"));

//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

/*
 * This class handle errors in the app
 */
// Includes
// ----------------------
// To do once
_errors["default"].declareCodes({
  // Special error that say we just want to add some extra stack trace data (but without using new error code)
  ESTACKTRACE: 'Stack Trace',
  // Default error
  E0000: 'No Specified Error',
  // Unexpected error
  EUNEXPECTED: 'Unexpected Error',
  // It's bad, very bad! :()
  OUT_OF_MEMORY: 'Out of memory. Prevent a memory allocation failure',
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


var Errors =
/*#__PURE__*/
function (_ErrorsLibrary) {
  (0, _inherits2["default"])(Errors, _ErrorsLibrary);

  function Errors() {
    (0, _classCallCheck2["default"])(this, Errors);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Errors).apply(this, arguments));
  }

  (0, _createClass2["default"])(Errors, [{
    key: "displayColoredError",

    /**
     * Display the colored error
     * @override
     */
    value: function displayColoredError() {
      _RoleAndTask["default"].getInstance().displayMessage({
        str: "".concat(this.getColoredErrorString(true), " - 2"),
        tags: [_CONSTANT["default"].MESSAGE_DISPLAY_TAGS.ERROR]
      });
    }
    /**
     * Display the recorded error
     * @override
     */

  }, {
    key: "displayError",
    value: function displayError() {
      _RoleAndTask["default"].getInstance().displayMessage({
        str: "".concat(this.getErrorString(), " - 1").red.bold,
        tags: [_CONSTANT["default"].MESSAGE_DISPLAY_TAGS.ERROR]
      });
    }
  }]);
  return Errors;
}(_errors["default"]);

exports["default"] = Errors;
//# sourceMappingURL=Errors.js.map
