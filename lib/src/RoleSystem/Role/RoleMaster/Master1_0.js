"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _child_process = _interopRequireDefault(require("child_process"));

var _AMaster2 = _interopRequireDefault(require("./AMaster.js"));

var _CONSTANT = _interopRequireDefault(require("../../../Utils/CONSTANT/CONSTANT.js"));

var _TaskHandler = _interopRequireDefault(require("../../Handlers/TaskHandler.js"));

var _ZeroMQServerRouter = _interopRequireDefault(require("../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter.js"));

var _Utils = _interopRequireDefault(require("../../../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../../../Utils/Errors.js"));

var _RoleAndTask = _interopRequireDefault(require("../../../RoleAndTask.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../../../Utils/PromiseCommandPattern.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var instance = null;
/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 */

var Master1_0 =
/*#__PURE__*/
function (_AMaster) {
  (0, _inherits2["default"])(Master1_0, _AMaster);

  function Master1_0() {
    var _this;

    (0, _classCallCheck2["default"])(this, Master1_0);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Master1_0).call(this));
    if (instance) return (0, _possibleConstructorReturn2["default"])(_this, instance);
    _this.name = _CONSTANT["default"].DEFAULT_ROLES.MASTER_ROLE.name;
    _this.id = _CONSTANT["default"].DEFAULT_ROLES.MASTER_ROLE.id;
    _this.pathToEntryFile = false; // Get the tasks related to the master role

    var tasks = _RoleAndTask["default"].getInstance().getRoleTasks(_CONSTANT["default"].DEFAULT_ROLES.MASTER_ROLE.id); // Define all tasks handled by this role


    _this.setTaskHandler(new _TaskHandler["default"](tasks));

    _this.initProperties();

    instance = (0, _assertThisInitialized2["default"])(_this);
    return (0, _possibleConstructorReturn2["default"])(_this, instance);
  }
  /**
   * Init the properties
   */


  (0, _createClass2["default"])(Master1_0, [{
    key: "initProperties",
    value: function initProperties() {
      // Define none communicationSystem for now
      this.communicationSystem = false; // Array of current approved slaves

      this.slaves = []; // Array of slaves that are in the confirmation process

      this.notConfirmedSlaves = []; // Array that contains the relation between console process ptr and programIdentifier
      // We use it too when there is no console launch, because it work with both soluce

      this.consoleChildObjectPtr = []; // Functions called when something happend to a slave connection

      this.newConnectionListeningFunction = [];
      this.newDisconnectionListeningFunction = []; // Data we keep as attribute to give to handleProgramTask later

      this.cpuUsageAndMemory = false;
      this.tasksInfos = false; // Store the mutexes here, we use to avoid concurrency between slaves on specific actions

      this.mutexes = {};
    }
    /**
     * Get the communicationSystem
     */

  }, {
    key: "getCommunicationSystem",
    value: function getCommunicationSystem() {
      return this.communicationSystem;
    }
    /**
     * SINGLETON implementation
     * @override
     */

  }, {
    key: "unlistenSlaveConnectionEvent",

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
    key: "unlistenSlaveDisconnectionEvent",
    value: function unlistenSlaveDisconnectionEvent(func) {
      this.newDisconnectionListeningFunction = this.newDisconnectionListeningFunction.filter(function (x) {
        return x.func !== func;
      });
    }
    /**
     * Push a function that get fired when a slave get connected
     */

  }, {
    key: "listenSlaveConnectionEvent",
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
    key: "listenSlaveDisconnectionEvent",
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
    key: "getNonConfirmedSlaves",
    value: function getNonConfirmedSlaves() {
      return this.notConfirmedSlaves;
    }
    /**
     *  Get an array that contains confirmed slaves
     */

  }, {
    key: "getSlaves",
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
    key: "sendDataToEveryProgramTaskWhereverItIsLowLevel",
    value: function sendDataToEveryProgramTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, body) {
      var _this2 = this;

      var regularSlaves = this.getSlavesOnlyThatAreRegularSlaves(); // Open the body to get the list of tasks we limit the spread on

      var limitToTaskList = body.limitToTaskList; // For each slave

      regularSlaves.forEach(function (x) {
        // Only send the data to the slaves that holds a tasks that need to know about the message
        if (!limitToTaskList || x.tasks.some(function (y) {
          return y.isActive && limitToTaskList.includes(y.id);
        })) {
          // Send a message to every running slaves
          _this2.sendMessageToSlaveHeadBodyPattern(x.programIdentifier, _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, body);
        }
      }); // For itself tasks

      _RoleAndTask["default"].getInstance().spreadDataToEveryLocalTask(body);
    }
    /**
     * We get asked to spread a news to every slave tasks and our tasks
     */

  }, {
    key: "sendDataToEveryProgramTaskWhereverItIs",
    value: function sendDataToEveryProgramTaskWhereverItIs(data) {
      this.sendDataToEveryProgramTaskWhereverItIsLowLevel(false, false, data);
    }
    /**
     * Tell the Task about something happend in slaves
     */

  }, {
    key: "tellMasterAboutSlaveError",
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
    key: "errorHappenedIntoSlave",
    value: function errorHappenedIntoSlave(clientIdentityByte, clientIdentityString, body) {
      var _this3 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee() {
            var err;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    err = _Errors["default"].deserialize(body); // Display the error

                    _Utils["default"].displayMessage({
                      str: _Errors["default"].staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
                      out: process.stderr
                    });

                    _context.prev = 2;
                    _context.next = 5;
                    return _RoleAndTask["default"].getInstance().changeProgramState(_CONSTANT["default"].DEFAULT_STATES.ERROR.id);

                  case 5:
                    // We goodly changed the program state
                    // Add informations on error
                    _Utils["default"].displayMessage({
                      str: _Errors["default"].staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
                      out: process.stderr
                    }); // Tell the task handleProgram that there had been an error for the slave


                    _this3.tellMasterAboutSlaveError(clientIdentityString, err); // If the errors are supposed to be fatal, exit!


                    if (_RoleAndTask["default"].getInstance().makesErrorFatal) {
                      _RoleAndTask["default"].exitProgramUnproperDueToError();
                    } // We leave the process because something get broken


                    _context.next = 15;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context["catch"](2);

                    _Utils["default"].displayMessage({
                      str: 'Exit program unproper ERROR HAPPENED IN SLAVE',
                      out: process.stderr
                    });

                    _Utils["default"].displayMessage({
                      str: String(_context.t0 && _context.t0.stack || _context.t0),
                      out: process.stderr
                    });

                    _RoleAndTask["default"].exitProgramUnproperDueToError();

                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, null, [[2, 10]]);
          }));

          function func() {
            return _func.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * In master/slave protocol, we ask to get a token. We get directly asked as the master
     */

  }, {
    key: "takeMutex",
    value: function takeMutex(id) {
      var _this4 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func2 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee2() {
            var customFunctions;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!_this4.mutexes[id]) {
                      _context2.next = 2;
                      break;
                    }

                    throw new _Errors["default"]('E7024');

                  case 2:
                    // Custom function to call when taking or releasing the mutex (if one got set by the user)
                    // If the function throw, we do not take the token
                    customFunctions = _RoleAndTask["default"].getInstance().getMasterMutexFunctions().find(function (x) {
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
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          function func() {
            return _func2.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * In master/slave protocol, we ask to release the token. We get directly asked as the master.
     */

  }, {
    key: "releaseMutex",
    value: function releaseMutex(id) {
      var _this5 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func3 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee3() {
            var customFunctions;
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    // Custom function to call when taking or releasing the mutex (if one got set by the user)
                    // If the function throw, we do not take the token
                    customFunctions = _RoleAndTask["default"].getInstance().getMasterMutexFunctions().find(function (x) {
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
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          function func() {
            return _func3.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Take the mutex behind the given ID if it's available
     */

  }, {
    key: "protocolTakeMutex",
    value: function protocolTakeMutex(clientIdentityByte, clientIdentityString, body) {
      var _this6 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func4 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee4() {
            var TAKE_MUTEX, slave, customFunctions;
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    TAKE_MUTEX = _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.TAKE_MUTEX; // Det the slave that asked

                    slave = _this6.slaves.find(function (x) {
                      return x.clientIdentityString === clientIdentityString;
                    });
                    _context4.prev = 2;

                    if (!_this6.mutexes[body.id]) {
                      _context4.next = 5;
                      break;
                    }

                    throw new _Errors["default"]('E7024');

                  case 5:
                    // Custom function to call when taking or releasing the mutex (if one got set by the user)
                    // If the function throw, we do not take the token
                    customFunctions = _RoleAndTask["default"].getInstance().getMasterMutexFunctions().find(function (x) {
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

                    _this6.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, TAKE_MUTEX, JSON.stringify({
                      error: false
                    }));

                    _context4.next = 16;
                    break;

                  case 13:
                    _context4.prev = 13;
                    _context4.t0 = _context4["catch"](2);

                    _this6.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, TAKE_MUTEX, JSON.stringify({
                      error: _context4.t0.serialize()
                    }));

                  case 16:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, null, [[2, 13]]);
          }));

          function func() {
            return _func4.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Release the mutex behind the given ID
     */

  }, {
    key: "protocolReleaseMutex",
    value: function protocolReleaseMutex(clientIdentityByte, clientIdentityString, body) {
      var _this7 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func5 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee5() {
            var RELEASE_MUTEX, slave, customFunctions;
            return _regenerator["default"].wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    RELEASE_MUTEX = _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.RELEASE_MUTEX; // Det the slave that asked

                    slave = _this7.slaves.find(function (x) {
                      return x.clientIdentityString === clientIdentityString;
                    });
                    _context5.prev = 2;
                    // Custom function to call when taking or releasing the mutex (if one got set by the user)
                    // If the function throw, we do not take the token
                    customFunctions = _RoleAndTask["default"].getInstance().getMasterMutexFunctions().find(function (x) {
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

                    _this7.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, RELEASE_MUTEX, JSON.stringify({
                      error: false
                    }));

                    _context5.next = 14;
                    break;

                  case 11:
                    _context5.prev = 11;
                    _context5.t0 = _context5["catch"](2);

                    _this7.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, RELEASE_MUTEX, JSON.stringify({
                      error: _context5.t0.serialize()
                    }));

                  case 14:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, null, [[2, 11]]);
          }));

          function func() {
            return _func5.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Define the master/slave basic protocol
     * (Authentification)
     */

  }, {
    key: "protocolMasterSlave",
    value: function protocolMasterSlave() {
      var _this8 = this;

      // Shortcuts
      var _CONSTANT$PROTOCOL_KE = _CONSTANT["default"].PROTOCOL_KEYWORDS,
          HEAD = _CONSTANT$PROTOCOL_KE.HEAD,
          BODY = _CONSTANT$PROTOCOL_KE.BODY;
      var _CONSTANT$PROTOCOL_MA = _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES,
          SLAVE_CONFIRMATION_INFORMATIONS = _CONSTANT$PROTOCOL_MA.SLAVE_CONFIRMATION_INFORMATIONS,
          GENERIC_CHANNEL_DATA = _CONSTANT$PROTOCOL_MA.GENERIC_CHANNEL_DATA,
          OUTPUT_TEXT = _CONSTANT$PROTOCOL_MA.OUTPUT_TEXT,
          INFOS_ABOUT_SLAVES = _CONSTANT$PROTOCOL_MA.INFOS_ABOUT_SLAVES,
          ERROR_HAPPENED = _CONSTANT$PROTOCOL_MA.ERROR_HAPPENED,
          TAKE_MUTEX = _CONSTANT$PROTOCOL_MA.TAKE_MUTEX,
          RELEASE_MUTEX = _CONSTANT$PROTOCOL_MA.RELEASE_MUTEX; // Listen at new Socket connection
      //
      // 1/ Check if the new slave have a correct identifier
      // 2/ Ask the slave for running tasks
      // 3/ Get the slave answer
      // 4/ Add the slave into handled slave
      //

      this.getCommunicationSystem().listenClientConnectionEvent(function (clientIdentityByte, clientIdentityString) {
        var _clientIdentityString = clientIdentityString.split('_'),
            _clientIdentityString2 = (0, _slicedToArray2["default"])(_clientIdentityString, 2),
            programIdentifier = _clientIdentityString2[0],
            clientPID = _clientIdentityString2[1]; // Look at the identity of the slave (and if we have duplicate)


        if (_this8.slaves.find(function (x) {
          return x.programIdentifier === programIdentifier;
        }) || _this8.notConfirmedSlaves.find(function (x) {
          return x.programIdentifier === programIdentifier;
        })) {
          // Identity already in use by an other slave
          // Close the connection
          _RoleAndTask["default"].getInstance().displayMessage({
            str: "[".concat(_this8.name, "] Refuse slave cause of identity").cyan
          });

          return _this8.getCommunicationSystem().closeConnectionToClient(clientIdentityByte, clientIdentityString);
        } // So here the client do not exist already and the identifier is free
        // Add the slave into the declared not confirmed array


        _this8.notConfirmedSlaves.push({
          clientIdentityString: clientIdentityString,
          clientIdentityByte: clientIdentityByte,
          programIdentifier: programIdentifier,
          clientPID: clientPID,
          tasks: [],
          error: false
        }); // Ask the slaves about its tasks


        return _this8.getCommunicationSystem().sendMessageToClient(clientIdentityByte, clientIdentityString, SLAVE_CONFIRMATION_INFORMATIONS);
      }); // Listen to slaves disconnection

      this.getCommunicationSystem().listenClientDisconnectionEvent(function (clientIdentityString) {
        _this8.slaves = _this8.slaves.filter(function (x) {
          if (x.clientIdentityString === clientIdentityString) {
            _RoleAndTask["default"].getInstance().displayMessage({
              str: "[".concat(_this8.name, "] Slave get removed (connection)").red
            }); // Fire when a slave get disconnected


            _Utils["default"].fireUp(_this8.newDisconnectionListeningFunction, [x]);

            return false;
          }

          return true;
        });
        _this8.notConfirmedSlaves = _this8.notConfirmedSlaves.filter(function (x) {
          if (x.clientIdentityString === clientIdentityString) {
            _RoleAndTask["default"].getInstance().displayMessage({
              str: "[".concat(_this8.name, "] Non-confirmed slave get removed (connection)").red
            }); // Fire when a slave get disconnected


            _Utils["default"].fireUp(_this8.newDisconnectionListeningFunction, [x]);

            return false;
          }

          return true;
        });
      }); // Confirm a slave that wasn't

      var confirmSlave = function confirmSlave(clientIdentityByte, clientIdentityString, dataJSON) {
        var index = _this8.notConfirmedSlaves.findIndex(function (x) {
          return x.clientIdentityString === clientIdentityString;
        });

        if (index === -1) return; // Confirm the slave

        var slave = _this8.notConfirmedSlaves[index];
        slave.tasks = dataJSON[BODY].tasks;
        slave.role = dataJSON[BODY].role;

        _this8.slaves.push(slave);

        _this8.notConfirmedSlaves.splice(index, 1); // Fire when a slave get connected


        _Utils["default"].fireUp(_this8.newConnectionListeningFunction, [slave]);
      }; // We listen to incoming messages


      this.getCommunicationSystem().listenToIncomingMessage(function (clientIdentityByte, clientIdentityString, dataString) {
        var dataJSON = _Utils["default"].convertStringToJSON(dataString); // Here we got all messages that comes from clients (so slaves)
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
    key: "infosAboutSlaveIncomming",
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
      if (!ptr.moreInfos) ptr.moreInfos = {}; // Apply values to moreInfos

      ['cpuAndMemory', 'ips', 'tasksInfos'].forEach(function (x) {
        // To get the 0 value
        if (data[x] !== void 0) ptr.moreInfos[x] = data[x];
      }); // Tell something changed in the conf

      this.somethingChangedAboutSlavesOrI();
    }
    /**
     * Returns in an array the whole system pids (Master + Slaves processes)
     */

  }, {
    key: "getFullSystemPids",
    value: function getFullSystemPids() {
      var _this9 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return new Promise(function (resolve) {
            resolve([String(process.pid)].concat((0, _toConsumableArray2["default"])(_this9.slaves.map(function (x) {
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
    key: "connectMasterToTask",
    value: function connectMasterToTask(idTaskToConnectTo, idTaskToConnect, args) {
      var _this10 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func6 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee6() {
            var task, connection;
            return _regenerator["default"].wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.prev = 0;

                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: _Utils["default"].monoline(["[".concat(_this10.name, "] Ask Master to connect the Task N\xB0").concat(idTaskToConnect), " to the Task N\xB0".concat(idTaskToConnectTo)]).blue
                    });

                    _context6.next = 4;
                    return _this10.getTaskHandler().getTask(idTaskToConnectTo);

                  case 4:
                    task = _context6.sent;

                    if (task.isActive()) {
                      _context6.next = 7;
                      break;
                    }

                    throw new _Errors["default"]('E7009', "idTask: ".concat(idTaskToConnectTo));

                  case 7:
                    // Ask the connection to be made
                    connection = task.connectToTask(idTaskToConnect, args);

                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: _Utils["default"].monoline(["[".concat(_this10.name, "] Task N\xB0").concat(idTaskToConnect, " correctly connected to Task "), "N\xB0".concat(idTaskToConnectTo, " in Master")]).green
                    });

                    return _context6.abrupt("return", connection);

                  case 12:
                    _context6.prev = 12;
                    _context6.t0 = _context6["catch"](0);

                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: _Utils["default"].monoline(["[".concat(_this10.name, "] Task N\xB0").concat(idTaskToConnect, " failed to be connected"), " to Task N\xB0".concat(idTaskToConnectTo, " in Master")]).red
                    });

                    throw _context6.t0;

                  case 16:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, null, [[0, 12]]);
          }));

          function func() {
            return _func6.apply(this, arguments);
          }

          return func;
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
    key: "connectTaskToTask",
    value: function connectTaskToTask(identifierSlave, idTaskToConnectTo, idTaskToConnect, args) {
      var _this11 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func7 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee7() {
            var ret;
            return _regenerator["default"].wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return _this11.sendMessageAndWaitForTheResponse({
                      identifierSlave: identifierSlave,
                      isHeadBodyPattern: true,
                      messageHeaderToSend: _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.CONNECT_TASK_TO_TASK,
                      messageBodyToSend: {
                        idTask: idTaskToConnectTo,
                        idTaskToConnect: idTaskToConnect,
                        args: args
                      },
                      messageHeaderToGet: _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.CONNECT_TASK_TO_TASK
                    });

                  case 2:
                    ret = _context7.sent;

                    if (!(ret === '')) {
                      _context7.next = 5;
                      break;
                    }

                    return _context7.abrupt("return", ret);

                  case 5:
                    throw ret;

                  case 6:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7);
          }));

          function func() {
            return _func7.apply(this, arguments);
          }

          return func;
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
    key: "modifyTaskStatusToSlaveLocalArray",
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
    key: "startTaskToSlave",
    value: function startTaskToSlave(identifier, idTask) {
      var _this13 = this;

      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func8 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee8() {
            var ret;
            return _regenerator["default"].wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return _this13.sendMessageAndWaitForTheResponse({
                      identifierSlave: identifier,
                      isHeadBodyPattern: true,
                      messageHeaderToSend: _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK,
                      messageBodyToSend: {
                        idTask: idTask,
                        args: args
                      },
                      messageHeaderToGet: _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK
                    });

                  case 2:
                    ret = _context8.sent;

                    if (!(ret === '')) {
                      _context8.next = 7;
                      break;
                    }

                    // Modify the task status for the given slave
                    _this13.modifyTaskStatusToSlaveLocalArray(identifier, idTask, true); // Say something changed


                    _this13.somethingChangedAboutSlavesOrI();

                    return _context8.abrupt("return", ret);

                  case 7:
                    throw _Errors["default"].deserialize(ret);

                  case 8:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8);
          }));

          function func() {
            return _func8.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * List the existing slaves
     */

  }, {
    key: "listSlaves",
    value: function listSlaves() {
      var _this14 = this;

      return new _PromiseCommandPattern["default"]({
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
    key: "distantListSlaveTask",
    value: function distantListSlaveTask(identifier) {
      var _this15 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _this15.sendMessageAndWaitForTheResponse({
            identifierSlave: identifier,
            isHeadBodyPattern: false,
            messageHeaderToSend: _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
            messageBodyToSend: {},
            messageHeaderToGet: _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS
          });
        }
      });
    }
    /**
     * List a slave tasks using its identifier (Use local data to it)
     * @param {String} identifier
     */

  }, {
    key: "listSlaveTask",
    value: function listSlaveTask(identifier) {
      var _this16 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func9 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee9() {
            var slave;
            return _regenerator["default"].wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    // Look for the slave in confirmSlave
                    slave = _this16.getSlaveByProgramIdentifier(identifier);
                    return _context9.abrupt("return", slave.tasks);

                  case 2:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9);
          }));

          function func() {
            return _func9.apply(this, arguments);
          }

          return func;
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
    key: "handleProgramStateChange",
    value: function handleProgramStateChange(programState, oldProgramState) {
      var _this17 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return Promise.all([// Spread to our tasks
          _this17.getTaskHandler().applyNewProgramState(programState, oldProgramState), // Spread to slaves
          _this17.tellAllSlaveThatProgramStateChanged(programState, oldProgramState) // The spread n slaves went well
          ]);
        }
      });
    }
    /**
     * Return only the slaves that are regular slaves (not CRON_EXECUTOR_ROLE for example)
     */

  }, {
    key: "getSlavesOnlyThatAreRegularSlaves",
    value: function getSlavesOnlyThatAreRegularSlaves() {
      return this.slaves.filter(function (x) {
        return x.role.id === _CONSTANT["default"].DEFAULT_ROLES.SLAVE_ROLE.id;
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
    key: "tellAllSlaveThatProgramStateChanged",
    value: function tellAllSlaveThatProgramStateChanged(programState, oldProgramState) {
      var _this18 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func10 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee10() {
            var regularSlaves;
            return _regenerator["default"].wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    regularSlaves = _this18.getSlavesOnlyThatAreRegularSlaves();
                    return _context10.abrupt("return", Promise.all(regularSlaves.map(function (x) {
                      return _this18.tellASlaveThatProgramStateChanged(x.programIdentifier, programState, oldProgramState);
                    })));

                  case 2:
                  case "end":
                    return _context10.stop();
                }
              }
            }, _callee10);
          }));

          function func() {
            return _func10.apply(this, arguments);
          }

          return func;
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
    key: "tellASlaveThatProgramStateChanged",
    value: function tellASlaveThatProgramStateChanged(slaveIdentifier, programState, oldProgramState) {
      var _this19 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func11 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee11() {
            var STATE_CHANGE, ret;
            return _regenerator["default"].wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    STATE_CHANGE = _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.STATE_CHANGE;
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
                      timeoutToGetMessage: _RoleAndTask["default"].getInstance().masterMessageWaitingTimeoutStateChange
                    });

                  case 3:
                    ret = _context11.sent;

                    if (!(ret === '')) {
                      _context11.next = 6;
                      break;
                    }

                    return _context11.abrupt("return", ret);

                  case 6:
                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: "[".concat(_this19.name, "] program state get not spread in Slave N\xB0").concat(slaveIdentifier).red
                    });

                    throw _Errors["default"].deserialize(ret);

                  case 8:
                  case "end":
                    return _context11.stop();
                }
              }
            }, _callee11);
          }));

          function func() {
            return _func11.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * When called: Remove an existing slave(s)
     * @param {Array} identifiersSlaves
     * @param {?Number} _i
     */

  }, {
    key: "removeExistingSlave",
    value: function removeExistingSlave(identifiersSlaves) {
      var _this20 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _Utils["default"].promiseQueue([].concat((0, _toConsumableArray2["default"])(identifiersSlaves.map(function (x) {
            return {
              functionToCall: _this20.sendMessageToSlave,
              context: _this20,
              args: [x, _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.CLOSE]
            };
          })), [// Say that something changed
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
    key: "killSlave",
    value: function killSlave(programIdentifier) {
      var _this21 = this;

      // Look for the given identifier
      this.consoleChildObjectPtr.filter(function (x) {
        if (x.programIdentifier === programIdentifier) {
          try {
            // Kill the process
            process.kill(x.pid, _CONSTANT["default"].SIGNAL_UNPROPER.SIGUSR1); // Remove the slave from the slave list

            _this21.slaves = _this21.slaves.filter(function (y) {
              return !(y.programIdentifier === programIdentifier);
            });
          } catch (err) {// Ignore the error, because the slave is dead anyway to us
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
    key: "removeTaskFromSlave",
    value: function removeTaskFromSlave(identifier, idTask) {
      var _this22 = this;

      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func12 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee12() {
            var STOP_TASK, ret;
            return _regenerator["default"].wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    STOP_TASK = _CONSTANT["default"].PROTOCOL_MASTER_SLAVE.MESSAGES.STOP_TASK;

                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: "[".concat(_this22.name, "] Ask Slave N\xB0").concat(identifier, " to stop the Task N\xB0").concat(idTask).blue
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
                      timeoutToGetMessage: _RoleAndTask["default"].getInstance().masterMessageWaitingTimeoutStopChange
                    });

                  case 4:
                    ret = _context12.sent;

                    if (!(ret === '')) {
                      _context12.next = 9;
                      break;
                    }

                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: "[".concat(_this22.name, "] Task N\xB0").concat(idTask, " correctly stopped in Slave N\xB0").concat(identifier).green
                    }); // Modify the task status for the given slave


                    _this22.modifyTaskStatusToSlaveLocalArray(identifier, idTask, false);

                    return _context12.abrupt("return", ret);

                  case 9:
                    _RoleAndTask["default"].getInstance().displayMessage({
                      str: "[".concat(_this22.name, "] Task N\xB0").concat(idTask, " failed to be stopped to Slave N\xB0").concat(identifier).red
                    });

                    throw ret;

                  case 11:
                  case "end":
                    return _context12.stop();
                }
              }
            }, _callee12);
          }));

          function func() {
            return _func12.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Display a message directly
     * @param {Object} param
     */

  }, {
    key: "displayMessage",
    value: function displayMessage(param) {
      var _this23 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func13 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee13() {
            var task;
            return _regenerator["default"].wrap(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    _context13.prev = 0;

                    if (!_RoleAndTask["default"].getInstance().displayTask) {
                      _context13.next = 9;
                      break;
                    }

                    _context13.next = 4;
                    return _this23.getTaskHandler().getTask(_RoleAndTask["default"].getInstance().displayTask);

                  case 4:
                    task = _context13.sent;

                    if (_RoleAndTask["default"].getInstance().displayLog) {
                      _context13.next = 7;
                      break;
                    }

                    return _context13.abrupt("return", false);

                  case 7:
                    if (!task.isActive()) {
                      _context13.next = 9;
                      break;
                    }

                    return _context13.abrupt("return", task.displayMessage(param));

                  case 9:
                    // If not we display
                    _Utils["default"].displayMessage(param);

                    _context13.next = 15;
                    break;

                  case 12:
                    _context13.prev = 12;
                    _context13.t0 = _context13["catch"](0);

                    // Ignore error - We can't display the data - it do not require further error treatment
                    // Store the message into file tho
                    _Utils["default"].displayMessage({
                      str: _Errors["default"].staticIsAnError(_context13.t0) ? _context13.t0.getErrorString() : String(_context13.t0.stack || _context13.t0),
                      out: process.stderr
                    });

                  case 15:
                    return _context13.abrupt("return", false);

                  case 16:
                  case "end":
                    return _context13.stop();
                }
              }
            }, _callee13, null, [[0, 12]]);
          }));

          function func() {
            return _func13.apply(this, arguments);
          }

          return func;
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
    key: "startNewSlaveInProcessMode",
    value: function startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout) {
      var _this24 = this;

      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return new Promise(function (resolve, reject) {
            // We create a unique Id that will referenciate the slave at the connexion
            var uniqueSlaveId = slaveOpts && slaveOpts.uniqueSlaveId || _Utils["default"].generateUniqueProgramID(); // Options to send to the new created slave


            var programOpts = slaveOpts && slaveOpts.opts || ["--".concat(_CONSTANT["default"].PROGRAM_LAUNCHING_PARAMETERS.MODE.name), "".concat(_CONSTANT["default"].PROGRAM_LAUNCHING_MODE.SLAVE), "--".concat(_CONSTANT["default"].PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name), "".concat(_CONSTANT["default"].SLAVE_START_ARGS.IDENTIFIER, "=").concat(uniqueSlaveId)]; // Options to give to fork(...)

            var forkOpts = {}; // If there is no path to the entry file to execute

            if (!_this24.pathToEntryFile) {
              throw new _Errors["default"]('EXXXX', 'Cannot start the slave : No pathToEntryFile configured');
            } // Path that lead to the exe of PROGRAM


            var pathToExec = _this24.pathToEntryFile; // LaunchScenarios program in slave mode in a different process

            var child = _child_process["default"].fork(pathToExec, programOpts, forkOpts); // LaunchScenarios a timeout of connection


            var timeoutConnection = setTimeout(function () {
              // Kill the process we did created
              child.kill(_CONSTANT["default"].SIGNAL_TO_KILL_SLAVE_COMMAND);
              return reject(new _Errors["default"]('E7003', "Timeout ".concat(connectionTimeout, " ms passed")));
            }, connectionTimeout); // Look at error event (If it get fired it means the program failed to get launched)
            // Handle the fact a child can result an error later on after first connection
            // Error detected

            child.on('error', function (err) {
              return reject(new _Errors["default"]('E7003', "Exit Code: ".concat(err)));
            }); // Handle the fact a child get closed
            // The close can be wanted, or not

            child.on('close', function (code) {
              // No error
              _RoleAndTask["default"].getInstance().displayMessage({
                str: "Slave Close: ".concat(code).red
              });
            }); // Handle the fact a child exit
            // The exit can be wanted or not

            child.on('exit', function (code) {
              // No error
              _RoleAndTask["default"].getInstance().displayMessage({
                str: "Slave Exit: ".concat(code).red
              });
            }); // Now we need to look at communicationSystem of the master to know if the new slave connect to PROGRAM
            // If we pass a connection timeout time, we kill the process we just created and return an error

            var connectEvent = function connectEvent(slaveInfos) {
              // Wait for a new client with the identifier like -> uniqueSlaveId_processId
              if (slaveInfos && slaveInfos.programIdentifier === uniqueSlaveId) {
                // We got our slave working well
                clearTimeout(timeoutConnection);

                _this24.unlistenSlaveConnectionEvent(connectEvent); // Store the child data


                _this24.consoleChildObjectPtr.push({
                  programIdentifier: uniqueSlaveId,
                  pid: slaveInfos.clientPID
                });

                return resolve(_objectSpread({}, slaveInfos, {
                  pid: slaveInfos.clientPID
                }));
              } // This is not our slave


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
    key: "tellOneTaskAboutArchitectureChange",
    value: function tellOneTaskAboutArchitectureChange(idTask) {
      var _this25 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func14 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee14() {
            var task;
            return _regenerator["default"].wrap(function _callee14$(_context14) {
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

                    return _context14.abrupt("return");

                  case 6:
                    if (task.isActive()) {
                      // Tell HandleProgramTask about new conf
                      task.dynamicallyRefreshDataIntoList({
                        notConfirmedSlaves: _this25.notConfirmedSlaves,
                        confirmedSlaves: _this25.slaves,
                        master: {
                          tasks: _this25.getTaskHandler().getTaskListStatus(),
                          communication: _this25.getCommunicationSystem(),
                          ips: _Utils["default"].givesLocalIps(),
                          cpuAndMemory: _this25.cpuUsageAndMemory,
                          tasksInfos: _this25.tasksInfos
                        }
                      });
                    }

                    _context14.next = 11;
                    break;

                  case 9:
                    _context14.prev = 9;
                    _context14.t0 = _context14["catch"](0);

                  case 11:
                  case "end":
                    return _context14.stop();
                }
              }
            }, _callee14, null, [[0, 9]]);
          }));

          function func() {
            return _func14.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Do something when an information changed about PROGRAM architecture
     */

  }, {
    key: "somethingChangedAboutSlavesOrI",
    value: function somethingChangedAboutSlavesOrI() {
      var _this26 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func15 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee15() {
            return _regenerator["default"].wrap(function _callee15$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    _context15.next = 2;
                    return Promise.all(_RoleAndTask["default"].getInstance().tasks.filter(function (x) {
                      return x.notifyAboutArchitectureChange;
                    }).map(function (x) {
                      return _this26.tellOneTaskAboutArchitectureChange(x.id);
                    }));

                  case 2:
                  case "end":
                    return _context15.stop();
                }
              }
            }, _callee15);
          }));

          function func() {
            return _func15.apply(this, arguments);
          }

          return func;
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
    key: "startNewSlave",
    value: function startNewSlave(slaveOpts, specificOpts) {
      var _this27 = this;

      var connectionTimeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _CONSTANT["default"].SLAVE_CREATION_CONNECTION_TIMEOUT;
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func16 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee16() {
            var ret;
            return _regenerator["default"].wrap(function _callee16$(_context16) {
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
                    return _context16.abrupt("return", ret);

                  case 6:
                  case "end":
                    return _context16.stop();
                }
              }
            }, _callee16);
          }));

          function func() {
            return _func16.apply(this, arguments);
          }

          return func;
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
    key: "sendMessageToSlaveHeadBodyPattern",
    value: function sendMessageToSlaveHeadBodyPattern(programIdentifier, headString, bodyString) {
      var _this28 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func17 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee17() {
            var _message;

            var message;
            return _regenerator["default"].wrap(function _callee17$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    // Build up the message
                    message = (_message = {}, (0, _defineProperty2["default"])(_message, _CONSTANT["default"].PROTOCOL_KEYWORDS.HEAD, headString), (0, _defineProperty2["default"])(_message, _CONSTANT["default"].PROTOCOL_KEYWORDS.BODY, bodyString), _message); // Send the message

                    return _context17.abrupt("return", _this28.sendMessageToSlave(programIdentifier, JSON.stringify(message)));

                  case 2:
                  case "end":
                    return _context17.stop();
                }
              }
            }, _callee17);
          }));

          function func() {
            return _func17.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Send a message to a slave using an programIdentifier
     * @param {String} programIdentifier
     * @param {String} message
     */

  }, {
    key: "sendMessageToSlave",
    value: function sendMessageToSlave(programIdentifier, message) {
      var _this29 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func18 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee18() {
            var slave;
            return _regenerator["default"].wrap(function _callee18$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    // Look for the slave in confirmSlave
                    slave = _this29.getSlaveByProgramIdentifier(programIdentifier); // Send the message

                    _this29.getCommunicationSystem().sendMessageToClient(slave.clientIdentityByte, slave.clientIdentityString, message);

                    return _context18.abrupt("return", true);

                  case 3:
                  case "end":
                    return _context18.stop();
                }
              }
            }, _callee18);
          }));

          function func() {
            return _func18.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Get a slave using its program id
     * @param {String} programIdentifier
     */

  }, {
    key: "getSlaveByProgramIdentifier",
    value: function getSlaveByProgramIdentifier(programIdentifier) {
      // Look for the slave in confirmSlave
      var slave = this.slaves.find(function (x) {
        return x.programIdentifier === programIdentifier;
      });
      return slave || new _Errors["default"]('E7004', "Identifier: ".concat(programIdentifier));
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
    key: "getMessageFromSlave",
    value: function getMessageFromSlave(headString, programIdentifier) {
      var _this30 = this;

      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _RoleAndTask["default"].getInstance().masterMessageWaitingTimeout;
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return new Promise(function (resolve, reject) {
            var timeoutFunction = false; // Look for the slave in confirmSlave

            var slave = _this30.getSlaveByProgramIdentifier(programIdentifier); // Function that will receive messages from slaves


            var msgListener = function msgListener(clientIdentityByte, clientIdentityString, dataString) {
              // Check the identifier to be the one we are waiting a message for
              if (clientIdentityString === slave.clientIdentityString) {
                var dataJSON = _Utils["default"].convertStringToJSON(dataString); // Here we got all messages that comes from clients (so slaves)
                // Check if the message answer particular message


                if (dataJSON && dataJSON[_CONSTANT["default"].PROTOCOL_KEYWORDS.HEAD] && dataJSON[_CONSTANT["default"].PROTOCOL_KEYWORDS.HEAD] === headString) {
                  // Stop the timeout
                  clearTimeout(timeoutFunction); // Stop the listening

                  _this30.getCommunicationSystem().unlistenToIncomingMessage(msgListener); // We get our message


                  return resolve(dataJSON[_CONSTANT["default"].PROTOCOL_KEYWORDS.BODY]);
                }
              }

              return false;
            }; // If the function get triggered, we reject an error


            timeoutFunction = setTimeout(function () {
              // Stop the listening
              _this30.getCommunicationSystem().unlistenToIncomingMessage(msgListener); // Return an error


              return reject(new _Errors["default"]('E7005'));
            }, timeout); // Listen to incoming messages

            return _this30.getCommunicationSystem().listenToIncomingMessage(msgListener);
          });
        }
      });
    }
    /**
     * Send the cpu load to the server periodically
     */

  }, {
    key: "infiniteGetCpuAndMemory",
    value: function infiniteGetCpuAndMemory() {
      var _this31 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func19 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee20() {
            return _regenerator["default"].wrap(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    if (!_this31.intervalFdCpuAndMemory) {
                      _context20.next = 2;
                      break;
                    }

                    return _context20.abrupt("return");

                  case 2:
                    if (_CONSTANT["default"].DISPLAY_CPU_MEMORY_CHANGE_TIME) {
                      // When we connect, we send our infos to the master
                      _this31.intervalFdCpuAndMemory = setInterval(
                      /*#__PURE__*/
                      (0, _asyncToGenerator2["default"])(
                      /*#__PURE__*/
                      _regenerator["default"].mark(function _callee19() {
                        var cpuAndMemory;
                        return _regenerator["default"].wrap(function _callee19$(_context19) {
                          while (1) {
                            switch (_context19.prev = _context19.next) {
                              case 0:
                                _context19.prev = 0;
                                _context19.next = 3;
                                return _Utils["default"].getCpuAndMemoryLoad();

                              case 3:
                                cpuAndMemory = _context19.sent;
                                _this31.cpuUsageAndMemory = cpuAndMemory; // Say something change

                                _this31.somethingChangedAboutSlavesOrI();

                                if (!_this31.active && _this31.intervalFdCpuAndMemory) {
                                  clearInterval(_this31.intervalFdCpuAndMemory);
                                  _this31.intervalFdCpuAndMemory = false;
                                }

                                _context19.next = 12;
                                break;

                              case 9:
                                _context19.prev = 9;
                                _context19.t0 = _context19["catch"](0);

                                _RoleAndTask["default"].getInstance().errorHappened(_context19.t0);

                              case 12:
                              case "end":
                                return _context19.stop();
                            }
                          }
                        }, _callee19, null, [[0, 9]]);
                      })), _CONSTANT["default"].DISPLAY_CPU_MEMORY_CHANGE_TIME);
                    }

                  case 3:
                  case "end":
                    return _context20.stop();
                }
              }
            }, _callee20);
          }));

          function func() {
            return _func19.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Get periodically the infos about tasks running in master
     */

  }, {
    key: "infiniteGetTasksInfos",
    value: function infiniteGetTasksInfos() {
      var _this32 = this;

      if (this.intervalFdTasksInfos) return;
      this.intervalFdTasksInfos = setInterval(
      /*#__PURE__*/
      (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee21() {
        var infos;
        return _regenerator["default"].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.prev = 0;
                _context21.next = 3;
                return _this32.taskHandler.getInfosFromAllActiveTasks();

              case 3:
                infos = _context21.sent;
                _this32.tasksInfos = infos;

                _this32.somethingChangedAboutSlavesOrI(); // If the role is still active we call it back


                if (!_this32.active && _this32.intervalFdTasksInfos) {
                  clearInterval(_this32.intervalFdTasksInfos);
                  _this32.intervalFdTasksInfos = false;
                }

                _context21.next = 12;
                break;

              case 9:
                _context21.prev = 9;
                _context21.t0 = _context21["catch"](0);

                _RoleAndTask["default"].getInstance().errorHappened(_context21.t0);

              case 12:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, null, [[0, 9]]);
      })), _CONSTANT["default"].SLAVES_INFOS_CHANGE_TIME);
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
    key: "start",
    value: function start(_ref3) {
      var _this33 = this;

      var _ref3$ipServer = _ref3.ipServer,
          ipServer = _ref3$ipServer === void 0 ? _CONSTANT["default"].ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref3$ipServer,
          _ref3$portServer = _ref3.portServer,
          portServer = _ref3$portServer === void 0 ? _CONSTANT["default"].ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref3$portServer;
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func20 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee22() {
            return _regenerator["default"].wrap(function _callee22$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    // Reinitialize some properties
                    _this33.initProperties(); // Create the OMQ Server


                    _this33.communicationSystem = new _ZeroMQServerRouter["default"](); // Start the communication system

                    _context22.next = 4;
                    return _this33.communicationSystem.start({
                      ipServer: ipServer,
                      portServer: portServer,
                      transport: _CONSTANT["default"].ZERO_MQ.TRANSPORT.IPC
                    });

                  case 4:
                    _this33.active = true;

                    _this33.protocolMasterSlave(); // Say something changed


                    _this33.somethingChangedAboutSlavesOrI(); // LaunchScenarios an infite get of cpu usage to give to handleProgramTask


                    _this33.infiniteGetCpuAndMemory(); // LaunchScenarios an infite get of tasks infos to give to handleProgramTask


                    _this33.infiniteGetTasksInfos();

                    return _context22.abrupt("return", true);

                  case 10:
                  case "end":
                    return _context22.stop();
                }
              }
            }, _callee22);
          }));

          function func() {
            return _func20.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Get the hierarchy level of the given task
     */

  }, {
    key: "chooseWhichTaskToStop",

    /**
     * This methods return the task we need to stop first
     * There is an hierarchie in tasks closure
     */
    value: function chooseWhichTaskToStop() {
      var tasksMaster = this.getTaskHandler().getTaskListStatus(); // Compute a list in order of tasksID to close (following the closure hierarchy)

      var computeListClosure = Master1_0.sortArray(tasksMaster.map(function (x) {
        return {
          idTask: x.id,
          closureHierarchy: x.closureHierarchy
        };
      })); // Now look at slaves tasks, then master task, about the task that is the higher in closure hierarchy

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
          if (!y.isActive) return false; // Look if this hierarchy is higher than the save one

          if (ret.hierarchyLevel === false || ret.hierarchyLevel > hierarchyY) {
            // Save the task to be the one that get to be removed (for now!)
            ret.hierarchyLevel = hierarchyY;
            ret.idTaskToRemove = y.id;
            ret.isSlaveTask = true;
            ret.isMasterTask = false;
            ret.identifierSlave = x.programIdentifier; // If the task we have is the highest in hierarchy, no need to look furthers

            if (computeListClosure.length && hierarchyY === computeListClosure[0].closureHierarchy) return true;
          }

          return false;
        });
      });
      if (foundHighestInHierarchy) return ret; // We didn't found the higest task in the hierarchy so look at master tasks, its maybe there

      tasksMaster.some(function (x) {
        var hierarchyX = Master1_0.getHierarchyLevelByIdTask(computeListClosure, x.id);
        if (!x.isActive) return false; // Look if this hierarchy is higher than the save one

        if (ret.hierarchyLevel === false || ret.hierarchyLevel > hierarchyX) {
          // Save the task to be the one that get to be removed (for now!)
          ret.hierarchyLevel = hierarchyX;
          ret.idTaskToRemove = x.id;
          ret.isSlaveTask = false;
          ret.isMasterTask = true;
          ret.identifierSlave = false; // If the task we have is the highest in hierarchy, no need to look furthers

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
    key: "stopAllTaskOnEverySlaveAndMaster",
    value: function stopAllTaskOnEverySlaveAndMaster() {
      var _this34 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func21 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee23() {
            var _this34$chooseWhichTa, idTaskToRemove, isMasterTask, isSlaveTask, identifierSlave, args;

            return _regenerator["default"].wrap(function _callee23$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    // close one of the task
                    // master or slave task
                    _this34$chooseWhichTa = _this34.chooseWhichTaskToStop(), idTaskToRemove = _this34$chooseWhichTa.idTaskToRemove, isMasterTask = _this34$chooseWhichTa.isMasterTask, isSlaveTask = _this34$chooseWhichTa.isSlaveTask, identifierSlave = _this34$chooseWhichTa.identifierSlave, args = _this34$chooseWhichTa.args; // No more task to stop

                    if (!(idTaskToRemove === false)) {
                      _context23.next = 4;
                      break;
                    }

                    // Say something changed
                    _this34.somethingChangedAboutSlavesOrI();

                    return _context23.abrupt("return", true);

                  case 4:
                    if (!isMasterTask) {
                      _context23.next = 8;
                      break;
                    }

                    _context23.next = 7;
                    return _this34.getTaskHandler().stopTask(idTaskToRemove, args);

                  case 7:
                    return _context23.abrupt("return", _this34.stopAllTaskOnEverySlaveAndMaster());

                  case 8:
                    if (!isSlaveTask) {
                      _context23.next = 12;
                      break;
                    }

                    _context23.next = 11;
                    return _this34.removeTaskFromSlave(identifierSlave, idTaskToRemove, args);

                  case 11:
                    return _context23.abrupt("return", _this34.stopAllTaskOnEverySlaveAndMaster());

                  case 12:
                    return _context23.abrupt("return", true);

                  case 13:
                  case "end":
                    return _context23.stop();
                }
              }
            }, _callee23);
          }));

          function func() {
            return _func21.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * PROGRAM stop to play the role
     * @param {Object} args
     * @override
     */

  }, {
    key: "stop",
    value: function stop() {
      var _this35 = this;

      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func22 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee24() {
            return _regenerator["default"].wrap(function _callee24$(_context24) {
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
                    if (_this35.intervalFdTasksInfos) clearInterval(_this35.intervalFdTasksInfos); // Stop the communication system

                    _context24.next = 8;
                    return _this35.communicationSystem.stop();

                  case 8:
                    _this35.active = false;
                    return _context24.abrupt("return", true);

                  case 10:
                  case "end":
                    return _context24.stop();
                }
              }
            }, _callee24);
          }));

          function func() {
            return _func22.apply(this, arguments);
          }

          return func;
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
    key: "sendMessageAndWaitForTheResponse",
    value: function sendMessageAndWaitForTheResponse(_ref4) {
      var _this36 = this;

      var identifierSlave = _ref4.identifierSlave,
          messageHeaderToSend = _ref4.messageHeaderToSend,
          messageBodyToSend = _ref4.messageBodyToSend,
          messageHeaderToGet = _ref4.messageHeaderToGet,
          isHeadBodyPattern = _ref4.isHeadBodyPattern,
          timeoutToGetMessage = _ref4.timeoutToGetMessage;
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return new Promise(function (resolve, reject) {
            // We switch to the appropriated func
            var sendMessageGoodFunc = function sendMessageGoodFunc() {
              if (isHeadBodyPattern) return _this36.sendMessageToSlaveHeadBodyPattern;
              return _this36.sendMessageToSlave;
            };

            var errAlreadyReturned = false; // Be ready to get the message from the slave before to send it the command

            _this36.getMessageFromSlave(messageHeaderToGet, identifierSlave, timeoutToGetMessage) // Job done
            .then(resolve)["catch"](function (err) {
              if (!errAlreadyReturned) {
                errAlreadyReturned = true;
                return reject(err);
              }

              return false;
            }); // Send the command to the slave


            sendMessageGoodFunc().call(_this36, identifierSlave, messageHeaderToSend, messageBodyToSend).then(function () {// It went well, no wait getMessageFromSlave to get the message
              // If the message is not coming, getMessageFromSlave will timeout and result of an error
              //
              // Nothing to do here anymore Mate!
              //
            })["catch"](function (err) {
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
    key: "getInstance",
    value: function getInstance() {
      return instance || new Master1_0();
    }
  }, {
    key: "getHierarchyLevelByIdTask",
    value: function getHierarchyLevelByIdTask(computeListClosure, idTask) {
      var toRet;
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
    key: "sortArray",
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
}(_AMaster2["default"]);

exports["default"] = Master1_0;
//# sourceMappingURL=Master1_0.js.map
