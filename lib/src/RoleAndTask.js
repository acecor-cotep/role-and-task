'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _CONSTANT = require('./Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _Utils = require('./Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Errors = require('./Utils/Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

var _RoleHandler = require('./RoleSystem/Handlers/RoleHandler.js');

var _RoleHandler2 = _interopRequireDefault(_RoleHandler);

var _PromiseCommandPattern = require('./Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = null;

/**
 * Class which is the interface with the library user
 */

var RoleAndTask = function () {
  /**
   * Constructor working the Singleton way
   */
  function RoleAndTask() {
    (0, _classCallCheck3.default)(this, RoleAndTask);

    if (instance) return instance;

    //
    // Mandatory to fill
    //

    // Set the Master Slave Configuration File to load
    this.launchMasterSlaveConfigurationFile = false;

    // Path to the entry point of your program, we use to pop a new slave
    this.pathToEntryFile = false;

    // The task we use to perform the displays : The task must be in master! If no task is provided here, the display is made to stdout
    this.displayTask = false;

    //
    // Options
    //

    // Are we displaying the logs ?
    this.displayLog = true;

    // Do we makes the error to be fatal ? One error -> Exit
    this.makesErrorFatal = _CONSTANT2.default.MAKES_ERROR_FATAL;

    // Do we consider warning as errors ?
    this.considerWarningAsErrors = _CONSTANT2.default.CONSIDER_WARNING_AS_ERRORS;

    // The amount of time a master wait for a slave message before to timeout
    this.masterMessageWaitingTimeout = _CONSTANT2.default.MASTER_MESSAGE_WAITING_TIMEOUT;

    // The amount of time a master wait for a slave message to acknowledge the state change before to timeout
    this.masterMessageWaitingTimeoutStateChange = _CONSTANT2.default.MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE;

    // The amount of time a master wait for a slave message before to timeout
    this.masterMessageWaitingTimeoutStopTask = _CONSTANT2.default.MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK;

    //
    //

    // Contains all the tasks referenced
    this.tasks = [].concat((0, _toConsumableArray3.default)((0, _keys2.default)(_CONSTANT2.default.DEFAULT_TASK).map(function (x) {
      return _CONSTANT2.default.DEFAULT_TASK[x];
    }))).filter(function (x) {
      return x.id !== -1;
    });

    // Contains all the roles referenced
    this.roles = [].concat((0, _toConsumableArray3.default)((0, _keys2.default)(_CONSTANT2.default.DEFAULT_ROLES).map(function (x) {
      return _CONSTANT2.default.DEFAULT_ROLES[x];
    }))).filter(function (x) {
      return x.id !== -1;
    });

    // Contains all the states the system can have
    this.states = [].concat((0, _toConsumableArray3.default)((0, _keys2.default)(_CONSTANT2.default.DEFAULT_STATES).map(function (x) {
      return _CONSTANT2.default.DEFAULT_STATES[x];
    })));

    // Array where we store the functions to call when the state change
    this.stateChangeCallbacks = [];

    // The state of program patform
    this.programState = _CONSTANT2.default.DEFAULT_STATES.LAUNCHING;

    // All the orders in a row to change the program state
    this.programStateChangeWaitingList = [];

    // When poping a new process, we start it using a "launching mode", there are two basic launching mode for "slave" and "master"
    // You can set up a custom launching mode
    this.customLaunchingMode = [];

    // Are we quitting?
    this.quitOrder = false;

    // Contains the functions to call to validate mutex take and release in master/slave protocol
    this.masterMutexValidationFunctions = [];

    // Handle the signals
    this.handleSignals();

    instance = this;

    return instance;
  }

  //
  // PRIVATE METHODS
  //

  /**
   * Get the good element to treat (Look at specific behavior described into lookAtProgramStateChangePipe comment)
   * (If there is actually something in progress, do nothing)
   */


  (0, _createClass3.default)(RoleAndTask, [{
    key: 'getProgramStateChangeToTreat',
    value: function getProgramStateChangeToTreat() {
      // No change to perform
      if (!this.programStateChangeWaitingList.length) return false;

      var inProgress = false;
      var errorElement = false;

      this.programStateChangeWaitingList.some(function (x) {
        // We do nothing if something is in progress exept if error
        if (x.inProgress) inProgress = true;

        if (x.programState.id === _CONSTANT2.default.DEFAULT_STATES.ERROR.id) {
          errorElement = x;

          return true;
        }

        return false;
      });

      // Error comes first
      if (errorElement) return errorElement;

      // Then in progress
      if (inProgress) return false;

      // Then regular
      return this.programStateChangeWaitingList[0];
    }

    /**
     * Some program element got treated, remove them from the pipe
     * @param {Object} elem
     */

  }, {
    key: 'programChangeElementGotTreated',
    value: function programChangeElementGotTreated(elem) {
      this.programStateChangeWaitingList = this.programStateChangeWaitingList.filter(function (x) {
        return x !== elem;
      });

      // look if there is something else to do
      this.lookAtProgramStateChangePipe();
    }

    /**
     * Send the message saying the state change to whom is interested to know
     */

  }, {
    key: 'spreadStateToListener',
    value: function spreadStateToListener() {
      var _this = this;

      this.stateChangeCallbacks.forEach(function (_ref) {
        var callback = _ref.callback;

        (0, _setImmediate3.default)(function () {
          return callback(_this.states.find(function (x) {
            return x.id === _this.programState.id;
          }));
        }, 0);
      });
    }

    /**
     * Look at the programStateChangeWaitingList array, and perform an program state change if we need to
     * Specific behavior:
     *
     * (1) Error change state always pass first
     * (2) When you want to change the state as something already true, resolve() directly
     */

  }, {
    key: 'lookAtProgramStateChangePipe',
    value: function lookAtProgramStateChangePipe() {
      var _this2 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var elementToTreat, oldProgramState, role, ret;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    elementToTreat = _this2.getProgramStateChangeToTreat();

                    // Nothing to do

                    if (elementToTreat) {
                      _context.next = 3;
                      break;
                    }

                    return _context.abrupt('return', false);

                  case 3:

                    elementToTreat.inProgress = true;

                    // If the state is already the good one

                    if (!(elementToTreat.programState.id === _this2.programState.id)) {
                      _context.next = 7;
                      break;
                    }

                    // Resolve the program change as a success
                    elementToTreat.resolve();

                    return _context.abrupt('return', _this2.programChangeElementGotTreated(elementToTreat));

                  case 7:
                    oldProgramState = _this2.programState;


                    _this2.programState = elementToTreat.programState;

                    _context.prev = 9;
                    _context.next = 12;
                    return _this2.getSlaveNorMaster();

                  case 12:
                    role = _context.sent;

                    if (!(role.id === _CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id)) {
                      _context.next = 20;
                      break;
                    }

                    _context.next = 16;
                    return role.handleProgramStateChange(elementToTreat.programState, oldProgramState);

                  case 16:
                    ret = _context.sent;


                    // Say to everyone which is listening that the state changed
                    _this2.spreadStateToListener();

                    elementToTreat.resolve(ret);

                    return _context.abrupt('return', _this2.programChangeElementGotTreated(elementToTreat));

                  case 20:

                    // Say to everyone which is listening that the state changed
                    _this2.spreadStateToListener();

                    // If we are the slave - Do nothing else here (we just set the this.programState)
                    elementToTreat.resolve();

                    return _context.abrupt('return', _this2.programChangeElementGotTreated(elementToTreat));

                  case 25:
                    _context.prev = 25;
                    _context.t0 = _context['catch'](9);

                    elementToTreat.reject(_context.t0);

                    return _context.abrupt('return', _this2.programChangeElementGotTreated(elementToTreat));

                  case 29:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2, [[9, 25]]);
          }));

          return function func() {
            return _ref2.apply(this, arguments);
          };
        }()
      });
    }

    //
    // PUBLIC METHODS
    //

    /**
     * Singleton getter
     */

  }, {
    key: 'boot',


    /**
     * Launch the system
     *
     * We have to load dynamically systemBoot to avoid recursive import
     */
    value: function boot() {
      var SystemBoot = require('./systemBoot/systemBoot.js').default;

      this.systemBoot = new SystemBoot().initialization();

      // Get the instances of the roles class before to push it into the roleHandler
      this.roles = this.roles.map(function (x) {
        return (0, _extends3.default)({}, x, {

          obj: x.class.getInstance()
        });
      });

      // Initialize the role handler in here
      this.roleHandler = new _RoleHandler2.default(this.roles);

      this.systemBoot.launch(this.launchMasterSlaveConfigurationFile);

      this.startDate = new Date();
    }

    /**
     * Launch the system ** can be called static **
     */

  }, {
    key: 'subscribeToStateChange',


    /**
     * Subscribe to the state change. Returns the descriptor to use to unsubscribe
     */
    value: function subscribeToStateChange(callback) {
      var descriptor = _Utils2.default.generateLittleID();

      this.stateChangeCallbacks.push({
        callback: callback,
        descriptor: descriptor
      });

      return descriptor;
    }

    /**
     * Unsubscribe to state change, passing the descriptor returned by subscribe function
     */

  }, {
    key: 'unSubscribeToStateChange',
    value: function unSubscribeToStateChange(descriptor) {
      this.stateChangeCallbacks = this.stateChangeCallbacks.filter(function (x) {
        return x.descriptor !== descriptor;
      });
    }

    /**
     * Declare a new launching mode for processes
     *
     * Basics launching mode are 'slave' and 'master'.
     *
     * > If you want a custom Role maybe you would implement your curstom launching mode
     */

  }, {
    key: 'declareLaunchingMode',
    value: function declareLaunchingMode(name, func) {
      this.customLaunchingMode.push({
        name: name,
        func: func
      });
    }

    /**
     * Remove a custom launching mode
     */

  }, {
    key: 'unDeclareLaunchingMode',
    value: function unDeclareLaunchingMode(name) {
      this.customLaunchingMode = this.customLaunchingMode.filter(function (x) {
        return x.name !== name;
      });
    }

    /**
     * Declare a new state
     *
     * {
     *   name: String,
     *   id: String,
     * }
     */

  }, {
    key: 'declareState',
    value: function declareState(stateConfiguration) {
      this.states.push(stateConfiguration);
    }

    /**
     * Declare a new Role
     *
     * {
     *   name: String,
     *   id: String,
     *   class: ARole,
     * }
     */

  }, {
    key: 'declareRole',
    value: function declareRole(roleConfiguration) {
      this.roles.push(roleConfiguration);
    }

    /**
     * Declare the given task to the task system
     *
     * {
     *   id: Number,
     *   name: String,
     *   color: String,
     *   closureHierarchy: Number,
     *   idsAllowedRole: [String],
     *   obj: ATask,
     *
     *   // Only works if the task is started in master
     *   notifyAboutArchitectureChange: Boolean,
     * }
     */

  }, {
    key: 'declareTask',
    value: function declareTask(taskConfiguration) {
      this.tasks.push(taskConfiguration);
    }

    /**
     * Remove the task from the task list using the task id
     */

  }, {
    key: 'removeTask',
    value: function removeTask(taskName) {
      this.tasks = this.tasks.filter(function (x) {
        return x.id !== taskName;
      });
    }

    /**
     * Get the tasks related to the given role id
     */

  }, {
    key: 'getRoleTasks',
    value: function getRoleTasks(idRole) {
      return this.tasks.filter(function (x) {
        return x.idsAllowedRole.includes(idRole);
      });
    }

    /**
     * Get the roles configuration
     */

  }, {
    key: 'getRoles',
    value: function getRoles() {
      return this.roles.map(function (x) {
        if (x.id === -1) return false;

        return (0, _extends3.default)({}, x, {

          obj: x.class.getInstance()
        });
      }).filter(function (x) {
        return x;
      });
    }

    /**
     * Get the actual running role
     */

  }, {
    key: 'getActualRole',
    value: function getActualRole(possibilities, i) {
      var _this3 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            var role;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(i >= possibilities.length)) {
                      _context2.next = 2;
                      break;
                    }

                    throw new _Errors2.default('EXXXX', 'No role available');

                  case 2:
                    _context2.next = 4;
                    return _this3.roleHandler.getRole(possibilities[i]);

                  case 4:
                    role = _context2.sent;

                    if (role.isActive()) {
                      _context2.next = 7;
                      break;
                    }

                    return _context2.abrupt('return', false);

                  case 7:
                    return _context2.abrupt('return', role);

                  case 8:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this3);
          }));

          return function func() {
            return _ref3.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Get the slave role nor the master
     * Take the first that is active
     */

  }, {
    key: 'getSlaveNorMaster',
    value: function getSlaveNorMaster() {
      var _this4 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _Utils2.default.promiseCallUntilTrue({
            functionToCall: _this4.getActualRole,
            context: _this4,

            args: [_this4.roles.map(function (x) {
              return x.id;
            })]
          });
        }
      });
    }

    /**
     * Change the program state
     * Role master: Set this.programState & spread the news to itselfs tasks and slaves
     * Role slate: Set the this.programState
     */

  }, {
    key: 'changeProgramState',
    value: function changeProgramState(idProgramState) {
      var _this5 = this;

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return new _promise2.default(function (resolve, reject) {
            // Push the order in the list of state change to perform
            _this5.programStateChangeWaitingList.push({
              resolve: resolve,
              reject: reject,
              programState: _this5.states.find(function (x) {
                return x.id === idProgramState;
              }),
              inProgress: false
            });

            _this5.lookAtProgramStateChangePipe();
          });
        }
      });
    }

    /**
     * Get the name of the task who asked for the display
     */

  }, {
    key: 'displayMessage',


    /**
     * Handle the display message throught the slaves and master
     * If we are master we display the message
     * If we are a slave we give the messsage to the master
     * @param {Object} param
     */
    value: function displayMessage(param) {
      var _this6 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var role, isString, newParam;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.prev = 0;
                    _context3.next = 3;
                    return _this6.getSlaveNorMaster();

                  case 3:
                    role = _context3.sent;


                    // Handle the fact we are trying to display an object
                    isString = _Utils2.default.isAString(param.str);

                    if (!isString) {
                      _context3.next = 7;
                      break;
                    }

                    return _context3.abrupt('return', role.displayMessage((0, _extends3.default)({}, param, {

                      // Add the task who perform the display
                      from: RoleAndTask.getTheTaskWhoPerformTheDisplay(role),

                      time: Date.now()
                    })));

                  case 7:
                    newParam = (0, _extends3.default)({}, param, {

                      // Add the task who perform the display
                      from: RoleAndTask.getTheTaskWhoPerformTheDisplay(role),

                      time: Date.now()
                    });


                    newParam.str = (0, _stringify2.default)(newParam.str, null, 2);

                    // Add here the task who performed the display and the time of it

                    return _context3.abrupt('return', role.displayMessage(newParam));

                  case 12:
                    _context3.prev = 12;
                    _context3.t0 = _context3['catch'](0);
                    return _context3.abrupt('return', false);

                  case 15:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this6, [[0, 12]]);
          }));

          return function func() {
            return _ref4.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Here we come when an error happened on the system and we want to deal with it,
     * If we are the master, we tell ourselves about it
     * If we are a slave or ... we tell the master about it
     */

  }, {
    key: 'errorHappened',
    value: function errorHappened(err) {
      var _this7 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var role;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    // Error happens
                    _Utils2.default.displayMessage({
                      str: String(err && err.stack || err),

                      out: process.stderr
                    });

                    _context4.prev = 1;
                    _context4.next = 4;
                    return _this7.getSlaveNorMaster();

                  case 4:
                    role = _context4.sent;

                    if (!(role.id !== _CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id)) {
                      _context4.next = 7;
                      break;
                    }

                    return _context4.abrupt('return', role.tellMasterErrorHappened(err));

                  case 7:
                    _context4.prev = 7;
                    _context4.next = 10;
                    return _this7.changeProgramState(_CONSTANT2.default.DEFAULT_STATES.ERROR.id);

                  case 10:

                    // We did sent the message :)
                    // Display the error message
                    _this7.displayMessage({
                      str: String(err && err.stack || err),

                      tags: [_CONSTANT2.default.MESSAGE_DISPLAY_TAGS.ERROR]
                    });

                    // If the errors are supposed to be fatal, exit!
                    if (RoleAndTask.getInstance().makesErrorFatal) {
                      RoleAndTask.exitProgramUnproperDueToError();
                    }
                    _context4.next = 18;
                    break;

                  case 14:
                    _context4.prev = 14;
                    _context4.t0 = _context4['catch'](7);

                    // We exit PROGRAM, nothing more we can do
                    // We locally display the error so it will finish into the node-error.log file
                    RoleAndTask.exitProgramMsg('Exit program unproper ERROR HAPPENED', err, _context4.t0);

                    // We use setTimeout tho if there is some others things to do before the quit it will
                    RoleAndTask.exitProgramUnproperDueToError();

                  case 18:
                    _context4.next = 24;
                    break;

                  case 20:
                    _context4.prev = 20;
                    _context4.t1 = _context4['catch'](1);

                    RoleAndTask.exitProgramMsg('Exit program unproper ERROR HAPPENED CATCH', err, _context4.t1);

                    // We use setTimeout tho if there is some others things to do before the quit it will
                    RoleAndTask.exitProgramUnproperDueToError();

                  case 24:
                    return _context4.abrupt('return', false);

                  case 25:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, _this7, [[1, 20], [7, 14]]);
          }));

          return function func() {
            return _ref5.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Display messages about exiting program in errorHappened
     */

  }, {
    key: 'makeTheMasterToQuitEverySlaveAndTask',


    /**
     * Make the master to quit every slaves and every task
     * DO NOT QUIT THE APP
     */
    value: function makeTheMasterToQuitEverySlaveAndTask() {
      var _this8 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            var role;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!_this8.quitOrder) {
                      _context5.next = 2;
                      break;
                    }

                    return _context5.abrupt('return', false);

                  case 2:

                    _this8.quitOrder = true;

                    _context5.next = 5;
                    return _this8.getSlaveNorMaster();

                  case 5:
                    role = _context5.sent;

                    if (!(role.id !== _CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id)) {
                      _context5.next = 8;
                      break;
                    }

                    throw new _Errors2.default('EXXXX', 'Closure not possible in a slave');

                  case 8:
                    _context5.next = 10;
                    return _this8.changeProgramState(_CONSTANT2.default.DEFAULT_STATES.CLOSE.id);

                  case 10:
                    return _context5.abrupt('return', _this8.quit());

                  case 11:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, _this8);
          }));

          return function func() {
            return _ref6.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Properly quit the app if we are on master
     * Ignore if we are inside something else
     */

  }, {
    key: 'makeTheMasterToQuitTheWholeApp',
    value: function makeTheMasterToQuitTheWholeApp() {
      var _this9 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            var quit;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (!(_this9.programState.id === _CONSTANT2.default.DEFAULT_STATES.LAUNCHING.id)) {
                      _context6.next = 3;
                      break;
                    }

                    _this9.displayMessage({
                      str: 'Cannot close PROGRAM when the state is LAUNCHING'
                    });

                    return _context6.abrupt('return');

                  case 3:
                    _context6.prev = 3;
                    _context6.next = 6;
                    return _this9.makeTheMasterToQuitEverySlaveAndTask();

                  case 6:
                    quit = _context6.sent;


                    if (quit) RoleAndTask.exitProgramGood();

                    // Do nothing if quit equal to false
                    // ...
                    _context6.next = 13;
                    break;

                  case 10:
                    _context6.prev = 10;
                    _context6.t0 = _context6['catch'](3);

                    RoleAndTask.getInstance().errorHappened(_context6.t0);

                  case 13:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this9, [[3, 10]]);
          }));

          return function func() {
            return _ref7.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * We exit PROGRAM unproperly due to an error that can't be fixed regulary
     * (Ex: lose the communication between the slave and the master and we are the slave)
     */

  }, {
    key: 'handleSignals',


    /**
     * Handle signals
     */
    value: function handleSignals() {
      var _this10 = this;

      // Exit PROGRAM properly
      var signalActionProper = function () {
        var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
          var role;
          return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return _this10.getSlaveNorMaster();

                case 2:
                  role = _context7.sent;

                  if (!(role.id !== _CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id)) {
                    _context7.next = 5;
                    break;
                  }

                  return _context7.abrupt('return');

                case 5:

                  _this10.makeTheMasterToQuitTheWholeApp();

                case 6:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, _this10);
        }));

        return function signalActionProper() {
          return _ref8.apply(this, arguments);
        };
      }();

      // Exit PROGRAM unproperly
      var signalActionUnproper = function signalActionUnproper() {
        RoleAndTask.exitProgramUnproperDueToError();
      };

      (0, _keys2.default)(_CONSTANT2.default.SIGNAL).forEach(function (x) {
        process.on(_CONSTANT2.default.SIGNAL[x], function () {
          return signalActionProper();
        });
      });

      (0, _keys2.default)(_CONSTANT2.default.SIGNAL_UNPROPER).forEach(function (x) {
        process.on(_CONSTANT2.default.SIGNAL_UNPROPER[x], function () {
          return signalActionUnproper();
        });
      });
    }

    /**
     * Spread data to every tasks we locally hold
     * @param {{dataName: String, data: Object, timestamp: Date, limitToTaskList: [String] | false}} args
     */

  }, {
    key: 'spreadDataToEveryLocalTask',
    value: function spreadDataToEveryLocalTask(_ref9) {
      var _this11 = this;

      var dataName = _ref9.dataName,
          data = _ref9.data,
          timestamp = _ref9.timestamp,
          limitToTaskList = _ref9.limitToTaskList;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            var role;
            return _regenerator2.default.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.prev = 0;
                    _context8.next = 3;
                    return _this11.getSlaveNorMaster();

                  case 3:
                    role = _context8.sent;


                    role.getTaskHandler().getAllActiveTasks().forEach(function (x) {
                      // Do not tell the tasks that do not require to know
                      if (!limitToTaskList || limitToTaskList.some(function (y) {
                        return x.id === y;
                      })) {
                        // Make it asynchronous!
                        setTimeout(function () {
                          x.consumeNewsData(dataName, data, timestamp);
                        }, 0);
                      }
                    });
                    _context8.next = 10;
                    break;

                  case 7:
                    _context8.prev = 7;
                    _context8.t0 = _context8['catch'](0);

                    _this11.errorHappened(_context8.t0);

                  case 10:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this11, [[0, 7]]);
          }));

          return function func() {
            return _ref10.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * THIS METHOD WORK ONLY IN THE MASTER
     * (It get called by HandleProgramTask)
     *
     * It returns in an array the whole system pids (Master + Slaves processes)
     */

  }, {
    key: 'getFullSystemPids',
    value: function getFullSystemPids() {
      var _this12 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
            var role;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return _this12.getMasterRole();

                  case 2:
                    role = _context9.sent;
                    return _context9.abrupt('return', role.getFullSystemPids());

                  case 4:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, _this12);
          }));

          return function func() {
            return _ref11.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Get the master role (error if we are not in master role process)
     */

  }, {
    key: 'getMasterRole',
    value: function getMasterRole() {
      var _this13 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
            var roleMaster;
            return _regenerator2.default.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2;
                    return _this13.getRoleHandler().getRole(_CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id);

                  case 2:
                    roleMaster = _context10.sent;

                    if (roleMaster.isActive()) {
                      _context10.next = 5;
                      break;
                    }

                    throw new _Errors2.default('EXXXX', 'Master is not active in getMasterRole');

                  case 5:
                    return _context10.abrupt('return', roleMaster);

                  case 6:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, _callee10, _this13);
          }));

          return function func() {
            return _ref12.apply(this, arguments);
          };
        }()
      });
    }

    // Getter

  }, {
    key: 'getRoleHandler',
    value: function getRoleHandler() {
      return this.roleHandler;
    }

    /**
     * Quit everything that is open
     *
     * Including:
     *
     * -> Close the role (Slave or Master)
     * ----> If slave: Close its running tasks
     * ----> If master: Close all the slaves
     */

  }, {
    key: 'quit',
    value: function quit() {
      var _this14 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
            var role;
            return _regenerator2.default.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    _context11.next = 2;
                    return _this14.getSlaveNorMaster();

                  case 2:
                    role = _context11.sent;
                    _context11.next = 5;
                    return role.stop();

                  case 5:
                    return _context11.abrupt('return', true);

                  case 6:
                  case 'end':
                    return _context11.stop();
                }
              }
            }, _callee11, _this14);
          }));

          return function func() {
            return _ref13.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Declare a new Role
     *
     * {
     *   name: String,
     *   id: String,
     *   class: ARole,
     * }
     */

  }, {
    key: 'setConfiguration',


    /**
     * Set the configuration through one function
     *
     * Returns the list of the configuration that has been accepted and setted
     */
    value: function setConfiguration(opts) {
      var _this15 = this;

      var availableOpts = ['displayTask', 'launchMasterSlaveConfigurationFile', 'pathToEntryFile', 'displayLog', 'makesErrorFatal', 'considerWarningAsErrors', 'masterMessageWaitingTimeout', 'masterMessageWaitingTimeoutStateChange', 'masterMessageWaitingTimeoutStopTask'];

      var setted = (0, _keys2.default)(opts).reduce(function (tmp, x) {
        // Unknown key
        if (!availableOpts.includes(x)) return tmp;

        // Set the option value
        _this15[x] = opts[x];

        tmp[x] = opts[x];

        return tmp;
      }, {});

      // Display the options that has been setted up
      this.displayMessage({
        str: 'role-and-task : Following options has been setted up : '
      });

      this.displayMessage({
        str: setted
      });

      return setted;
    }

    /**
     * In master/slave protocol, we ask to get a token
     *
     * SHORTCUT
     */

  }, {
    key: 'takeMutex',
    value: function takeMutex(id) {
      var _this16 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
            var role;
            return _regenerator2.default.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    _context12.next = 2;
                    return _this16.getSlaveNorMaster();

                  case 2:
                    role = _context12.sent;
                    return _context12.abrupt('return', role.takeMutex(id));

                  case 4:
                  case 'end':
                    return _context12.stop();
                }
              }
            }, _callee12, _this16);
          }));

          return function func() {
            return _ref14.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * In master/slave protocol, we ask to release the token
     *
     * SHORTCUT
     */

  }, {
    key: 'releaseMutex',
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(id) {
        var _this17 = this;

        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                return _context14.abrupt('return', new _PromiseCommandPattern2.default({
                  func: function () {
                    var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
                      var role;
                      return _regenerator2.default.wrap(function _callee13$(_context13) {
                        while (1) {
                          switch (_context13.prev = _context13.next) {
                            case 0:
                              _context13.next = 2;
                              return _this17.getSlaveNorMaster();

                            case 2:
                              role = _context13.sent;
                              return _context13.abrupt('return', role.releaseMutex(id));

                            case 4:
                            case 'end':
                              return _context13.stop();
                          }
                        }
                      }, _callee13, _this17);
                    }));

                    return function func() {
                      return _ref16.apply(this, arguments);
                    };
                  }()
                }));

              case 1:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function releaseMutex(_x) {
        return _ref15.apply(this, arguments);
      }

      return releaseMutex;
    }()

    /**
     * Contains the functions to call to validate mutex take and release in master/slave protocol
     */

  }, {
    key: 'getMasterMutexFunctions',
    value: function getMasterMutexFunctions() {
      return this.masterMutexValidationFunctions;
    }

    /**
     * Add a function to be called when a user want to take the Mutex related to the given id
     *
     * The function have to throw an error if the token cannot be taken, if it goes well, consider the mutex to be taken
     */

  }, {
    key: 'addMasterMutexFunctions',
    value: function addMasterMutexFunctions(id, funcTake, funcRelease) {
      this.masterMutexValidationFunctions.push({
        id: id,
        funcTake: funcTake,
        funcRelease: funcRelease
      });
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      return instance || new RoleAndTask();
    }
  }, {
    key: 'boot',
    value: function boot() {
      RoleAndTask.getInstance().boot();
    }
  }, {
    key: 'getTheTaskWhoPerformTheDisplay',
    value: function getTheTaskWhoPerformTheDisplay(role) {
      var activeTasks = role.getTaskHandler().getAllActiveTasks();

      if (!activeTasks.length) return '' + process.pid;

      return activeTasks[0].name;
    }
  }, {
    key: 'exitProgramMsg',
    value: function exitProgramMsg(txt, err, e) {
      // We exit PROGRAM, nothing more we can do
      _Utils2.default.displayMessage({
        str: String(err && err.stack || err),
        out: process.stderr
      });

      // We locally display the error so it will finish into the node-error.log file
      _Utils2.default.displayMessage({
        str: String(e),
        out: process.stderr
      });

      _Utils2.default.displayMessage({
        str: 'Exit program unproper ERROR HAPPENED CATCH',
        out: process.stderr
      });
    }
  }, {
    key: 'exitProgramUnproperDueToError',
    value: function exitProgramUnproperDueToError() {
      // Exit after a timeout to let the system makes the displays
      setTimeout(function () {
        return process.exit(1);
      }, _CONSTANT2.default.TIMEOUT_LEAVE_PROGRAM_UNPROPER);
    }

    /**
     * We exit PROGRAM when everything had been closed the right way
     */

  }, {
    key: 'exitProgramGood',
    value: function exitProgramGood() {
      _Utils2.default.displayMessage({
        str: 'Exit program good',
        out: process.stderr
      });

      process.exit(0);
    }
  }, {
    key: 'declareRole',
    value: function declareRole(roleConfiguration) {
      this.getInstance().declareRole(roleConfiguration);
    }

    /**
     * Declare a new State in addition of the defaults ones
     *
     * {
     *   name: String,
     *   id: String,
     * }
     */

  }, {
    key: 'declareState',
    value: function declareState(stateConfiguration) {
      this.getInstance().declareState(stateConfiguration);
    }

    /**
     * Declare the given task to the task system
     *
     * {
     *   id: Number,
     *   name: String,
     *   color: String,
     *   closureHierarchy: Number,
     *   idsAllowedRole: [Number],
     *   obj: ATask,
     *
     *   // Only works if the task is started in master
     *   notifyAboutArchitectureChange: Boolean,
     * }
     */

  }, {
    key: 'declareTask',
    value: function declareTask(taskConfiguration) {
      this.getInstance().declareTask(taskConfiguration);
    }

    /**
     * Remove the task from the task list using the task id
     */

  }, {
    key: 'removeTask',
    value: function removeTask(taskName) {
      this.getInstance().removeTask(taskName);
    }
  }]);
  return RoleAndTask;
}();

exports.default = RoleAndTask;
//# sourceMappingURL=RoleAndTask.js.map
