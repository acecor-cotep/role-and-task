'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _Utils = require('./Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _RoleAndTask = require('../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = null;

/**
 * Contain utilitaries functions
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * This class contain utilitaries functions for devs
 */

// Includes

var DevUtils = function () {
  /**
   * constructor
   */
  function DevUtils() {
    (0, _classCallCheck3.default)(this, DevUtils);

    if (instance) return instance;

    instance = this;

    return instance;
  }

  /**
   * Singleton Implementation
   */


  (0, _createClass3.default)(DevUtils, null, [{
    key: 'getInstance',
    value: function getInstance() {
      return instance || new DevUtils();
    }

    /**
     * Get a Line
     */

  }, {
    key: 'djson',


    /**
     * Display some JSON using json.stringify
     * It's a simple shortcut
     * @param {Object} x
     */
    value: function djson(x) {
      var strsParts = [];

      var displayIndent = function displayIndent(level) {
        for (var i = 0; i < level; i += 1) {
          strsParts.push('    ');
        }
      };

      var displayOneLevel = function displayOneLevel(ptr) {
        var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var parentIsKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        // We have an array
        if (ptr && ptr instanceof Array) {
          if (!parentIsKey) displayIndent(indent);

          strsParts.push('[\n'.white);

          ptr.forEach(function (y) {
            return displayOneLevel(y, indent + 1);
          });

          displayIndent(indent);

          strsParts.push('],\n'.white);

          return;
        }

        // We have a json
        if (_Utils2.default.isAJSON(ptr) && !_Utils2.default.isAMongooseObjectId(ptr) && !(ptr instanceof Date)) {
          if (!parentIsKey) displayIndent(indent);

          strsParts.push('{\n'.white);

          (0, _keys2.default)(ptr).forEach(function (y) {
            displayIndent(indent + 1);

            strsParts.push((y + ': ').green);

            displayOneLevel(ptr[y], indent + 1, true);
          });

          displayIndent(indent);

          if (indent) strsParts.push('},\n'.white);else strsParts.push('}\n'.white);

          return;
        }

        var getTextDueToDataType = function getTextDueToDataType() {
          var str = ptr + ',\n';

          var commaJump = ',\n'.white;

          var toRet = str;

          // If we have a string do something
          var conf = [{
            check: function check(v) {
              return v instanceof Date;
            },

            do: function _do() {
              try {
                return '' + _colors2.default.magenta.bold('\'') + _colors2.default.yellow(ptr.toISOString()) + _colors2.default.magenta.bold('\'') + commaJump;
              } catch (e) {
                // Handle the range error
                return '' + _colors2.default.magenta.bold('\'') + _colors2.default.yellow(ptr) + _colors2.default.magenta.bold('\'') + commaJump;
              }
            }
          }, {
            check: _Utils2.default.isAMongooseObjectId,

            do: function _do() {
              return '' + _colors2.default.magenta.bold('\'') + _colors2.default.yellow(String(ptr)) + _colors2.default.magenta.bold('\'') + commaJump;
            }
          }, {
            check: _Utils2.default.isAnID,

            do: function _do() {
              return '' + _colors2.default.magenta.bold('\'') + _colors2.default.yellow(ptr) + _colors2.default.magenta.bold('\'') + commaJump;
            }
          }, {
            check: _Utils2.default.isAnInteger,

            do: function _do() {
              return '' + _colors2.default.cyan.bold(ptr) + commaJump;
            }
          }, {
            check: _Utils2.default.isAnUnsignedInteger,

            do: function _do() {
              return '' + _colors2.default.cyan.bold(ptr) + commaJump;
            }
          }, {
            check: _Utils2.default.isAFloat,

            do: function _do() {
              return '' + _colors2.default.cyan.bold.underline(ptr) + commaJump;
            }
          }, {
            check: _Utils2.default.isABoolean,

            do: function _do() {
              return '' + (ptr ? _colors2.default.bgGreen.white(ptr) : _colors2.default.bgRed.white(ptr)) + commaJump;
            }
          }, {
            check: _Utils2.default.isNull,

            do: function _do() {
              return '' + _colors2.default.bgRed.white.bold.underline(ptr) + commaJump;
            }
          }, {
            check: _Utils2.default.isAVersion,

            do: function _do() {
              return '' + _colors2.default.bgMagenta.bold('\'') + _colors2.default.bgMagenta.white(ptr) + _colors2.default.bgMagenta.bold('\'') + commaJump;
            }
          }, {
            check: _Utils2.default.isAString,

            do: function _do() {
              return '' + _colors2.default.magenta.bold('\'') + _colors2.default.magenta.bold(ptr) + _colors2.default.magenta.bold('\'') + commaJump;
            }
          }];

          conf.some(function (y) {
            if (y.check(ptr)) {
              toRet = y.do();

              return true;
            }

            return false;
          });

          return toRet;
        };

        // We have something else
        if (!parentIsKey) displayIndent(indent);
        strsParts.push(getTextDueToDataType());
      };

      displayOneLevel(x);

      _RoleAndTask2.default.getInstance().displayMessage({
        str: _Utils2.default.monoline(strsParts)
      });
    }

    /**
     * Display something
     * It's a simple shortcut
     * @param {Object} x
     */

  }, {
    key: 'd',
    value: function d(x) {
      _RoleAndTask2.default.getInstance().displayMessage({
        str: ('' + x).red
      });
    }

    /**
     * Display an Error
     * It's a simple shortcut
     * @param {Object} x
     */

  }, {
    key: 'dre',
    value: function dre(x) {
      _RoleAndTask2.default.getInstance().displayMessage({
        str: String(x).bgRed.bold.white
      });
    }

    /**
     * Smart display
     * You gives something in enter and display it (Json or other)
     * @param {Object} x
     */

  }, {
    key: 'sd',
    value: function sd(x) {
      if (x instanceof Error) DevUtils.dre(x);else if (_Utils2.default.isAJSON(x)) DevUtils.djson(x);else DevUtils.d(x);
    }
  }, {
    key: 'LINE',
    get: function get() {
      return '\n>------------------------------------------\n';
    }
  }]);
  return DevUtils;
}();

// export the var to other files using GLOBAL variable


exports.default = DevUtils;
global.DEV = DevUtils;
//# sourceMappingURL=DevUtils.js.map
