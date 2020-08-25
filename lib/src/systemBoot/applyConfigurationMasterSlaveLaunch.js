"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_js_1 = __importDefault(require("../Utils/Utils.js"));
var Errors_js_1 = __importDefault(require("../Utils/Errors.js"));
var CONSTANT_js_1 = __importDefault(require("../Utils/CONSTANT/CONSTANT.js"));
var RoleAndTask_js_1 = __importDefault(require("../RoleAndTask.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../Utils/PromiseCommandPattern.js"));
var LocalClass = /** @class */ (function () {
    function LocalClass() {
    }
    LocalClass.startMasterRoleOnCurrentProcess = function (roleHandler, optionsMaster) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, roleHandler.getRole(CONSTANT_js_1.default.DEFAULT_ROLES.MASTER_ROLE.id)];
                        case 1:
                            role = _a.sent();
                            // Role here is a AMaster so we can use method of it
                            role.pathToEntryFile = RoleAndTask_js_1.default.getInstance().pathToEntryFile;
                            role.displayTask = RoleAndTask_js_1.default.getInstance().displayTask;
                            // Start the master on the current process
                            return [4 /*yield*/, roleHandler.startRole(CONSTANT_js_1.default.DEFAULT_ROLES.MASTER_ROLE.id, optionsMaster)];
                        case 2:
                            // Start the master on the current process
                            _a.sent();
                            return [2 /*return*/, role];
                    }
                });
            }); },
        });
    };
    /**
     * Start all given task for the given slave
     * @param {Object} masterRole
     * @param {Object} slave
     * @param {[{ id: String, args: Object }]} tasks
     */
    LocalClass.startXTasksForSlave = function (masterRole, slave, tasks) {
        // Start a tasks
        return PromiseCommandPattern_js_1.default({
            func: function () { return Promise.all(tasks.map(function (x) { return masterRole.startTaskToSlave(slave.programIdentifier, x.id, x.args); })); },
        });
    };
    /**
     * Add a new slaves with the given tasks on it
     * @param {Object} masterRole
     * @param {[{ id: String, args: Object }]} tasks
     */
    LocalClass.addNewSlaveWithGivenTasks = function (masterRole, tasks) {
        var _this = this;
        if (tasks === void 0) { tasks = []; }
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var slave;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, masterRole.startNewSlave()];
                        case 1:
                            slave = _a.sent();
                            return [4 /*yield*/, LocalClass.startXTasksForSlave(masterRole, slave, tasks)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, slave];
                    }
                });
            }); },
        });
    };
    /**
     * Start all given task for the master
     * @param {Object} masterRole
     * @param {[{ id: String, args: Object }]} tasks
     */
    LocalClass.startXTasksForMaster = function (masterRole, tasks) {
        if (tasks === void 0) { tasks = []; }
        return PromiseCommandPattern_js_1.default({
            func: function () { return Promise.all(tasks.map(function (x) { return masterRole.startTask(x.id, x.args); })); },
        });
    };
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
    LocalClass.startMultipleSlavesAndTheirsTasks = function (masterRole, slaves) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var rets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all(slaves.map(function (x) { return LocalClass.addNewSlaveWithGivenTasks(masterRole, x.tasks); }))];
                        case 1:
                            rets = _a.sent();
                            return [2 /*return*/, rets.map(function (x, xi) { return ({
                                    slave: x,
                                    name: slaves[xi].name,
                                }); })];
                    }
                });
            }); },
        });
    };
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
    LocalClass.connectTasksTogethers = function (masterRole, slaves, tasksConnects) {
        return PromiseCommandPattern_js_1.default({
            func: function () { return Utils_js_1.default.executePromiseQueue(tasksConnects.map(function (x) { return ({
                functionToCall: LocalClass.connectOneTaskWithAnOther,
                context: LocalClass,
                args: [
                    masterRole,
                    slaves,
                    x,
                ],
            }); })); },
        });
    };
    /**
     * Connect one task
     */
    LocalClass.connectOneTaskWithAnOther = function (masterRole, slaves, taskConnect) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var goodSlaveClient;
                return __generator(this, function (_a) {
                    goodSlaveClient = slaves.find(function (x) { return x.name === taskConnect.name_slave_client; });
                    // If the configuration is bad
                    // EMPTY FIELD MEANS THE CLIENT IS THE MASTER
                    if (!goodSlaveClient && taskConnect.name_slave_client !== '') {
                        throw new Errors_js_1.default('EXXXX', 'Bad task connection configuration');
                    }
                    // Connect one
                    if (!goodSlaveClient) {
                        return [2 /*return*/, masterRole.connectMasterToTask(taskConnect.id_task_client, taskConnect.id_task_server, taskConnect.args)];
                    }
                    return [2 /*return*/, masterRole.connectTaskToTask((goodSlaveClient && goodSlaveClient.slave.programIdentifier) || false, taskConnect.id_task_client, taskConnect.id_task_server, taskConnect.args)];
                });
            }); },
        });
    };
    /**
     * Check the configuration file
     * @param {String} conf
     */
    LocalClass.checkConfigurationFile = function (conf) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var checkTask;
                return __generator(this, function (_a) {
                    checkTask = function (data) { return !data.some(function (task) { return [
                        function () { return Utils_js_1.default.isAJSON(task); },
                        function () { return Utils_js_1.default.isAString(task.id); },
                        function () { return Utils_js_1.default.isAJSON(task.args); },
                    ].some(function (x) { return !x(); }); }); };
                    //
                    //  We perform sequentials checks
                    //  (Same as if/if/if/if/if/if... but much more sexier 8D )
                    [
                        function () { return Utils_js_1.default.isAJSON(conf.master); },
                        function () { return Utils_js_1.default.isAnArray(conf.slaves); },
                        function () { return Utils_js_1.default.isAnArray(conf.task_connect); },
                        //
                        // Master body
                        //
                        function () { return Utils_js_1.default.isAJSON(conf.master.options); },
                        function () { return Utils_js_1.default.isAnArray(conf.master.tasks); },
                        // Master -> Tasks
                        function () { return checkTask(conf.master.tasks); },
                        //
                        // Slaves body
                        //
                        function () { return !conf.slaves.some(function (slave) { return [
                            function () { return Utils_js_1.default.isAJSON(slave); },
                            function () { return Utils_js_1.default.isAString(slave.name); },
                            function () { return Utils_js_1.default.isAnArray(slave.tasks); },
                            function () { return checkTask(slave.tasks); },
                        ].some(function (x) { return !x(); }); }); },
                        //
                        // Task connect body
                        //
                        function () { return !conf.task_connect.some(function (body) { return [
                            function () { return Utils_js_1.default.isAJSON(body); },
                            function () { return Utils_js_1.default.isAString(body.id_task_server) && body.id_task_server.length > 0; },
                            function () { return Utils_js_1.default.isAString(body.name_slave_client); },
                            function () { return Utils_js_1.default.isAString(body.id_task_client) && body.id_task_client.length > 0; },
                            function () { return Utils_js_1.default.isAJSON(body.args); },
                        ].some(function (x) { return !x(); }); }); },
                    ].forEach(function (x, xi) {
                        // Put xi to debug in case
                        if (!x())
                            throw new Errors_js_1.default('E8092', "" + String(xi));
                    });
                    return [2 /*return*/, true];
                });
            }); },
        });
    };
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
    LocalClass.applyConfigurationMasterSlaveLaunch = function (conf) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var roleHandler, masterRole, _a, slaves;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            roleHandler = RoleAndTask_js_1.default.getInstance()
                                .getRoleHandler();
                            // Check the configuration to be good
                            return [4 /*yield*/, LocalClass.checkConfigurationFile(conf)];
                        case 1:
                            // Check the configuration to be good
                            _b.sent();
                            return [4 /*yield*/, LocalClass.startMasterRoleOnCurrentProcess(roleHandler, conf.master.options)];
                        case 2:
                            masterRole = _b.sent();
                            return [4 /*yield*/, Promise.all([
                                    // Start the master tasks
                                    LocalClass.startXTasksForMaster(masterRole, conf.master.tasks),
                                    // Start all slaves and theirs tasks
                                    LocalClass.startMultipleSlavesAndTheirsTasks(masterRole, conf.slaves),
                                ])];
                        case 3:
                            _a = _b.sent(), slaves = _a[1];
                            // Connect all tasks to each othes following the configuration
                            return [2 /*return*/, LocalClass.connectTasksTogethers(masterRole, slaves, conf.task_connect)];
                    }
                });
            }); },
        });
    };
    return LocalClass;
}());
// Export the function to use
exports.default = (function (conf) { return LocalClass.applyConfigurationMasterSlaveLaunch(conf); });
