'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _pidusage = require('pidusage');

var _pidusage2 = _interopRequireDefault(_pidusage);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _CONSTANT = require('./CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Contain utilitaries functions
 */
var Utils = function () {
  function Utils() {
    (0, _classCallCheck3.default)(this, Utils);
  }

  (0, _createClass3.default)(Utils, null, [{
    key: 'generateUniqueEliotID',

    /**
     * Get an unique id (Specific to Eliot)
     * USE THE PID OF THE APP TO GET AN INTER-ELIOT UNIQUE IDENTIFIER
     */
    value: function generateUniqueEliotID() {
      if (!Utils.generatedId) Utils.generatedId = 2;

      Utils.generatedId += 1;

      return process.pid + 'x' + Utils.generatedId;
    }

    /**
     * Generate a little ID usefull for log for example
     */

  }, {
    key: 'generateLittleID',
    value: function generateLittleID() {
      return Math.random().toString(36).substr(2, 10);
    }

    /**
     * Return the name of thekey that are behind the given value
     * @param {Object} json
     * @param {String} value
     */

  }, {
    key: 'getJsonCorrespondingKey',
    value: function getJsonCorrespondingKey(json, value) {
      return (0, _keys2.default)(json).find(function (x) {
        return json[x] === value;
      });
    }

    /**
     * Create a monoline from an array which is usefull when you have a line that is too long
     */

  }, {
    key: 'monoline',
    value: function monoline(parts) {
      return parts.reduce(function (str, x) {
        return '' + str + x;
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
    key: 'recursiveCallFunction',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var context = _ref2.context,
            func = _ref2.func,
            objToIterate = _ref2.objToIterate,
            _ref2$nameToSend = _ref2.nameToSend,
            nameToSend = _ref2$nameToSend === undefined ? '_id' : _ref2$nameToSend,
            _ref2$nameTakenInDocs = _ref2.nameTakenInDocs,
            nameTakenInDocs = _ref2$nameTakenInDocs === undefined ? '_id' : _ref2$nameTakenInDocs,
            _ref2$additionnalJson = _ref2.additionnalJsonData,
            additionnalJsonData = _ref2$additionnalJson === undefined ? {} : _ref2$additionnalJson,
            _ref2$additionnalPara = _ref2.additionnalParams,
            additionnalParams = _ref2$additionnalPara === undefined ? [] : _ref2$additionnalPara,
            _ref2$_i = _ref2._i,
            _i = _ref2$_i === undefined ? 0 : _ref2$_i,
            _ref2$_rets = _ref2._rets,
            _rets = _ref2$_rets === undefined ? [] : _ref2$_rets;

        var val, obj, ret;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (objToIterate) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', _rets);

              case 2:
                if (!(_i >= objToIterate.length)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', _rets);

              case 4:

                // Get the value from the objToIterate following the given parameters
                val = nameTakenInDocs ? objToIterate[_i][nameTakenInDocs] : objToIterate[_i];

                // Put the val into a JSON or a regular object

                obj = nameToSend ? (0, _defineProperty3.default)({}, nameToSend, val) : val;

                // if we have a JSON object and additionnalJsonData

                if (nameToSend) {
                  (0, _keys2.default)(additionnalJsonData).forEach(function (x) {
                    obj[x] = additionnalJsonData[x];
                  });
                }

                // Call the func
                _context.next = 9;
                return func.apply(context, [obj].concat((0, _toConsumableArray3.default)(additionnalParams)));

              case 9:
                ret = _context.sent;
                return _context.abrupt('return', Utils.recursiveCallFunction({
                  context: context,
                  func: func,
                  objToIterate: objToIterate,
                  nameToSend: nameToSend,
                  nameTakenInDocs: nameTakenInDocs,
                  additionnalJsonData: additionnalJsonData,
                  additionnalParams: additionnalParams,

                  _i: _i + 1,

                  _rets: ret ? [].concat((0, _toConsumableArray3.default)(_rets), [ret]) : _rets
                }));

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function recursiveCallFunction(_x) {
        return _ref.apply(this, arguments);
      }

      return recursiveCallFunction;
    }()

    /**
     * Get the Ips of the local machine
     */

  }, {
    key: 'givesLocalIps',
    value: function givesLocalIps() {
      try {
        // Get network interfaces
        var interfaces = _os2.default.networkInterfaces();

        return (0, _keys2.default)(interfaces).reduce(function (tmp, x) {
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
    key: 'convertStringToJSON',
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
    key: 'execCommandLine',
    value: function execCommandLine(cmd) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        maxBuffer: 1024 * 2000
      };

      return new _promise2.default(function (resolve, reject) {
        _child_process2.default.exec(cmd, options, function (err, res) {
          if (err) {
            return reject(new Error('E8191 : ' + String(err)));
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
    key: 'generateStringFromSameChar',
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
    key: 'execStreamedCommandLine',
    value: function execStreamedCommandLine(_ref4) {
      var cmd = _ref4.cmd,
          _ref4$options = _ref4.options,
          options = _ref4$options === undefined ? [] : _ref4$options,
          _ref4$processArray = _ref4.processArray,
          processArray = _ref4$processArray === undefined ? false : _ref4$processArray,
          onStdout = _ref4.onStdout,
          onStderr = _ref4.onStderr;

      return new _promise2.default(function (resolve, reject) {
        var ls = _child_process2.default.spawn(cmd, options);

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

          reject(new Error('E8200 : ' + err.toString()));
        });
      });
    }

    /**
     * Sleep some time
     */

  }, {
    key: 'sleep',
    value: function sleep(timeInMs) {
      return new _promise2.default(function (resolve) {
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
    key: 'displayMessage',
    value: function displayMessage(_ref5) {
      var str = _ref5.str,
          _ref5$carriageReturn = _ref5.carriageReturn,
          carriageReturn = _ref5$carriageReturn === undefined ? true : _ref5$carriageReturn,
          _ref5$out = _ref5.out,
          out = _ref5$out === undefined ? process.stdout : _ref5$out,
          _ref5$from = _ref5.from,
          from = _ref5$from === undefined ? 'unknown' : _ref5$from,
          _ref5$time = _ref5.time,
          time = _ref5$time === undefined ? Date.now() : _ref5$time;

      out.write((0, _moment2.default)(time).format(_CONSTANT2.default.MOMENT_CONSOLE_DATE_DISPLAY_FORMAT) + ':' + from + ' > - ' + str + (carriageReturn ? '\n' : ''));
    }

    /**
     * Read a file asynchronously
     */

  }, {
    key: 'readFile',
    value: function readFile(filename) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

      return new _promise2.default(function (resolve, reject) {
        _fs2.default.readFile(filename, options, function (err, data) {
          if (err) return reject(new Error('E8088 : filename: ' + filename, String(err)));

          return resolve(data);
        });
      });
    }

    /**
     * Parse hjson content (Human JSON --> npm module)
     * @param {String} content
     */

  }, {
    key: 'parseHjsonContent',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(content) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                return _context2.abrupt('return', _hjson2.default.parse(content));

              case 4:
                _context2.prev = 4;
                _context2.t0 = _context2['catch'](0);
                throw new Error('E8089 : ' + String(_context2.t0));

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 4]]);
      }));

      function parseHjsonContent(_x4) {
        return _ref6.apply(this, arguments);
      }

      return parseHjsonContent;
    }()

    /**
     * DO NOT CALL IT DIRECTLY, it is used by promiseCallUntilTrue
     *
     * RECURSIVE
     */

  }, {
    key: 'executePromiseCallUntilTrue',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref8) {
        var functionToCall = _ref8.functionToCall,
            context = _ref8.context,
            args = _ref8.args,
            _ref8$i = _ref8.i,
            i = _ref8$i === undefined ? 0 : _ref8$i;
        var ret;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return functionToCall.apply(context, [].concat((0, _toConsumableArray3.default)(args), [i]));

              case 2:
                ret = _context3.sent;

                if (!(ret !== false && ret.args === void 0)) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt('return', ret);

              case 5:
                return _context3.abrupt('return', Utils.executePromiseCallUntilTrue({
                  functionToCall: functionToCall,
                  context: context,
                  args: ret.args === void 0 ? args : ret.args,

                  i: ret.i === void 0 ? i + 1 : ret.i
                }));

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function executePromiseCallUntilTrue(_x5) {
        return _ref7.apply(this, arguments);
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
    key: 'promiseCallUntilTrue',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(conf) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', Utils.executePromiseCallUntilTrue(conf));

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function promiseCallUntilTrue(_x6) {
        return _ref9.apply(this, arguments);
      }

      return promiseCallUntilTrue;
    }()

    /**
     * DO NOT CALL IT DIRECTLY, it is used by promiseQueue
     *
     * RECURSIVE
     */

  }, {
    key: 'executePromiseQueue',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(conf) {
        var _rets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var _i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        var _conf$_i, functionToCall, _conf$_i$context, context, _conf$_i$args, args;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(_i >= conf.length)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', _rets);

              case 2:

                // Execute one
                _conf$_i = conf[_i], functionToCall = _conf$_i.functionToCall, _conf$_i$context = _conf$_i.context, context = _conf$_i$context === undefined ? this : _conf$_i$context, _conf$_i$args = _conf$_i.args, args = _conf$_i$args === undefined ? [] : _conf$_i$args;
                _context5.t0 = _rets;
                _context5.next = 6;
                return functionToCall.apply(context, args);

              case 6:
                _context5.t1 = _context5.sent;

                _context5.t0.push.call(_context5.t0, _context5.t1);

                return _context5.abrupt('return', Utils.executePromiseQueue(conf, _rets, _i + 1));

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function executePromiseQueue(_x7) {
        return _ref10.apply(this, arguments);
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
    key: 'promiseQueue',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(conf) {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', Utils.executePromiseQueue(conf));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function promiseQueue(_x10) {
        return _ref11.apply(this, arguments);
      }

      return promiseQueue;
    }()

    /**
     * Return the name of the function that call this function
     * IT'S A HACK
     */

  }, {
    key: 'getFunctionName',
    value: function getFunctionName() {
      var numberFuncToGoBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      var err = new Error('tmpErr');

      var splitted = err.stack.split('\n');

      // If we cannot succeed to find the good function name, return the whole data
      if (numberFuncToGoBack >= splitted.length) {
        return err.stack;
      }

      var trimmed = splitted[numberFuncToGoBack].trim(' ');

      // If we cannot succeed to find the good function name, return the whole data
      if (!trimmed.length) return err.stack;

      return trimmed.split(' ')[1];
    }

    /**
     * Fire functions that are in the given array and pass args to it
     * @param {[?({func: Function, context: Object},func)]} arrayOfFunction
     * @param {Array} args
     */

  }, {
    key: 'fireUp',
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
    key: 'isAnArray',
    value: function isAnArray(v) {
      return Utils.isAJSON(v) && v instanceof Array;
    }

    /**
     * Check if we got a version in a String
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: 'isAVersion',
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
    key: 'isABoolean',
    value: function isABoolean(v) {
      return typeof v === 'boolean' || v === 'true' || v === 'false';
    }

    /**
     * Check if we got a Boolean (permissive with true and false strings)
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: 'isABooleanPermissive',
    value: function isABooleanPermissive(v) {
      return Utils.isABoolean(v) || v === 'true' || v === 'false';
    }

    /**
     * Check if we got an ID
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: 'isAnID',
    value: function isAnID(v) {
      if (!v || typeof v !== 'string') return false;

      return new RegExp('^[a-f\\d]{' + String(_CONSTANT2.default.MONGO_DB_ID_LENGTH) + '}$', 'i').test(v);
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
    key: 'isNull',
    value: function isNull(v) {
      return v === null || v === 0 || v === false || v === 'null' || v === void 0;
    }

    /**
     * Check if we got a String
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: 'isAString',
    value: function isAString(v) {
      return typeof v === 'string';
    }

    /**
     * Check if we got an unsigned Integer
     * @param {Object} v
     * @return {Boolean}
     */

  }, {
    key: 'isAnUnsignedInteger',
    value: function isAnUnsignedInteger(v) {
      if (v === void 0 || v === null || v instanceof Array || (typeof v === 'undefined' ? 'undefined' : (0, _typeof3.default)(v)) === 'object' && !(v instanceof Number)) return false;

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
    key: 'isATimestamp',
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
    key: 'isAnInteger',
    value: function isAnInteger(v) {
      if (v === void 0 || v === null || v instanceof Array || (typeof v === 'undefined' ? 'undefined' : (0, _typeof3.default)(v)) === 'object' && !(v instanceof Number)) return false;

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
    key: 'isAFloat',
    value: function isAFloat(v) {
      if (v === void 0 || v === null || v instanceof Array || (typeof v === 'undefined' ? 'undefined' : (0, _typeof3.default)(v)) === 'object' && !(v instanceof Number)) return false;

      var regexp = /^[+-]?\d+(\.\d+)?$/;

      return regexp.test(v);
    }

    /**
     * Get the Cpu usage & memory of the current pid
     */

  }, {
    key: 'getCpuAndMemoryLoad',
    value: function getCpuAndMemoryLoad() {
      return new _promise2.default(function (resolve, reject) {
        (0, _pidusage2.default)(process.pid, function (err, stat) {
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
    key: 'isAnIPAddress',
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
    key: 'isAJSON',
    value: function isAJSON(v) {
      // handle the null case
      if (v === null || v === false || v === void 0) return false;

      // handle one part of numbers
      if (v instanceof Number) return false;

      if ((typeof v === 'undefined' ? 'undefined' : (0, _typeof3.default)(v)) === 'object') return true;

      if (!Utils.isAString(v)) return false;

      // Test a json contains {} or [] data in it
      var regexpJson = /(({*})|(\[*\]))+/;

      if (!regexpJson.test(v)) return false;

      try {
        JSON.parse(v);

        // handle the numbers
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
    key: 'toBoolean',
    value: function toBoolean(v) {
      if (typeof v === 'boolean') return v;

      if (v === 'false') return false;

      if (v === 'true') return true;

      return !!v;
    }
  }]);
  return Utils;
}(); //
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

/*
 * This class contain utilitaries functions
 */

// Includes


exports.default = Utils;
//# sourceMappingURL=Utils.js.map
