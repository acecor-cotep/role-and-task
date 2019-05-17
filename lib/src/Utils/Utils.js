"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _os = _interopRequireDefault(require("os"));

var _moment = _interopRequireDefault(require("moment"));

var _fs = _interopRequireDefault(require("fs"));

var _hjson = _interopRequireDefault(require("hjson"));

var _pidusage = _interopRequireDefault(require("pidusage"));

var _child_process = _interopRequireDefault(require("child_process"));

var _CONSTANT = _interopRequireDefault(require("./CONSTANT/CONSTANT.js"));

var _Errors = _interopRequireDefault(require("./Errors.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * This class contain utilitaries functions
 */
// Includes

/**
 * Contain utilitaries functions
 */
var Utils =
/*#__PURE__*/
function () {
  function Utils() {
    (0, _classCallCheck2["default"])(this, Utils);
  }

  (0, _createClass2["default"])(Utils, null, [{
    key: "generateUniqueProgramID",

    /**
     * Get an unique id (Specific to Program)
     * USE THE PID OF THE APP TO GET AN INTER-PROGRAM UNIQUE IDENTIFIER
     */
    value: function generateUniqueProgramID() {
      if (!Utils.generatedId) Utils.generatedId = 2;
      Utils.generatedId += 1;
      return "".concat(process.pid, "x").concat(Utils.generatedId);
    }
    /**
     * Generate a little ID usefull for log for example
     */

  }, {
    key: "generateLittleID",
    value: function generateLittleID() {
      return Math.random().toString(36).substr(2, 10);
    }
    /**
     * Generate a random value from min to max
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} round
     */

  }, {
    key: "generateRandom",
    value: function generateRandom(min, max) {
      var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var nb = Math.random() * (max - min + 1) + min;
      if (round) return Math.floor(nb);
      return nb;
    }
    /**
     * Return the name of thekey that are behind the given value
     * @param {Object} json
     * @param {String} value
     */

  }, {
    key: "getJsonCorrespondingKey",
    value: function getJsonCorrespondingKey(json, value) {
      return Object.keys(json).find(function (x) {
        return json[x] === value;
      });
    }
    /**
     * Create a monoline from an array which is usefull when you have a line that is too long
     */

  }, {
    key: "monoline",
    value: function monoline(parts) {
      return parts.reduce(function (str, x) {
        return "".concat(str).concat(x);
      }, '');
    }
    /**
     * Call recursively the function given in parameter for each iteration of the object
     * It works for a given function pattern
     * Call resolve with an array that contains results of called functions
     *
     * @param {{
     *  context: Object,
     *
     *  func: Function,
     *
     *  objToIterate: [Object],
     *
     *  // name of the field that is sent to the function
     *  // if its equals to null, it means we have to send data into NON JSON structure
     *  nameToSend: String,
     *
     *  // name of the field we took from the docs to sent to the function,
     *  // if its equals to null, it means the objToIterate is an array that contains directs values
     *  // (DO NOT WORK WITH COLLECTION_ENTRY OBJECTS)
     *  nameTakenInDocs: String,
     *
     *  // to pass in addition to the id  - DO NOT WORK WITH nameToSend = null
     *  additionnalJsonData: Object,
     *
     *  // to pass in addition of the generated json
     *  additionnalParams: [],
     *
     *  _i: ?Number,
     *
     *  _rets: ?Array, // all returns of the functions we called
     * }}
     */

  }, {
    key: "recursiveCallFunction",
    value: function () {
      var _recursiveCallFunction = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var context, func, objToIterate, _ref$nameToSend, nameToSend, _ref$nameTakenInDocs, nameTakenInDocs, _ref$additionnalJsonD, additionnalJsonData, _ref$additionnalParam, additionnalParams, _ref$_i, _i, _ref$_rets, _rets, val, obj, ret;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                context = _ref.context, func = _ref.func, objToIterate = _ref.objToIterate, _ref$nameToSend = _ref.nameToSend, nameToSend = _ref$nameToSend === void 0 ? '_id' : _ref$nameToSend, _ref$nameTakenInDocs = _ref.nameTakenInDocs, nameTakenInDocs = _ref$nameTakenInDocs === void 0 ? '_id' : _ref$nameTakenInDocs, _ref$additionnalJsonD = _ref.additionnalJsonData, additionnalJsonData = _ref$additionnalJsonD === void 0 ? {} : _ref$additionnalJsonD, _ref$additionnalParam = _ref.additionnalParams, additionnalParams = _ref$additionnalParam === void 0 ? [] : _ref$additionnalParam, _ref$_i = _ref._i, _i = _ref$_i === void 0 ? 0 : _ref$_i, _ref$_rets = _ref._rets, _rets = _ref$_rets === void 0 ? [] : _ref$_rets;

                if (objToIterate) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", _rets);

              case 3:
                if (!(_i >= objToIterate.length)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", _rets);

              case 5:
                // Get the value from the objToIterate following the given parameters
                val = nameTakenInDocs ? objToIterate[_i][nameTakenInDocs] : objToIterate[_i]; // Put the val into a JSON or a regular object

                obj = nameToSend ? (0, _defineProperty2["default"])({}, nameToSend, val) : val; // if we have a JSON object and additionnalJsonData

                if (nameToSend) {
                  Object.keys(additionnalJsonData).forEach(function (x) {
                    obj[x] = additionnalJsonData[x];
                  });
                } // Call the func


                _context.next = 10;
                return func.apply(context, [obj].concat((0, _toConsumableArray2["default"])(additionnalParams)));

              case 10:
                ret = _context.sent;
                return _context.abrupt("return", Utils.recursiveCallFunction({
                  context: context,
                  func: func,
                  objToIterate: objToIterate,
                  nameToSend: nameToSend,
                  nameTakenInDocs: nameTakenInDocs,
                  additionnalJsonData: additionnalJsonData,
                  additionnalParams: additionnalParams,
                  _i: _i + 1,
                  _rets: ret ? [].concat((0, _toConsumableArray2["default"])(_rets), [ret]) : _rets
                }));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function recursiveCallFunction(_x) {
        return _recursiveCallFunction.apply(this, arguments);
      }

      return recursiveCallFunction;
    }()
    /**
     * Get the Ips of the local machine
     */

  }, {
    key: "givesLocalIps",
    value: function givesLocalIps() {
      try {
        // Get network interfaces
        var interfaces = _os["default"].networkInterfaces();

        return Object.keys(interfaces).reduce(function (tmp, x) {
          return tmp.concat(interfaces[x]);
        }, []).filter(function (iface) {
          return iface.family === 'IPv4' && !iface.internal;
        }).map(function (iface) {
          return iface.address;
        });
      } catch (err) {
        return String(err && err.stack || err);
      }
    }
    /**
     * Convert a string to JSON
     * If he cannot parse it, return false
     * @param {String} dataString
     */

  }, {
    key: "convertStringToJSON",
    value: function convertStringToJSON(dataString) {
      return function () {
        try {
          return JSON.parse(dataString);
        } catch (_) {
          return false;
        }
      }();
    }
    /**
     * Execute a command line
     * By default, set the maxBuffer option to 2GB
     */

  }, {
    key: "execCommandLine",
    value: function execCommandLine(cmd) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        maxBuffer: 1024 * 2000
      };
      return new Promise(function (resolve, reject) {
        _child_process["default"].exec(cmd, options, function (err, res) {
          if (err) {
            return reject(new _Errors["default"]('E8191', "".concat(String(err))));
          }

          return resolve(res);
        });
      });
    }
    /**
     * Generate a string using the given char repeated x time
     * @param {character} String
     * @param {Number} nb
     */

  }, {
    key: "generateStringFromSameChar",
    value: function generateStringFromSameChar(character, nb) {
      return character.repeat(nb);
    }
    /**
     * Execute a command line
     * Execute the given onStdout function when stdout datas are given
     * When onStdout is not set, do nothing about the data
     * Execute the given onStderr function when stderr datas are given
     * When onStderr is not set, do nothing about the data
     */

  }, {
    key: "execStreamedCommandLine",
    value: function execStreamedCommandLine(_ref3) {
      var cmd = _ref3.cmd,
          _ref3$options = _ref3.options,
          options = _ref3$options === void 0 ? [] : _ref3$options,
          _ref3$processArray = _ref3.processArray,
          processArray = _ref3$processArray === void 0 ? false : _ref3$processArray,
          onStdout = _ref3.onStdout,
          onStderr = _ref3.onStderr;
      return new Promise(function (resolve, reject) {
        var ls = _child_process["default"].spawn(cmd, options);

        if (processArray) {
          processArray.push(ls);
        }

        if (!onStdout) {
          ls.stdout.on('data', function () {
            return true;
          });
        } else {
          ls.stdout.on('data', onStdout);
        }

        if (!onStderr) {
          ls.stderr.on('data', function () {
            return true;
          });
        } else {
          ls.stderr.on('data', onStderr);
        }

        ls.on('close', function (code) {
          if (code === 'SIGINT') {
            reject(code);
          }

          var index = processArray.indexOf(ls);

          if (index !== -1) {
            processArray.splice(index, 1);
          }

          resolve(code);
        });
        ls.on('error', function (err) {
          var index = processArray.indexOf(ls);

          if (index !== -1) {
            processArray.splice(index, 1);
          }

          reject(new _Errors["default"]('E8200', "".concat(err.toString())));
        });
      });
    }
    /**
     * Sleep some time
     */

  }, {
    key: "sleep",
    value: function sleep(timeInMs) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          return resolve();
        }, timeInMs);
      });
    }
    /**
     * Display a message in console
     * @param {{
     *   str: String,
     *   carriageReturn: Boolean,
     *   out: Object,
     *   from: String,
     * }}
     */

  }, {
    key: "displayMessage",
    value: function displayMessage(_ref4) {
      var str = _ref4.str,
          _ref4$carriageReturn = _ref4.carriageReturn,
          carriageReturn = _ref4$carriageReturn === void 0 ? true : _ref4$carriageReturn,
          _ref4$out = _ref4.out,
          out = _ref4$out === void 0 ? process.stdout : _ref4$out,
          _ref4$from = _ref4.from,
          from = _ref4$from === void 0 ? process.pid : _ref4$from,
          _ref4$time = _ref4.time,
          time = _ref4$time === void 0 ? Date.now() : _ref4$time;
      out.write("".concat((0, _moment["default"])(time).format(_CONSTANT["default"].MOMENT_CONSOLE_DATE_DISPLAY_FORMAT), ":").concat(from, " > - ").concat(str).concat(carriageReturn ? '\n' : ''));
    }
    /**
     * Read a file asynchronously
     */

  }, {
    key: "readFile",
    value: function readFile(filename) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';
      return new Promise(function (resolve, reject) {
        _fs["default"].readFile(filename, options, function (err, data) {
          if (err) return reject(new _Errors["default"]('E8088', "filename: ".concat(filename), String(err)));
          return resolve(data);
        });
      });
    }
    /**
     * Parse hjson content (Human JSON --> npm module)
     * @param {String} content
     */

  }, {
    key: "parseHjsonContent",
    value: function () {
      var _parseHjsonContent = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(content) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                return _context2.abrupt("return", _hjson["default"].parse(content));

              case 4:
                _context2.prev = 4;
                _context2.t0 = _context2["catch"](0);
                throw new _Errors["default"]('E8089', "".concat(String(_context2.t0)));

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 4]]);
      }));

      function parseHjsonContent(_x2) {
        return _parseHjsonContent.apply(this, arguments);
      }

      return parseHjsonContent;
    }()
    /**
     * DO NOT CALL IT DIRECTLY, it is used by promiseCallUntilTrue
     *
     * RECURSIVE
     */

  }, {
    key: "executePromiseCallUntilTrue",
    value: function () {
      var _executePromiseCallUntilTrue = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref5) {
        var functionToCall, context, args, _ref5$i, i, ret;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                functionToCall = _ref5.functionToCall, context = _ref5.context, args = _ref5.args, _ref5$i = _ref5.i, i = _ref5$i === void 0 ? 0 : _ref5$i;
                _context3.next = 3;
                return functionToCall.apply(context, [].concat((0, _toConsumableArray2["default"])(args), [i]));

              case 3:
                ret = _context3.sent;

                if (!(ret !== false && ret.args === void 0)) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", ret);

              case 6:
                return _context3.abrupt("return", Utils.executePromiseCallUntilTrue({
                  functionToCall: functionToCall,
                  context: context,
                  args: ret.args === void 0 ? args : ret.args,
                  i: ret.i === void 0 ? i + 1 : ret.i
                }));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function executePromiseCallUntilTrue(_x3) {
        return _executePromiseCallUntilTrue.apply(this, arguments);
      }

      return executePromiseCallUntilTrue;
    }()
    /**
     * Call the given function until it return something different than false
     *
     * If the function returns :
     *
     * false                                -> We make an another call with the same args
     * true                                 -> We stop the calls and return true
     * { args: something }                  -> We make an another call with the new given args
     * { args: something, i: something }    -> We make an another call with the new given args and changing the i
     * anything else                        -> we stop the calls and return wathever it is
     *
     * {
     *   functionToCall,
     *   context,
     *   args,
     *   i = 0,
     * }
     *
     * i is the index you can force to start with instead of 0
     */

  }, {
    key: "promiseCallUntilTrue",
    value: function () {
      var _promiseCallUntilTrue = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(conf) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", Utils.executePromiseCallUntilTrue(conf));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function promiseCallUntilTrue(_x4) {
        return _promiseCallUntilTrue.apply(this, arguments);
      }

      return promiseCallUntilTrue;
    }()
    /**
     * DO NOT CALL IT DIRECTLY, it is used by promiseQueue
     *
     * RECURSIVE
     */

  }, {
    key: "executePromiseQueue",
    value: function () {
      var _executePromiseQueue = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(conf) {
        var _rets,
            _i,
            _conf$_i,
            functionToCall,
            _conf$_i$context,
            context,
            _conf$_i$args,
            args,
            _args5 = arguments;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _rets = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : [];
                _i = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 0;

                if (!(_i >= conf.length)) {
                  _context5.next = 4;
                  break;
                }

                return _context5.abrupt("return", _rets);

              case 4:
                // Execute one
                _conf$_i = conf[_i], functionToCall = _conf$_i.functionToCall, _conf$_i$context = _conf$_i.context, context = _conf$_i$context === void 0 ? this : _conf$_i$context, _conf$_i$args = _conf$_i.args, args = _conf$_i$args === void 0 ? [] : _conf$_i$args;
                _context5.t0 = _rets;
                _context5.next = 8;
                return functionToCall.apply(context, args);

              case 8:
                _context5.t1 = _context5.sent;

                _context5.t0.push.call(_context5.t0, _context5.t1);

                return _context5.abrupt("return", Utils.executePromiseQueue(conf, _rets, _i + 1));

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function executePromiseQueue(_x5) {
        return _executePromiseQueue.apply(this, arguments);
      }

      return executePromiseQueue;
    }()
    /**
     * Execute the given functions one by one, and the return the ret of them in an array
     *
     * -> it's a Promise.all but one by one instead of parallel
     *
     * [{
     *   // The function you want to call
     *   functionToCall,
     *
     *   // The context to use when you are calling it
     *   context,
     *
     *   // The argument to pass to the functionToCall (must be in an array)
     *   args,
     * }]
     */

  }, {
    key: "promiseQueue",
    value: function () {
      var _promiseQueue = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(conf) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", Utils.executePromiseQueue(conf));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function promiseQueue(_x6) {
        return _promiseQueue.apply(this, arguments);
      }

      return promiseQueue;
    }()
    /**
     * Return the name of the function that call this function
     * IT'S A HACK
     */

  }, {
    key: "getFunctionName",
    value: function getFunctionName() {
      var numberFuncToGoBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var err = new Error('tmpErr');
      var splitted = err.stack.split('\n'); // If we cannot succeed to find the good function name, return the whole data

      if (numberFuncToGoBack >= splitted.length) {
        return err.stack;
      }

      var trimmed = splitted[numberFuncToGoBack].trim(' '); // If we cannot succeed to find the good function name, return the whole data

      if (!trimmed.length) return err.stack;
      return trimmed.split(' ')[1];
    }
    /**
     * Fire functions that are in the given array and pass args to it
     * @param {[?({func: Function, context: Object},func)]} arrayOfFunction
     * @param {Array} args
     */

  }, {
    key: "fireUp",
    value: function fireUp(arrayOfFunction, args) {
      var _this = this;

      if (arrayOfFunction.length) {
        arrayOfFunction.forEach(function (x) {
          if (x && x.func && typeof x.func === 'function') x.func.apply(x.context || _this, args);
          if (x && typeof x === 'function') x.apply(_this, args);
        });
      }
    }
    /**
     * Is the given parameter an array
     */

  }, {
    key: "isAnArray",
    value: function isAnArray(v) {
      return Utils.isAJSON(v) && v instanceof Array;
    }
    /**
     * Check if we got a version in a String
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isAVersion",
    value: function isAVersion(v) {
      if (!v) return false;
      var regexp = /^(\d+(\.\d+)*)$/;
      return regexp.test(v);
    }
    /**
     * Check if we got a Boolean
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isABoolean",
    value: function isABoolean(v) {
      return typeof v === 'boolean' || v === 'true' || v === 'false';
    }
    /**
     * Check if we got a Boolean (permissive with true and false strings)
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isABooleanPermissive",
    value: function isABooleanPermissive(v) {
      return Utils.isABoolean(v) || v === 'true' || v === 'false';
    }
    /**
     * Check if we got an ID
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isAnID",
    value: function isAnID(v) {
      if (!v || typeof v !== 'string') return false;
      return new RegExp("^[a-f\\d]{".concat(String(_CONSTANT["default"].MONGO_DB_ID_LENGTH), "}$"), 'i').test(v);
    }
    /**
     * Check if we got a null value
     *
     * Is considered NULL :
     * - an empty String
     * - the value 0
     * - the boolean false
     * - the null value
     * - undefined
     *
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isNull",
    value: function isNull(v) {
      return v === null || v === 0 || v === false || v === 'null' || v === void 0;
    }
    /**
     * Check if we got a String
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isAString",
    value: function isAString(v) {
      return typeof v === 'string';
    }
    /**
     * Check if we got an unsigned Integer
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isAnUnsignedInteger",
    value: function isAnUnsignedInteger(v) {
      if (v === void 0 || v === null || v instanceof Array || (0, _typeof2["default"])(v) === 'object' && !(v instanceof Number)) return false;
      if (v instanceof Number && v >= 0) return true;
      var regexp = /^\+?(0|[0-9]\d*)$/;
      return regexp.test(v);
    }
    /**
     * Check if we got a timestamp
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isATimestamp",
    value: function isATimestamp(v) {
      if (!v) return false;
      if (v instanceof Date) return true;
      if (typeof v !== 'string' && typeof v !== 'number') return false;
      return new Date(Number(v)).getTime() > 0;
    }
    /**
     * Check if we got an Integer
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isAnInteger",
    value: function isAnInteger(v) {
      if (v === void 0 || v === null || v instanceof Array || (0, _typeof2["default"])(v) === 'object' && !(v instanceof Number)) return false;
      if (v instanceof Number) return true;
      var regexp = /^[+-]?(0|[1-9]\d*)$/;
      return regexp.test(v);
    }
    /**
     * Check if we got a Float
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isAFloat",
    value: function isAFloat(v) {
      if (v === void 0 || v === null || v instanceof Array || (0, _typeof2["default"])(v) === 'object' && !(v instanceof Number)) return false;
      var regexp = /^[+-]?\d+(\.\d+)?$/;
      return regexp.test(v);
    }
    /**
     * Get the Cpu usage & memory of the current pid
     */

  }, {
    key: "getCpuAndMemoryLoad",
    value: function getCpuAndMemoryLoad() {
      return new Promise(function (resolve, reject) {
        (0, _pidusage["default"])(process.pid, function (err, stat) {
          if (err) return reject(err);
          return resolve(stat);
        });
      });
    }
    /**
     * Check if we got an Integer
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isAnIPAddress",
    value: function isAnIPAddress(v) {
      if (!Utils.isAString(v)) return false;
      var regexpIpv4 = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
      var regexpIpv6 = /^::ffff:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
      return regexpIpv4.test(v) || regexpIpv6.test(v);
    }
    /**
     * Do we have a json in parameters?
     *
     * WARNING: JSON.PARSE ACCEPT PLAIN NUMBERS AND NULL AS VALUES
     *
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "isAJSON",
    value: function isAJSON(v) {
      // handle the null case
      if (v === null || v === false || v === void 0) return false; // handle one part of numbers

      if (v instanceof Number) return false;
      if ((0, _typeof2["default"])(v) === 'object') return true;
      if (!Utils.isAString(v)) return false; // Test a json contains {} or [] data in it

      var regexpJson = /(({*})|(\[*\]))+/;
      if (!regexpJson.test(v)) return false;

      try {
        JSON.parse(v); // handle the numbers

        if (Utils.isAnInteger(v) || Utils.isAFloat(v)) return false;
        return true;
      } catch (e) {
        return false;
      }
    }
    /**
     * Transform v into a boolean - (this function is usefull for console commands)
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: "toBoolean",
    value: function toBoolean(v) {
      if (typeof v === 'boolean') return v;
      if (v === 'false') return false;
      if (v === 'true') return true;
      return !!v;
    }
  }]);
  return Utils;
}();

exports["default"] = Utils;
//# sourceMappingURL=Utils.js.map
