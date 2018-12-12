'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _CONSTANT = require('../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _Utils = require('../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _applyConfigurationMasterSlaveLaunch = require('./applyConfigurationMasterSlaveLaunch.js');

var _applyConfigurationMasterSlaveLaunch2 = _interopRequireDefault(_applyConfigurationMasterSlaveLaunch);

var _RoleAndTask = require('../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var instance = null;

/**
 * This class implement the different launch scenarios of ELIOT
 */

var LaunchScenarios = function () {
  function LaunchScenarios() {
    (0, _classCallCheck3.default)(this, LaunchScenarios);

    if (instance) return instance;

    this.lastLaunch = false;

    instance = this;

    return instance;
  }

  /**
   * SINGLETON implementation
   */


  (0, _createClass3.default)(LaunchScenarios, [{
    key: 'getMapLaunchingModes',


    /**
     * Get the map of launching modes
     */
    value: function getMapLaunchingModes() {
      return [{
        name: _CONSTANT2.default.ELIOT_LAUNCHING_MODE.MASTER,
        func: this.master
      }, {
        name: _CONSTANT2.default.ELIOT_LAUNCHING_MODE.SLAVE,
        func: this.slave
      }].concat((0, _toConsumableArray3.default)(_RoleAndTask2.default.getInstance().customLaunchingMode));
    }

    /**
     * Read the Master Slave launch configuration file
     */

  }, {
    key: 'master',


    /**
     * Start ELIOT in master mode
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options, launchMasterSlaveConfigurationFile) {
        var launchConfFileContent;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.lastLaunch = {
                  method: this.master,
                  options: options
                };

                // Say to people in which state we are at launch -> LAUNCHING
                _context.next = 3;
                return _RoleAndTask2.default.getInstance().spreadStateToListener();

              case 3:
                _context.next = 5;
                return LaunchScenarios.readLaunchMasterSlaveConfigurationFile(launchMasterSlaveConfigurationFile);

              case 5:
                launchConfFileContent = _context.sent;
                _context.next = 8;
                return (0, _applyConfigurationMasterSlaveLaunch2.default)(launchConfFileContent);

              case 8:
                _context.next = 10;
                return _RoleAndTask2.default.getInstance().changeEliotState(_CONSTANT2.default.DEFAULT_STATES.READY_PROCESS.id);

              case 10:
                return _context.abrupt('return', true);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function master(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return master;
    }()

    /**
     * Takes option-key = ['optA=12', 'optB=78', ...]
     * and return [
     *   optA: '12',
     *   optB: '78',
     * ]
     *
     * @param {Object} options
     * @param {String} name
     */

  }, {
    key: 'slave',


    /**
     * Start ELIOT in slave mode
     */
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
        var roleHandler, optCreatSlave, parsedOptions;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                roleHandler = _RoleAndTask2.default.getInstance().getRoleHandler();
                optCreatSlave = {};


                this.lastLaunch = {
                  method: this.slave,
                  options: options
                };

                // We have something like mode-options = ['optA=12', 'optB=78', ...]
                _context2.next = 5;
                return LaunchScenarios.parseEqualsArrayOptions(options, _CONSTANT2.default.ELIOT_LAUNCHING_PARAMETERS.MODE_OPTIONS.name);

              case 5:
                parsedOptions = _context2.sent;


                // Create dynamically the options to create a new slave depending on what the CLI gave to us
                // Add as enter parameter all parameters that can be taken as Slave start
                (0, _keys2.default)(_CONSTANT2.default.SLAVE_START_ARGS).map(function (x) {
                  return _CONSTANT2.default.SLAVE_START_ARGS[x];
                }).forEach(function (x) {
                  if (parsedOptions[x]) optCreatSlave[x] = parsedOptions[x];
                });

                _context2.next = 9;
                return roleHandler.startRole(_CONSTANT2.default.DEFAULT_ROLES.SLAVE_ROLE.id, optCreatSlave);

              case 9:
                return _context2.abrupt('return', true);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function slave(_x3) {
        return _ref2.apply(this, arguments);
      }

      return slave;
    }()
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      return instance || new LaunchScenarios();
    }
  }, {
    key: 'readLaunchMasterSlaveConfigurationFile',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(filename) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = _Utils2.default;
                _context3.next = 3;
                return _Utils2.default.readFile(filename);

              case 3:
                _context3.t1 = _context3.sent;
                return _context3.abrupt('return', _context3.t0.parseHjsonContent.call(_context3.t0, _context3.t1));

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function readLaunchMasterSlaveConfigurationFile(_x4) {
        return _ref3.apply(this, arguments);
      }

      return readLaunchMasterSlaveConfigurationFile;
    }()
  }, {
    key: 'parseEqualsArrayOptions',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(options, name) {
        var tmp, parsedOptions, ret;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!options || !options[name])) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return', {});

              case 2:
                if (options[name] instanceof Array) {
                  _context4.next = 4;
                  break;
                }

                throw new Error('INVALID_LAUNCHING_PARAMETER : Parameter: ' + name);

              case 4:
                tmp = void 0;
                parsedOptions = {};
                ret = options[name].some(function (x) {
                  tmp = x.split('=');

                  // If the pattern optA=value isn't respected return an error
                  if (tmp.length !== 2) return true;

                  parsedOptions[tmp[0]] = tmp[1];

                  return false;
                });

                if (!ret) {
                  _context4.next = 9;
                  break;
                }

                throw new Error('INVALID_LAUNCHING_PARAMETER : Parameter: ' + name);

              case 9:
                return _context4.abrupt('return', parsedOptions);

              case 10:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function parseEqualsArrayOptions(_x5, _x6) {
        return _ref4.apply(this, arguments);
      }

      return parseEqualsArrayOptions;
    }()
  }]);
  return LaunchScenarios;
}();

exports.default = LaunchScenarios;
//# sourceMappingURL=LaunchScenarios.js.map
