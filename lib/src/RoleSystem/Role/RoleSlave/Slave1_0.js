'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _ASlave2 = require('./ASlave.js');

var _ASlave3 = _interopRequireDefault(_ASlave2);

var _CONSTANT = require('../../../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _ZeroMQClientDealer = require('../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientDealer.js');

var _ZeroMQClientDealer2 = _interopRequireDefault(_ZeroMQClientDealer);

var _TaskHandler = require('../../Handlers/TaskHandler.js');

var _TaskHandler2 = _interopRequireDefault(_TaskHandler);

var _Utils = require('../../../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _RoleAndTask = require('../../../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
var instance = null;

/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 */

var Slave1_0 = function (_ASlave) {
  (0, _inherits3.default)(Slave1_0, _ASlave);

  /**
   * Ask if we want a brand new instance (If you don't create a new instance here as asked
   * you will have trouble in inheritance - child of this class)
   */
  function Slave1_0() {
    var _ret, _ret2, _ret3;

    var oneshotNewInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    (0, _classCallCheck3.default)(this, Slave1_0);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Slave1_0.__proto__ || (0, _getPrototypeOf2.default)(Slave1_0)).call(this));

    if (instance && !oneshotNewInstance) return _ret = instance, (0, _possibleConstructorReturn3.default)(_this, _ret);

    _this.name = _CONSTANT2.default.DEFAULT_ROLE.SLAVE_ROLE.name;
    _this.id = _CONSTANT2.default.DEFAULT_ROLE.SLAVE_ROLE.id;

    // Get the tasks related to the master role
    var tasks = _RoleAndTask2.default.getInstance().getRoleTasks(_CONSTANT2.default.DEFAULT_ROLE.SLAVE_ROLE.id);

    // Define none communicationSystem for now
    _this.communicationSystem = false;

    // Define all tasks handled by this role
    _this.setTaskHandler(new _TaskHandler2.default(tasks));

    if (oneshotNewInstance) return _ret2 = _this, (0, _possibleConstructorReturn3.default)(_this, _ret2);

    instance = _this;

    return _ret3 = instance, (0, _possibleConstructorReturn3.default)(_this, _ret3);
  }

  /**
   * SINGLETON implementation
   * @override
   */


  (0, _createClass3.default)(Slave1_0, [{
    key: 'getCommunicationSystem',


    /**
     * Get the communicationSystem
     */
    value: function getCommunicationSystem() {
      return this.communicationSystem;
    }

    /**
     * Display a message by giving it to the master
     * @param {Object} param
     */

  }, {
    key: 'displayMessage',
    value: function displayMessage(params) {
      // If we disallow log display, stop it here
      if (!_RoleAndTask2.default.getInstance().getDisplayLog()) return;

      this.sendHeadBodyMessageToServer(_CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.OUTPUT_TEXT, params);
    }

    /**
     * Send the task list to the server
     */

  }, {
    key: 'sendTaskList',
    value: function sendTaskList() {
      var buildMsg = this.buildHeadBodyMessage(_CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS, this.getTaskHandler().getTaskListStatus());

      return this.getCommunicationSystem().sendMessageToServer(buildMsg);
    }

    /**
     * We send our tasks and the type of slave we are
     */

  }, {
    key: 'sendConfirmationInformations',
    value: function sendConfirmationInformations() {
      var buildMsg = this.buildHeadBodyMessage(_CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.SLAVE_CONFIRMATION_INFORMATIONS, {
        tasks: this.getTaskHandler().getTaskListStatus(),

        role: {
          id: this.id,
          name: this.name
        }
      });

      return this.getCommunicationSystem().sendMessageToServer(buildMsg);
    }

    /**
     * We get asked to spread a news to every slave tasks -> Send the request to master
     * @param {String} dataName
     * @param {Object} data
     * @param {Date} timestamp
     */

  }, {
    key: 'sendDataToEveryELIOTTaskWhereverItIs',
    value: function sendDataToEveryELIOTTaskWhereverItIs(data) {
      var buildMsg = this.buildHeadBodyMessage(_CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, data);

      this.getCommunicationSystem().sendMessageToServer(buildMsg);
    }

    /**
     * Send message to server using head/body pattern
     * @param {String} head
     * @param {Object} body
     */

  }, {
    key: 'sendHeadBodyMessageToServer',
    value: function sendHeadBodyMessageToServer(head, body) {
      var buildMsg = this.buildHeadBodyMessage(head, body);

      // Error in message
      return this.getCommunicationSystem().sendMessageToServer(buildMsg);
    }

    /**
     * Start a task
     * @param {{idTask: String, args: Object}} body
     */

  }, {
    key: 'protocolStartTask',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(body) {
        var START_TASK;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                START_TASK = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK;

                // We should have something like { idTask: String, args: {} }

                if (!(!body || !body.idTask || !body.args)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', this.sendHeadBodyMessageToServer(START_TASK, new Error('E7006').serialize()));

              case 3:
                _context.prev = 3;
                _context.next = 6;
                return this.getTaskHandler().startTask(body.idTask, (0, _extends3.default)({}, body.args, {
                  role: this
                }));

              case 6:

                // Task get successfuly added
                this.sendHeadBodyMessageToServer(START_TASK, '');
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](3);

                this.sendHeadBodyMessageToServer(START_TASK, _context.t0.serialize());

              case 12:
                return _context.abrupt('return', false);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 9]]);
      }));

      function protocolStartTask(_x2) {
        return _ref.apply(this, arguments);
      }

      return protocolStartTask;
    }()

    /**
     * Stop a task
     * @param {Object} body
     */

  }, {
    key: 'protocolStopTask',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(body) {
        var STOP_TASK;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                STOP_TASK = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STOP_TASK;

                // We should have something like { idTask: String, args: {} }

                if (!(!body || !body.idTask || !body.args)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', this.sendHeadBodyMessageToServer(STOP_TASK, new Error('E7006').serialize()));

              case 3:
                _context2.prev = 3;
                _context2.next = 6;
                return this.getTaskHandler().stopTask(body.idTask, body.args);

              case 6:

                // Task get successfuly stopped
                this.sendHeadBodyMessageToServer(STOP_TASK, '');
                _context2.next = 12;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2['catch'](3);

                this.sendHeadBodyMessageToServer(STOP_TASK, _context2.t0.serialize());

              case 12:
                return _context2.abrupt('return', false);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 9]]);
      }));

      function protocolStopTask(_x3) {
        return _ref2.apply(this, arguments);
      }

      return protocolStopTask;
    }()

    /**
     * As a slave we send our infos to the master throught this method
     * Infos are: IP Address, CPU and memory Load, tasks infos ...
     */

  }, {
    key: 'protocolSendMyInfosToMaster',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref4) {
        var ip = _ref4.ip,
            cpuAndMemory = _ref4.cpuAndMemory,
            tasksInfos = _ref4.tasksInfos;
        var INFOS_ABOUT_SLAVES, infos, ret;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                INFOS_ABOUT_SLAVES = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.INFOS_ABOUT_SLAVES;
                infos = {};

                // Add the ip address

                if (ip) infos.ips = _Utils2.default.givesLocalIps();

                // Add the tasks infos
                if (tasksInfos) infos.tasksInfos = tasksInfos;

                // Add the cpu and memory Load

                if (!cpuAndMemory) {
                  _context3.next = 18;
                  break;
                }

                _context3.prev = 5;
                _context3.next = 8;
                return _Utils2.default.getCpuAndMemoryLoad();

              case 8:
                ret = _context3.sent;


                infos.cpuAndMemory = ret;

                this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
                _context3.next = 17;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3['catch'](5);

                infos.cpuAndMemory = _context3.t0.serialize();

                this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);

              case 17:
                return _context3.abrupt('return', false);

              case 18:
                return _context3.abrupt('return', this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos));

              case 19:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[5, 13]]);
      }));

      function protocolSendMyInfosToMaster(_x4) {
        return _ref3.apply(this, arguments);
      }

      return protocolSendMyInfosToMaster;
    }()

    /**
     * Connect a task to an other task
     * @param {Object} body
     */

  }, {
    key: 'protocolConnectTasks',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(body) {
        var _CONSTANT$PROTOCOL_MA, CONNECT_TASK_TO_TASK, START_TASK, task;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _CONSTANT$PROTOCOL_MA = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES, CONNECT_TASK_TO_TASK = _CONSTANT$PROTOCOL_MA.CONNECT_TASK_TO_TASK, START_TASK = _CONSTANT$PROTOCOL_MA.START_TASK;

                // We should have something like { idTask: String, idTaskToConnect: String, args: {} }

                if (!(!body || !body.idTask || !body.idTaskToConnect || !body.args)) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt('return', this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, new Error('E7006').serialize()));

              case 3:
                _context4.prev = 3;
                _context4.next = 6;
                return this.getTaskHandler().getTask(body.idTask);

              case 6:
                task = _context4.sent;

                if (task.isActive()) {
                  _context4.next = 12;
                  break;
                }

                _context4.next = 10;
                return this.sendHeadBodyMessageToServer(START_TASK, new Error('E7009 : idTask: ' + body.idTask));

              case 10:
                _context4.next = 14;
                break;

              case 12:
                _context4.next = 14;
                return task.connectToTask(body.idTaskToConnect, body.args);

              case 14:

                this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, '');
                _context4.next = 20;
                break;

              case 17:
                _context4.prev = 17;
                _context4.t0 = _context4['catch'](3);

                this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, _context4.t0.serialize());

              case 20:
                return _context4.abrupt('return', false);

              case 21:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 17]]);
      }));

      function protocolConnectTasks(_x5) {
        return _ref5.apply(this, arguments);
      }

      return protocolConnectTasks;
    }()

    /**
     * We got a news from the master. We have to spread the news to every tasks we hold.
     * @param {{dataName: String, data: Object, timestamp: Date}} body
     */

  }, {
    key: 'protocolStateChange',


    /**
     * We got a news about ELIOT state change
     * We tell all our tasks about the change and send a result of spread to the master
     * @param {{ eliotState: Number, oldEliotState: Number }} body
     */
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(body) {
        var STATE_CHANGE;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                STATE_CHANGE = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STATE_CHANGE;

                // We should have something like { eliotState: Number }

                if (!(!body || !body.eliotState || !body.oldEliotState)) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt('return', this.sendHeadBodyMessageToServer(STATE_CHANGE, new Error('E7006').serialize()));

              case 3:
                _context5.prev = 3;
                _context5.next = 6;
                return _RoleAndTask2.default.getInstance().changeEliotState(body.eliotState);

              case 6:
                _context5.next = 8;
                return this.getTaskHandler().applyNewEliotState(body.eliotState, body.oldEliotState);

              case 8:
                return _context5.abrupt('return', this.sendHeadBodyMessageToServer(STATE_CHANGE, ''));

              case 11:
                _context5.prev = 11;
                _context5.t0 = _context5['catch'](3);

                // New state didn't get successfuly spread
                this.sendHeadBodyMessageToServer(STATE_CHANGE, _context5.t0.serialize());

              case 14:
                return _context5.abrupt('return', false);

              case 15:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 11]]);
      }));

      function protocolStateChange(_x6) {
        return _ref6.apply(this, arguments);
      }

      return protocolStateChange;
    }()

    /**
     * We got an error that happended into the slave process
     * We send the error to the master, to make it do something about it
     * @param {Error)} err
     */

  }, {
    key: 'tellMasterErrorHappened',
    value: function tellMasterErrorHappened(err) {
      // Send the error to the master
      this.sendHeadBodyMessageToServer(_CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.ERROR_HAPPENED, String(new Error(err)));
    }

    /**
     * Tell the master that the database initialization is done
     */

  }, {
    key: 'databaseIntializationDone',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var DB_INIT_DONE, ret, json;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                DB_INIT_DONE = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.DB_INIT_DONE;
                _context6.next = 3;
                return this.sendMessageAndWaitForTheResponse({
                  messageHeaderToSend: DB_INIT_DONE,
                  messageBodyToSend: '',
                  messageHeaderToGet: DB_INIT_DONE,
                  isHeadBodyPattern: true,
                  timeoutToGetMessage: _CONSTANT2.default.MASTER_SLAVE_DB_INIT_MESSAGES_WAITING_TIMEOUT
                });

              case 3:
                ret = _context6.sent;
                json = _Utils2.default.convertStringToJSON(ret);

                if (!(!json || !json.error)) {
                  _context6.next = 7;
                  break;
                }

                return _context6.abrupt('return', true);

              case 7:
                throw new Error('Deserialized');

              case 8:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function databaseIntializationDone() {
        return _ref7.apply(this, arguments);
      }

      return databaseIntializationDone;
    }()

    /**
     * Ask the master to perform a database initialization
     */

  }, {
    key: 'askForDatabaseInitialization',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var ASK_DB_INIT, ret, json;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                ASK_DB_INIT = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.ASK_DB_INIT;
                _context7.next = 3;
                return this.sendMessageAndWaitForTheResponse({
                  messageHeaderToSend: ASK_DB_INIT,
                  messageBodyToSend: '',
                  messageHeaderToGet: ASK_DB_INIT,
                  isHeadBodyPattern: true,
                  timeoutToGetMessage: _CONSTANT2.default.MASTER_SLAVE_DB_INIT_MESSAGES_WAITING_TIMEOUT
                });

              case 3:
                ret = _context7.sent;
                json = _Utils2.default.convertStringToJSON(ret);

                if (!(!json || !json.error)) {
                  _context7.next = 7;
                  break;
                }

                return _context7.abrupt('return', true);

              case 7:
                return _context7.abrupt('return', new Error('Deserialized'));

              case 8:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function askForDatabaseInitialization() {
        return _ref8.apply(this, arguments);
      }

      return askForDatabaseInitialization;
    }()

    /**
     * Ask the master to perform a database connection change
     */

  }, {
    key: 'askForDatabaseConnectionChange',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(newLogsToApply) {
        var ASK_DATABASE_CONNECTION_CHANGE, ret, json;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                ASK_DATABASE_CONNECTION_CHANGE = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.ASK_DATABASE_CONNECTION_CHANGE;
                _context8.next = 3;
                return this.sendMessageAndWaitForTheResponse({
                  messageHeaderToSend: ASK_DATABASE_CONNECTION_CHANGE,
                  messageBodyToSend: newLogsToApply,
                  messageHeaderToGet: ASK_DATABASE_CONNECTION_CHANGE,
                  isHeadBodyPattern: true,
                  timeoutToGetMessage: _CONSTANT2.default.MASTER_SLAVE_DB_INIT_MESSAGES_WAITING_TIMEOUT
                });

              case 3:
                ret = _context8.sent;
                json = _Utils2.default.convertStringToJSON(ret);

                if (!(!json || !json.error)) {
                  _context8.next = 7;
                  break;
                }

                return _context8.abrupt('return', true);

              case 7:
                return _context8.abrupt('return', new Error('Deserialized'));

              case 8:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function askForDatabaseConnectionChange(_x7) {
        return _ref9.apply(this, arguments);
      }

      return askForDatabaseConnectionChange;
    }()

    /**
     * We get an order of setting up new database connections
     */

  }, {
    key: 'protocolDatabaseConnectionChange',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(body) {
        var CHANGE_DATABASE_CONNECTION;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                CHANGE_DATABASE_CONNECTION = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CHANGE_DATABASE_CONNECTION;
                _context9.prev = 1;
                _context9.next = 4;
                return _RoleAndTask2.default.getInstance().changeDatabaseConnection(body);

              case 4:

                // New connection get successfuly setted
                this.sendHeadBodyMessageToServer(CHANGE_DATABASE_CONNECTION, '');
                _context9.next = 10;
                break;

              case 7:
                _context9.prev = 7;
                _context9.t0 = _context9['catch'](1);

                // New state didn't get successfuly setted
                this.sendHeadBodyMessageToServer(CHANGE_DATABASE_CONNECTION, _context9.t0.serialize());

              case 10:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[1, 7]]);
      }));

      function protocolDatabaseConnectionChange(_x8) {
        return _ref10.apply(this, arguments);
      }

      return protocolDatabaseConnectionChange;
    }()

    /**
     * Define the protocol between master and a slaves
     */

  }, {
    key: 'protocolMasterSlave',
    value: function protocolMasterSlave() {
      var _this2 = this;

      // We listen to incoming messages
      this.getCommunicationSystem().listenToIncomingMessage(function (dataString) {
        var dataJSON = _Utils2.default.convertStringToJSON(dataString);
        var _CONSTANT$PROTOCOL_KE = _CONSTANT2.default.PROTOCOL_KEYWORDS,
            HEAD = _CONSTANT$PROTOCOL_KE.HEAD,
            BODY = _CONSTANT$PROTOCOL_KE.BODY;
        var _CONSTANT$PROTOCOL_MA2 = _CONSTANT2.default.PROTOCOL_MASTER_SLAVE.MESSAGES,
            LIST_TASKS = _CONSTANT$PROTOCOL_MA2.LIST_TASKS,
            START_TASK = _CONSTANT$PROTOCOL_MA2.START_TASK,
            STOP_TASK = _CONSTANT$PROTOCOL_MA2.STOP_TASK,
            CONNECT_TASK_TO_TASK = _CONSTANT$PROTOCOL_MA2.CONNECT_TASK_TO_TASK,
            GENERIC_CHANNEL_DATA = _CONSTANT$PROTOCOL_MA2.GENERIC_CHANNEL_DATA,
            CLOSE = _CONSTANT$PROTOCOL_MA2.CLOSE,
            STATE_CHANGE = _CONSTANT$PROTOCOL_MA2.STATE_CHANGE,
            SLAVE_CONFIRMATION_INFORMATIONS = _CONSTANT$PROTOCOL_MA2.SLAVE_CONFIRMATION_INFORMATIONS,
            CHANGE_DATABASE_CONNECTION = _CONSTANT$PROTOCOL_MA2.CHANGE_DATABASE_CONNECTION;

        // Here we got all messages that comes from server (so master)
        // Check if the message answer particular message
        // If it does apply the particular job

        [{
          // Check about the list of tasks
          checkFunc: function checkFunc() {
            return dataString === LIST_TASKS;
          },

          // It means we get asked about our tasks list
          applyFunc: function applyFunc() {
            return _this2.sendTaskList();
          }
        }, {
          // Check about the ask for infos
          checkFunc: function checkFunc() {
            return dataString === SLAVE_CONFIRMATION_INFORMATIONS;
          },

          // It means we get asked about our informations
          applyFunc: function applyFunc() {
            return _this2.sendConfirmationInformations();
          }
        }, {
          // Check about add a task
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === START_TASK;
          },

          // It means we get asked about starting a task
          applyFunc: function applyFunc() {
            return _this2.protocolStartTask(dataJSON[BODY]);
          }
        }, {
          // Check about connect a task to an other task
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === CONNECT_TASK_TO_TASK;
          },
          applyFunc: function applyFunc() {
            return _this2.protocolConnectTasks(dataJSON[BODY]);
          }
        }, {
          // Check about news about generic channel data
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === GENERIC_CHANNEL_DATA;
          },
          applyFunc: function applyFunc() {
            return Slave1_0.protocolGenericChannelData(dataJSON[BODY]);
          }
        }, {
          // Check about news about eliot state
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === STATE_CHANGE;
          },
          applyFunc: function applyFunc() {
            return _this2.protocolStateChange(dataJSON[BODY]);
          }
        }, {
          // Check about news about eliot connection change
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === CHANGE_DATABASE_CONNECTION;
          },
          applyFunc: function applyFunc() {
            return _this2.protocolDatabaseConnectionChange(dataJSON[BODY]);
          }
        }, {
          // Check about close order
          checkFunc: function checkFunc() {
            return dataString === CLOSE;
          },
          applyFunc: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
              return _regenerator2.default.wrap(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      _context10.prev = 0;
                      _context10.next = 3;
                      return _this2.stop();

                    case 3:

                      _RoleAndTask2.default.exitEliotGood();
                      _context10.next = 10;
                      break;

                    case 6:
                      _context10.prev = 6;
                      _context10.t0 = _context10['catch'](0);

                      _Utils2.default.displayMessage({
                        str: 'Exit eliot unproper CLOSE ORDER FAILED [' + String(_context10.t0) + ']',
                        out: process.stderr
                      });

                      _RoleAndTask2.default.exitEliotUnproperDueToError();

                    case 10:
                    case 'end':
                      return _context10.stop();
                  }
                }
              }, _callee10, _this2, [[0, 6]]);
            }));

            return function applyFunc() {
              return _ref11.apply(this, arguments);
            };
          }()
        }, {
          // Check about close a task
          checkFunc: function checkFunc() {
            return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === STOP_TASK;
          },
          applyFunc: function applyFunc() {
            return _this2.protocolStopTask(dataJSON[BODY]);
          }
        }].forEach(function (x) {
          if (x.checkFunc()) x.applyFunc();
        });
      });
    }

    /**
     * Send the cpu and memory load to the server periodically
     */

  }, {
    key: 'infiniteSendCpuAndMemoryLoadToMaster',
    value: function infiniteSendCpuAndMemoryLoadToMaster() {
      var _this3 = this;

      if (this.intervalFdCpuAndMemory) return;

      if (_CONSTANT2.default.DISPLAY_CPU_MEMORY_CHANGE_TIME) {
        // When we connect, we send our infos to the master
        this.intervalFdCpuAndMemory = setInterval(function () {
          _this3.protocolSendMyInfosToMaster({
            cpuAndMemory: true
          });

          if (!_this3.active && _this3.intervalFdCpuAndMemory) {
            clearInterval(_this3.intervalFdCpuAndMemory);
            _this3.intervalFdCpuAndMemory = false;
          }
        }, _CONSTANT2.default.DISPLAY_CPU_MEMORY_CHANGE_TIME);
      }
    }

    /**
     * Send the cpu and memory load to the server periodically
     */

  }, {
    key: 'infiniteSendTasksInfosToMaster',
    value: function infiniteSendTasksInfosToMaster() {
      var _this4 = this;

      if (this.intervalFdTasksInfos) return;

      // When we connect, we send our infos to the master
      this.intervalFdTasksInfos = setInterval((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
        var infos;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.next = 3;
                return _this4.taskHandler.getInfosFromAllActiveTasks();

              case 3:
                infos = _context11.sent;


                // Send the data to the master
                _this4.protocolSendMyInfosToMaster({
                  tasksInfos: infos
                });

                // If the role is still active we call it back
                if (!_this4.active && _this4.intervalFdTasksInfos) {
                  clearInterval(_this4.intervalFdTasksInfos);

                  _this4.intervalFdTasksInfos = false;
                }
                _context11.next = 11;
                break;

              case 8:
                _context11.prev = 8;
                _context11.t0 = _context11['catch'](0);

                _RoleAndTask2.default.getInstance().errorHappened(_context11.t0);

              case 11:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, _this4, [[0, 8]]);
      })), _CONSTANT2.default.SLAVES_INFOS_CHANGE_TIME);
    }

    /**
     * Start the slave1_0
     * @param {Object} args
     * @override
     */

  }, {
    key: 'startSlave1_0',
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(_ref14) {
        var _ref14$ipServer = _ref14.ipServer,
            ipServer = _ref14$ipServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _ref14$ipServer,
            _ref14$portServer = _ref14.portServer,
            portServer = _ref14$portServer === undefined ? _CONSTANT2.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _ref14$portServer,
            identifier = _ref14.identifier;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                // Create the OMQ Server
                this.communicationSystem = new _ZeroMQClientDealer2.default();

                this.protocolMasterSlave();

                // Start the communication system
                _context12.next = 4;
                return this.communicationSystem.start({
                  ipServer: ipServer,
                  portServer: portServer,
                  transport: _CONSTANT2.default.ZERO_MQ.TRANSPORT.IPC,
                  identityPrefix: identifier
                });

              case 4:

                this.active = true;

                // When we connect, we send our infos to the master
                this.protocolSendMyInfosToMaster({
                  ip: true
                });

                // Every X sec get the CPU and the Memory and send it to the master
                this.infiniteSendCpuAndMemoryLoadToMaster();

                // Every X sec get infos from the active tasks and send them to the master
                this.infiniteSendTasksInfosToMaster();

                // Look at when we get connected
                this.communicationSystem.listenConnectEvent(function (client) {
                  _RoleAndTask2.default.getInstance().displayMessage({
                    str: ('Connected ' + client).yellow
                  });
                });

                // Look at when we get disconnected
                this.communicationSystem.listenDisconnectEvent(function (client) {
                  return _RoleAndTask2.default.getInstance().displayMessage({
                    str: ('Disconnected ' + client).yellow
                  });
                });

                return _context12.abrupt('return', true);

              case 11:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function startSlave1_0(_x9) {
        return _ref13.apply(this, arguments);
      }

      return startSlave1_0;
    }()

    /**
     * ELIOT start to play the role
     * @param {Object} args
     * @override
     */

  }, {
    key: 'start',
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(args) {
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt('return', this.startSlave1_0(args));

              case 1:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function start(_x10) {
        return _ref15.apply(this, arguments);
      }

      return start;
    }()

    /**
     * ELIOT stop to play the role
     * @param {Object} args
     * @override
     */

  }, {
    key: 'stop',
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _RoleAndTask2.default.getInstance().displayMessage({
                  str: 'Ask Role Slave To Stop'.cyan
                });

                // Stop all its tasks
                _context14.next = 3;
                return this.getTaskHandler().stopAllTask();

              case 3:

                // Stop the infinite loops
                if (this.intervalFdCpuAndMemory) clearInterval(this.intervalFdCpuAndMemory);

                if (this.intervalFdTasksInfos) clearInterval(this.intervalFdTasksInfos);

                // Stop the communication system
                _context14.next = 7;
                return this.communicationSystem.stop();

              case 7:

                _RoleAndTask2.default.getInstance().displayMessage({
                  str: 'Role Slave Stopped'.red
                });

                this.active = false;

                return _context14.abrupt('return', true);

              case 10:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function stop() {
        return _ref16.apply(this, arguments);
      }

      return stop;
    }()

    /**
     * Send the data to the server
     * @param {String} data
     */

  }, {
    key: 'sendMessageToServer',
    value: function sendMessageToServer(data) {
      this.getCommunicationSystem().sendMessageToServer(data);
    }

    /**
     * Wait a specific incoming message from the server
     *
     * Messages are like: { head: Object, body: Object }
     *
     * If there is no answer before the timeout, stop waiting and send an error
     * @param {String} headString
     * @param {Number} timeout - in ms
     */

  }, {
    key: 'getMessageFromServer',
    value: function getMessageFromServer(headString) {
      var _this5 = this;

      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _CONSTANT2.default.MASTER_MESSAGE_WAITING_TIMEOUT;

      return new _promise2.default(function (resolve, reject) {
        var timeoutFunction = false;

        // Function that will receive messages from the server
        var msgListener = function msgListener(dataString) {
          var dataJSON = _Utils2.default.convertStringToJSON(dataString);

          // Here we got all messages that comes from the server
          // Check if the message answer particular message
          if (dataJSON && dataJSON[_CONSTANT2.default.PROTOCOL_KEYWORDS.HEAD] && dataJSON[_CONSTANT2.default.PROTOCOL_KEYWORDS.HEAD] === headString) {
            // Stop the timeout
            clearTimeout(timeoutFunction);

            // Stop the listening
            _this5.getCommunicationSystem().unlistenToIncomingMessage(msgListener);

            // We get our message
            return resolve(dataJSON[_CONSTANT2.default.PROTOCOL_KEYWORDS.BODY]);
          }

          return false;
        };

        // If the function get triggered, we reject an error
        timeoutFunction = setTimeout(function () {
          // Stop the listening
          _this5.getCommunicationSystem().unlistenToIncomingMessage(msgListener);

          // Return an error
          return reject(new Error('E7005'));
        }, timeout);

        // Listen to incoming messages
        return _this5.getCommunicationSystem().listenToIncomingMessage(msgListener);
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
    value: function sendMessageAndWaitForTheResponse(_ref17) {
      var _this6 = this;

      var messageHeaderToSend = _ref17.messageHeaderToSend,
          messageBodyToSend = _ref17.messageBodyToSend,
          messageHeaderToGet = _ref17.messageHeaderToGet,
          isHeadBodyPattern = _ref17.isHeadBodyPattern,
          timeoutToGetMessage = _ref17.timeoutToGetMessage;

      return new _promise2.default(function (resolve, reject) {
        var errAlreadyReturned = false;

        // Be ready to get the message from the slave before to send it the command
        _this6.getMessageFromServer(messageHeaderToGet, timeoutToGetMessage)
        // Job done
        .then(resolve).catch(function (err) {
          if (!errAlreadyReturned) {
            errAlreadyReturned = true;

            return reject(err);
          }

          return false;
        });

        // Send the command to the slave
        if (isHeadBodyPattern) return _this6.sendHeadBodyMessageToServer(messageHeaderToSend, messageBodyToSend);

        return _this6.sendMessageToServer(messageBodyToSend);

        // It went well, no wait getMessageFromServer to get the message
        // If the message is not coming, getMessageFromServer will timeout and result of an error

        //
        // Nothing to do here anymore Mate!
        //
      });
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      return instance || new Slave1_0();
    }
  }, {
    key: 'protocolGenericChannelData',
    value: function protocolGenericChannelData(body) {
      // For itself tasks
      _RoleAndTask2.default.getInstance().spreadDataToEveryLocalTask(body);
    }
  }]);
  return Slave1_0;
}(_ASlave3.default);

exports.default = Slave1_0;
//# sourceMappingURL=Slave1_0.js.map
