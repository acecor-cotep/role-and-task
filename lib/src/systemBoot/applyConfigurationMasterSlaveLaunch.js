"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Utils = _interopRequireDefault(require("../Utils/Utils.js"));

var _Errors = _interopRequireDefault(require("../Utils/Errors.js"));

var _CONSTANT = _interopRequireDefault(require("../Utils/CONSTANT/CONSTANT.js"));

var _RoleAndTask = _interopRequireDefault(require("../RoleAndTask.js"));

var _PromiseCommandPattern = _interopRequireDefault(require("../Utils/PromiseCommandPattern.js"));

//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
// Imports
var LocalClass =
/*#__PURE__*/
function () {
  function LocalClass() {
    (0, _classCallCheck2["default"])(this, LocalClass);
  }

  (0, _createClass2["default"])(LocalClass, null, [{
    key: "startMasterRoleOnCurrentProcess",

    /**
     * Start the master role on current process
     */
    value: function startMasterRoleOnCurrentProcess(roleHandler, optionsMaster) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee() {
            var role;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return roleHandler.getRole(_CONSTANT["default"].DEFAULT_ROLES.MASTER_ROLE.id);

                  case 2:
                    role = _context.sent;
                    // Role here is a AMaster so we can use method of it
                    role.pathToEntryFile = _RoleAndTask["default"].getInstance().pathToEntryFile;
                    role.displayTask = _RoleAndTask["default"].getInstance().displayTask; // Start the master on the current process

                    _context.next = 7;
                    return roleHandler.startRole(_CONSTANT["default"].DEFAULT_ROLES.MASTER_ROLE.id, optionsMaster);

                  case 7:
                    return _context.abrupt("return", role);

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function func() {
            return _func.apply(this, arguments);
          }

          return func;
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
    key: "startXTasksForSlave",
    value: function startXTasksForSlave(masterRole, slave, tasks) {
      // Start a tasks
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return Promise.all(tasks.map(function (x) {
            return masterRole.startTaskToSlave(slave.programIdentifier, x.id, x.args);
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
    key: "addNewSlaveWithGivenTasks",
    value: function addNewSlaveWithGivenTasks(masterRole) {
      var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func2 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee2() {
            var slave;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
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
                    return _context2.abrupt("return", slave);

                  case 6:
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
     * Start all given task for the master
     * @param {Object} masterRole
     * @param {[{ id: String, args: Object }]} tasks
     */

  }, {
    key: "startXTasksForMaster",
    value: function startXTasksForMaster(masterRole) {
      var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return Promise.all(tasks.map(function (x) {
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
    key: "startMultipleSlavesAndTheirsTasks",
    value: function startMultipleSlavesAndTheirsTasks(masterRole, slaves) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func3 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee3() {
            var rets;
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return Promise.all(slaves.map(function (x) {
                      return LocalClass.addNewSlaveWithGivenTasks(masterRole, x.tasks);
                    }));

                  case 2:
                    rets = _context3.sent;
                    return _context3.abrupt("return", rets.map(function (x, xi) {
                      return {
                        slave: x,
                        name: slaves[xi].name
                      };
                    }));

                  case 4:
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
    key: "connectTasksTogethers",
    value: function connectTasksTogethers(masterRole, slaves, tasksConnects) {
      return new _PromiseCommandPattern["default"]({
        func: function func() {
          return _Utils["default"].executePromiseQueue(tasksConnects.map(function (x) {
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
    key: "connectOneTaskWithAnOther",
    value: function connectOneTaskWithAnOther(masterRole, slaves, taskConnect) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func4 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee4() {
            var goodSlaveClient;
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    goodSlaveClient = slaves.find(function (x) {
                      return x.name === taskConnect.name_slave_client;
                    }); // If the configuration is bad
                    // EMPTY FIELD MEANS THE CLIENT IS THE MASTER

                    if (!(!goodSlaveClient && taskConnect.name_slave_client !== '')) {
                      _context4.next = 3;
                      break;
                    }

                    throw new _Errors["default"]('EXXXX', 'Bad task connection configuration');

                  case 3:
                    if (goodSlaveClient) {
                      _context4.next = 5;
                      break;
                    }

                    return _context4.abrupt("return", masterRole.connectMasterToTask(taskConnect.id_task_client, taskConnect.id_task_server, taskConnect.args));

                  case 5:
                    return _context4.abrupt("return", masterRole.connectTaskToTask(goodSlaveClient && goodSlaveClient.slave.programIdentifier || false, taskConnect.id_task_client, taskConnect.id_task_server, taskConnect.args));

                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));

          function func() {
            return _func4.apply(this, arguments);
          }

          return func;
        }()
      });
    }
    /**
     * Check the configuration file
     * @param {String} conf
     */

  }, {
    key: "checkConfigurationFile",
    value: function checkConfigurationFile(conf) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func5 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee5() {
            var checkTask;
            return _regenerator["default"].wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    checkTask = function checkTask(data) {
                      return !data.some(function (task) {
                        return [function () {
                          return _Utils["default"].isAJSON(task);
                        }, function () {
                          return _Utils["default"].isAString(task.id);
                        }, function () {
                          return _Utils["default"].isAJSON(task.args);
                        }].some(function (x) {
                          return !x();
                        });
                      });
                    }; //
                    //  We perform sequentials checks
                    //  (Same as if/if/if/if/if/if... but much more sexier 8D )


                    [function () {
                      return _Utils["default"].isAJSON(conf.master);
                    }, function () {
                      return _Utils["default"].isAnArray(conf.slaves);
                    }, function () {
                      return _Utils["default"].isAnArray(conf.task_connect);
                    }, //
                    // Master body
                    //
                    function () {
                      return _Utils["default"].isAJSON(conf.master.options);
                    }, function () {
                      return _Utils["default"].isAnArray(conf.master.tasks);
                    }, // Master -> Tasks
                    function () {
                      return checkTask(conf.master.tasks);
                    }, //
                    // Slaves body
                    //
                    function () {
                      return !conf.slaves.some(function (slave) {
                        return [function () {
                          return _Utils["default"].isAJSON(slave);
                        }, function () {
                          return _Utils["default"].isAString(slave.name);
                        }, function () {
                          return _Utils["default"].isAnArray(slave.tasks);
                        }, function () {
                          return checkTask(slave.tasks);
                        }].some(function (x) {
                          return !x();
                        });
                      });
                    }, //
                    // Task connect body
                    //
                    function () {
                      return !conf.task_connect.some(function (body) {
                        return [function () {
                          return _Utils["default"].isAJSON(body);
                        }, function () {
                          return _Utils["default"].isAString(body.id_task_server) && body.id_task_server.length > 0;
                        }, function () {
                          return _Utils["default"].isAString(body.name_slave_client);
                        }, function () {
                          return _Utils["default"].isAString(body.id_task_client) && body.id_task_client.length > 0;
                        }, function () {
                          return _Utils["default"].isAJSON(body.args);
                        }].some(function (x) {
                          return !x();
                        });
                      });
                    }].forEach(function (x, xi) {
                      // Put xi to debug in case
                      if (!x()) throw new _Errors["default"]('E8092', "".concat(String(xi)));
                    });
                    return _context5.abrupt("return", true);

                  case 3:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));

          function func() {
            return _func5.apply(this, arguments);
          }

          return func;
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
    key: "applyConfigurationMasterSlaveLaunch",
    value: function applyConfigurationMasterSlaveLaunch(conf) {
      return new _PromiseCommandPattern["default"]({
        func: function () {
          var _func6 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee6() {
            var roleHandler, masterRole, _ref, _ref2, slaves;

            return _regenerator["default"].wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    roleHandler = _RoleAndTask["default"].getInstance().getRoleHandler(); // Check the configuration to be good

                    _context6.next = 3;
                    return LocalClass.checkConfigurationFile(conf);

                  case 3:
                    _context6.next = 5;
                    return LocalClass.startMasterRoleOnCurrentProcess(roleHandler, conf.master.options);

                  case 5:
                    masterRole = _context6.sent;
                    _context6.next = 8;
                    return Promise.all([// Start the master tasks
                    LocalClass.startXTasksForMaster(masterRole, conf.master.tasks), // Start all slaves and theirs tasks
                    LocalClass.startMultipleSlavesAndTheirsTasks(masterRole, conf.slaves)]);

                  case 8:
                    _ref = _context6.sent;
                    _ref2 = (0, _slicedToArray2["default"])(_ref, 2);
                    slaves = _ref2[1];
                    return _context6.abrupt("return", LocalClass.connectTasksTogethers(masterRole, slaves, conf.task_connect));

                  case 12:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6);
          }));

          function func() {
            return _func6.apply(this, arguments);
          }

          return func;
        }()
      });
    }
  }]);
  return LocalClass;
}(); // Export the function to use


var _default = function _default() {
  return LocalClass.applyConfigurationMasterSlaveLaunch.apply(LocalClass, arguments);
};

exports["default"] = _default;
//# sourceMappingURL=applyConfigurationMasterSlaveLaunch.js.map
