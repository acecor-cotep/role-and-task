'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Utils = require('../Utils/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Errors = require('../Utils/Errors.js');

var _Errors2 = _interopRequireDefault(_Errors);

var _CONSTANT = require('../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _RoleAndTask = require('../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

var _PromiseCommandPattern = require('../Utils/PromiseCommandPattern.js');

var _PromiseCommandPattern2 = _interopRequireDefault(_PromiseCommandPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalClass = function () {
  function LocalClass() {
    (0, _classCallCheck3.default)(this, LocalClass);
  }

  (0, _createClass3.default)(LocalClass, null, [{
    key: 'startMasterRoleOnCurrentProcess',

    /**
     * Start the master role on current process
     */
    value: function startMasterRoleOnCurrentProcess(roleHandler, optionsMaster) {
      var _this = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var role;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return roleHandler.getRole(_CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id);

                  case 2:
                    role = _context.sent;


                    // Role here is a AMaster so we can use method of it
                    role.setPathToEntryFile(_RoleAndTask2.default.getInstance().getPathToEntryFile());

                    role.setDisplayTask(_RoleAndTask2.default.getInstance().getDisplayTask());

                    // Start the master on the current process
                    _context.next = 7;
                    return roleHandler.startRole(_CONSTANT2.default.DEFAULT_ROLES.MASTER_ROLE.id, optionsMaster);

                  case 7:
                    return _context.abrupt('return', role);

                  case 8:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this);
          }));

          return function func() {
            return _ref.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Start all given task for the given slave
     * @param {Object} masterRole
     * @param {Object} slave
     * @param {[{ id: String, args: Object }]} tasks
     */

  }, {
    key: 'startXTasksForSlave',
    value: function startXTasksForSlave(masterRole, slave, tasks) {
      // Start a tasks
      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _promise2.default.all(tasks.map(function (x) {
            return masterRole.startTaskToSlave(slave.eliotIdentifier, x.id, x.args);
          }));
        }
      });
    }

    /**
     * Add a new slaves with the given tasks on it
     * @param {Object} masterRole
     * @param {[{ id: String, args: Object }]} tasks
     */

  }, {
    key: 'addNewSlaveWithGivenTasks',
    value: function addNewSlaveWithGivenTasks(masterRole) {
      var _this2 = this;

      var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            var slave;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return masterRole.startNewSlave();

                  case 2:
                    slave = _context2.sent;
                    _context2.next = 5;
                    return LocalClass.startXTasksForSlave(masterRole, slave, tasks);

                  case 5:
                    return _context2.abrupt('return', slave);

                  case 6:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this2);
          }));

          return function func() {
            return _ref2.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Start all given task for the master
     * @param {Object} masterRole
     * @param {[{ id: String, args: Object }]} tasks
     */

  }, {
    key: 'startXTasksForMaster',
    value: function startXTasksForMaster(masterRole) {
      var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _promise2.default.all(tasks.map(function (x) {
            return masterRole.startTask(x.id, x.args);
          }));
        }
      });
    }

    /**
     * Start multiple slaves and theirs related tasks
     *
     * @param {Object} masterRole
     * @param {[{
     *       name: String,
     *       tasks: [{
     *          id: String,
     *          args: {},
     *       }],
     *    }]} slaves
     *
     * ret => [{
     *    slave: Object,
     *    name: String,
     * }]
     */

  }, {
    key: 'startMultipleSlavesAndTheirsTasks',
    value: function startMultipleSlavesAndTheirsTasks(masterRole, slaves) {
      var _this3 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var rets;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return _promise2.default.all(slaves.map(function (x) {
                      return LocalClass.addNewSlaveWithGivenTasks(masterRole, x.tasks);
                    }));

                  case 2:
                    rets = _context3.sent;
                    return _context3.abrupt('return', rets.map(function (x, xi) {
                      return {
                        slave: x,
                        name: slaves[xi].name
                      };
                    }));

                  case 4:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this3);
          }));

          return function func() {
            return _ref3.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Connect all tasks to each othes following the configuration
     * @param {Object} masterRole
     *
     *  @param {[{
     *    slave: Object,
     *    name: String,
     * }]} slaves
     *
     * @param {[{
     *        id_task_server: String,
     *        name_slave_client: String,
     *        id_task_client: String,
     *        args: {},
     *    }]} taskConnect
     */

  }, {
    key: 'connectTasksTogethers',
    value: function connectTasksTogethers(masterRole, slaves, tasksConnects) {
      return new _PromiseCommandPattern2.default({
        func: function func() {
          return _Utils2.default.executePromiseQueue(tasksConnects.map(function (x) {
            return {
              functionToCall: LocalClass.connectOneTaskWithAnOther,

              context: LocalClass,

              args: [masterRole, slaves, x]
            };
          }));
        }
      });
    }

    /**
     * Connect one task
     */

  }, {
    key: 'connectOneTaskWithAnOther',
    value: function connectOneTaskWithAnOther(masterRole, slaves, taskConnect) {
      var _this4 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var goodSlaveClient;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    goodSlaveClient = slaves.find(function (x) {
                      return x.name === taskConnect.name_slave_client;
                    });

                    // If the configuration is bad
                    // EMPTY FIELD MEANS THE CLIENT IS THE MASTER

                    if (!(!goodSlaveClient && taskConnect.name_slave_client !== '')) {
                      _context4.next = 3;
                      break;
                    }

                    throw new _Errors2.default('EXXXX', 'Bad task connection configuration');

                  case 3:
                    if (goodSlaveClient) {
                      _context4.next = 5;
                      break;
                    }

                    return _context4.abrupt('return', masterRole.connectMasterToTask(taskConnect.id_task_client, taskConnect.id_task_server, taskConnect.args));

                  case 5:
                    return _context4.abrupt('return', masterRole.connectTaskToTask(goodSlaveClient && goodSlaveClient.slave.eliotIdentifier || false, taskConnect.id_task_client, taskConnect.id_task_server, taskConnect.args));

                  case 6:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, _this4);
          }));

          return function func() {
            return _ref4.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Check the configuration file
     * @param {String} conf
     */

  }, {
    key: 'checkConfigurationFile',
    value: function checkConfigurationFile(conf) {
      var _this5 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            var checkTask;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    checkTask = function checkTask(data) {
                      return !data.some(function (task) {
                        return [function () {
                          return _Utils2.default.isAJSON(task);
                        }, function () {
                          return _Utils2.default.isAString(task.id);
                        }, function () {
                          return _Utils2.default.isAJSON(task.args);
                        }].some(function (x) {
                          return !x();
                        });
                      });
                    };

                    //
                    //  We perform sequentials checks
                    //  (Same as if/if/if/if/if/if... but much more sexier 8D )


                    [function () {
                      return _Utils2.default.isAJSON(conf.master);
                    }, function () {
                      return _Utils2.default.isAnArray(conf.slaves);
                    }, function () {
                      return _Utils2.default.isAnArray(conf.task_connect);
                    },

                    //
                    // Master body
                    //
                    function () {
                      return _Utils2.default.isAJSON(conf.master.options);
                    }, function () {
                      return _Utils2.default.isAnArray(conf.master.tasks);
                    },

                    // Master -> Tasks
                    function () {
                      return checkTask(conf.master.tasks);
                    },

                    //
                    // Slaves body
                    //
                    function () {
                      return !conf.slaves.some(function (slave) {
                        return [function () {
                          return _Utils2.default.isAJSON(slave);
                        }, function () {
                          return _Utils2.default.isAString(slave.name);
                        }, function () {
                          return _Utils2.default.isAnArray(slave.tasks);
                        }, function () {
                          return checkTask(slave.tasks);
                        }].some(function (x) {
                          return !x();
                        });
                      });
                    },

                    //
                    // Task connect body
                    //
                    function () {
                      return !conf.task_connect.some(function (body) {
                        return [function () {
                          return _Utils2.default.isAJSON(body);
                        }, function () {
                          return _Utils2.default.isAString(body.id_task_server) && body.id_task_server.length > 0;
                        }, function () {
                          return _Utils2.default.isAString(body.name_slave_client);
                        }, function () {
                          return _Utils2.default.isAString(body.id_task_client) && body.id_task_client.length > 0;
                        }, function () {
                          return _Utils2.default.isAJSON(body.args);
                        }].some(function (x) {
                          return !x();
                        });
                      });
                    }].forEach(function (x, xi) {
                      // Put xi to debug in case
                      if (!x()) throw new _Errors2.default('E8092', '' + String(xi));
                    });

                    return _context5.abrupt('return', true);

                  case 3:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, _this5);
          }));

          return function func() {
            return _ref5.apply(this, arguments);
          };
        }()
      });
    }

    /**
     * Function to apply a master and slaves configuration to launch
     *
     * @param {Object} conf
     *
     * {
     *    // Master configuration
     *    master: {
     *       options: {},
     *       tasks: [{
     *         id: String,
     *         args: {},
     *       }, ...],
     *    },
     *    // Slaves configuration
     *    slaves: [{
     *       name: String,
     *       tasks: [{
     *          id: String,
     *          args: {},
     *       }, ...],
     *    }],
     *    // Define the connection between the slave/master tasks
     *    task_connect: [{
     *        id_task_server: String,
     *        name_slave_client: String,
     *        id_task_client: String,
     *        args: {},
     *    }],
     * }
     */

  }, {
    key: 'applyConfigurationMasterSlaveLaunch',
    value: function applyConfigurationMasterSlaveLaunch(conf) {
      var _this6 = this;

      return new _PromiseCommandPattern2.default({
        func: function () {
          var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            var roleHandler, masterRole, _ref7, _ref8, slaves;

            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    roleHandler = _RoleAndTask2.default.getInstance().getRoleHandler();

                    // Check the configuration to be good

                    _context6.next = 3;
                    return LocalClass.checkConfigurationFile(conf);

                  case 3:
                    _context6.next = 5;
                    return LocalClass.startMasterRoleOnCurrentProcess(roleHandler, conf.master.options);

                  case 5:
                    masterRole = _context6.sent;
                    _context6.next = 8;
                    return _promise2.default.all([
                    // Start the master tasks
                    LocalClass.startXTasksForMaster(masterRole, conf.master.tasks),

                    // Start all slaves and theirs tasks
                    LocalClass.startMultipleSlavesAndTheirsTasks(masterRole, conf.slaves)]);

                  case 8:
                    _ref7 = _context6.sent;
                    _ref8 = (0, _slicedToArray3.default)(_ref7, 2);
                    slaves = _ref8[1];
                    return _context6.abrupt('return', LocalClass.connectTasksTogethers(masterRole, slaves, conf.task_connect));

                  case 12:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this6);
          }));

          return function func() {
            return _ref6.apply(this, arguments);
          };
        }()
      });
    }
  }]);
  return LocalClass;
}();

// Export the function to use
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports


exports.default = function () {
  return LocalClass.applyConfigurationMasterSlaveLaunch.apply(LocalClass, arguments);
};
//# sourceMappingURL=applyConfigurationMasterSlaveLaunch.js.map
