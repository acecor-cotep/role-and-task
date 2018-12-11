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

var _CONSTANT = require('../Utils/CONSTANT/CONSTANT.js');

var _CONSTANT2 = _interopRequireDefault(_CONSTANT);

var _RoleAndTask = require('../RoleAndTask.js');

var _RoleAndTask2 = _interopRequireDefault(_RoleAndTask);

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
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(roleHandler, optionsMaster) {
        var role;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return roleHandler.getRole(_CONSTANT2.default.DEFAULT_ROLE.MASTER_ROLE.id);

              case 2:
                role = _context.sent;


                // Role here is a AMaster so we can use method of it
                role.setPathToEntryFile(_RoleAndTask2.default.getInstance().getPathToEntryFile());

                role.setDisplayTask(_RoleAndTask2.default.getInstance().getDisplayTask());

                // Start the master on the current process
                _context.next = 7;
                return roleHandler.startRole(_CONSTANT2.default.DEFAULT_ROLE.MASTER_ROLE.id, optionsMaster);

              case 7:
                return _context.abrupt('return', role);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function startMasterRoleOnCurrentProcess(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return startMasterRoleOnCurrentProcess;
    }()

    /**
     * Start all given task for the given slave
     * @param {Object} masterRole
     * @param {Object} slave
     * @param {[{ id: String, args: Object }]} tasks
     */

  }, {
    key: 'startXTasksForSlave',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(masterRole, slave, tasks) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', _promise2.default.all(tasks.map(function (x) {
                  return masterRole.startTaskToSlave(slave.eliotIdentifier, x.id, x.args);
                })));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function startXTasksForSlave(_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return startXTasksForSlave;
    }()

    /**
     * Add a new slaves with the given tasks on it
     * @param {Object} masterRole
     * @param {[{ id: String, args: Object }]} tasks
     */

  }, {
    key: 'addNewSlaveWithGivenTasks',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(masterRole) {
        var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var slave;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return masterRole.startNewSlave();

              case 2:
                slave = _context3.sent;
                _context3.next = 5;
                return LocalClass.startXTasksForSlave(masterRole, slave, tasks);

              case 5:
                return _context3.abrupt('return', slave);

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function addNewSlaveWithGivenTasks(_x6) {
        return _ref3.apply(this, arguments);
      }

      return addNewSlaveWithGivenTasks;
    }()

    /**
     * Start all given task for the master
     * @param {Object} masterRole
     * @param {[{ id: String, args: Object }]} tasks
     */

  }, {
    key: 'startXTasksForMaster',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(masterRole) {
        var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', _promise2.default.all(tasks.map(function (x) {
                  return masterRole.startTask(x.id, x.args);
                })));

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function startXTasksForMaster(_x8) {
        return _ref4.apply(this, arguments);
      }

      return startXTasksForMaster;
    }()

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
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(masterRole, slaves) {
        var rets;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _promise2.default.all(slaves.map(function (x) {
                  return LocalClass.addNewSlaveWithGivenTasks(masterRole, x.tasks);
                }));

              case 2:
                rets = _context5.sent;
                return _context5.abrupt('return', rets.map(function (x, xi) {
                  return {
                    slave: x,
                    name: slaves[xi].name
                  };
                }));

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function startMultipleSlavesAndTheirsTasks(_x10, _x11) {
        return _ref5.apply(this, arguments);
      }

      return startMultipleSlavesAndTheirsTasks;
    }()

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
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(masterRole, slaves, tasksConnects) {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', _Utils2.default.executePromiseQueue(tasksConnects.map(function (x) {
                  return {
                    functionToCall: LocalClass.connectOneTaskWithAnOther,

                    context: LocalClass,

                    args: [masterRole, slaves, x]
                  };
                })));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function connectTasksTogethers(_x12, _x13, _x14) {
        return _ref6.apply(this, arguments);
      }

      return connectTasksTogethers;
    }()

    /**
     * Connect one task
     */

  }, {
    key: 'connectOneTaskWithAnOther',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(masterRole, slaves, taskConnect) {
        var goodSlaveClient;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                goodSlaveClient = slaves.find(function (x) {
                  return x.name === taskConnect.name_slave_client;
                });

                // If the configuration is bad
                // EMPTY FIELD MEANS THE CLIENT IS THE MASTER

                if (!(!goodSlaveClient && taskConnect.name_slave_client !== '')) {
                  _context7.next = 3;
                  break;
                }

                throw new Error('EXXXX : Bad task connection configuration');

              case 3:
                if (goodSlaveClient) {
                  _context7.next = 5;
                  break;
                }

                return _context7.abrupt('return', masterRole.connectMasterToTask(taskConnect.id_task_client, taskConnect.id_task_server, taskConnect.args));

              case 5:
                return _context7.abrupt('return', masterRole.connectTaskToTask(goodSlaveClient && goodSlaveClient.slave.eliotIdentifier || false, taskConnect.id_task_client, taskConnect.id_task_server, taskConnect.args));

              case 6:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function connectOneTaskWithAnOther(_x15, _x16, _x17) {
        return _ref7.apply(this, arguments);
      }

      return connectOneTaskWithAnOther;
    }()

    /**
     * Check the configuration file
     * @param {String} conf
     */

  }, {
    key: 'checkConfigurationFile',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(conf) {
        var checkTask;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
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
                  if (!x()) throw new Error('E8092 ' + String(xi));
                });

                return _context8.abrupt('return', true);

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function checkConfigurationFile(_x18) {
        return _ref8.apply(this, arguments);
      }

      return checkConfigurationFile;
    }()

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
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(conf, pathToEntryFile) {
        var roleHandler, masterRole, _ref10, _ref11, slaves;

        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                roleHandler = _RoleAndTask2.default.getInstance().getRoleHandler();

                // Check the configuration to be good

                _context9.next = 3;
                return LocalClass.checkConfigurationFile(conf);

              case 3:
                _context9.next = 5;
                return LocalClass.startMasterRoleOnCurrentProcess(roleHandler, conf.master.options);

              case 5:
                masterRole = _context9.sent;
                _context9.next = 8;
                return _promise2.default.all([
                // Start the master tasks
                LocalClass.startXTasksForMaster(masterRole, conf.master.tasks),

                // Start all slaves and theirs tasks
                LocalClass.startMultipleSlavesAndTheirsTasks(masterRole, conf.slaves)]);

              case 8:
                _ref10 = _context9.sent;
                _ref11 = (0, _slicedToArray3.default)(_ref10, 2);
                slaves = _ref11[1];
                return _context9.abrupt('return', LocalClass.connectTasksTogethers(masterRole, slaves, conf.task_connect));

              case 12:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function applyConfigurationMasterSlaveLaunch(_x19, _x20) {
        return _ref9.apply(this, arguments);
      }

      return applyConfigurationMasterSlaveLaunch;
    }()
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
