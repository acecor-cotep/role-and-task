'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _AMaster2 = require('./AMaster.js');

var _AMaster3 = _interopRequireDefault(_AMaster2);

var _CONSTANT = require('../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _TaskHandler = require('../../Handlers/TaskHandler.js');

var _TaskHandler2 = _interopRequireDefault(_TaskHandler);

var _ZeroMQServerRouter = require('../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter.js');

var _ZeroMQServerRouter2 = _interopRequireDefault(_ZeroMQServerRouter);

var _Utils = require('../../../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Errors = require('../../../Utils/Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

var _RoleAndTask = require('../../../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

var _PromiseCommandPattern = require('../../../Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = null;

/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports

var Master1_0 = function (_AMaster) {
  (0, _inherits3.default)(Master1_0, _AMaster);

  function Master1_0() {
    var _ret, _ret2;

    (0, _classCallCheck3.default)(this, Master1_0);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Master1_0.__proto__ || (0, _getPrototypeOf2.default)(Master1_0)).call(this));

    if (instance) return _ret = instance, (0, _possibleConstructorReturn3.default)(_this, _ret);

    _this.name = _CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.name;
    _this.id = _CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id;

    _this.pathToEntryFile = false;

    // Get the tasks related to the master role
    var tasks = _RoleAndTask2.default.getInstance().getRoleTasks(_CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id);

    // Define all tasks handled by this role
    _this.setTaskHandler(new _TaskHandler2.default(tasks));

    _this.initProperties();

    instance = _this;

    return _ret2 = instance, (0, _possibleConstructorReturn3.default)(_this, _ret2);
  }

  /**
   * Init the properties
   */


  (0, _createClass3.default)(Master1_0, [{
    key: 'initProperties',
    value: function initProperties() {
      // Define none communicationSystem for now
      this.communicationSystem = false;

      // Array of current approved slaves
      this.slaves = [];

      // Array of slaves that are in the confirmation process
      this.notConfirmedSlaves = [];

      // Array that contains the relation between console process ptr and programIdentifier
      // We use it too when there is no console launch, because it work with both soluce
      this.consoleChildObjectPtr = [];

      // Functions called when something happend to a slave connection
      this.newConnectionListeningFunction = [];
      this.newDisconnectionListeningFunction = [];

      // Data we keep as attribute to give to handleProgramTask later
      this.cpuUsageAndMemory = false;
      this.tasksInfos = false;

      // Store the mutexes here, we use to avoid concurrency between slaves on specific actions
      this.mutexes = {};
    }

    /**
     * Get the communicationSystem
     */

  }, {
    key: 'getCommunicationSystem',
    value: function getCommunicationSystem() {
      return this.communicationSystem;
    }

    /**
     * SINGLETON implementation
     * @override
     */

  }, {
    key: 'unlistenSlaveConnectionEvent',


    /**
     * Pull a function that get fired when a slave get connected
     */
    value: function unlistenSlaveConnectionEvent(func) {
      this.newConnectionListeningFunction = this.newConnectionListeningFunction.filter(function (x) {
        return x.func !== func;
      });
    }

    /**
     * Pull a function that get fired when a slave get disconnected
     */

  }, {
    key: 'unlistenSlaveDisconnectionEvent',
    value: function unlistenSlaveDisconnectionEvent(func) {
      this.newDisconnectionListeningFunction = this.newDisconnectionListeningFunction.filter(function (x) {
        return x.func !== func;
      });
    }

    /**
     * Push a function that get fired when a slave get connected
     */

  }, {
    key: 'listenSlaveConnectionEvent',
    value: function listenSlaveConnectionEvent(func, context) {
      this.newConnectionListeningFunction.push({
        func: func,
        context: context
      });
    }

    /**
     * Push a function that get fired when a slave get disconnected
     */

  }, {
    key: 'listenSlaveDisconnectionEvent',
    value: function listenSlaveDisconnectionEvent(func) {
      this.newDisconnectionListeningFunction.push({
        func: func,
        context: context
      });
    }

    /**
     * Return the array that contains non-confirmed slaves
     */

  }, {
    key: 'getNonConfirmedSlaves',
    value: function getNonConfirmedSlaves() {
      return this.notConfirmedSlaves;
    }

    /**
     *  Get an array that contains confirmed slaves
     */

  }, {
    key: 'getSlaves',
    value: function getSlaves() {
      return this.slaves;
    }

    /**
     * We get asked to spread a news to every slave tasks and our tasks
     *
     * WARNING - DO NOT SEND IT TO NON-REGULAR SLAVES (CRON_EXECUTOR_ROLE FOR EXAMPLE)
     *
     * @param {[Byte]} clientIdentityByte
     * @param {String} clientIdentityString
     * @param {Object} data
     */

  }, {
    key: 'sendDataToEveryProgramTaskWhereverItIsLowLevel',
    value: function sendDataToEveryProgramTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, body) {
      var _this2 = this;

      var regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();

      // Open the body to get the list of tasks we limit the spread on
      var limitToTaskList = body.limitToTaskList;

      // For each slave

      regularSlaves.forEach(function (x) {
        // Only send the data to the slaves that holds a tasks that need to know about the message
        if (!limitToTaskList || x.tasks.some(function (y) {
          return y.isActive && limitToTaskList.includes(y.id);
        })) {
          // Send a message to every running slaves
          _this2.sendMessageToSlaveHeadBodyPattern(x.programIdentifier, _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, body);
        }
      });

      // For itself tasks
      _RoleAndTask2.default.getInstance().spreadDataToEveryLocalTask(body);
    }

    /**
     * We get asked to spread a news to every slave tasks and our tasks
     */

  }, {
    key: 'sendDataToEveryProgramTaskWhereverItIs',
    value: function sendDataToEveryProgramTaskWhereverItIs(data) {
      this.sendDataToEveryProgramTaskWhereverItIsLowLevel(false, false, data);
    }

    /**
     * Tell the Task about something happend in slaves
     */

  }, {
    key: 'tellMasterAboutSlaveError',
    value: function tellMasterAboutSlaveError(clientIdentityString, err) {
      var slave = this.slaves.find(function (x) {
        return x.clientIdentityString === clientIdentityString;
      });

      if (!slave) return;

      slave.error = err;
      this.somethingChangedAboutSlavesOrI();
    }

    /**
     * An error happended into a slave, what do we do?
     * @param {Array} clientIdentityByte
     * @param {String} clientIdentityString
     * @param {String} body
     */

  }, {
    key: 'errorHappenedIntoSlave',
    value: function errorHappenedIntoSlave(clientIdentityByte, clientIdentityString, body) {
      var _this3 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var err;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    err = _Errors2.default.deserialize(body);

                    // Display the error

                    _Utils2.default.displayMessage({
                      str: _Errors2.default.staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
                      out: process.stderr
                    });

                    _context.prev = 2;
                    _context.next = 5;
                    return _RoleAndTask2.default.getInstance().changeProgramState(_CONSTANT2.default.DEFAULT_STATES.ERROR.id);

                  case 5:

                    // We goodly changed the program state
                    // Add informations on error

                    _Utils2.default.displayMessage({
                      str: _Errors2.default.staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
                      out: process.stderr
                    });

                    // Tell the task handleProgram that there had been an error for the slave
                    _this3.tellMasterAboutSlaveError(clientIdentityString, err);

                    // If the errors are supposed to be fatal, exit!
                    if (_RoleAndTask2.default.getInstance().makesErrorFatal) {
                      _RoleAndTask2.default.exitProgramUnproperDueToError();
                    }
                    // We leave the process because something get broken
                    _context.next = 15;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context['catch'](2);

                    _Utils2.default.displayMessage({
                      str: 'Exit program unproper ERROR HAPPENED IN SLAVE',
                      out: process.stderr
                    });

                    _Utils2.default.displayMessage({
                      str: String(_context.t0 && _context.t0.stack || _context.t0),
                      out: process.stderr
                    });

                    _RoleAndTask2.default.exitProgramUnproperDueToError();

                  case 15:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this3, [[2, 10]]);
          }));

          return function func() {
            return _ref.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * In master/slave protocol, we ask to get a token. We get directly asked as the master
     */

  }, {
    key: 'takeMutex',
    value: function takeMutex(id) {
      var _this4 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            var customFunctions;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!_this4.mutexes[id]) {
                      _context2.next = 2;
                      break;
                    }

                    throw new _Errors2.default('E7024');

                  case 2:

                    // Custom function to call when taking or releasing the mutex (if one got set by the user)
                    // If the function throw, we do not take the token
                    customFunctions = _RoleAndTask2.default.getInstance().getMasterMutexFunctions().find(function (x) {
                      return x.id === id;
                    });

                    if (!(customFunctions && customFunctions.funcTake)) {
                      _context2.next = 6;
                      break;
                    }

                    _context2.next = 6;
                    return customFunctions.funcTake();

                  case 6:

                    _this4.mutexes[id] = true;

                  case 7:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this4);
          }));

          return function func() {
            return _ref2.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * In master/slave protocol, we ask to release the token. We get directly asked as the master.
     */

  }, {
    key: 'releaseMutex',
    value: function releaseMutex(id) {
      var _this5 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var customFunctions;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    // Custom function to call when taking or releasing the mutex (if one got set by the user)
                    // If the function throw, we do not take the token
                    customFunctions = _RoleAndTask2.default.getInstance().getMasterMutexFunctions().find(function (x) {
                      return x.id === id;
                    });

                    if (!(customFunctions && customFunctions.funcRelease)) {
                      _context3.next = 4;
                      break;
                    }

                    _context3.next = 4;
                    return customFunctions.funcRelease();

                  case 4:

                    _this5.mutexes[id] = false;

                  case 5:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this5);
          }));

          return function func() {
            return _ref3.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Take the mutex behind the given ID if it's available
     */

  }, {
    key: 'protocolTakeMutex',
    value: function protocolTakeMutex(clientIdentityByte, clientIdentityString, body) {
      var _this6 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var TAKE_MUTEX, slave, customFunctions;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    TAKE_MUTEX = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.TAKE_MUTEX;

                    // Det the slave that asked

                    slave = _this6.slaves.find(function (x) {
                      return x.clientIdentityString === clientIdentityString;
                    });
                    _context4.prev = 2;

                    if (!_this6.mutexes[body.id]) {
                      _context4.next = 5;
                      break;
                    }

                    throw new _Errors2.default('E7024');

                  case 5:

                    // Custom function to call when taking or releasing the mutex (if one got set by the user)
                    // If the function throw, we do not take the token
                    customFunctions = _RoleAndTask2.default.getInstance().getMasterMutexFunctions().find(function (x) {
                      return x.id === body.id;
                    });

                    if (!(customFunctions && customFunctions.funcTake)) {
                      _context4.next = 9;
                      break;
                    }

                    _context4.next = 9;
                    return customFunctions.funcTake();

                  case 9:

                    _this6.mutexes[body.id] = true;

                    _this6.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, TAKE_MUTEX, (0, _stringify2.default)({
                      error: false
                    }));
                    _context4.next = 16;
                    break;

                  case 13:
                    _context4.prev = 13;
                    _context4.t0 = _context4['catch'](2);

                    _this6.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, TAKE_MUTEX, (0, _stringify2.default)({
                      error: _context4.t0.serialize()
                    }));

                  case 16:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, _this6, [[2, 13]]);
          }));

          return function func() {
            return _ref4.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Release the mutex behind the given ID
     */

  }, {
    key: 'protocolReleaseMutex',
    value: function protocolReleaseMutex(clientIdentityByte, clientIdentityString, body) {
      var _this7 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            var RELEASE_MUTEX, slave, customFunctions;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    RELEASE_MUTEX = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.RELEASE_MUTEX;

                    // Det the slave that asked

                    slave = _this7.slaves.find(function (x) {
                      return x.clientIdentityString === clientIdentityString;
                    });
                    _context5.prev = 2;

                    // Custom function to call when taking or releasing the mutex (if one got set by the user)
                    // If the function throw, we do not take the token
                    customFunctions = _RoleAndTask2.default.getInstance().getMasterMutexFunctions().find(function (x) {
                      return x.id === body.id;
                    });

                    if (!(customFunctions && customFunctions.funcRelease)) {
                      _context5.next = 7;
                      break;
                    }

                    _context5.next = 7;
                    return customFunctions.funcRelease();

                  case 7:

                    _this7.mutexes[body.id] = false;

                    _this7.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, RELEASE_MUTEX, (0, _stringify2.default)({
                      error: false
                    }));
                    _context5.next = 14;
                    break;

                  case 11:
                    _context5.prev = 11;
                    _context5.t0 = _context5['catch'](2);

                    _this7.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, RELEASE_MUTEX, (0, _stringify2.default)({
                      error: _context5.t0.serialize()
                    }));

                  case 14:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, _this7, [[2, 11]]);
          }));

          return function func() {
            return _ref5.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Define the master/slave basic protocol
     * (Authentification)
     */

  }, {
    key: 'protocolMasterSlave',
    value: function protocolMasterSlave() {
      var _this8 = this;

      // Shortcuts
      var _CONSTANT$PROTOCOL_KE = _CONSTANT2.default.PROTOCOL_KEYWORDS,
          HEAD = _CONSTANT$PROTOCOL_KE.HEAD,
          BODY = _CONSTANT$PROTOCOL_KE.BODY;
      var _CONSTANT$PROTOCOL_MA = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES,
          SLAVE_CONFIRMATION_INFORMATIONS = _CONSTANT$PROTOCOL_MA.SLAVE_CONFIRMATION_INFORMATIONS,
          GENERIC_CHANNEL_DATA = _CONSTANT$PROTOCOL_MA.GENERIC_CHANNEL_DATA,
          OUTPUT_TEXT = _CONSTANT$PROTOCOL_MA.OUTPUT_TEXT,
          INFOS_ABOUT_SLAVES = _CONSTANT$PROTOCOL_MA.INFOS_ABOUT_SLAVES,
          ERROR_HAPPENED = _CONSTANT$PROTOCOL_MA.ERROR_HAPPENED,
          TAKE_MUTEX = _CONSTANT$PROTOCOL_MA.TAKE_MUTEX,
          RELEASE_MUTEX = _CONSTANT$PROTOCOL_MA.RELEASE_MUTEX;

      // Listen at new Socket connection
      //
      // 1/ Check if the new slave have a correct identifier
      // 2/ Ask the slave for running tasks
      // 3/ Get the slave answer
      // 4/ Add the slave into handled slave
      //

      this.getCommunicationSystem().listenClientConnectionEvent(function (clientIdentityByte, clientIdentityString) {
        var _clientIdentityString = clientIdentityString.split('_'),
            _clientIdentityString2 = (0, _slicedToArray3.default)(_clientIdentityString, 2),
            programIdentifier = _clientIdentityString2[0],
            clientPID = _clientIdentityString2[1];

        // Look at the identity of the slave (and if we have duplicate)


        if (_this8.slaves.find(function (x) {
          return x.programIdentifier === programIdentifier;
        }) || _this8.notConfirmedSlaves.find(function (x) {
          return x.programIdentifier === programIdentifier;
        })) {
          // Identity already in use by an other slave
          // Close the connection
          _RoleAndTask2.default.getInstance().displayMessage({
            str: ('[' + _this8.name + '] Refuse slave cause of identity').cyan
          });

          return _this8.getCommunicationSystem().closeConnectionToClient(clientIdentityByte, clientIdentityString);
        }

        // So here the client do not exist already and the identifier is free

        // Add the slave into the declared not confirmed array
        _this8.notConfirmedSlaves.push({
          clientIdentityString: clientIdentityString,
          clientIdentityByte: clientIdentityByte,
          programIdentifier: programIdentifier,
          clientPID: clientPID,
          tasks: [],
          error: false
        });

        // Ask the slaves about its tasks
        return _this8.getCommunicationSystem().sendMessageToClient(clientIdentityByte, clientIdentityString, SLAVE_CONFIRMATION_INFORMATIONS);
      });

      // Listen to slaves disconnection
      this.getCommunicationSystem().listenClientDisconnectionEvent(function (clientIdentityString) {
        _this8.slaves = _this8.slaves.filter(function (x) {
          if (x.clientIdentityString === clientIdentityString) {
            _RoleAndTask2.default.getInstance().displayMessage({
              str: ('[' + _this8.name + '] Slave get removed (connection)').red
            });

            // Fire when a slave get disconnected
            _Utils2.default.fireUp(_this8.newDisconnectionListeningFunction, [x]);

            return false;
          }

          return true;
        });

        _this8.notConfirmedSlaves = _this8.notConfirmedSlaves.filter(function (x) {
          if (x.clientIdentityString === clientIdentityString) {
            _RoleAndTask2.default.getInstance().displayMessage({
              str: ('[' + _this8.name + '] Non-confirmed slave get removed (connection)').red
            });

            // Fire when a slave get disconnected
            _Utils2.default.fireUp(_this8.newDisconnectionListeningFunction, [x]);

            return false;
          }

          return true;
        });
      });

      // Confirm a slave that wasn't
      var confirmSlave = function confirmSlave(clientIdentityByte, clientIdentityString, dataJSON) {
        var index = _this8.notConfirmedSlaves.findIndex(function (x) {
          return x.clientIdentityString === clientIdentityString;
        });

        if (index === -1) return;

        // Confirm the slave
        var slave = _this8.notConfirmedSlaves[index];

        slave.tasks = dataJSON[BODY].tasks;
        slave.role = dataJSON[BODY].role;

        _this8.slaves.push(slave);

        _this8.notConfirmedSlaves.splice(index, 1);

        // Fire when a slave get connected
        _Utils2.default.fireUp(_this8.newConnectionListeningFunction, [slave]);
      };

      // We listen to incoming messages
      this.getCommunicationSystem().listenToIncomingMessage(function (clientIdentityByte, clientIdentityString, dataString) {
        var dataJSON = _Utils2.default.convertStringToJSON(dataString);

        // Here we got all messages that comes from clients (so slaves)
        // Check if the message answer particular message
        // If it does apply the particular job
        [{
          //
          // Check about the slave infos
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === SLAVE_CONFIRMATION_INFORMATIONS;
          },
          // It means we get the tasks list
          applyFunc: function applyFunc() {
            return confirmSlave(clientIdentityByte, clientIdentityString, dataJSON);
          }
        }, {
          //
          // Check about generic news
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === GENERIC_CHANNEL_DATA;
          },
          applyFunc: function applyFunc() {
            return _this8.sendDataToEveryProgramTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }, {
          //
          // Check about messages to display
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === OUTPUT_TEXT;
          },
          applyFunc: function applyFunc() {
            return _this8.displayMessage(dataJSON[BODY]);
          }
        }, {
          //
          // Check about infos about slaves
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === INFOS_ABOUT_SLAVES;
          },
          applyFunc: function applyFunc() {
            return _this8.infosAboutSlaveIncomming(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }, {
          //
          // Check about error happened into slave
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ERROR_HAPPENED;
          },
          applyFunc: function applyFunc() {
            return _this8.errorHappenedIntoSlave(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }, {
          //
          // Check about slave asking for taking a mutex
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === TAKE_MUTEX;
          },
          applyFunc: function applyFunc() {
            return _this8.protocolTakeMutex(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }, {
          //
          // Check about slave asking for releasing a mutex
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === RELEASE_MUTEX;
          },
          applyFunc: function applyFunc() {
            return _this8.protocolReleaseMutex(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }].forEach(function (x) {
          if (x.checkFunc()) x.applyFunc();
        });
      });
    }

    /**
     * We got news about a slave -> infos
     * Store it and call HandleProgramTask if it's up
     * @param {Object} clientIdentityByte
     * @param {String} clientIdentityString
     * @param {Object} data
     */

  }, {
    key: 'infosAboutSlaveIncomming',
    value: function infosAboutSlaveIncomming(clientIdentityByte, clientIdentityString, data) {
      // Get the right slave
      var slave = this.slaves.find(function (x) {
        return x.clientIdentityString === clientIdentityString;
      });
      var notConfirmedSlave = this.notConfirmedSlaves.find(function (x) {
        return x.clientIdentityString === clientIdentityString;
      });

      var ptr = slave || notConfirmedSlave;

      if (!ptr) return;

      if (!ptr.moreInfos) ptr.moreInfos = {};

      // Apply values to moreInfos
      ['cpuAndMemory', 'ips', 'tasksInfos'].forEach(function (x) {
        // To get the 0 value
        if (data[x] !== void 0) ptr.moreInfos[x] = data[x];
      });

      // Tell something changed in the conf
      this.somethingChangedAboutSlavesOrI();
    }

    /**
     * Returns in an array the whole system pids (Master + Slaves processes)
     */

  }, {
    key: 'getFullSystemPids',
    value: function getFullSystemPids() {
      var _this9 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return new _promise2.default(function (resolve) {
            resolve([String(process.pid)].concat((0, _toConsumableArray3.default)(_this9.slaves.map(function (x) {
              return String(x.clientPID);
            }))));
          });
        }
      });
    }

    /**
     * Connect the second Task to the first one
     * @param {String} idTaskToConnectTo
     * @param {String} idTaskToConnect
     * @param {Object} args
     */

  }, {
    key: 'connectMasterToTask',
    value: function connectMasterToTask(idTaskToConnectTo, idTaskToConnect, args) {
      var _this10 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            var task, connection;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.prev = 0;

                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: _Utils2.default.monoline(['[' + _this10.name + '] Ask Master to connect the Task N\xB0' + idTaskToConnect, ' to the Task N\xB0' + idTaskToConnectTo]).blue
                    });

                    _context6.next = 4;
                    return _this10.getTaskHandler().getTask(idTaskToConnectTo);

                  case 4:
                    task = _context6.sent;

                    if (task.isActive()) {
                      _context6.next = 7;
                      break;
                    }

                    throw new _Errors2.default('E7009', 'idTask: ' + idTaskToConnectTo);

                  case 7:

                    // Ask the connection to be made
                    connection = task.connectToTask(idTaskToConnect, args);


                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: _Utils2.default.monoline(['[' + _this10.name + '] Task N\xB0' + idTaskToConnect + ' correctly connected to Task ', 'N\xB0' + idTaskToConnectTo + ' in Master']).green
                    });

                    return _context6.abrupt('return', connection);

                  case 12:
                    _context6.prev = 12;
                    _context6.t0 = _context6['catch'](0);

                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: _Utils2.default.monoline(['[' + _this10.name + '] Task N\xB0' + idTaskToConnect + ' failed to be connected', ' to Task N\xB0' + idTaskToConnectTo + ' in Master']).red
                    });

                    throw _context6.t0;

                  case 16:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this10, [[0, 12]]);
          }));

          return function func() {
            return _ref6.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Connect the second Task to the first one
     * @param {String} identifierSlave - Identifier of the slave that host the idTaskToConnectTo
     * @param {String} idTaskToConnectTo
     * @param {String} idTaskToConnect
     * @param {Object} args
     */

  }, {
    key: 'connectTaskToTask',
    value: function connectTaskToTask(identifierSlave, idTaskToConnectTo, idTaskToConnect, args) {
      var _this11 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
            var ret;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return _this11.sendMessageAndWaitForTheResponse({
                      identifierSlave: identifierSlave,
                      isHeadBodyPattern: true,
                      messageHeaderToSend: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CONNECT_TASK_TO_TASK,

                      messageBodyToSend: {
                        idTask: idTaskToConnectTo,
                        idTaskToConnect: idTaskToConnect,
                        args: args
                      },

                      messageHeaderToGet: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CONNECT_TASK_TO_TASK
                    });

                  case 2:
                    ret = _context7.sent;

                    if (!(ret === '')) {
                      _context7.next = 5;
                      break;
                    }

                    return _context7.abrupt('return', ret);

                  case 5:
                    throw ret;

                  case 6:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, _this11);
          }));

          return function func() {
            return _ref7.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Modify the status of the task attached to the given identifier
     * (local data, have no impact in the real slave)
     * @param {String} identifier
     * @param {String} idTask
     * @param {Boolean} status
     */

  }, {
    key: 'modifyTaskStatusToSlaveLocalArray',
    value: function modifyTaskStatusToSlaveLocalArray(identifier, idTask, status) {
      var _this12 = this;

      this.slaves.some(function (x, xi) {
        if (x.programIdentifier === identifier) {
          return x.tasks.some(function (y, yi) {
            if (y.id === idTask) {
              _this12.slaves[xi].tasks[yi].isActive = status;

              return true;
            }

            return false;
          });
        }

        return false;
      });
    }

    /**
     * When called: Add a task to a slave
     * @param {String} identifier
     * @param {String} idTask
     */

  }, {
    key: 'startTaskToSlave',
    value: function startTaskToSlave(identifier, idTask) {
      var _this13 = this;

      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            var ret;
            return _regenerator2.default.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return _this13.sendMessageAndWaitForTheResponse({
                      identifierSlave: identifier,
                      isHeadBodyPattern: true,
                      messageHeaderToSend: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK,

                      messageBodyToSend: {
                        idTask: idTask,
                        args: args
                      },

                      messageHeaderToGet: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK
                    });

                  case 2:
                    ret = _context8.sent;

                    if (!(ret === '')) {
                      _context8.next = 7;
                      break;
                    }

                    // Modify the task status for the given slave
                    _this13.modifyTaskStatusToSlaveLocalArray(identifier, idTask, true);

                    // Say something changed
                    _this13.somethingChangedAboutSlavesOrI();

                    return _context8.abrupt('return', ret);

                  case 7:
                    throw _Errors2.default.deserialize(ret);

                  case 8:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this13);
          }));

          return function func() {
            return _ref8.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * List the existing slaves
     */

  }, {
    key: 'listSlaves',
    value: function listSlaves() {
      var _this14 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this14.master.getSlave();
        }
      });
    }

    /**
     * List a slave tasks using its identifier (Ask the slave to it)
     * @param {String} identifier
     */

  }, {
    key: 'distantListSlaveTask',
    value: function distantListSlaveTask(identifier) {
      var _this15 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _this15.sendMessageAndWaitForTheResponse({
            identifierSlave: identifier,
            isHeadBodyPattern: false,
            messageHeaderToSend: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
            messageBodyToSend: {},
            messageHeaderToGet: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS
          });
        }
      });
    }

    /**
     * List a slave tasks using its identifier (Use local data to it)
     * @param {String} identifier
     */

  }, {
    key: 'listSlaveTask',
    value: function listSlaveTask(identifier) {
      var _this16 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
            var slave;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    // Look for the slave in confirmSlave
                    slave = _this16.getSlaveByProgramIdentifier(identifier);
                    return _context9.abrupt('return', slave.tasks);

                  case 2:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, _this16);
          }));

          return function func() {
            return _ref9.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Handle the fact the program state change
     * We spread the data on our tasks and to our slaves
     * @param {Number} programState
     * @param {Number} oldProgramState
     */

  }, {
    key: 'handleProgramStateChange',
    value: function handleProgramStateChange(programState, oldProgramState) {
      var _this17 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _promise2.default.all([
          // Spread to our tasks
          _this17.getTaskHandler().applyNewProgramState(programState, oldProgramState),

          // Spread to slaves
          _this17.tellAllSlaveThatProgramStateChanged(programState, oldProgramState)]

          // The spread n slaves went well
          );
        }
      });
    }

    /**
     * Return only the slaves that are regular slaves (not CRON_EXECUTOR_ROLE for example)
     */

  }, {
    key: 'getSlavesOnlyThatAreRegularSlaves',
    value: function getSlavesOnlyThatAreRegularSlaves() {
      return this.slaves.filter(function (x) {
        return x.role.id === _CONSTANT2.default.DEFAULT_ROLES.SLAVE_ROLE.id;
      });
    }

    /**
     * Tell all slave that the program state did change
     *
     * WARNING - DO NOT INCLUDE CRON_EXECUTOR_ROLE SLAVES INTO THE PIPE
     *
     * @param {Number} programState
     * @param {Number} oldProgramState
     */

  }, {
    key: 'tellAllSlaveThatProgramStateChanged',
    value: function tellAllSlaveThatProgramStateChanged(programState, oldProgramState) {
      var _this18 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
            var regularSlaves;
            return _regenerator2.default.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    regularSlaves = _this18.getSlavesOnlyThatAreRegularSlaves();
                    return _context10.abrupt('return', _promise2.default.all(regularSlaves.map(function (x) {
                      return _this18.tellASlaveThatProgramStateChanged(x.programIdentifier, programState, oldProgramState);
                    })));

                  case 2:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, _callee10, _this18);
          }));

          return function func() {
            return _ref10.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Tell a slave that program state did change
     * @param {String} slaveIdentifier
     * @param {Number} programState
     * @param {Number} oldProgramState
     */

  }, {
    key: 'tellASlaveThatProgramStateChanged',
    value: function tellASlaveThatProgramStateChanged(slaveIdentifier, programState, oldProgramState) {
      var _this19 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
            var STATE_CHANGE, ret;
            return _regenerator2.default.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    STATE_CHANGE = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STATE_CHANGE;
                    _context11.next = 3;
                    return _this19.sendMessageAndWaitForTheResponse({
                      identifierSlave: slaveIdentifier,
                      isHeadBodyPattern: true,
                      messageHeaderToSend: STATE_CHANGE,

                      messageBodyToSend: {
                        programState: programState,
                        oldProgramState: oldProgramState
                      },

                      messageHeaderToGet: STATE_CHANGE,
                      timeoutToGetMessage: _RoleAndTask2.default.getInstance().masterMessageWaitingTimeoutStateChange
                    });

                  case 3:
                    ret = _context11.sent;

                    if (!(ret === '')) {
                      _context11.next = 6;
                      break;
                    }

                    return _context11.abrupt('return', ret);

                  case 6:

                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: ('[' + _this19.name + '] program state get not spread in Slave N\xB0' + slaveIdentifier).red
                    });

                    throw _Errors2.default.deserialize(ret);

                  case 8:
                  case 'end':
                    return _context11.stop();
                }
              }
            }, _callee11, _this19);
          }));

          return function func() {
            return _ref11.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * When called: Remove an existing slave(s)
     * @param {Array} identifiersSlaves
     * @param {?Number} _i
     */

  }, {
    key: 'removeExistingSlave',
    value: function removeExistingSlave(identifiersSlaves) {
      var _this20 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _Utils2.default.promiseQueue([].concat((0, _toConsumableArray3.default)(identifiersSlaves.map(function (x) {
            return {
              functionToCall: _this20.sendMessageToSlave,

              context: _this20,

              args: [x, _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CLOSE]
            };
          })), [

          // Say that something changed
          {
            functionToCall: _this20.somethingChangedAboutSlavesOrI,
            context: _this20
          }]));
        }
      });
    }

    /**
     * Kill a slave using its identifier
     * @param {String} programIdentifier
     */

  }, {
    key: 'killSlave',
    value: function killSlave(programIdentifier) {
      var _this21 = this;

      // Look for the given identifier
      this.consoleChildObjectPtr.filter(function (x) {
        if (x.programIdentifier === programIdentifier) {
          try {
            // Kill the process
            process.kill(x.pid, _CONSTANT2.default.SIGNAL_UNPROPER.SIGUSR1);

            // Remove the slave from the slave list
            _this21.slaves = _this21.slaves.filter(function (y) {
              return !(y.programIdentifier === programIdentifier);
            });
          } catch (err) {
            // Ignore the error, because the slave is dead anyway to us
          }

          return false;
        }

        return true;
      });
    }

    /**
     * When called: remove a task from slave
     *
     * THIS FUNCTION HAVE SPECIAL TIMEOUT FOR SLAVE ANSWER
     *
     * @param {String} identifier
     * @param {String} idTask
     * @param {Object} args
     */

  }, {
    key: 'removeTaskFromSlave',
    value: function removeTaskFromSlave(identifier, idTask) {
      var _this22 = this;

      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
            var STOP_TASK, ret;
            return _regenerator2.default.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    STOP_TASK = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STOP_TASK;


                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: ('[' + _this22.name + '] Ask Slave N\xB0' + identifier + ' to stop the Task N\xB0' + idTask).blue
                    });

                    _context12.next = 4;
                    return _this22.sendMessageAndWaitForTheResponse({
                      identifierSlave: identifier,
                      isHeadBodyPattern: true,
                      messageHeaderToSend: STOP_TASK,

                      messageBodyToSend: {
                        idTask: idTask,
                        args: args
                      },

                      messageHeaderToGet: STOP_TASK,
                      timeoutToGetMessage: _RoleAndTask2.default.getInstance().masterMessageWaitingTimeoutStopChange
                    });

                  case 4:
                    ret = _context12.sent;

                    if (!(ret === '')) {
                      _context12.next = 9;
                      break;
                    }

                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: ('[' + _this22.name + '] Task N\xB0' + idTask + ' correctly stopped in Slave N\xB0' + identifier).green
                    });

                    // Modify the task status for the given slave
                    _this22.modifyTaskStatusToSlaveLocalArray(identifier, idTask, false);

                    return _context12.abrupt('return', ret);

                  case 9:

                    _RoleAndTask2.default.getInstance().displayMessage({
                      str: ('[' + _this22.name + '] Task N\xB0' + idTask + ' failed to be stopped to Slave N\xB0' + identifier).red
                    });

                    throw ret;

                  case 11:
                  case 'end':
                    return _context12.stop();
                }
              }
            }, _callee12, _this22);
          }));

          return function func() {
            return _ref12.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Display a message directly
     * @param {Object} param
     */

  }, {
    key: 'displayMessage',
    value: function displayMessage(param) {
      var _this23 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
            var task;
            return _regenerator2.default.wrap(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    _context13.prev = 0;

                    if (!_RoleAndTask2.default.getInstance().displayTask) {
                      _context13.next = 9;
                      break;
                    }

                    _context13.next = 4;
                    return _this23.getTaskHandler().getTask(_RoleAndTask2.default.getInstance().displayTask);

                  case 4:
                    task = _context13.sent;

                    if (_RoleAndTask2.default.getInstance().displayLog) {
                      _context13.next = 7;
                      break;
                    }

                    return _context13.abrupt('return', false);

                  case 7:
                    if (!task.isActive()) {
                      _context13.next = 9;
                      break;
                    }

                    return _context13.abrupt('return', task.displayMessage(param));

                  case 9:

                    // If not we display
                    _Utils2.default.displayMessage(param);
                    _context13.next = 15;
                    break;

                  case 12:
                    _context13.prev = 12;
                    _context13.t0 = _context13['catch'](0);

                    // Ignore error - We can't display the data - it do not require further error treatment
                    // Store the message into file tho
                    _Utils2.default.displayMessage({
                      str: _Errors2.default.staticIsAnError(_context13.t0) ? _context13.t0.getErrorString() : String(_context13.t0.stack || _context13.t0),
                      out: process.stderr
                    });

                  case 15:
                    return _context13.abrupt('return', false);

                  case 16:
                  case 'end':
                    return _context13.stop();
                }
              }
            }, _callee13, _this23, [[0, 12]]);
          }));

          return function func() {
            return _ref13.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Start a new slave not in a console but in a regular process
     * @param {{opts: String, uniqueSlaveId: String}} slaveOpts
     * @param {Object} specificOpts - (Spawn options)
     * @param {String} connectionTimeout
     */

  }, {
    key: 'startNewSlaveInProcessMode',
    value: function startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout) {
      var _this24 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return new _promise2.default(function (resolve, reject) {
            // We create a unique Id that will referenciate the slave at the connexion
            var uniqueSlaveId = slaveOpts && slaveOpts.uniqueSlaveId || _Utils2.default.generateUniqueProgramID();

            // Options to send to the new created slave
            var programOpts = slaveOpts && slaveOpts.opts || ['--' + _CONSTANT2.default.PROGRAM_LAUNCHING_PARAMETERS.MODE.name, '' + _CONSTANT2.default.PROGRAM_LAUNCHING_MODE.SLAVE, '--' + _CONSTANT2.default.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name, _CONSTANT2.default.SLAVE_START_ARGS.IDENTIFIER + '=' + uniqueSlaveId];

            // Options to give to fork(...)
            var forkOpts = {};

            // If there is no path to the entry file to execute
            if (!_this24.pathToEntryFile) {
              throw new _Errors2.default('EXXXX', 'Cannot start the slave : No pathToEntryFile configured');
            }

            // Path that lead to the exe of PROGRAM
            var pathToExec = _this24.pathToEntryFile;

            // LaunchScenarios program in slave mode in a different process
            var child = _child_process2.default.fork(pathToExec, programOpts, forkOpts);

            // LaunchScenarios a timeout of connection
            var timeoutConnection = setTimeout(function () {
              // Kill the process we did created
              child.kill(_CONSTANT2.default.SIGNAL_TO_KILL_SLAVE_COMMAND);

              return reject(new _Errors2.default('E7003', 'Timeout ' + connectionTimeout + ' ms passed'));
            }, connectionTimeout);

            // Look at error event (If it get fired it means the program failed to get launched)
            // Handle the fact a child can result an error later on after first connection
            // Error detected
            child.on('error', function (err) {
              return reject(new _Errors2.default('E7003', 'Exit Code: ' + err));
            });

            // Handle the fact a child get closed
            // The close can be wanted, or not
            child.on('close', function (code) {
              // No error
              _RoleAndTask2.default.getInstance().displayMessage({
                str: ('Slave Close: ' + code).red
              });
            });

            // Handle the fact a child exit
            // The exit can be wanted or not
            child.on('exit', function (code) {
              // No error
              _RoleAndTask2.default.getInstance().displayMessage({
                str: ('Slave Exit: ' + code).red
              });
            });

            // Now we need to look at communicationSystem of the master to know if the new slave connect to PROGRAM
            // If we pass a connection timeout time, we kill the process we just created and return an error
            var connectEvent = function connectEvent(slaveInfos) {
              // Wait for a new client with the identifier like -> uniqueSlaveId_processId
              if (slaveInfos && slaveInfos.programIdentifier === uniqueSlaveId) {
                // We got our slave working well
                clearTimeout(timeoutConnection);
                _this24.unlistenSlaveConnectionEvent(connectEvent);

                // Store the child data
                _this24.consoleChildObjectPtr.push({
                  programIdentifier: uniqueSlaveId,
                  pid: slaveInfos.clientPID
                });

                return resolve((0, _extends3.default)({}, slaveInfos, {
                  pid: slaveInfos.clientPID
                }));
              }

              // This is not our slave

              return false;
            };

            _this24.listenSlaveConnectionEvent(connectEvent);
          });
        }
      });
    }

    /**
     * Tell one task about what changed in the architecture
     */

  }, {
    key: 'tellOneTaskAboutArchitectureChange',
    value: function tellOneTaskAboutArchitectureChange(idTask) {
      var _this25 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
            var task;
            return _regenerator2.default.wrap(function _callee14$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    _context14.prev = 0;
                    _context14.next = 3;
                    return _this25.getTaskHandler().getTask(idTask);

                  case 3:
                    task = _context14.sent;

                    if (task) {
                      _context14.next = 6;
                      break;
                    }

                    return _context14.abrupt('return');

                  case 6:

                    if (task.isActive()) {
                      // Tell HandleProgramTask about new conf
                      task.dynamicallyRefreshDataIntoList({
                        notConfirmedSlaves: _this25.notConfirmedSlaves,
                        confirmedSlaves: _this25.slaves,

                        master: {
                          tasks: _this25.getTaskHandler().getTaskListStatus(),
                          communication: _this25.getCommunicationSystem(),
                          ips: _Utils2.default.givesLocalIps(),
                          cpuAndMemory: _this25.cpuUsageAndMemory,
                          tasksInfos: _this25.tasksInfos
                        }
                      });
                    }
                    _context14.next = 11;
                    break;

                  case 9:
                    _context14.prev = 9;
                    _context14.t0 = _context14['catch'](0);

                  case 11:
                  case 'end':
                    return _context14.stop();
                }
              }
            }, _callee14, _this25, [[0, 9]]);
          }));

          return function func() {
            return _ref14.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Do something when an information changed about PROGRAM architecture
     */

  }, {
    key: 'somethingChangedAboutSlavesOrI',
    value: function somethingChangedAboutSlavesOrI() {
      var _this26 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
            return _regenerator2.default.wrap(function _callee15$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    _context15.next = 2;
                    return _promise2.default.all(_RoleAndTask2.default.getInstance().tasks.filter(function (x) {
                      return x.notifyAboutArchitectureChange;
                    }).map(function (x) {
                      return _this26.tellOneTaskAboutArchitectureChange(x.id);
                    }));

                  case 2:
                  case 'end':
                    return _context15.stop();
                }
              }
            }, _callee15, _this26);
          }));

          return function func() {
            return _ref15.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * When called : start a new slave
     * Take options in parameters or start a regular slave
     *
     * @param {{opts: String, uniqueSlaveId: String}} slaveOpts
     * @param {Object} specificOpts - (Spawn options)
     * @param {String} connectionTimeout
     */

  }, {
    key: 'startNewSlave',
    value: function startNewSlave(slaveOpts, specificOpts) {
      var _this27 = this;

      var connectionTimeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _CONSTANT2.default.SLAVE_CREATION_CONNECTION_TIMEOUT;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
            var ret;
            return _regenerator2.default.wrap(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    _context16.next = 2;
                    return _this27.startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout);

                  case 2:
                    ret = _context16.sent;
                    _context16.next = 5;
                    return _this27.somethingChangedAboutSlavesOrI();

                  case 5:
                    return _context16.abrupt('return', ret);

                  case 6:
                  case 'end':
                    return _context16.stop();
                }
              }
            }, _callee16, _this27);
          }));

          return function func() {
            return _ref16.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Send a message that match head/body pattern
     *
     * Messages are like: { head: Object, body: Object }
     *
     * @param {String} programIdentifier
     * @param {String} headString
     * @param {String} bodyString
     */

  }, {
    key: 'sendMessageToSlaveHeadBodyPattern',
    value: function sendMessageToSlaveHeadBodyPattern(programIdentifier, headString, bodyString) {
      var _this28 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
            var _message;

            var message;
            return _regenerator2.default.wrap(function _callee17$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    // Build up the message
                    message = (_message = {}, (0, _defineProperty3.default)(_message, _CONSTANT2.default.PROTOCOL_KEYWORDS.HEAD, headString), (0, _defineProperty3.default)(_message, _CONSTANT2.default.PROTOCOL_KEYWORDS.BODY, bodyString), _message);

                    // Send the message

                    return _context17.abrupt('return', _this28.sendMessageToSlave(programIdentifier, (0, _stringify2.default)(message)));

                  case 2:
                  case 'end':
                    return _context17.stop();
                }
              }
            }, _callee17, _this28);
          }));

          return function func() {
            return _ref17.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Send a message to a slave using an programIdentifier
     * @param {String} programIdentifier
     * @param {String} message
     */

  }, {
    key: 'sendMessageToSlave',
    value: function sendMessageToSlave(programIdentifier, message) {
      var _this29 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
            var slave;
            return _regenerator2.default.wrap(function _callee18$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    // Look for the slave in confirmSlave
                    slave = _this29.getSlaveByProgramIdentifier(programIdentifier);

                    // Send the message

                    _this29.getCommunicationSystem().sendMessageToClient(slave.clientIdentityByte, slave.clientIdentityString, message);

                    return _context18.abrupt('return', true);

                  case 3:
                  case 'end':
                    return _context18.stop();
                }
              }
            }, _callee18, _this29);
          }));

          return function func() {
            return _ref18.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Get a slave using its program id
     * @param {String} programIdentifier
     */

  }, {
    key: 'getSlaveByProgramIdentifier',
    value: function getSlaveByProgramIdentifier(programIdentifier) {
      // Look for the slave in confirmSlave
      var slave = this.slaves.find(function (x) {
        return x.programIdentifier === programIdentifier;
      });

      return slave || new _Errors2.default('E7004', 'Identifier: ' + programIdentifier);
    }

    /**
     * Using the programIdentifier, wait a specific incoming message from a specific slave
     *
     * Messages are like: { head: Object, body: Object }
     *
     * If there is no answer before the timeout, stop waiting and send an error
     * @param {String} headString
     * @param {String} programIdentifier
     * @param {Number} timeout - in ms
     */

  }, {
    key: 'getMessageFromSlave',
    value: function getMessageFromSlave(headString, programIdentifier) {
      var _this30 = this;

      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _RoleAndTask2.default.getInstance().masterMessageWaitingTimeout;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return new _promise2.default(function (resolve, reject) {
            var timeoutFunction = false;

            // Look for the slave in confirmSlave
            var slave = _this30.getSlaveByProgramIdentifier(programIdentifier);

            // Function that will receive messages from slaves
            var msgListener = function msgListener(clientIdentityByte, clientIdentityString, dataString) {
              // Check the identifier to be the one we are waiting a message for

              if (clientIdentityString === slave.clientIdentityString) {
                var dataJSON = _Utils2.default.convertStringToJSON(dataString);

                // Here we got all messages that comes from clients (so slaves)
                // Check if the message answer particular message
                if (dataJSON && dataJSON[_CONSTANT2.default.PROTOCOL_KEYWORDS.HEAD] && dataJSON[_CONSTANT2.default.PROTOCOL_KEYWORDS.HEAD] === headString) {
                  // Stop the timeout
                  clearTimeout(timeoutFunction);

                  // Stop the listening
                  _this30.getCommunicationSystem().unlistenToIncomingMessage(msgListener);

                  // We get our message
                  return resolve(dataJSON[_CONSTANT2.default.PROTOCOL_KEYWORDS.BODY]);
                }
              }

              return false;
            };

            // If the function get triggered, we reject an error
            timeoutFunction = setTimeout(function () {
              // Stop the listening
              _this30.getCommunicationSystem().unlistenToIncomingMessage(msgListener);

              // Return an error
              return reject(new _Errors2.default('E7005'));
            }, timeout);

            // Listen to incoming messages
            return _this30.getCommunicationSystem().listenToIncomingMessage(msgListener);
          });
        }
      });
    }

    /**
     * Send the cpu load to the server periodically
     */

  }, {
    key: 'infiniteGetCpuAndMemory',
    value: function infiniteGetCpuAndMemory() {
      var _this31 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
            return _regenerator2.default.wrap(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    if (!_this31.intervalFdCpuAndMemory) {
                      _context20.next = 2;
                      break;
                    }

                    return _context20.abrupt('return');

                  case 2:

                    if (_CONSTANT2.default.DISPLAY_CPU_MEMORY_CHANGE_TIME) {
                      // When we connect, we send our infos to the master
                      _this31.intervalFdCpuAndMemory = setInterval((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
                        var cpuAndMemory;
                        return _regenerator2.default.wrap(function _callee19$(_context19) {
                          while (1) {
                            switch (_context19.prev = _context19.next) {
                              case 0:
                                _context19.prev = 0;
                                _context19.next = 3;
                                return _Utils2.default.getCpuAndMemoryLoad();

                              case 3:
                                cpuAndMemory = _context19.sent;


                                _this31.cpuUsageAndMemory = cpuAndMemory;

                                // Say something change
                                _this31.somethingChangedAboutSlavesOrI();

                                if (!_this31.active && _this31.intervalFdCpuAndMemory) {
                                  clearInterval(_this31.intervalFdCpuAndMemory);

                                  _this31.intervalFdCpuAndMemory = false;
                                }
                                _context19.next = 12;
                                break;

                              case 9:
                                _context19.prev = 9;
                                _context19.t0 = _context19['catch'](0);

                                _RoleAndTask2.default.getInstance().errorHappened(_context19.t0);

                              case 12:
                              case 'end':
                                return _context19.stop();
                            }
                          }
                        }, _callee19, _this31, [[0, 9]]);
                      })), _CONSTANT2.default.DISPLAY_CPU_MEMORY_CHANGE_TIME);
                    }

                  case 3:
                  case 'end':
                    return _context20.stop();
                }
              }
            }, _callee20, _this31);
          }));

          return function func() {
            return _ref19.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Get periodically the infos about tasks running in master
     */

  }, {
    key: 'infiniteGetTasksInfos',
    value: function infiniteGetTasksInfos() {
      var _this32 = this;

      if (this.intervalFdTasksInfos) return;

      this.intervalFdTasksInfos = setInterval((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
        var infos;
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.prev = 0;
                _context21.next = 3;
                return _this32.taskHandler.getInfosFromAllActiveTasks();

              case 3:
                infos = _context21.sent;


                _this32.tasksInfos = infos;

                _this32.somethingChangedAboutSlavesOrI();

                // If the role is still active we call it back
                if (!_this32.active && _this32.intervalFdTasksInfos) {
                  clearInterval(_this32.intervalFdTasksInfos);

                  _this32.intervalFdTasksInfos = false;
                }
                _context21.next = 12;
                break;

              case 9:
                _context21.prev = 9;
                _context21.t0 = _context21['catch'](0);

                _RoleAndTask2.default.getInstance().errorHappened(_context21.t0);

              case 12:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, _this32, [[0, 9]]);
      })), _CONSTANT2.default.SLAVES_INFOS_CHANGE_TIME);
    }

    /**
     * PROGRAM start to play the role
     *
     * A master is defined as:
     * A master have a Server ZeroMQ open
     * A master is connected to Slaves
     *
     * pathToEntryFile is the path we will use to start new slaves
     *
     * @param {Object} args
     * @override
     */

  }, {
    key: 'start',
    value: function start(_ref22) {
      var _this33 = this;

      var _ref22$ipServer = _ref22.ipServer,
          ipServer = _ref22$ipServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref22$ipServer,
          _ref22$portServer = _ref22.portServer,
          portServer = _ref22$portServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref22$portServer;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
            return _regenerator2.default.wrap(function _callee22$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    // Reinitialize some properties
                    _this33.initProperties();

                    // Create the OMQ Server
                    _this33.communicationSystem = new _ZeroMQServerRouter2.default();

                    // Start the communication system
                    _context22.next = 4;
                    return _this33.communicationSystem.start({
                      ipServer: ipServer,
                      portServer: portServer,
                      transport: _CONSTANT2.default.ZERO_MQ.TRANSPORT.IPC
                    });

                  case 4:

                    _this33.active = true;

                    _this33.protocolMasterSlave();

                    // Say something changed
                    _this33.somethingChangedAboutSlavesOrI();

                    // LaunchScenarios an infite get of cpu usage to give to handleProgramTask
                    _this33.infiniteGetCpuAndMemory();

                    // LaunchScenarios an infite get of tasks infos to give to handleProgramTask
                    _this33.infiniteGetTasksInfos();

                    return _context22.abrupt('return', true);

                  case 10:
                  case 'end':
                    return _context22.stop();
                }
              }
            }, _callee22, _this33);
          }));

          return function func() {
            return _ref23.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Get the hierarchy level of the given task
     */

  }, {
    key: 'chooseWhichTaskToStop',


    /**
     * This methods return the task we need to stop first
     * There is an hierarchie in tasks closure
     */
    value: function chooseWhichTaskToStop() {
      var tasksMaster = this.getTaskHandler().getTaskListStatus();

      // Compute a list in order of tasksID to close (following the closure hierarchy)
      var computeListClosure = Master1_0.sortArray(tasksMaster.map(function (x) {
        return {
          idTask: x.id,
          closureHierarchy: x.closureHierarchy
        };
      }));

      // Now look at slaves tasks, then master task, about the task that is the higher in closure hierarchy
      var ret = {
        idTaskToRemove: false,
        isMasterTask: false,
        isSlaveTask: false,
        identifierSlave: false,
        hierarchyLevel: false,
        args: {}
      };

      var foundHighestInHierarchy = this.slaves.some(function (x) {
        return x.tasks.some(function (y) {
          // Look at the hierarchy level of the given task
          var hierarchyY = Master1_0.getHierarchyLevelByIdTask(computeListClosure, y.id);

          if (!y.isActive) return false;

          // Look if this hierarchy is higher than the save one
          if (ret.hierarchyLevel === false || ret.hierarchyLevel > hierarchyY) {
            // Save the task to be the one that get to be removed (for now!)
            ret.hierarchyLevel = hierarchyY;
            ret.idTaskToRemove = y.id;
            ret.isSlaveTask = true;
            ret.isMasterTask = false;
            ret.identifierSlave = x.programIdentifier;

            // If the task we have is the highest in hierarchy, no need to look furthers
            if (computeListClosure.length && hierarchyY === computeListClosure[0].closureHierarchy) return true;
          }

          return false;
        });
      });

      if (foundHighestInHierarchy) return ret;

      // We didn't found the higest task in the hierarchy so look at master tasks, its maybe there
      tasksMaster.some(function (x) {
        var hierarchyX = Master1_0.getHierarchyLevelByIdTask(computeListClosure, x.id);

        if (!x.isActive) return false;

        // Look if this hierarchy is higher than the save one
        if (ret.hierarchyLevel === false || ret.hierarchyLevel > hierarchyX) {
          // Save the task to be the one that get to be removed (for now!)
          ret.hierarchyLevel = hierarchyX;
          ret.idTaskToRemove = x.id;
          ret.isSlaveTask = false;
          ret.isMasterTask = true;
          ret.identifierSlave = false;

          // If the task we have is the highest in hierarchy, no need to look furthers
          if (computeListClosure.length && hierarchyX === computeListClosure[0].closureHierarchy) return true;
        }
        return false;
      });

      return ret;
    }

    /**
     * Stop all tasks on every slave and master following a specific closure order
     * (Some tasks must be closed before/after some others)
     *
     * WARNING RECURSIVE CALL
     */

  }, {
    key: 'stopAllTaskOnEverySlaveAndMaster',
    value: function stopAllTaskOnEverySlaveAndMaster() {
      var _this34 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
            var _chooseWhichTaskToSto, idTaskToRemove, isMasterTask, isSlaveTask, identifierSlave, args;

            return _regenerator2.default.wrap(function _callee23$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    // close one of the task
                    // master or slave task
                    _chooseWhichTaskToSto = _this34.chooseWhichTaskToStop(), idTaskToRemove = _chooseWhichTaskToSto.idTaskToRemove, isMasterTask = _chooseWhichTaskToSto.isMasterTask, isSlaveTask = _chooseWhichTaskToSto.isSlaveTask, identifierSlave = _chooseWhichTaskToSto.identifierSlave, args = _chooseWhichTaskToSto.args;

                    // No more task to stop

                    if (!(idTaskToRemove === false)) {
                      _context23.next = 4;
                      break;
                    }

                    // Say something changed
                    _this34.somethingChangedAboutSlavesOrI();

                    return _context23.abrupt('return', true);

                  case 4:
                    if (!isMasterTask) {
                      _context23.next = 8;
                      break;
                    }

                    _context23.next = 7;
                    return _this34.getTaskHandler().stopTask(idTaskToRemove, args);

                  case 7:
                    return _context23.abrupt('return', _this34.stopAllTaskOnEverySlaveAndMaster());

                  case 8:
                    if (!isSlaveTask) {
                      _context23.next = 12;
                      break;
                    }

                    _context23.next = 11;
                    return _this34.removeTaskFromSlave(identifierSlave, idTaskToRemove, args);

                  case 11:
                    return _context23.abrupt('return', _this34.stopAllTaskOnEverySlaveAndMaster());

                  case 12:
                    return _context23.abrupt('return', true);

                  case 13:
                  case 'end':
                    return _context23.stop();
                }
              }
            }, _callee23, _this34);
          }));

          return function func() {
            return _ref24.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * PROGRAM stop to play the role
     * @param {Object} args
     * @override
     */

  }, {
    key: 'stop',
    value: function stop() {
      var _this35 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24() {
            return _regenerator2.default.wrap(function _callee24$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    _context24.next = 2;
                    return _this35.stopAllTaskOnEverySlaveAndMaster();

                  case 2:
                    _context24.next = 4;
                    return _this35.removeExistingSlave(_this35.slaves.map(function (x) {
                      return x.programIdentifier;
                    }));

                  case 4:

                    // Stop the infinite loops
                    if (_this35.intervalFdCpuAndMemory) clearInterval(_this35.intervalFdCpuAndMemory);

                    if (_this35.intervalFdTasksInfos) clearInterval(_this35.intervalFdTasksInfos);

                    // Stop the communication system
                    _context24.next = 8;
                    return _this35.communicationSystem.stop();

                  case 8:

                    _this35.active = false;

                    return _context24.abrupt('return', true);

                  case 10:
                  case 'end':
                    return _context24.stop();
                }
              }
            }, _callee24, _this35);
          }));

          return function func() {
            return _ref25.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Send the given message and wait for the response
     *
     * HERE WE CREATE TWO EXECUTIONS LIFES
     *
     * Put isHeadBodyPattern = true if you want to use the headBodyPattern
     *
     * @param {Object} args
     */

  }, {
    key: 'sendMessageAndWaitForTheResponse',
    value: function sendMessageAndWaitForTheResponse(_ref26) {
      var _this36 = this;

      var identifierSlave = _ref26.identifierSlave,
          messageHeaderToSend = _ref26.messageHeaderToSend,
          messageBodyToSend = _ref26.messageBodyToSend,
          messageHeaderToGet = _ref26.messageHeaderToGet,
          isHeadBodyPattern = _ref26.isHeadBodyPattern,
          timeoutToGetMessage = _ref26.timeoutToGetMessage;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return new _promise2.default(function (resolve, reject) {
            // We switch to the appropriated func
            var sendMessageGoodFunc = function sendMessageGoodFunc() {
              if (isHeadBodyPattern) return _this36.sendMessageToSlaveHeadBodyPattern;

              return _this36.sendMessageToSlave;
            };

            var errAlreadyReturned = false;

            // Be ready to get the message from the slave before to send it the command
            _this36.getMessageFromSlave(messageHeaderToGet, identifierSlave, timeoutToGetMessage)
            // Job done
            .then(resolve).catch(function (err) {
              if (!errAlreadyReturned) {
                errAlreadyReturned = true;

                return reject(err);
              }

              return false;
            });

            // Send the command to the slave
            sendMessageGoodFunc().call(_this36, identifierSlave, messageHeaderToSend, messageBodyToSend).then(function () {
              // It went well, no wait getMessageFromSlave to get the message
              // If the message is not coming, getMessageFromSlave will timeout and result of an error

              //
              // Nothing to do here anymore Mate!
              //
            }).catch(function (err) {
              // The getMessageFromSlave will automatically timeout
              if (!errAlreadyReturned) {
                errAlreadyReturned = true;

                return reject(err);
              }

              return false;
            });
          });
        }
      });
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      return instance || new Master1_0();
    }
  }, {
    key: 'getHierarchyLevelByIdTask',
    value: function getHierarchyLevelByIdTask(computeListClosure, idTask) {
      var toRet = void 0;

      computeListClosure.some(function (x) {
        if (x.idTask === idTask) {
          toRet = x.closureHierarchy;

          return true;
        }

        return false;
      });

      return toRet;
    }

    /**
     * Sort the array ASC by closureHierarchy
     */

  }, {
    key: 'sortArray',
    value: function sortArray(ptr) {
      var arr = ptr;

      for (var i = 0; i < arr.length - 1; i += 1) {
        if (arr[i].closureHierarchy > arr[i + 1].closureHierarchy) {
          var tmp = arr[i + 1];

          arr[i + 1] = arr[i];

          arr[i] = tmp;

          i = -1;
        }
      }

      return arr;
    }
  }]);
  return Master1_0;
}(_AMaster3.default);

exports.default = Master1_0;
//# sourceMappingURL=Master1_0.js.map