'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify2 = require('babel-runtime/core-js/json/stringify');

var _stringify3 = _interopRequireDefault(_stringify2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _RoleAndTask = require('../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

var _Utils = require('./Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _CONSTANT = require('./CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------

/**
 * Handles errors in application. It contains Error codes and functions to manage them
 */
var Errors = function () {
  /**
   * @param {String} errCode - the key associated to the error
   * @param {String} functionName - where the error happened
   * @param {String} supString - Supplement infos about the error
   */
  function Errors(errCode, supString) {
    var functionName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _Utils2.default.getFunctionName(_CONSTANT2.default.NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_CLASSIC);
    (0, _classCallCheck3.default)(this, Errors);

    this.stringError = '';
    this.errorCode = 'E0000';
    this.happened = '';

    if (errCode) {
      this.errorCode = errCode;

      if (functionName) this.happened = functionName;
    }

    if (supString) this.stringError = supString;

    this.dad = false;
  }

  /**
   * We call this function to add some trace to the error
   * @param {Errors} error - new Error that will help the trace
   */


  (0, _createClass3.default)(Errors, [{
    key: 'stackTrace',
    value: function stackTrace(error) {
      error.setDad(this);

      return error;
    }

    /**
     * Set a dad to the error (used by stack trace to create a stack trace using simple errors)
     * @param {Errors} error
     */

  }, {
    key: 'setDad',
    value: function setDad(error) {
      this.dad = error;
    }

    /**
     * We serialize the error to be able to deserialize it after
     * @param {?Boolean} _stringify - do we need to stringify before end? Used to call it recurively
     *
     * WARNING RECURSIVE FUNCTION
     */

  }, {
    key: 'serialize',
    value: function serialize() {
      var _stringify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var serialize = {
        stringError: this.stringError,
        errorCode: this.errorCode,
        happened: this.happened,
        dad: this.dad ? this.dad.serialize(false) : false
      };

      return _stringify ? (0, _stringify3.default)(serialize) : serialize;
    }

    /**
     * We deserialize a previously serialized error
     * If the string is not a serialized error, create a new error with the string as new error infos
     * @param {String} str
     */

  }, {
    key: 'checkErrorOccur',


    /**
     * Check if the errCode is a part of the stackTrace errors
     * @param {String} errCode
     */
    value: function checkErrorOccur(errCode) {
      if (this.errorCode === errCode) return true;

      if (!this.dad) return false;

      return this.dad.checkErrorOccur(errCode);
    }

    /**
     * Get the description associated to the recorded error
     * @return {string}
     */

  }, {
    key: 'getMeaning',
    value: function getMeaning() {
      return Errors.Code[this.errorCode] || '';
    }

    /**
     * @override
     */

  }, {
    key: 'toString',
    value: function toString() {
      return this.getErrorString();
    }

    /**
     * Get the string that correspond to the recorded error (its a stringified json)
     * @param {?Boolean} _dad
     * @return {string}
     */

  }, {
    key: 'getErrorString',
    value: function getErrorString() {
      var _dad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var json = {};
      var avoid = true;

      if (this.errorCode !== 'ESTACKTRACE' || !_dad && this.errorCode === 'ESTACKTRACE') {
        avoid = false;
        json.errorCode = this.errorCode;
        json.errorMeaning = this.getMeaning();

        if (this.stringError) json.moreInfos = this.stringError;

        if (this.happened) json.happenedAt = this.happened;
      }

      if (this.dad) json.dad = this.dad.getErrorString(true);

      if (_dad && avoid) return json.dad;

      if (_dad) return json;

      if (avoid) return (0, _stringify3.default)(json.dad);

      return (0, _stringify3.default)(json);
    }

    /**
     * Display the colored error
     */

  }, {
    key: 'displayColoredError',
    value: function displayColoredError() {
      _RoleAndTask2.default.getInstance().displayMessage({
        str: this.getColoredErrorString(true) + ' - 2',

        tags: [_CONSTANT2.default.MESSAGE_DISPLAY_TAGS.ERROR]
      });
    }

    /**
     * display the error into the console
     * WARNING THIS FUNCTION IS RECURSIVE
     * @param {Boolean} isFirst
     */

  }, {
    key: 'getColoredErrorString',
    value: function getColoredErrorString() {
      var isFirst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var strsParts = [];
      var dadsDisplay = [];

      // Get the dad display
      if (this.dad) {
        // Here we have something like [dad, dad, dad, dad, dad, dad] displays with the latests the most high level trace
        dadsDisplay = this.dad.getColoredErrorString(false);
      }

      // Create our own display
      if (isFirst || this.errorCode !== 'ESTACKTRACE') {
        strsParts.push(_Utils2.default.monoline(['--> Error['.red, ('' + this.errorCode).yellow, ']: ['.red, ('' + this.getMeaning()).yellow, ']\n'.red]));
      }

      if (this.stringError) strsParts.push(('More infos: [' + this.stringError + ']\n').blue);

      if (this.happened) strsParts.push(('Happened at: [' + this.happened + ']\n').grey);

      // If we are the first called function, it means we have to actually handle the display
      if (isFirst) {
        // So have dad to display we have
        // strsParts which is the highest level trace we have
        // [dad, dad, dad, dad] which are the others traces, with the last dad the highest level trace

        // Starting with the highest dad we start the display
        var finalArrayToDisplay = [];

        var spacesOffset = ' ';

        finalArrayToDisplay.push(_Utils2.default.monoline(['TRACE: '.bold.underline.red, '--------------------------------------------------------------'.bold.red, '\n']));

        strsParts.forEach(function (x) {
          return finalArrayToDisplay.push('| ' + spacesOffset + x);
        });

        dadsDisplay.forEach(function (x) {
          spacesOffset += ' ';

          // When we add it in the final array, we insert the graphical '    ' spaces offset
          x.forEach(function (y) {
            return finalArrayToDisplay.push('| ' + spacesOffset + y);
          });
        });

        finalArrayToDisplay.push(_Utils2.default.monoline(['---------------------------------------------------------------------'.bold.red, '\n']));

        return _Utils2.default.monoline(finalArrayToDisplay);
      }

      // We do not have to handle the display just return our display and our dad display
      var toRet = [];

      if (strsParts.length) toRet.push(strsParts);

      if (dadsDisplay.length) {
        toRet = [].concat((0, _toConsumableArray3.default)(toRet), (0, _toConsumableArray3.default)(dadsDisplay));
      }

      return toRet;
    }

    /**
     * Display the recorded error
     */

  }, {
    key: 'displayError',
    value: function displayError() {
      _RoleAndTask2.default.getInstance().displayMessage({
        str: (this.getErrorString() + ' - 1').red.bold,
        tags: [_CONSTANT2.default.MESSAGE_DISPLAY_TAGS.ERROR]
      });
    }

    /**
     * Say if the parameter is an instance of the class Error
     * @param {Object} unknown
     * @return {Boolean}
     */

  }, {
    key: 'isAnError',
    value: function isAnError(unknown) {
      return unknown instanceof Errors;
    }

    /**
     * Say if the parameter is an instance of the class Error
     * @param {Object} unknown
     * @return {Boolean}
     */

  }, {
    key: 'setString',


    /**
     * Set a string to specify more the error
     * @param {string} error - description of the error
     */
    value: function setString(error) {
      this.stringError = error;
    }

    /**
     * Set the error code
     * @param {String} errCode - key that refer to an error
     */

  }, {
    key: 'setErrorCode',
    value: function setErrorCode(errCode) {
      this.errorCode = errCode;
    }

    /**
     * Get the string associated to the last code in stack
     */

  }, {
    key: 'getLastStringInStack',
    value: function getLastStringInStack() {
      var ptr = this;

      while (ptr.dad) {
        ptr = ptr.dad;
      }return ptr.stringError;
    }

    /**
     * Get the error code (key that refer to the error)
     * The last in the stack
     * @return {String}
     */

  }, {
    key: 'getLastErrorCodeInStack',
    value: function getLastErrorCodeInStack() {
      var ptr = this;

      while (ptr.dad) {
        ptr = ptr.dad;
      }return ptr.errorCode;
    }

    /**
     * Get the error
     * The last in the stack
     * @return {String}
     */

  }, {
    key: 'getLastErrorInStack',
    value: function getLastErrorInStack() {
      var ptr = this;

      while (ptr.dad) {
        ptr = ptr.dad;
      }return ptr;
    }

    /**
     * Get the error code (key that refer to the error)
     * @return {String}
     */

  }, {
    key: 'getErrorCode',
    value: function getErrorCode() {
      return this.errorCode;
    }
  }], [{
    key: 'deserialize',
    value: function deserialize(str) {
      var obj = _Utils2.default.convertStringToJSON(str);

      var constructError = function constructError(ptr) {
        var newErrorObj = new Errors();

        newErrorObj.stringError = ptr.stringError || '';
        newErrorObj.errorCode = ptr.errorCode || 'EUNEXPECTED';
        newErrorObj.happened = ptr.happened || '';

        if (ptr.dad) newErrorObj.dad = constructError(ptr.dad);

        return newErrorObj;
      };

      // If the str is not an Errors serialized data
      if (!obj) return new Errors('UNKNOWN_ERROR', str);

      return constructError(obj);
    }

    /**
     * Enum that contains errorCodes
     * @return {{EX: number}}
     */

  }, {
    key: 'shortcutStackTraceSpecial',


    /**
     * Shortcut to handle an add to stack trace (special add --> ESTACKTRACE type)
     * @param {String} funcName
     * @param {?(Errors|Error)} err
     */
    value: function shortcutStackTraceSpecial(err, funcName) {
      return Errors.handleStackTraceAdd(err, new Errors('ESTACKTRACE', '', funcName), funcName);
    }

    /**
     * Add an error into a stack trace, handle the fact of unexpected errors
     * @param {?(Errors|Error)} err
     * @param {String} funcName
     * @param {Errors} errToAdd
     * @param {Boolean} logIt
     * @param {?Number} type
     */

  }, {
    key: 'handleStackTraceAdd',
    value: function handleStackTraceAdd(err, errToAdd) {
      var funcName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _Utils2.default.getFunctionName(_CONSTANT2.default.NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_HANDLE_STACK_TRACE);

      if (!Errors.staticIsAnError(err)) return new Errors('EUNEXPECTED', String(err.stack || err), funcName);

      return err.stackTrace(errToAdd);
    }
  }, {
    key: 'staticIsAnError',
    value: function staticIsAnError(unknown) {
      return unknown instanceof Errors;
    }
  }, {
    key: 'Code',
    get: function get() {
      return {
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
      };
    }
  }]);
  return Errors;
}(); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * This class handle errors in the app
 */

// Includes


exports.default = Errors;
//# sourceMappingURL=Errors.js.map
