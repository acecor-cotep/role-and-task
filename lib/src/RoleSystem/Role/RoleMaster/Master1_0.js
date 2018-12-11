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

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _RoleAndTask = require('../../../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

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

    _this.name = _CONSTANT2.default.DEFAULT_ROLE.MASTER_ROLE.name;
    _this.id = _CONSTANT2.default.DEFAULT_ROLE.MASTER_ROLE.id;

    _this.pathToEntryFile = false;

    // Get the tasks related to the master role
    var tasks = _RoleAndTask2.default.getInstance().getRoleTasks(_CONSTANT2.default.DEFAULT_ROLE.MASTER_ROLE.id);

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

      // Array that contains the relation between console process ptr and eliotIdentifier
      // We use it too when there is no console launch, because it work with both soluce
      this.consoleChildObjectPtr = [];

      // Functions called when something happend to a slave connection
      this.newConnectionListeningFunction = [];
      this.newDisconnectionListeningFunction = [];

      // Data we keep as attribute to give to handleEliotTask later
      this.cpuUsageAndMemory = false;
      this.tasksInfos = false;
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
    key: 'sendDataToEveryELIOTTaskWhereverItIsLowLevel',
    value: function sendDataToEveryELIOTTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, body) {
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
          _this2.sendMessageToSlaveHeadBodyPattern(x.eliotIdentifier, _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, body);
        }
      });

      // For itself tasks
      _RoleAndTask2.default.getInstance().spreadDataToEveryLocalTask(body);
    }

    /**
     * We get asked to spread a news to every slave tasks and our tasks
     */

  }, {
    key: 'sendDataToEveryELIOTTaskWhereverItIs',
    value: function sendDataToEveryELIOTTaskWhereverItIs(data) {
      this.sendDataToEveryELIOTTaskWhereverItIsLowLevel(false, false, data);
    }

    /**
     * Tell the handleEliotTask about something happend in slaves
     */

  }, {
    key: 'tellHandleEliotTaskAboutSlaveError',
    value: function tellHandleEliotTaskAboutSlaveError(clientIdentityString, err) {
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
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(clientIdentityByte, clientIdentityString, body) {
        var err;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // const err = Errors.deserialize(body);
                err = new Error('Deserialized');

                // Display the error

                _Utils2.default.displayMessage({
                  str: String(err && err.stack || err),
                  out: process.stderr
                });

                _context.prev = 2;
                _context.next = 5;
                return _RoleAndTask2.default.getInstance().changeEliotState(_CONSTANT2.default.ELIOT_STATE.ERROR);

              case 5:

                // We goodly changed the eliot state
                // Add informations on error

                _Utils2.default.displayMessage({
                  str: String(err && err.stack || err),
                  out: process.stderr
                });

                // Tell the task handleEliot that there had been an error for the slave
                this.tellHandleEliotTaskAboutSlaveError(clientIdentityString, err);

                // If the errors are supposed to be fatal, exit!
                if (_CONSTANT2.default.MAKES_ERROR_FATAL) {
                  _RoleAndTask2.default.exitEliotUnproperDueToError();
                }
                // We leave the process because something get broken
                _context.next = 15;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](2);

                _Utils2.default.displayMessage({
                  str: 'Exit eliot unproper ERROR HAPPENED IN SLAVE',
                  out: process.stderr
                });

                _Utils2.default.displayMessage({
                  str: String(_context.t0 && _context.t0.stack || _context.t0),
                  out: process.stderr
                });

                _RoleAndTask2.default.exitEliotUnproperDueToError();

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 10]]);
      }));

      function errorHappenedIntoSlave(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return errorHappenedIntoSlave;
    }()

    /**
     * Handle a slave that ask for database initialization
     * @param {Array} clientIdentityByte
     * @param {String} clientIdentityString
     */

  }, {
    key: 'protocolHandleDatabaseInitializationAsk',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(clientIdentityByte, clientIdentityString) {
        var ASK_DB_INIT, slave;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                ASK_DB_INIT = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.ASK_DB_INIT;
                slave = this.slaves.find(function (x) {
                  return x.clientIdentityString === clientIdentityString;
                });
                _context2.prev = 2;
                _context2.next = 5;
                return _RoleAndTask2.default.getInstance().askForDatabaseInitialization();

              case 5:

                this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, ASK_DB_INIT, (0, _stringify2.default)({
                  error: false
                }));
                _context2.next = 11;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](2);

                this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, ASK_DB_INIT, (0, _stringify2.default)({
                  error: _context2.t0.serialize()
                }));

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 8]]);
      }));

      function protocolHandleDatabaseInitializationAsk(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return protocolHandleDatabaseInitializationAsk;
    }()

    /**
     * Handle a slave that say the database initialization is done
     * @param {Array} clientIdentityByte
     * @param {String} clientIdentityString
     */

  }, {
    key: 'protocolHandleDatabaseInitializationDone',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(clientIdentityByte, clientIdentityString) {
        var DB_INIT_DONE, slave;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                DB_INIT_DONE = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.DB_INIT_DONE;
                slave = this.slaves.find(function (x) {
                  return x.clientIdentityString === clientIdentityString;
                });

                if (slave) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt('return', this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, DB_INIT_DONE, (0, _stringify2.default)({
                  error: String(new Error('SLAVE_ERROR'))
                })));

              case 4:
                _context3.prev = 4;
                _context3.next = 7;
                return _RoleAndTask2.default.getInstance().databaseIntializationDone();

              case 7:

                this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, DB_INIT_DONE, (0, _stringify2.default)({
                  error: false
                }));
                _context3.next = 13;
                break;

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3['catch'](4);

                this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, DB_INIT_DONE, (0, _stringify2.default)({
                  error: _context3.t0.serialize()
                }));

              case 13:
                return _context3.abrupt('return', false);

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[4, 10]]);
      }));

      function protocolHandleDatabaseInitializationDone(_x6, _x7) {
        return _ref3.apply(this, arguments);
      }

      return protocolHandleDatabaseInitializationDone;
    }()

    /**
     * Handle a slave that ask for database connection change
     * @param {Array} clientIdentityByte
     * @param {String} clientIdentityString
     */

  }, {
    key: 'protocolHandleDatabaseConnectionChangeAsk',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(clientIdentityByte, clientIdentityString, body) {
        var ASK_DATABASE_CONNECTION_CHANGE, slave;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                ASK_DATABASE_CONNECTION_CHANGE = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.ASK_DATABASE_CONNECTION_CHANGE;
                slave = this.slaves.find(function (x) {
                  return x.clientIdentityString === clientIdentityString;
                });
                _context4.prev = 2;
                _context4.next = 5;
                return _RoleAndTask2.default.getInstance().askForDatabaseConnectionChange(body);

              case 5:

                this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, ASK_DATABASE_CONNECTION_CHANGE, (0, _stringify2.default)({
                  error: false
                }));
                _context4.next = 11;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4['catch'](2);

                this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, ASK_DATABASE_CONNECTION_CHANGE, (0, _stringify2.default)({
                  error: _context4.t0.serialize()
                }));

              case 11:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 8]]);
      }));

      function protocolHandleDatabaseConnectionChangeAsk(_x8, _x9, _x10) {
        return _ref4.apply(this, arguments);
      }

      return protocolHandleDatabaseConnectionChangeAsk;
    }()

    /**
     * Ask every slave to perform a connection data change and do it yourself
     */

  }, {
    key: 'askForDatabaseConnectionChange',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(newLogsToApply) {
        var _this3 = this;

        var regularSlaves, rets;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();

                // For each slave
                // Send a message to every running slaves

                _context5.next = 3;
                return _promise2.default.all(regularSlaves.map(function (x) {
                  return _this3.sendMessageAndWaitForTheResponse({
                    identifierSlave: x.eliotIdentifier,
                    isHeadBodyPattern: true,
                    messageHeaderToSend: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CHANGE_DATABASE_CONNECTION,
                    messageBodyToSend: newLogsToApply,
                    messageHeaderToGet: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CHANGE_DATABASE_CONNECTION
                  });
                }));

              case 3:
                rets = _context5.sent;

                if (!rets.some(function (x) {
                  return x !== '';
                })) {
                  _context5.next = 6;
                  break;
                }

                return _context5.abrupt('return', rets.find(function (x) {
                  return x !== '';
                }));

              case 6:
                _context5.next = 8;
                return _RoleAndTask2.default.getInstance().changeDatabaseConnection(newLogsToApply);

              case 8:
                return _context5.abrupt('return', false);

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function askForDatabaseConnectionChange(_x11) {
        return _ref5.apply(this, arguments);
      }

      return askForDatabaseConnectionChange;
    }()

    /**
     * Define the master/slave basic protocol
     * (Authentification)
     */

  }, {
    key: 'protocolMasterSlave',
    value: function protocolMasterSlave() {
      var _this4 = this;

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
          ASK_DB_INIT = _CONSTANT$PROTOCOL_MA.ASK_DB_INIT,
          DB_INIT_DONE = _CONSTANT$PROTOCOL_MA.DB_INIT_DONE,
          ASK_DATABASE_CONNECTION_CHANGE = _CONSTANT$PROTOCOL_MA.ASK_DATABASE_CONNECTION_CHANGE;

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
            eliotIdentifier = _clientIdentityString2[0],
            clientPID = _clientIdentityString2[1];

        // Look at the identity of the slave (and if we have duplicate)


        if (_this4.slaves.find(function (x) {
          return x.eliotIdentifier === eliotIdentifier;
        }) || _this4.notConfirmedSlaves.find(function (x) {
          return x.eliotIdentifier === eliotIdentifier;
        })) {
          // Identity already in use by an other slave
          // Close the connection
          _RoleAndTask2.default.getInstance().displayMessage({
            str: ('[' + _this4.name + '] Refuse slave cause of identity').cyan
          });

          return _this4.getCommunicationSystem().closeConnectionToClient(clientIdentityByte, clientIdentityString);
        }

        // So here the client do not exist already and the identifier is free

        // Add the slave into the declared not confirmed array
        _this4.notConfirmedSlaves.push({
          clientIdentityString: clientIdentityString,
          clientIdentityByte: clientIdentityByte,
          eliotIdentifier: eliotIdentifier,
          clientPID: clientPID,
          tasks: [],
          error: false
        });

        // Ask the slaves about its tasks
        return _this4.getCommunicationSystem().sendMessageToClient(clientIdentityByte, clientIdentityString, SLAVE_CONFIRMATION_INFORMATIONS);
      });

      // Listen to slaves disconnection
      this.getCommunicationSystem().listenClientDisconnectionEvent(function (clientIdentityString) {
        _this4.slaves = _this4.slaves.filter(function (x) {
          if (x.clientIdentityString === clientIdentityString) {
            _RoleAndTask2.default.getInstance().displayMessage({
              str: ('[' + _this4.name + '] Slave get removed (connection)').red
            });

            // Fire when a slave get disconnected
            _Utils2.default.fireUp(_this4.newDisconnectionListeningFunction, [x]);

            return false;
          }

          return true;
        });

        _this4.notConfirmedSlaves = _this4.notConfirmedSlaves.filter(function (x) {
          if (x.clientIdentityString === clientIdentityString) {
            _RoleAndTask2.default.getInstance().displayMessage({
              str: ('[' + _this4.name + '] Non-confirmed slave get removed (connection)').red
            });

            // Fire when a slave get disconnected
            _Utils2.default.fireUp(_this4.newDisconnectionListeningFunction, [x]);

            return false;
          }

          return true;
        });
      });

      // Confirm a slave that wasn't
      var confirmSlave = function confirmSlave(clientIdentityByte, clientIdentityString, dataJSON) {
        var index = _this4.notConfirmedSlaves.findIndex(function (x) {
          return x.clientIdentityString === clientIdentityString;
        });

        if (index === -1) return;

        // Confirm the slave
        var slave = _this4.notConfirmedSlaves[index];

        slave.tasks = dataJSON[BODY].tasks;
        slave.role = dataJSON[BODY].role;

        _this4.slaves.push(slave);

        _this4.notConfirmedSlaves.splice(index, 1);

        // Fire when a slave get connected
        _Utils2.default.fireUp(_this4.newConnectionListeningFunction, [slave]);
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
            return _this4.sendDataToEveryELIOTTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }, {
          //
          // Check about messages to display
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === OUTPUT_TEXT;
          },
          applyFunc: function applyFunc() {
            return _this4.displayMessage(dataJSON[BODY]);
          }
        }, {
          //
          // Check about infos about slaves
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === INFOS_ABOUT_SLAVES;
          },
          applyFunc: function applyFunc() {
            return _this4.infosAboutSlaveIncomming(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }, {
          //
          // Check about error happened into slave
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ERROR_HAPPENED;
          },
          applyFunc: function applyFunc() {
            return _this4.errorHappenedIntoSlave(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }, {
          //
          // Check about slave asking for DB initialization
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ASK_DB_INIT;
          },
          applyFunc: function applyFunc() {
            return _this4.protocolHandleDatabaseInitializationAsk(clientIdentityByte, clientIdentityString);
          }
        }, {
          //
          // Check about slave asking for DB initialization
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === DB_INIT_DONE;
          },
          applyFunc: function applyFunc() {
            return _this4.protocolHandleDatabaseInitializationDone(clientIdentityByte, clientIdentityString);
          }
        }, {
          //
          // Check about slave asking for DB update startup
          //
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ASK_DATABASE_CONNECTION_CHANGE;
          },
          applyFunc: function applyFunc() {
            return _this4.protocolHandleDatabaseConnectionChangeAsk(clientIdentityByte, clientIdentityString, dataJSON[BODY]);
          }
        }].forEach(function (x) {
          if (x.checkFunc()) x.applyFunc();
        });
      });
    }

    /**
     * We got news about a slave -> infos
     * Store it and call HandleEliotTask if it's up
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
      var _this5 = this;

      return new _promise2.default(function (resolve) {
        resolve([String(process.pid)].concat((0, _toConsumableArray3.default)(_this5.slaves.map(function (x) {
          return String(x.clientPID);
        }))));
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
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(idTaskToConnectTo, idTaskToConnect, args) {
        var task, connection;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;

                _RoleAndTask2.default.getInstance().displayMessage({
                  str: _Utils2.default.monoline(['[' + this.name + '] Ask Master to connect the Task N\xB0' + idTaskToConnect, ' to the Task N\xB0' + idTaskToConnectTo]).blue
                });

                _context6.next = 4;
                return this.getTaskHandler().getTask(idTaskToConnectTo);

              case 4:
                task = _context6.sent;

                if (task.isActive()) {
                  _context6.next = 7;
                  break;
                }

                throw new Error('E7009 : idTask: ' + idTaskToConnectTo);

              case 7:

                // Ask the connection to be made
                connection = task.connectToTask(idTaskToConnect, args);


                _RoleAndTask2.default.getInstance().displayMessage({
                  str: _Utils2.default.monoline(['[' + this.name + '] Task N\xB0' + idTaskToConnect + ' correctly connected to Task ', 'N\xB0' + idTaskToConnectTo + ' in Master']).green
                });

                return _context6.abrupt('return', connection);

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6['catch'](0);

                _RoleAndTask2.default.getInstance().displayMessage({
                  str: _Utils2.default.monoline(['[' + this.name + '] Task N\xB0' + idTaskToConnect + ' failed to be connected', ' to Task N\xB0' + idTaskToConnectTo + ' in Master']).red
                });

                throw _context6.t0;

              case 16:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 12]]);
      }));

      function connectMasterToTask(_x12, _x13, _x14) {
        return _ref6.apply(this, arguments);
      }

      return connectMasterToTask;
    }()

    /**
     * Connect the second Task to the first one
     * @param {String} identifierSlave - Identifier of the slave that host the idTaskToConnectTo
     * @param {String} idTaskToConnectTo
     * @param {String} idTaskToConnect
     * @param {Object} args
     */

  }, {
    key: 'connectTaskToTask',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(identifierSlave, idTaskToConnectTo, idTaskToConnect, args) {
        var ret;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.sendMessageAndWaitForTheResponse({
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
        }, _callee7, this);
      }));

      function connectTaskToTask(_x15, _x16, _x17, _x18) {
        return _ref7.apply(this, arguments);
      }

      return connectTaskToTask;
    }()

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
      var _this6 = this;

      this.slaves.some(function (x, xi) {
        if (x.eliotIdentifier === identifier) {
          return x.tasks.some(function (y, yi) {
            if (y.id === idTask) {
              _this6.slaves[xi].tasks[yi].isActive = status;

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
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(identifier, idTask) {
        var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var ret;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.sendMessageAndWaitForTheResponse({
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
                this.modifyTaskStatusToSlaveLocalArray(identifier, idTask, true);

                // Say something changed
                this.somethingChangedAboutSlavesOrI();

                return _context8.abrupt('return', ret);

              case 7:
                throw new Error('deserialize');

              case 8:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function startTaskToSlave(_x19, _x20) {
        return _ref8.apply(this, arguments);
      }

      return startTaskToSlave;
    }()

    /**
     * List the existing slaves
     */

  }, {
    key: 'listSlaves',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt('return', this.master.getSlave);

              case 1:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function listSlaves() {
        return _ref9.apply(this, arguments);
      }

      return listSlaves;
    }()

    /**
     * List a slave tasks using its identifier (Ask the slave to it)
     * @param {String} identifier
     */

  }, {
    key: 'distantListSlaveTask',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(identifier) {
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt('return', this.sendMessageAndWaitForTheResponse({
                  identifierSlave: identifier,
                  isHeadBodyPattern: false,
                  messageHeaderToSend: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
                  messageBodyToSend: {},
                  messageHeaderToGet: _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS
                }));

              case 1:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function distantListSlaveTask(_x22) {
        return _ref10.apply(this, arguments);
      }

      return distantListSlaveTask;
    }()

    /**
     * List a slave tasks using its identifier (Use local data to it)
     * @param {String} identifier
     */

  }, {
    key: 'listSlaveTask',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(identifier) {
        var slave;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                // Look for the slave in confirmSlave
                slave = this.getSlaveByEliotIdentifier(identifier);
                return _context11.abrupt('return', slave.tasks);

              case 2:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function listSlaveTask(_x23) {
        return _ref11.apply(this, arguments);
      }

      return listSlaveTask;
    }()

    /**
     * Handle the fact the eliot state change
     * We spread the data on our tasks and to our slaves
     * @param {Number} eliotState
     * @param {Number} oldEliotState
     */

  }, {
    key: 'handleEliotStateChange',
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(eliotState, oldEliotState) {
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt('return', _promise2.default.all([
                // Spread to our tasks
                this.getTaskHandler().applyNewEliotState(eliotState, oldEliotState),

                // Spread to slaves
                this.tellAllSlaveThatEliotStateChanged(eliotState, oldEliotState)]

                // The spread n slaves went well
                ));

              case 1:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function handleEliotStateChange(_x24, _x25) {
        return _ref12.apply(this, arguments);
      }

      return handleEliotStateChange;
    }()

    /**
     * Return only the slaves that are regular slaves (not CRON_EXECUTOR_ROLE for example)
     */

  }, {
    key: 'getSlavesOnlyThatAreRegularSlaves',
    value: function getSlavesOnlyThatAreRegularSlaves() {
      return this.slaves.filter(function (x) {
        return x.role.id === _CONSTANT2.default.DEFAULT_ROLE.SLAVE_ROLE.id;
      });
    }

    /**
     * Tell all slave that the eliot state did change
     *
     * WARNING - DO NOT INCLUDE CRON_EXECUTOR_ROLE SLAVES INTO THE PIPE
     *
     * @param {Number} eliotState
     * @param {Number} oldEliotState
     */

  }, {
    key: 'tellAllSlaveThatEliotStateChanged',
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(eliotState, oldEliotState) {
        var _this7 = this;

        var regularSlaves;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();
                return _context13.abrupt('return', _promise2.default.all(regularSlaves.map(function (x) {
                  return _this7.tellASlaveThatEliotStateChanged(x.eliotIdentifier, eliotState, oldEliotState);
                })));

              case 2:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function tellAllSlaveThatEliotStateChanged(_x26, _x27) {
        return _ref13.apply(this, arguments);
      }

      return tellAllSlaveThatEliotStateChanged;
    }()

    /**
     * Tell a slave that eliot state did change
     * @param {String} slaveIdentifier
     * @param {Number} eliotState
     * @param {Number} oldEliotState
     */

  }, {
    key: 'tellASlaveThatEliotStateChanged',
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(slaveIdentifier, eliotState, oldEliotState) {
        var STATE_CHANGE, ret;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                STATE_CHANGE = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STATE_CHANGE;
                _context14.next = 3;
                return this.sendMessageAndWaitForTheResponse({
                  identifierSlave: slaveIdentifier,
                  isHeadBodyPattern: true,
                  messageHeaderToSend: STATE_CHANGE,

                  messageBodyToSend: {
                    eliotState: eliotState,
                    oldEliotState: oldEliotState
                  },

                  messageHeaderToGet: STATE_CHANGE,
                  timeoutToGetMessage: _CONSTANT2.default.MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE
                });

              case 3:
                ret = _context14.sent;

                if (!(ret === '')) {
                  _context14.next = 6;
                  break;
                }

                return _context14.abrupt('return', ret);

              case 6:

                _RoleAndTask2.default.getInstance().displayMessage({
                  str: ('[' + this.name + '] eliot state get not spread in Slave N\xB0' + slaveIdentifier).red
                });

                throw new Error('deserialize');

              case 8:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function tellASlaveThatEliotStateChanged(_x28, _x29, _x30) {
        return _ref14.apply(this, arguments);
      }

      return tellASlaveThatEliotStateChanged;
    }()

    /**
     * When called: Remove an existing slave(s)
     * @param {Array} identifiersSlaves
     * @param {?Number} _i
     */

  }, {
    key: 'removeExistingSlave',
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(identifiersSlaves) {
        var _this8 = this;

        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt('return', _Utils2.default.promiseQueue([].concat((0, _toConsumableArray3.default)(identifiersSlaves.map(function (x) {
                  return {
                    functionToCall: _this8.sendMessageToSlave,

                    context: _this8,

                    args: [x, _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CLOSE]
                  };
                })), [

                // Say that something changed
                {
                  functionToCall: this.somethingChangedAboutSlavesOrI,
                  context: this
                }])));

              case 1:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function removeExistingSlave(_x31) {
        return _ref15.apply(this, arguments);
      }

      return removeExistingSlave;
    }()

    /**
     * Kill a slave using its identifier
     * @param {String} eliotIdentifier
     */

  }, {
    key: 'killSlave',
    value: function killSlave(eliotIdentifier) {
      var _this9 = this;

      // Look for the given identifier
      this.consoleChildObjectPtr.filter(function (x) {
        if (x.eliotIdentifier === eliotIdentifier) {
          try {
            // Kill the process
            process.kill(x.pid, _CONSTANT2.default.SIGNAL_UNPROPER.SIGUSR1);

            // Remove the slave from the slave list
            _this9.slaves = _this9.slaves.filter(function (y) {
              return !(y.eliotIdentifier === eliotIdentifier);
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
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(identifier, idTask) {
        var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var STOP_TASK, ret;
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                STOP_TASK = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STOP_TASK;


                _RoleAndTask2.default.getInstance().displayMessage({
                  str: ('[' + this.name + '] Ask Slave N\xB0' + identifier + ' to stop the Task N\xB0' + idTask).blue
                });

                _context16.next = 4;
                return this.sendMessageAndWaitForTheResponse({
                  identifierSlave: identifier,
                  isHeadBodyPattern: true,
                  messageHeaderToSend: STOP_TASK,

                  messageBodyToSend: {
                    idTask: idTask,
                    args: args
                  },

                  messageHeaderToGet: STOP_TASK,
                  timeoutToGetMessage: _CONSTANT2.default.MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK
                });

              case 4:
                ret = _context16.sent;

                if (!(ret === '')) {
                  _context16.next = 9;
                  break;
                }

                _RoleAndTask2.default.getInstance().displayMessage({
                  str: ('[' + this.name + '] Task N\xB0' + idTask + ' correctly stopped in Slave N\xB0' + identifier).green
                });

                // Modify the task status for the given slave
                this.modifyTaskStatusToSlaveLocalArray(identifier, idTask, false);

                return _context16.abrupt('return', ret);

              case 9:

                _RoleAndTask2.default.getInstance().displayMessage({
                  str: ('[' + this.name + '] Task N\xB0' + idTask + ' failed to be stopped to Slave N\xB0' + identifier).red
                });

                throw ret;

              case 11:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function removeTaskFromSlave(_x32, _x33) {
        return _ref16.apply(this, arguments);
      }

      return removeTaskFromSlave;
    }()

    /**
     * Display a message directly
     * @param {Object} param
     */

  }, {
    key: 'displayMessage',
    value: function () {
      var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(param) {
        var task;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;

                if (!this.displayTask) {
                  _context17.next = 9;
                  break;
                }

                _context17.next = 4;
                return this.getTaskHandler().getTask(this.displayTask);

              case 4:
                task = _context17.sent;

                if (_RoleAndTask2.default.getInstance().getDisplayLog()) {
                  _context17.next = 7;
                  break;
                }

                return _context17.abrupt('return', false);

              case 7:
                if (!task.isActive()) {
                  _context17.next = 9;
                  break;
                }

                return _context17.abrupt('return', task.displayMessage(param));

              case 9:

                // If not we display
                _Utils2.default.displayMessage(param);
                _context17.next = 15;
                break;

              case 12:
                _context17.prev = 12;
                _context17.t0 = _context17['catch'](0);

                // Ignore error - We can't display the data - it do not require further error treatment
                // Store the message into file tho
                _Utils2.default.displayMessage({
                  str: String(_context17.t0.stack || _context17.t0),
                  out: process.stderr
                });

              case 15:
                return _context17.abrupt('return', false);

              case 16:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this, [[0, 12]]);
      }));

      function displayMessage(_x35) {
        return _ref17.apply(this, arguments);
      }

      return displayMessage;
    }()

    /**
     * Start a new slave not in a console but in a regular process
     * @param {{opts: String, uniqueSlaveId: String}} slaveOpts
     * @param {Object} specificOpts - (Spawn options)
     * @param {String} connectionTimeout
     */

  }, {
    key: 'startNewSlaveInProcessMode',
    value: function startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout) {
      var _this10 = this;

      return new _promise2.default(function (resolve, reject) {
        // We create a unique Id that will referenciate the slave at the connexion
        var uniqueSlaveId = slaveOpts && slaveOpts.uniqueSlaveId || _Utils2.default.generateUniqueEliotID();

        // Options to send to the new created slave
        var eliotOpts = slaveOpts && slaveOpts.opts || ['--' + _CONSTANT2.default.ELIOT_LAUNCHING_PARAMETERS.MODE.name, '' + _CONSTANT2.default.ELIOT_LAUNCHING_MODE.SLAVE, '--' + _CONSTANT2.default.ELIOT_LAUNCHING_PARAMETERS.MODE_OPTIONS.name, _CONSTANT2.default.SLAVE_START_ARGS.IDENTIFIER + '=' + uniqueSlaveId];

        // Options to give to fork(...)
        var forkOpts = {};

        // If there is no path to the entry file to execute
        if (!_this10.pathToEntryFile) {
          throw new Error('Cannot start the slave : No pathToEntryFile configured');
        }

        // Path that lead to the exe of ELIOT
        var pathToExec = _this10.pathToEntryFile;

        // LaunchScenarios eliot in slave mode in a different process
        var child = _child_process2.default.fork(pathToExec, eliotOpts, forkOpts);

        // LaunchScenarios a timeout of connection
        var timeoutConnection = setTimeout(function () {
          // Kill the process we did created
          child.kill(_CONSTANT2.default.SIGNAL_TO_KILL_SLAVE_COMMAND);

          return reject(new Error('E7003 : Timeout ' + connectionTimeout + ' ms passed'));
        }, connectionTimeout);

        // Look at error event (If it get fired it means the program failed to get launched)
        // Handle the fact a child can result an error later on after first connection
        // Error detected
        child.on('error', function (err) {
          return reject(new Error('E7003 : Exit Code: ' + err));
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

        // Now we need to look at communicationSystem of the master to know if the new slave connect to ELIOT
        // If we pass a connection timeout time, we kill the process we just created and return an error
        var connectEvent = function connectEvent(slaveInfos) {
          // Wait for a new client with the identifier like -> uniqueSlaveId_processId
          if (slaveInfos && slaveInfos.eliotIdentifier === uniqueSlaveId) {
            // We got our slave working well
            clearTimeout(timeoutConnection);
            _this10.unlistenSlaveConnectionEvent(connectEvent);

            // Store the child data
            _this10.consoleChildObjectPtr.push({
              eliotIdentifier: uniqueSlaveId,
              pid: slaveInfos.clientPID
            });

            return resolve((0, _extends3.default)({}, slaveInfos, {
              pid: slaveInfos.clientPID
            }));
          }

          // This is not our slave

          return false;
        };

        _this10.listenSlaveConnectionEvent(connectEvent);
      });
    }

    /**
     * Do something when an information changed about ELIOT architecture
     */

  }, {
    key: 'somethingChangedAboutSlavesOrI',
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
        var task;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                // const task = await this.getHandleEliotTaskShortcut();
                task = null;

                // No HandleEliotTask so -> don't tell a new archiecture is here

                if (task) {
                  _context18.next = 3;
                  break;
                }

                return _context18.abrupt('return');

              case 3:

                // Tell HandleEliotTask about new conf
                task.dynamicallyRefreshDataIntoList({
                  notConfirmedSlaves: this.notConfirmedSlaves,
                  confirmedSlaves: this.slaves,

                  master: {
                    tasks: this.getTaskHandler().getTaskListStatus(),
                    communication: this.getCommunicationSystem(),
                    ips: _Utils2.default.givesLocalIps(),
                    cpuAndMemory: this.cpuUsageAndMemory,
                    tasksInfos: this.tasksInfos
                  }
                });

              case 4:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function somethingChangedAboutSlavesOrI() {
        return _ref18.apply(this, arguments);
      }

      return somethingChangedAboutSlavesOrI;
    }()

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
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(slaveOpts, specificOpts) {
        var connectionTimeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _CONSTANT2.default.SLAVE_CREATION_CONNECTION_TIMEOUT;
        var ret;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return this.startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout);

              case 2:
                ret = _context19.sent;


                // Say something changed
                this.somethingChangedAboutSlavesOrI();

                return _context19.abrupt('return', ret);

              case 5:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function startNewSlave(_x36, _x37) {
        return _ref19.apply(this, arguments);
      }

      return startNewSlave;
    }()

    /**
     * Send a message that match head/body pattern
     *
     * Messages are like: { head: Object, body: Object }
     *
     * @param {String} eliotIdentifier
     * @param {String} headString
     * @param {String} bodyString
     */

  }, {
    key: 'sendMessageToSlaveHeadBodyPattern',
    value: function () {
      var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(eliotIdentifier, headString, bodyString) {
        var _message;

        var message;
        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                // Build up the message
                message = (_message = {}, (0, _defineProperty3.default)(_message, _CONSTANT2.default.PROTOCOL_KEYWORDS.HEAD, headString), (0, _defineProperty3.default)(_message, _CONSTANT2.default.PROTOCOL_KEYWORDS.BODY, bodyString), _message);

                // Send the message

                return _context20.abrupt('return', this.sendMessageToSlave(eliotIdentifier, (0, _stringify2.default)(message)));

              case 2:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function sendMessageToSlaveHeadBodyPattern(_x39, _x40, _x41) {
        return _ref20.apply(this, arguments);
      }

      return sendMessageToSlaveHeadBodyPattern;
    }()

    /**
     * Send a message to a slave using an eliotIdentifier
     * @param {String} eliotIdentifier
     * @param {String} message
     */

  }, {
    key: 'sendMessageToSlave',
    value: function () {
      var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(eliotIdentifier, message) {
        var slave;
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                // Look for the slave in confirmSlave
                slave = this.getSlaveByEliotIdentifier(eliotIdentifier);

                // Send the message

                this.getCommunicationSystem().sendMessageToClient(slave.clientIdentityByte, slave.clientIdentityString, message);

                return _context21.abrupt('return', true);

              case 3:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function sendMessageToSlave(_x42, _x43) {
        return _ref21.apply(this, arguments);
      }

      return sendMessageToSlave;
    }()

    /**
     * Get a slave using its eliot id
     * @param {String} eliotIdentifier
     */

  }, {
    key: 'getSlaveByEliotIdentifier',
    value: function getSlaveByEliotIdentifier(eliotIdentifier) {
      // Look for the slave in confirmSlave
      var slave = this.slaves.find(function (x) {
        return x.eliotIdentifier === eliotIdentifier;
      });

      return slave || new Error('E7004 : Identifier: ' + eliotIdentifier);
    }

    /**
     * Using the eliotIdentifier, wait a specific incoming message from a specific slave
     *
     * Messages are like: { head: Object, body: Object }
     *
     * If there is no answer before the timeout, stop waiting and send an error
     * @param {String} headString
     * @param {String} eliotIdentifier
     * @param {Number} timeout - in ms
     */

  }, {
    key: 'getMessageFromSlave',
    value: function getMessageFromSlave(headString, eliotIdentifier) {
      var _this11 = this;

      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _CONSTANT2.default.MASTER_MESSAGE_WAITING_TIMEOUT;

      return new _promise2.default(function (resolve, reject) {
        var timeoutFunction = false;

        // Look for the slave in confirmSlave
        var slave = _this11.getSlaveByEliotIdentifier(eliotIdentifier);

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
              _this11.getCommunicationSystem().unlistenToIncomingMessage(msgListener);

              // We get our message
              return resolve(dataJSON[_CONSTANT2.default.PROTOCOL_KEYWORDS.BODY]);
            }
          }

          return false;
        };

        // If the function get triggered, we reject an error
        timeoutFunction = setTimeout(function () {
          // Stop the listening
          _this11.getCommunicationSystem().unlistenToIncomingMessage(msgListener);

          // Return an error
          return reject(new Error('E7005'));
        }, timeout);

        // Listen to incoming messages
        return _this11.getCommunicationSystem().listenToIncomingMessage(msgListener);
      });
    }

    /**
     * Send the cpu load to the server periodically
     */

  }, {
    key: 'infiniteGetCpuAndMemory',
    value: function infiniteGetCpuAndMemory() {
      var _this12 = this;

      if (this.intervalFdCpuAndMemory) return;

      if (_CONSTANT2.default.DISPLAY_CPU_MEMORY_CHANGE_TIME) {
        // When we connect, we send our infos to the master
        this.intervalFdCpuAndMemory = setInterval((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
          var cpuAndMemory;
          return _regenerator2.default.wrap(function _callee22$(_context22) {
            while (1) {
              switch (_context22.prev = _context22.next) {
                case 0:
                  _context22.prev = 0;
                  _context22.next = 3;
                  return _Utils2.default.getCpuAndMemoryLoad();

                case 3:
                  cpuAndMemory = _context22.sent;


                  _this12.cpuUsageAndMemory = cpuAndMemory;

                  // Say something change
                  _this12.somethingChangedAboutSlavesOrI();

                  if (!_this12.active && _this12.intervalFdCpuAndMemory) {
                    clearInterval(_this12.intervalFdCpuAndMemory);

                    _this12.intervalFdCpuAndMemory = false;
                  }
                  _context22.next = 12;
                  break;

                case 9:
                  _context22.prev = 9;
                  _context22.t0 = _context22['catch'](0);

                  _RoleAndTask2.default.getInstance().errorHappened(_context22.t0);

                case 12:
                case 'end':
                  return _context22.stop();
              }
            }
          }, _callee22, _this12, [[0, 9]]);
        })), _CONSTANT2.default.DISPLAY_CPU_MEMORY_CHANGE_TIME);
      }
    }

    /**
     * Get periodically the infos about tasks running in master
     */

  }, {
    key: 'infiniteGetTasksInfos',
    value: function () {
      var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24() {
        var _this13 = this;

        return _regenerator2.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                if (!this.intervalFdTasksInfos) {
                  _context24.next = 2;
                  break;
                }

                return _context24.abrupt('return');

              case 2:

                this.intervalFdTasksInfos = setInterval((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
                  var infos;
                  return _regenerator2.default.wrap(function _callee23$(_context23) {
                    while (1) {
                      switch (_context23.prev = _context23.next) {
                        case 0:
                          _context23.prev = 0;
                          _context23.next = 3;
                          return _this13.taskHandler.getInfosFromAllActiveTasks();

                        case 3:
                          infos = _context23.sent;


                          _this13.tasksInfos = infos;

                          _this13.somethingChangedAboutSlavesOrI();

                          // If the role is still active we call it back
                          if (!_this13.active && _this13.intervalFdTasksInfos) {
                            clearInterval(_this13.intervalFdTasksInfos);

                            _this13.intervalFdTasksInfos = false;
                          }
                          _context23.next = 12;
                          break;

                        case 9:
                          _context23.prev = 9;
                          _context23.t0 = _context23['catch'](0);

                          _RoleAndTask2.default.getInstance().errorHappened(_context23.t0);

                        case 12:
                        case 'end':
                          return _context23.stop();
                      }
                    }
                  }, _callee23, _this13, [[0, 9]]);
                })), _CONSTANT2.default.SLAVES_INFOS_CHANGE_TIME);

              case 3:
              case 'end':
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function infiniteGetTasksInfos() {
        return _ref23.apply(this, arguments);
      }

      return infiniteGetTasksInfos;
    }()

    /**
     * ELIOT start to play the role
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
    value: function () {
      var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25(_ref26) {
        var _ref26$ipServer = _ref26.ipServer,
            ipServer = _ref26$ipServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref26$ipServer,
            _ref26$portServer = _ref26.portServer,
            portServer = _ref26$portServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref26$portServer;
        return _regenerator2.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                // Reinitialize some properties
                this.initProperties();

                // Create the OMQ Server
                this.communicationSystem = new _ZeroMQServerRouter2.default();

                // Start the communication system
                _context25.next = 4;
                return this.communicationSystem.start({
                  ipServer: ipServer,
                  portServer: portServer,
                  transport: _CONSTANT2.default.ZERO_MQ.TRANSPORT.IPC
                });

              case 4:

                this.active = true;

                this.protocolMasterSlave();

                // Say something changed
                this.somethingChangedAboutSlavesOrI();

                // LaunchScenarios an infite get of cpu usage to give to handleEliotTask
                this.infiniteGetCpuAndMemory();

                // LaunchScenarios an infite get of tasks infos to give to handleEliotTask
                this.infiniteGetTasksInfos();

                return _context25.abrupt('return', true);

              case 10:
              case 'end':
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function start(_x45) {
        return _ref25.apply(this, arguments);
      }

      return start;
    }()

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
            ret.identifierSlave = x.eliotIdentifier;

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
    value: function () {
      var _ref27 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26() {
        var _chooseWhichTaskToSto, idTaskToRemove, isMasterTask, isSlaveTask, identifierSlave, args;

        return _regenerator2.default.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                // close one of the task
                // master or slave task
                _chooseWhichTaskToSto = this.chooseWhichTaskToStop(), idTaskToRemove = _chooseWhichTaskToSto.idTaskToRemove, isMasterTask = _chooseWhichTaskToSto.isMasterTask, isSlaveTask = _chooseWhichTaskToSto.isSlaveTask, identifierSlave = _chooseWhichTaskToSto.identifierSlave, args = _chooseWhichTaskToSto.args;

                // No more task to stop

                if (!(idTaskToRemove === false)) {
                  _context26.next = 4;
                  break;
                }

                // Say something changed
                this.somethingChangedAboutSlavesOrI();

                return _context26.abrupt('return', true);

              case 4:
                if (!isMasterTask) {
                  _context26.next = 8;
                  break;
                }

                _context26.next = 7;
                return this.getTaskHandler().stopTask(idTaskToRemove, args);

              case 7:
                return _context26.abrupt('return', this.stopAllTaskOnEverySlaveAndMaster());

              case 8:
                if (!isSlaveTask) {
                  _context26.next = 12;
                  break;
                }

                _context26.next = 11;
                return this.removeTaskFromSlave(identifierSlave, idTaskToRemove, args);

              case 11:
                return _context26.abrupt('return', this.stopAllTaskOnEverySlaveAndMaster());

              case 12:
                return _context26.abrupt('return', true);

              case 13:
              case 'end':
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function stopAllTaskOnEverySlaveAndMaster() {
        return _ref27.apply(this, arguments);
      }

      return stopAllTaskOnEverySlaveAndMaster;
    }()

    /**
     * ELIOT stop to play the role
     * @param {Object} args
     * @override
     */

  }, {
    key: 'stop',
    value: function () {
      var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27() {
        return _regenerator2.default.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                _context27.next = 2;
                return this.stopAllTaskOnEverySlaveAndMaster();

              case 2:
                _context27.next = 4;
                return this.removeExistingSlave(this.slaves.map(function (x) {
                  return x.eliotIdentifier;
                }));

              case 4:

                // Stop the infinite loops
                if (this.intervalFdCpuAndMemory) clearInterval(this.intervalFdCpuAndMemory);

                if (this.intervalFdTasksInfos) clearInterval(this.intervalFdTasksInfos);

                // Stop the communication system
                _context27.next = 8;
                return this.communicationSystem.stop();

              case 8:

                this.active = false;

                return _context27.abrupt('return', true);

              case 10:
              case 'end':
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function stop() {
        return _ref28.apply(this, arguments);
      }

      return stop;
    }()

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
    value: function sendMessageAndWaitForTheResponse(_ref29) {
      var _this14 = this;

      var identifierSlave = _ref29.identifierSlave,
          messageHeaderToSend = _ref29.messageHeaderToSend,
          messageBodyToSend = _ref29.messageBodyToSend,
          messageHeaderToGet = _ref29.messageHeaderToGet,
          isHeadBodyPattern = _ref29.isHeadBodyPattern,
          timeoutToGetMessage = _ref29.timeoutToGetMessage;

      return new _promise2.default(function (resolve, reject) {
        // We switch to the appropriated func
        var sendMessageGoodFunc = function sendMessageGoodFunc() {
          if (isHeadBodyPattern) return _this14.sendMessageToSlaveHeadBodyPattern;

          return _this14.sendMessageToSlave;
        };

        var errAlreadyReturned = false;

        // Be ready to get the message from the slave before to send it the command
        _this14.getMessageFromSlave(messageHeaderToGet, identifierSlave, timeoutToGetMessage)
        // Job done
        .then(resolve).catch(function (err) {
          if (!errAlreadyReturned) {
            errAlreadyReturned = true;

            return reject(err);
          }

          return false;
        });

        // Send the command to the slave
        sendMessageGoodFunc().call(_this14, identifierSlave, messageHeaderToSend, messageBodyToSend).then(function () {
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
