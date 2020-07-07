"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var child_process_1 = __importDefault(require("child_process"));
var AMaster_1 = __importDefault(require("./AMaster"));
var CONSTANT_1 = __importDefault(require("../../../Utils/CONSTANT/CONSTANT"));
var TaskHandler_1 = __importDefault(require("../../Handlers/TaskHandler"));
var ZeroMQServerRouter_1 = __importDefault(require("../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter"));
var Utils_1 = __importDefault(require("../../../Utils/Utils"));
var Errors_1 = __importDefault(require("../../../Utils/Errors"));
var RoleAndTask_1 = __importDefault(require("../../../RoleAndTask"));
var PromiseCommandPattern_1 = __importDefault(require("../../../Utils/PromiseCommandPattern"));
var instance = null;
/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 */
var Master1_0 = /** @class */ (function (_super) {
    __extends(Master1_0, _super);
    function Master1_0() {
        var _this = _super.call(this) || this;
        _this.pathToEntryFile = false;
        // Define none communicationSystem for now
        _this.communicationSystem = false;
        // Array of current approved slaves
        _this.slaves = [];
        // Array of slaves that are in the confirmation process
        _this.notConfirmedSlaves = [];
        // Array that contains the relation between console process ptr and programIdentifier
        // We use it too when there is no console launch, because it work with both soluce
        _this.consoleChildObjectPtr = [];
        // Functions called when something happend to a slave connection
        _this.newConnectionListeningFunction = [];
        _this.newDisconnectionListeningFunction = [];
        // Data we keep as attribute to give to handleProgramTask later
        _this.cpuUsageAndMemory = false;
        _this.tasksInfos = false;
        // Store the mutexes here, we use to avoid concurrency between slaves on specific actions
        _this.mutexes = {};
        _this.intervalFdCpuAndMemory = null;
        _this.intervalFdTasksInfos = null;
        if (instance)
            return instance;
        // Set the reference time that will be sent to the slaves
        _this.referenceStartTime = Date.now();
        _this.name = CONSTANT_1.default.DEFAULT_ROLES.MASTER_ROLE.name;
        _this.id = CONSTANT_1.default.DEFAULT_ROLES.MASTER_ROLE.id;
        // Get the tasks related to the master role
        var tasks = RoleAndTask_1.default.getInstance()
            .getRoleTasks(CONSTANT_1.default.DEFAULT_ROLES.MASTER_ROLE.id);
        _this.setTaskHandler(new TaskHandler_1.default(tasks));
        /*
      // Define all tasks handled by this role
      // We turn the tasks array into an object containing the tasks
      this.setTaskHandler(new TaskHandler(tasks.reduce((tmp, x) => {
        tmp[x.name] = x;
    
        return tmp;
      }, {})));
      */
        _this.initProperties();
        instance = _this;
        return instance;
    }
    /**
     * Init the properties
     */
    Master1_0.prototype.initProperties = function () {
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
    };
    /**
     * Get the communicationSystem
     */
    Master1_0.prototype.getCommunicationSystem = function () {
        return this.communicationSystem;
    };
    /**
     * SINGLETON implementation
     * @override
     */
    Master1_0.getInstance = function () {
        return instance || new Master1_0();
    };
    /**
     * Pull a function that get fired when a slave get connected
     */
    Master1_0.prototype.unlistenSlaveConnectionEvent = function (func) {
        this.newConnectionListeningFunction = this.newConnectionListeningFunction.filter(function (x) { return x.func !== func; });
    };
    /**
     * Pull a function that get fired when a slave get disconnected
     */
    Master1_0.prototype.unlistenSlaveDisconnectionEvent = function (func) {
        this.newDisconnectionListeningFunction = this.newDisconnectionListeningFunction.filter(function (x) { return x.func !== func; });
    };
    /**
     * Push a function that get fired when a slave get connected
     */
    Master1_0.prototype.listenSlaveConnectionEvent = function (func, context) {
        if (context === void 0) { context = this; }
        this.newConnectionListeningFunction.push({
            func: func,
            context: context,
        });
    };
    /**
     * Push a function that get fired when a slave get disconnected
     */
    Master1_0.prototype.listenSlaveDisconnectionEvent = function (func, context) {
        if (context === void 0) { context = this; }
        this.newDisconnectionListeningFunction.push({
            func: func,
            context: context,
        });
    };
    /**
     * Return the array that contains non-confirmed slaves
     */
    Master1_0.prototype.getNonConfirmedSlaves = function () {
        return this.notConfirmedSlaves;
    };
    /**
     *  Get an array that contains confirmed slaves
     */
    Master1_0.prototype.getSlaves = function () {
        return this.slaves;
    };
    /**
     * We get asked to spread a news to every slave tasks and our tasks
     *
     * WARNING - DO NOT SEND IT TO NON-REGULAR SLAVES (CRON_EXECUTOR_ROLE FOR EXAMPLE)
     */
    Master1_0.prototype.sendDataToEveryProgramTaskWhereverItIsLowLevel = function (_, __, body) {
        var _this = this;
        var regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();
        // Open the body to get the list of tasks we limit the spread on
        var limitToTaskList = body.limitToTaskList;
        // For each slave
        regularSlaves.forEach(function (x) {
            // Only send the data to the slaves that holds a tasks that need to know about the message
            if (!limitToTaskList || x.tasks.some(function (y) { return y.isActive && limitToTaskList.includes(y.id); })) {
                // Send a message to every running slaves
                _this.sendMessageToSlaveHeadBodyPattern(x.programIdentifier, CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, body);
            }
        });
        // For itself tasks
        RoleAndTask_1.default.getInstance()
            .spreadDataToEveryLocalTask(body);
    };
    /**
     * We get asked to spread a news to every slave tasks and our tasks
     */
    Master1_0.prototype.sendDataToEveryProgramTaskWhereverItIs = function (data) {
        this.sendDataToEveryProgramTaskWhereverItIsLowLevel([], '', data);
    };
    /**
     * Tell the Task about something happend in slaves
     */
    Master1_0.prototype.tellMasterAboutSlaveError = function (clientIdentityString, err) {
        var slave = this.slaves.find(function (x) { return x.clientIdentityString === clientIdentityString; });
        if (!slave) {
            return;
        }
        slave.error = err;
        this.somethingChangedAboutSlavesOrI();
    };
    /**
     * An error happended into a slave, what do we do?
     */
    Master1_0.prototype.errorHappenedIntoSlave = function (_, clientIdentityString, body) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var err, errNested_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            err = Errors_1.default.deserialize(body);
                            // Display the error
                            Utils_1.default.displayMessage({
                                str: Errors_1.default.staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
                                out: process.stderr,
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            // Get the client that got the problem
                            // We try to change the program state to error
                            return [4 /*yield*/, RoleAndTask_1.default.getInstance()
                                    .changeProgramState(CONSTANT_1.default.DEFAULT_STATES.ERROR.id)];
                        case 2:
                            // Get the client that got the problem
                            // We try to change the program state to error
                            _a.sent();
                            // We goodly changed the program state
                            // Add informations on error
                            Utils_1.default.displayMessage({
                                str: Errors_1.default.staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
                                out: process.stderr,
                            });
                            // Tell the task handleProgram that there had been an error for the slave
                            this.tellMasterAboutSlaveError(clientIdentityString, err);
                            if (!RoleAndTask_1.default.getInstance().makesErrorFatal) return [3 /*break*/, 4];
                            return [4 /*yield*/, RoleAndTask_1.default.getInstance().makeTheMasterToQuitTheWholeApp()];
                        case 3:
                            _a.sent();
                            RoleAndTask_1.default.exitProgramUnproperDueToError();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            errNested_1 = _a.sent();
                            Utils_1.default.displayMessage({
                                str: 'Exit program unproper ERROR HAPPENED IN SLAVE',
                                out: process.stderr,
                            });
                            Utils_1.default.displayMessage({
                                str: String((errNested_1 && errNested_1.stack) || errNested_1),
                                out: process.stderr,
                            });
                            RoleAndTask_1.default.exitProgramUnproperDueToError();
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * In master/slave protocol, we ask to get a token. We get directly asked as the master
     */
    Master1_0.prototype.takeMutex = function (id) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var customFunctions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // The mutex has already been taken
                            if (this.mutexes[id]) {
                                throw new Errors_1.default('E7024');
                            }
                            customFunctions = RoleAndTask_1.default.getInstance()
                                .getMasterMutexFunctions()
                                .find(function (x) { return x.id === id; });
                            if (!(customFunctions && customFunctions.funcTake)) return [3 /*break*/, 2];
                            return [4 /*yield*/, customFunctions.funcTake()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            this.mutexes[id] = true;
                            return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * In master/slave protocol, we ask to release the token. We get directly asked as the master.
     */
    Master1_0.prototype.releaseMutex = function (id) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var customFunctions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            customFunctions = RoleAndTask_1.default.getInstance()
                                .getMasterMutexFunctions()
                                .find(function (x) { return x.id === id; });
                            if (!(customFunctions && customFunctions.funcRelease)) return [3 /*break*/, 2];
                            return [4 /*yield*/, customFunctions.funcRelease()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            this.mutexes[id] = false;
                            return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * Take the mutex behind the given ID if it's available
     */
    Master1_0.prototype.protocolTakeMutex = function (_, clientIdentityString, body) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var TAKE_MUTEX, slave, customFunctions, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            TAKE_MUTEX = CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.TAKE_MUTEX;
                            slave = this.slaves.find(function (x) { return x.clientIdentityString === clientIdentityString; });
                            if (!slave) {
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            // The mutex has already been taken
                            if (this.mutexes[body.id]) {
                                throw new Errors_1.default('E7024');
                            }
                            customFunctions = RoleAndTask_1.default.getInstance()
                                .getMasterMutexFunctions()
                                .find(function (x) { return x.id === body.id; });
                            if (!(customFunctions && customFunctions.funcTake)) return [3 /*break*/, 3];
                            return [4 /*yield*/, customFunctions.funcTake()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            this.mutexes[body.id] = true;
                            this.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, TAKE_MUTEX, JSON.stringify({
                                error: false,
                            }));
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _a.sent();
                            this.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, TAKE_MUTEX, JSON.stringify({
                                error: err_1 instanceof Errors_1.default ? (err_1.serialize && err_1.serialize()) : String(err_1),
                            }));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * Release the mutex behind the given ID
     */
    Master1_0.prototype.protocolReleaseMutex = function (_, clientIdentityString, body) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var RELEASE_MUTEX, slave, customFunctions, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            RELEASE_MUTEX = CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.RELEASE_MUTEX;
                            slave = this.slaves.find(function (x) { return x.clientIdentityString === clientIdentityString; });
                            if (!slave) {
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            customFunctions = RoleAndTask_1.default.getInstance()
                                .getMasterMutexFunctions()
                                .find(function (x) { return x.id === body.id; });
                            if (!(customFunctions && customFunctions.funcRelease)) return [3 /*break*/, 3];
                            return [4 /*yield*/, customFunctions.funcRelease()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            this.mutexes[body.id] = false;
                            this.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, RELEASE_MUTEX, JSON.stringify({
                                error: false,
                            }));
                            return [3 /*break*/, 5];
                        case 4:
                            err_2 = _a.sent();
                            this.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, RELEASE_MUTEX, JSON.stringify({
                                error: err_2 instanceof Errors_1.default ? (err_2.serialize && err_2.serialize()) : String(err_2),
                            }));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * Define the master/slave basic protocol
     * (Authentification)
     */
    Master1_0.prototype.protocolMasterSlave = function () {
        var _this = this;
        // Shortcuts
        var _a = CONSTANT_1.default.PROTOCOL_KEYWORDS, HEAD = _a.HEAD, BODY = _a.BODY;
        var _b = CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES, SLAVE_CONFIRMATION_INFORMATIONS = _b.SLAVE_CONFIRMATION_INFORMATIONS, GENERIC_CHANNEL_DATA = _b.GENERIC_CHANNEL_DATA, OUTPUT_TEXT = _b.OUTPUT_TEXT, INFOS_ABOUT_SLAVES = _b.INFOS_ABOUT_SLAVES, ERROR_HAPPENED = _b.ERROR_HAPPENED, TAKE_MUTEX = _b.TAKE_MUTEX, RELEASE_MUTEX = _b.RELEASE_MUTEX;
        if (this.communicationSystem === false) {
            return;
        }
        // Listen at new Socket connection
        //
        // 1/ Check if the new slave have a correct identifier
        // 2/ Ask the slave for running tasks
        // 3/ Get the slave answer
        // 4/ Add the slave into handled slave
        //
        this.communicationSystem.listenClientConnectionEvent(function (clientIdentityByte, clientIdentityString) {
            var _a = clientIdentityString.split('_'), programIdentifier = _a[0], clientPID = _a[1];
            // Look at the identity of the slave (and if we have duplicate)
            if (_this.slaves.find(function (x) { return x.programIdentifier === programIdentifier; }) ||
                _this.notConfirmedSlaves.find(function (x) { return x.programIdentifier === programIdentifier; })) {
                // Identity already in use by an other slave
                // Close the connection
                RoleAndTask_1.default.getInstance()
                    .displayMessage({
                    str: ("[" + _this.name + "] Refuse slave cause of identity").cyan,
                });
                if (_this.communicationSystem === false)
                    throw new Errors_1.default('EXXXX', 'communication system id false');
                return _this.communicationSystem.closeConnectionToClient(clientIdentityByte, clientIdentityString);
            }
            // So here the client do not exist already and the identifier is free
            // Add the slave into the declared not confirmed array
            _this.notConfirmedSlaves.push({
                clientIdentityString: clientIdentityString,
                clientIdentityByte: clientIdentityByte,
                programIdentifier: programIdentifier,
                clientPID: clientPID,
                tasks: [],
                error: false,
            });
            if (_this.communicationSystem === false)
                throw new Errors_1.default('EXXXX', 'communication system id false');
            // Ask the slaves about its tasks
            return _this.communicationSystem.sendMessageToClient(clientIdentityByte, clientIdentityString, SLAVE_CONFIRMATION_INFORMATIONS);
        });
        // Listen to slaves disconnection
        this.communicationSystem.listenClientDisconnectionEvent(function (clientIdentityString) {
            _this.slaves = _this.slaves.filter(function (x) {
                if (x.clientIdentityString === clientIdentityString) {
                    RoleAndTask_1.default.getInstance()
                        .displayMessage({
                        str: ("[" + _this.name + "] Slave get removed (connection)").red,
                    });
                    // Fire when a slave get disconnected
                    Utils_1.default.fireUp(_this.newDisconnectionListeningFunction, [x]);
                    return false;
                }
                return true;
            });
            _this.notConfirmedSlaves = _this.notConfirmedSlaves.filter(function (x) {
                if (x.clientIdentityString === clientIdentityString) {
                    RoleAndTask_1.default.getInstance()
                        .displayMessage({
                        str: ("[" + _this.name + "] Non-confirmed slave get removed (connection)").red,
                    });
                    // Fire when a slave get disconnected
                    Utils_1.default.fireUp(_this.newDisconnectionListeningFunction, [x]);
                    return false;
                }
                return true;
            });
        });
        // Confirm a slave that wasn't
        var confirmSlave = function (clientIdentityByte, clientIdentityString, dataJSON) {
            var index = _this.notConfirmedSlaves.findIndex(function (x) { return x.clientIdentityString === clientIdentityString; });
            if (index === -1)
                return;
            // Confirm the slave
            var slave = _this.notConfirmedSlaves[index];
            slave.tasks = dataJSON[BODY].tasks;
            slave.role = dataJSON[BODY].role;
            _this.slaves.push(slave);
            _this.notConfirmedSlaves.splice(index, 1);
            // Fire when a slave get connected
            Utils_1.default.fireUp(_this.newConnectionListeningFunction, [slave]);
        };
        // We listen to incoming messages
        this.communicationSystem.listenToIncomingMessage(function (clientIdentityByte, clientIdentityString, dataString) {
            var dataJSON = Utils_1.default.convertStringToJSON(dataString);
            // Here we got all messages that comes from clients (so slaves)
            // Check if the message answer particular message
            // If it does apply the particular job
            [{
                    //
                    // Check about the slave infos
                    //
                    checkFunc: function () { return (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === SLAVE_CONFIRMATION_INFORMATIONS); },
                    // It means we get the tasks list
                    applyFunc: function () { return confirmSlave(clientIdentityByte, clientIdentityString, dataJSON); },
                }, {
                    //
                    // Check about generic news
                    //
                    checkFunc: function () { return (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === GENERIC_CHANNEL_DATA); },
                    applyFunc: function () { return _this.sendDataToEveryProgramTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, dataJSON[BODY]); },
                }, {
                    //
                    // Check about messages to display
                    //
                    checkFunc: function () { return (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === OUTPUT_TEXT); },
                    applyFunc: function () { return _this.displayMessage(dataJSON[BODY]); },
                }, {
                    //
                    // Check about infos about slaves
                    //
                    checkFunc: function () { return (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === INFOS_ABOUT_SLAVES); },
                    applyFunc: function () { return _this.infosAboutSlaveIncomming(clientIdentityByte, clientIdentityString, dataJSON[BODY]); },
                }, {
                    //
                    // Check about error happened into slave
                    //
                    checkFunc: function () { return (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ERROR_HAPPENED); },
                    applyFunc: function () { return _this.errorHappenedIntoSlave(clientIdentityByte, clientIdentityString, dataJSON[BODY]); },
                }, {
                    //
                    // Check about slave asking for taking a mutex
                    //
                    checkFunc: function () { return (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === TAKE_MUTEX); },
                    applyFunc: function () { return _this.protocolTakeMutex(clientIdentityByte, clientIdentityString, dataJSON[BODY]); },
                }, {
                    //
                    // Check about slave asking for releasing a mutex
                    //
                    checkFunc: function () { return (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === RELEASE_MUTEX); },
                    applyFunc: function () { return _this.protocolReleaseMutex(clientIdentityByte, clientIdentityString, dataJSON[BODY]); },
                }].forEach(function (x) {
                if (x.checkFunc())
                    x.applyFunc();
            });
        });
    };
    /**
     * We got news about a slave -> infos
     * Store it and call HandleProgramTask if it's up
     */
    Master1_0.prototype.infosAboutSlaveIncomming = function (_, clientIdentityString, data) {
        // Get the right slave
        var slave = this.slaves.find(function (x) { return x.clientIdentityString === clientIdentityString; });
        var notConfirmedSlave = this.notConfirmedSlaves.find(function (x) { return x.clientIdentityString === clientIdentityString; });
        var ptr = slave || notConfirmedSlave;
        if (!ptr) {
            return;
        }
        if (!ptr.moreInfos)
            ptr.moreInfos = {};
        // Apply values to moreInfos
        [
            'cpuAndMemory',
            'ips',
            'tasksInfos',
        ]
            .forEach(function (x) {
            // To get the 0 value
            if (data[x] !== void 0)
                ptr.moreInfos[x] = data[x];
        });
        // Tell something changed in the conf
        this.somethingChangedAboutSlavesOrI();
    };
    /**
     * Returns in an array the whole system pids (Master + Slaves processes)
     */
    Master1_0.prototype.getFullSystemPids = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return new Promise(function (resolve) {
                resolve(__spreadArrays([
                    String(process.pid)
                ], _this.slaves.map(function (x) { return String(x.clientPID); })));
            }); },
        });
    };
    /**
     * Connect the second Task to the first one
     */
    Master1_0.prototype.connectMasterToTask = function (idTaskToConnectTo, idTaskToConnect, args) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var handler, task, connection, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            RoleAndTask_1.default.getInstance()
                                .displayMessage({
                                str: Utils_1.default.monoline([
                                    "[" + this.name + "] Ask Master to connect the Task N\u00B0" + idTaskToConnect,
                                    " to the Task N\u00B0" + idTaskToConnectTo,
                                ])
                                    .blue,
                            });
                            handler = this.getTaskHandler();
                            if (handler === false)
                                throw new Errors_1.default('EXXXX', 'no task handler');
                            return [4 /*yield*/, handler.getTask(idTaskToConnectTo)];
                        case 1:
                            task = _a.sent();
                            // We get the task
                            // Error if the task is not active
                            if (!task.isActive()) {
                                throw new Errors_1.default('E7009', "idTask: " + idTaskToConnectTo);
                            }
                            connection = task.connectToTask(idTaskToConnect, args);
                            RoleAndTask_1.default.getInstance()
                                .displayMessage({
                                str: Utils_1.default.monoline([
                                    "[" + this.name + "] Task N\u00B0" + idTaskToConnect + " correctly connected to Task ",
                                    "N\u00B0" + idTaskToConnectTo + " in Master",
                                ])
                                    .green,
                            });
                            return [2 /*return*/, connection];
                        case 2:
                            err_3 = _a.sent();
                            RoleAndTask_1.default.getInstance()
                                .displayMessage({
                                str: Utils_1.default.monoline([
                                    "[" + this.name + "] Task N\u00B0" + idTaskToConnect + " failed to be connected",
                                    " to Task N\u00B0" + idTaskToConnectTo + " in Master",
                                ]).red,
                            });
                            throw err_3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * Connect the second Task to the first one
     */
    Master1_0.prototype.connectTaskToTask = function (identifierSlave, idTaskToConnectTo, idTaskToConnect, args) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sendMessageAndWaitForTheResponse({
                                identifierSlave: identifierSlave,
                                isHeadBodyPattern: true,
                                messageHeaderToSend: CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CONNECT_TASK_TO_TASK,
                                messageBodyToSend: {
                                    idTask: idTaskToConnectTo,
                                    idTaskToConnect: idTaskToConnect,
                                    args: args,
                                },
                                messageHeaderToGet: CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CONNECT_TASK_TO_TASK,
                            })];
                        case 1:
                            ret = _a.sent();
                            // We get either an errors object or an error
                            if (ret === '') {
                                return [2 /*return*/, ret];
                            }
                            console.error(ret, '----> Master1_0 -- 4');
                            throw ret;
                    }
                });
            }); },
        });
    };
    /**
     * Modify the status of the task attached to the given identifier
     * (local data, have no impact in the real slave)
     */
    Master1_0.prototype.modifyTaskStatusToSlaveLocalArray = function (identifier, idTask, status) {
        var _this = this;
        this.slaves.some(function (x, xi) {
            if (x.programIdentifier === identifier) {
                return x.tasks.some(function (y, yi) {
                    if (y.id === idTask) {
                        // @WARNING IT WAS isActive BEFORE
                        _this.slaves[xi].tasks[yi].active = status;
                        return true;
                    }
                    return false;
                });
            }
            return false;
        });
    };
    /**
     * When called: Add a task to a slave
     */
    Master1_0.prototype.startTaskToSlave = function (identifier, idTask, args) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sendMessageAndWaitForTheResponse({
                                identifierSlave: identifier,
                                isHeadBodyPattern: true,
                                messageHeaderToSend: CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK,
                                messageBodyToSend: {
                                    idTask: idTask,
                                    args: args,
                                },
                                messageHeaderToGet: CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK,
                            })];
                        case 1:
                            ret = (_a.sent());
                            // We get either an errors object or an error
                            if (ret === '') {
                                // Modify the task status for the given slave
                                this.modifyTaskStatusToSlaveLocalArray(identifier, idTask, true);
                                // Say something changed
                                this.somethingChangedAboutSlavesOrI();
                                return [2 /*return*/, ret];
                            }
                            console.error(ret, '----> Master1_0 -- 1');
                            throw Errors_1.default.deserialize(ret);
                    }
                });
            }); },
        });
    };
    /**
     * List the existing slaves
     */
    Master1_0.prototype.listSlaves = function () {
        return this.getSlaves();
    };
    /**
     * List a slave tasks using its identifier (Ask the slave to it)
     */
    Master1_0.prototype.distantListSlaveTask = function (identifier) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return _this.sendMessageAndWaitForTheResponse({
                identifierSlave: identifier,
                isHeadBodyPattern: false,
                messageHeaderToSend: CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
                messageBodyToSend: {},
                messageHeaderToGet: CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
            }); },
        });
    };
    /**
     * List a slave tasks using its identifier (Use local data to it)
     * @param {String} identifier
     */
    Master1_0.prototype.listSlaveTask = function (identifier) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var slave;
                return __generator(this, function (_a) {
                    slave = this.getSlaveByProgramIdentifier(identifier);
                    if (!slave || slave instanceof Errors_1.default) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, slave.tasks];
                });
            }); },
        });
    };
    /**
     * Handle the fact the program state change
     * We spread the data on our tasks and to our slaves
     * @param {Number} programState
     * @param {Number} oldProgramState
     */
    Master1_0.prototype.handleProgramStateChange = function (programState, oldProgramState) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () {
                var taskHandler = _this.getTaskHandler();
                if (taskHandler === false)
                    throw new Errors_1.default('EXXXX', 'no task handler');
                return Promise.all([
                    // Spread to our tasks
                    taskHandler.applyNewProgramState(programState, oldProgramState),
                    // Spread to slaves
                    _this.tellAllSlaveThatProgramStateChanged(programState, oldProgramState),
                ]);
            },
        });
    };
    /**
     * Return only the slaves that are regular slaves (not CRON_EXECUTOR_ROLE for example)
     */
    Master1_0.prototype.getSlavesOnlyThatAreRegularSlaves = function () {
        return this.slaves.filter(function (x) {
            if (!x.role) {
                return false;
            }
            return x.role.id === CONSTANT_1.default.DEFAULT_ROLES.SLAVE_ROLE.id;
        });
    };
    /**
     * Tell all slave that the program state did change
     *
     * WARNING - DO NOT INCLUDE CRON_EXECUTOR_ROLE SLAVES INTO THE PIPE
     */
    Master1_0.prototype.tellAllSlaveThatProgramStateChanged = function (programState, oldProgramState) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var regularSlaves;
                var _this = this;
                return __generator(this, function (_a) {
                    regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();
                    return [2 /*return*/, Promise.all(regularSlaves.map(function (x) { return _this.tellASlaveThatProgramStateChanged(x.programIdentifier, programState, oldProgramState); }))];
                });
            }); },
        });
    };
    /**
     * Tell a slave that program state did change
     */
    Master1_0.prototype.tellASlaveThatProgramStateChanged = function (slaveIdentifier, programState, oldProgramState) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var STATE_CHANGE, ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            STATE_CHANGE = CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STATE_CHANGE;
                            return [4 /*yield*/, this.sendMessageAndWaitForTheResponse({
                                    identifierSlave: slaveIdentifier,
                                    isHeadBodyPattern: true,
                                    messageHeaderToSend: STATE_CHANGE,
                                    messageBodyToSend: {
                                        programState: programState,
                                        oldProgramState: oldProgramState,
                                    },
                                    messageHeaderToGet: STATE_CHANGE,
                                    timeoutToGetMessage: RoleAndTask_1.default.getInstance().masterMessageWaitingTimeoutStateChange,
                                })];
                        case 1:
                            ret = (_a.sent());
                            // We get either an errors object or an error
                            if (ret === '')
                                return [2 /*return*/, ret];
                            console.error(ret, '----> Master1_0 -- 2');
                            RoleAndTask_1.default.getInstance()
                                .displayMessage({
                                str: ("[" + this.name + "] program state get not spread in Slave N\u00B0" + slaveIdentifier).red,
                            });
                            throw Errors_1.default.deserialize(ret);
                    }
                });
            }); },
        });
    };
    /**
     * When called: Remove an existing slave(s)
     */
    Master1_0.prototype.removeExistingSlave = function (identifiersSlaves) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return Utils_1.default.promiseQueue(__spreadArrays(identifiersSlaves.map(function (x) { return ({
                functionToCall: _this.sendMessageToSlave,
                context: _this,
                args: [
                    x,
                    CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.CLOSE,
                ],
            }); }), [
                // Say that something changed
                {
                    functionToCall: _this.somethingChangedAboutSlavesOrI,
                    context: _this,
                },
            ])); },
        });
    };
    /**
     * Kill a slave using its identifier
     */
    Master1_0.prototype.killSlave = function (programIdentifier) {
        var _this = this;
        // Look for the given identifier
        this.consoleChildObjectPtr.filter(function (x) {
            if (x.programIdentifier === programIdentifier) {
                try {
                    // Kill the process
                    process.kill(x.pid, CONSTANT_1.default.SIGNAL_UNPROPER.SIGUSR1);
                    // Remove the slave from the slave list
                    _this.slaves = _this.slaves.filter(function (y) { return !(y.programIdentifier === programIdentifier); });
                }
                catch (err) {
                    // Ignore the error, because the slave is dead anyway to us
                }
                return false;
            }
            return true;
        });
    };
    /**
     * When called: remove a task from slave
     *
     * THIS FUNCTION HAVE SPECIAL TIMEOUT FOR SLAVE ANSWER
     */
    Master1_0.prototype.removeTaskFromSlave = function (identifier, idTask, args) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var STOP_TASK, ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            STOP_TASK = CONSTANT_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STOP_TASK;
                            RoleAndTask_1.default.getInstance()
                                .displayMessage({
                                str: ("[" + this.name + "] Ask Slave N\u00B0" + identifier + " to stop the Task N\u00B0" + idTask).blue,
                            });
                            return [4 /*yield*/, this.sendMessageAndWaitForTheResponse({
                                    identifierSlave: identifier,
                                    isHeadBodyPattern: true,
                                    messageHeaderToSend: STOP_TASK,
                                    messageBodyToSend: {
                                        idTask: idTask,
                                        args: args,
                                    },
                                    messageHeaderToGet: STOP_TASK,
                                    timeoutToGetMessage: RoleAndTask_1.default.getInstance().masterMessageWaitingTimeoutStopChange,
                                })];
                        case 1:
                            ret = (_a.sent());
                            // We get either an errors object or an error
                            if (ret === '') {
                                RoleAndTask_1.default.getInstance()
                                    .displayMessage({
                                    str: ("[" + this.name + "] Task N\u00B0" + idTask + " correctly stopped in Slave N\u00B0" + identifier).green,
                                });
                                // Modify the task status for the given slave
                                this.modifyTaskStatusToSlaveLocalArray(identifier, idTask, false);
                                return [2 /*return*/, ret];
                            }
                            console.error(ret, '----> Master1_0 -- 3');
                            RoleAndTask_1.default.getInstance()
                                .displayMessage({
                                str: ("[" + this.name + "] Task N\u00B0" + idTask + " failed to be stopped to Slave N\u00B0" + identifier).red,
                            });
                            throw ret;
                    }
                });
            }); },
        });
    };
    /**
     * Display a message directly
     */
    Master1_0.prototype.displayMessage = function (param) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var displayTask, taskHandler, task, err_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            displayTask = RoleAndTask_1.default.getInstance().displayTask;
                            if (!(displayTask !== false)) return [3 /*break*/, 2];
                            taskHandler = this.getTaskHandler();
                            if (taskHandler === false)
                                throw new Errors_1.default('EXXXX', 'no task handler');
                            return [4 /*yield*/, taskHandler.getTask(displayTask)];
                        case 1:
                            task = _a.sent();
                            // If we disallow log display, stop it here
                            if (!RoleAndTask_1.default.getInstance().displayLog) {
                                return [2 /*return*/, false];
                            }
                            if (task.isActive() && task.displayMessage) {
                                return [2 /*return*/, task.displayMessage(param)];
                            }
                            _a.label = 2;
                        case 2:
                            // If not we display
                            Utils_1.default.displayMessage(param);
                            return [3 /*break*/, 4];
                        case 3:
                            err_4 = _a.sent();
                            // Ignore error - We can't display the data - it do not require further error treatment
                            // Store the message into file tho
                            Utils_1.default.displayMessage({
                                str: Errors_1.default.staticIsAnError(err_4) ? err_4.getErrorString() : String(err_4.stack || err_4),
                                out: process.stderr,
                            });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, false];
                    }
                });
            }); },
        });
    };
    /**
     * Start a new slave not in a console but in a regular process
     */
    Master1_0.prototype.startNewSlaveInProcessMode = function (slaveOpts, _, connectionTimeout) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                // We create a unique Id that will referenciate the slave at the connexion
                var uniqueSlaveId = (slaveOpts && slaveOpts.uniqueSlaveId) || Utils_1.default.generateUniqueProgramID();
                // Options to send to the new created slave
                var programOpts = (slaveOpts && slaveOpts.opts) || [
                    "--" + CONSTANT_1.default.PROGRAM_LAUNCHING_PARAMETERS.MODE.name,
                    "" + CONSTANT_1.default.PROGRAM_LAUNCHING_MODE.SLAVE,
                    "--" + CONSTANT_1.default.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name,
                    CONSTANT_1.default.SLAVE_START_ARGS.IDENTIFIER + "=" + uniqueSlaveId,
                    CONSTANT_1.default.SLAVE_START_ARGS.ELIOT_START_TIME + "=" + _this.referenceStartTime,
                ];
                // Options to give to fork(...)
                var forkOpts = {};
                // If there is no path to the entry file to execute
                if (!_this.pathToEntryFile) {
                    throw new Errors_1.default('EXXXX', 'Cannot start the slave : No pathToEntryFile configured');
                }
                // Path that lead to the exe of PROGRAM
                var pathToExec = _this.pathToEntryFile;
                // LaunchScenarios program in slave mode in a different process
                var child = child_process_1.default.fork(pathToExec, programOpts, forkOpts);
                // LaunchScenarios a timeout of connection
                var timeoutConnection = setTimeout(function () {
                    // Kill the process we did created
                    child.kill(CONSTANT_1.default.SIGNAL_TO_KILL_SLAVE_COMMAND);
                    return reject(new Errors_1.default('E7003', "Timeout " + connectionTimeout + " ms passed"));
                }, connectionTimeout);
                // Look at error event (If it get fired it means the program failed to get launched)
                // Handle the fact a child can result an error later on after first connection
                // Error detected
                child.on('error', function (err) { return reject(new Errors_1.default('E7003', "Exit Code: " + err)); });
                // Handle the fact a child get closed
                // The close can be wanted, or not
                child.on('close', function (code) {
                    // No error
                    RoleAndTask_1.default.getInstance()
                        .displayMessage({
                        str: ("Slave Close: " + code).red,
                    });
                });
                // Handle the fact a child exit
                // The exit can be wanted or not
                child.on('exit', function (code) {
                    // No error
                    RoleAndTask_1.default.getInstance()
                        .displayMessage({
                        str: ("Slave Exit: " + code).red,
                    });
                });
                // Now we need to look at communicationSystem of the master to know if the new slave connect to PROGRAM
                // If we pass a connection timeout time, we kill the process we just created and return an error
                var connectEvent = function (slaveInfos) {
                    // Wait for a new client with the identifier like -> uniqueSlaveId_processId
                    if (slaveInfos && slaveInfos.programIdentifier === uniqueSlaveId) {
                        // We got our slave working well
                        clearTimeout(timeoutConnection);
                        _this.unlistenSlaveConnectionEvent(connectEvent);
                        // Store the child data
                        _this.consoleChildObjectPtr.push({
                            programIdentifier: uniqueSlaveId,
                            pid: slaveInfos.clientPID,
                        });
                        resolve(__assign(__assign({}, slaveInfos), { pid: slaveInfos.clientPID }));
                    }
                    // This is not our slave
                    return;
                };
                _this.listenSlaveConnectionEvent(connectEvent);
            }); },
        });
    };
    /**
     * Tell one task about what changed in the architecture
     */
    Master1_0.prototype.tellOneTaskAboutArchitectureChange = function (idTask) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var taskHandler, task, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            taskHandler = this.getTaskHandler();
                            if (taskHandler === false)
                                throw new Errors_1.default('EXXXX', 'cannot find task handler');
                            return [4 /*yield*/, taskHandler.getTask(idTask)];
                        case 1:
                            task = _a.sent();
                            // Can't find the task  so -> don't tell a new archiecture is here
                            if (!task)
                                return [2 /*return*/];
                            if (task.isActive() && task.dynamicallyRefreshDataIntoList) {
                                // Tell HandleProgramTask about new conf
                                task.dynamicallyRefreshDataIntoList({
                                    notConfirmedSlaves: this.notConfirmedSlaves,
                                    confirmedSlaves: this.slaves,
                                    master: {
                                        tasks: taskHandler.getTaskListStatus(),
                                        communication: this.getCommunicationSystem(),
                                        ips: Utils_1.default.givesLocalIps(),
                                        cpuAndMemory: this.cpuUsageAndMemory,
                                        tasksInfos: this.tasksInfos,
                                    },
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * Do something when an information changed about PROGRAM architecture
     */
    Master1_0.prototype.somethingChangedAboutSlavesOrI = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Look at all tasks
                        return [4 /*yield*/, Promise.all(RoleAndTask_1.default.getInstance()
                                .tasks.filter(function (x) { return x.notifyAboutArchitectureChange; })
                                .map(function (x) { return _this.tellOneTaskAboutArchitectureChange(x.id); }))];
                        case 1:
                            // Look at all tasks
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * When called : start a new slave
     * Take options in parameters or start a regular slave
     */
    Master1_0.prototype.startNewSlave = function (slaveOpts, specificOpts, connectionTimeout) {
        var _this = this;
        if (connectionTimeout === void 0) { connectionTimeout = CONSTANT_1.default.SLAVE_CREATION_CONNECTION_TIMEOUT; }
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout)];
                        case 1:
                            ret = _a.sent();
                            // Say something changed
                            return [4 /*yield*/, this.somethingChangedAboutSlavesOrI()];
                        case 2:
                            // Say something changed
                            _a.sent();
                            return [2 /*return*/, ret];
                    }
                });
            }); },
        });
    };
    /**
     * Send a message that match head/body pattern
     *
     * Messages are like: { head: Object, body: Object }
     */
    Master1_0.prototype.sendMessageToSlaveHeadBodyPattern = function (programIdentifier, headString, body) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var message;
                var _a;
                return __generator(this, function (_b) {
                    message = (_a = {},
                        _a[CONSTANT_1.default.PROTOCOL_KEYWORDS.HEAD] = headString,
                        _a[CONSTANT_1.default.PROTOCOL_KEYWORDS.BODY] = body,
                        _a);
                    // Send the message
                    return [2 /*return*/, this.sendMessageToSlave(programIdentifier, JSON.stringify(message))];
                });
            }); },
        });
    };
    /**
     * Send a message to a slave using an programIdentifier
     */
    Master1_0.prototype.sendMessageToSlave = function (programIdentifier, message) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var slave;
                return __generator(this, function (_a) {
                    slave = this.getSlaveByProgramIdentifier(programIdentifier);
                    if (this.communicationSystem === false || slave instanceof Errors_1.default) {
                        throw new Errors_1.default('EXXXX', 'communication system false');
                    }
                    // Send the message
                    this.communicationSystem
                        .sendMessageToClient(slave.clientIdentityByte, slave.clientIdentityString, message);
                    return [2 /*return*/, true];
                });
            }); },
        });
    };
    /**
     * Get a slave using its program id
     */
    Master1_0.prototype.getSlaveByProgramIdentifier = function (programIdentifier) {
        // Look for the slave in confirmSlave
        var slave = this.slaves.find(function (x) { return x.programIdentifier === programIdentifier; });
        return slave || new Errors_1.default('E7004', "Identifier: " + programIdentifier);
    };
    /**
     * Using the programIdentifier, wait a specific incoming message from a specific slave
     *
     * Messages are like: { head: Object, body: Object }
     *
     * If there is no answer before the timeout, stop waiting and send an error
     */
    Master1_0.prototype.getMessageFromSlave = function (headString, programIdentifier, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = RoleAndTask_1.default.getInstance().masterMessageWaitingTimeout; }
        return PromiseCommandPattern_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                var timeoutFunction = false;
                // Look for the slave in confirmSlave
                var slave = _this.getSlaveByProgramIdentifier(programIdentifier);
                // Function that will receive messages from slaves
                var msgListener = function (clientIdentityByte, clientIdentityString, dataString) {
                    // Check the identifier to be the one we are waiting a message for
                    if (!(slave instanceof Errors_1.default) && clientIdentityString === slave.clientIdentityString) {
                        var dataJSON = Utils_1.default.convertStringToJSON(dataString);
                        // Here we got all messages that comes from clients (so slaves)
                        // Check if the message answer particular message
                        if (dataJSON && dataJSON[CONSTANT_1.default.PROTOCOL_KEYWORDS.HEAD] &&
                            dataJSON[CONSTANT_1.default.PROTOCOL_KEYWORDS.HEAD] === headString) {
                            // Stop the timeout
                            if (timeoutFunction) {
                                clearTimeout(timeoutFunction);
                            }
                            if (_this.communicationSystem === false) {
                                throw new Errors_1.default('EXXXX', 'communication system is false');
                            }
                            // Stop the listening
                            _this.communicationSystem.unlistenToIncomingMessage(msgListener);
                            // We get our message
                            return resolve(dataJSON[CONSTANT_1.default.PROTOCOL_KEYWORDS.BODY]);
                        }
                    }
                };
                // If the function get triggered, we reject an error
                timeoutFunction = setTimeout(function () {
                    if (_this.communicationSystem === false) {
                        throw new Errors_1.default('EXXXX', 'communication system is false');
                    }
                    // Stop the listening
                    _this.communicationSystem.unlistenToIncomingMessage(msgListener);
                    // Return an error
                    return reject(new Errors_1.default('E7005'));
                }, timeout);
                if (_this.communicationSystem === false) {
                    throw new Errors_1.default('EXXXX', 'communication system is false');
                }
                // Listen to incoming messages
                return _this.communicationSystem.listenToIncomingMessage(msgListener);
            }); },
        });
    };
    /**
     * Send the cpu load to the server periodically
     */
    Master1_0.prototype.infiniteGetCpuAndMemory = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.intervalFdCpuAndMemory)
                        return [2 /*return*/];
                    if (CONSTANT_1.default.DISPLAY_CPU_MEMORY_CHANGE_TIME) {
                        // When we connect, we send our infos to the master
                        this.intervalFdCpuAndMemory = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var cpuAndMemory, err_5;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, Utils_1.default.getCpuAndMemoryLoad()];
                                    case 1:
                                        cpuAndMemory = _a.sent();
                                        this.cpuUsageAndMemory = cpuAndMemory;
                                        // Say something change
                                        this.somethingChangedAboutSlavesOrI();
                                        if (!this.active && this.intervalFdCpuAndMemory) {
                                            clearInterval(this.intervalFdCpuAndMemory);
                                            this.intervalFdCpuAndMemory = null;
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_5 = _a.sent();
                                        RoleAndTask_1.default.getInstance()
                                            .errorHappened(err_5);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, CONSTANT_1.default.DISPLAY_CPU_MEMORY_CHANGE_TIME);
                    }
                    return [2 /*return*/];
                });
            }); },
        });
    };
    /**
     * Get periodically the infos about tasks running in master
     */
    Master1_0.prototype.infiniteGetTasksInfos = function () {
        var _this = this;
        if (this.intervalFdTasksInfos) {
            return;
        }
        this.intervalFdTasksInfos = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var taskHandler, infos, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        taskHandler = this.getTaskHandler();
                        if (taskHandler === false)
                            throw new Errors_1.default('EXXXX', 'no task handler');
                        return [4 /*yield*/, taskHandler.getInfosFromAllActiveTasks()];
                    case 1:
                        infos = _a.sent();
                        this.tasksInfos = infos;
                        this.somethingChangedAboutSlavesOrI();
                        // If the role is still active we call it back
                        if (!this.active && this.intervalFdTasksInfos) {
                            clearInterval(this.intervalFdTasksInfos);
                            this.intervalFdTasksInfos = null;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        RoleAndTask_1.default.getInstance()
                            .errorHappened(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, CONSTANT_1.default.SLAVES_INFOS_CHANGE_TIME);
    };
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
    Master1_0.prototype.start = function (_a) {
        var _this = this;
        var _b = _a.ipServer, ipServer = _b === void 0 ? CONSTANT_1.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _b, _c = _a.portServer, portServer = _c === void 0 ? CONSTANT_1.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _c;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Reinitialize some properties
                            this.initProperties();
                            // Create the OMQ Server
                            this.communicationSystem = new ZeroMQServerRouter_1.default();
                            // Start the communication system
                            return [4 /*yield*/, this.communicationSystem.start({
                                    ipServer: ipServer,
                                    portServer: portServer,
                                    transport: CONSTANT_1.default.ZERO_MQ.TRANSPORT.IPC,
                                })];
                        case 1:
                            // Start the communication system
                            _a.sent();
                            this.active = true;
                            this.protocolMasterSlave();
                            // Say something changed
                            this.somethingChangedAboutSlavesOrI();
                            // LaunchScenarios an infite get of cpu usage to give to handleProgramTask
                            this.infiniteGetCpuAndMemory();
                            // LaunchScenarios an infite get of tasks infos to give to handleProgramTask
                            this.infiniteGetTasksInfos();
                            return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    /**
     * Get the hierarchy level of the given task
     */
    Master1_0.getHierarchyLevelByIdTask = function (computeListClosure, idTask) {
        var toRet;
        computeListClosure.some(function (x) {
            if (x.idTask === idTask) {
                toRet = x.closureHierarchy;
                return true;
            }
            return false;
        });
        return toRet;
    };
    /**
     * Sort the array ASC by closureHierarchy
     */
    Master1_0.sortArray = function (ptr) {
        var arr = ptr;
        for (var i = 0; i < (arr.length - 1); i += 1) {
            if (arr[i].closureHierarchy > arr[i + 1].closureHierarchy) {
                var tmp = arr[i + 1];
                arr[i + 1] = arr[i];
                arr[i] = tmp;
                i = -1;
            }
        }
        return arr;
    };
    /**
     * This methods return the task we need to stop first
     * There is an hierarchie in tasks closure
     */
    Master1_0.prototype.chooseWhichTaskToStop = function () {
        var taskHandler = this.getTaskHandler();
        if (taskHandler === false)
            throw new Errors_1.default('EXXXX', 'no task handler');
        var tasksMaster = taskHandler.getTaskListStatus();
        // Compute a list in order of tasksID to close (following the closure hierarchy)
        var computeListClosure = Master1_0.sortArray(tasksMaster.map(function (x) { return ({
            idTask: x.id,
            closureHierarchy: x.closureHierarchy,
        }); }));
        // Now look at slaves tasks, then master task, about the task that is the higher in closure hierarchy
        var ret = {
            idTaskToRemove: false,
            isMasterTask: false,
            isSlaveTask: false,
            identifierSlave: false,
            hierarchyLevel: false,
            args: {},
        };
        var foundHighestInHierarchy = this.slaves.some(function (x) { return x.tasks.some(function (y) {
            // Look at the hierarchy level of the given task
            var hierarchyY = Master1_0.getHierarchyLevelByIdTask(computeListClosure, y.id);
            if (!y.isActive)
                return false;
            // Look if this hierarchy is higher than the save one
            if (ret.hierarchyLevel === false || (ret.hierarchyLevel > hierarchyY)) {
                // Save the task to be the one that get to be removed (for now!)
                ret.hierarchyLevel = hierarchyY;
                ret.idTaskToRemove = y.id;
                ret.isSlaveTask = true;
                ret.isMasterTask = false;
                ret.identifierSlave = x.programIdentifier;
                // If the task we have is the highest in hierarchy, no need to look furthers
                if (computeListClosure.length && hierarchyY === computeListClosure[0].closureHierarchy)
                    return true;
            }
            return false;
        }); });
        if (foundHighestInHierarchy)
            return ret;
        // We didn't found the higest task in the hierarchy so look at master tasks, its maybe there
        tasksMaster.some(function (x) {
            var hierarchyX = Master1_0.getHierarchyLevelByIdTask(computeListClosure, x.id);
            if (!x.isActive)
                return false;
            // Look if this hierarchy is higher than the save one
            if (ret.hierarchyLevel === false || (ret.hierarchyLevel > hierarchyX)) {
                // Save the task to be the one that get to be removed (for now!)
                ret.hierarchyLevel = hierarchyX;
                ret.idTaskToRemove = x.id;
                ret.isSlaveTask = false;
                ret.isMasterTask = true;
                ret.identifierSlave = false;
                // If the task we have is the highest in hierarchy, no need to look furthers
                if (computeListClosure.length && hierarchyX === computeListClosure[0].closureHierarchy)
                    return true;
            }
            return false;
        });
        return ret;
    };
    /**
     * Stop all tasks on every slave and master following a specific closure order
     * (Some tasks must be closed before/after some others)
     *
     * WARNING RECURSIVE CALL
     */
    Master1_0.prototype.stopAllTaskOnEverySlaveAndMaster = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, idTaskToRemove, isMasterTask, isSlaveTask, identifierSlave, args;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.chooseWhichTaskToStop(), idTaskToRemove = _a.idTaskToRemove, isMasterTask = _a.isMasterTask, isSlaveTask = _a.isSlaveTask, identifierSlave = _a.identifierSlave, args = _a.args;
                            // No more task to stop
                            if (idTaskToRemove === false) {
                                // Say something changed
                                this.somethingChangedAboutSlavesOrI();
                                return [2 /*return*/, true];
                            }
                            if (!isMasterTask) return [3 /*break*/, 2];
                            if (this.taskHandler === false)
                                throw new Errors_1.default('EXXXX', 'task handler is false');
                            return [4 /*yield*/, this.taskHandler.stopTask(idTaskToRemove, args)];
                        case 1:
                            _b.sent();
                            // Call next
                            return [2 /*return*/, this.stopAllTaskOnEverySlaveAndMaster()];
                        case 2:
                            if (!isSlaveTask) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.removeTaskFromSlave(identifierSlave, idTaskToRemove, args)];
                        case 3:
                            _b.sent();
                            // Call next
                            return [2 /*return*/, this.stopAllTaskOnEverySlaveAndMaster()];
                        case 4: return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    Master1_0.prototype.stop = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Say bye to every slaves
                        return [4 /*yield*/, this.stopAllTaskOnEverySlaveAndMaster()];
                        case 1:
                            // Say bye to every slaves
                            _a.sent();
                            return [4 /*yield*/, this.removeExistingSlave(this.slaves.map(function (x) { return x.programIdentifier; }))];
                        case 2:
                            _a.sent();
                            // Stop the infinite loops
                            if (this.intervalFdCpuAndMemory)
                                clearInterval(this.intervalFdCpuAndMemory);
                            if (this.intervalFdTasksInfos)
                                clearInterval(this.intervalFdTasksInfos);
                            if (!(this.communicationSystem !== false)) return [3 /*break*/, 4];
                            // Stop the communication system
                            return [4 /*yield*/, this.communicationSystem.stop()];
                        case 3:
                            // Stop the communication system
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            this.active = false;
                            return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    /**
     * Send the given message and wait for the response
     *
     * HERE WE CREATE TWO EXECUTIONS LIFES
     *
     * Put isHeadBodyPattern = true if you want to use the headBodyPattern
     */
    Master1_0.prototype.sendMessageAndWaitForTheResponse = function (_a) {
        var _this = this;
        var identifierSlave = _a.identifierSlave, messageHeaderToSend = _a.messageHeaderToSend, messageBodyToSend = _a.messageBodyToSend, messageHeaderToGet = _a.messageHeaderToGet, isHeadBodyPattern = _a.isHeadBodyPattern, 
        // Can be equals to undefined -> default timeout
        timeoutToGetMessage = _a.timeoutToGetMessage;
        return PromiseCommandPattern_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                // We switch to the appropriated func
                var sendMessageGoodFunc = function () {
                    if (isHeadBodyPattern)
                        return _this.sendMessageToSlaveHeadBodyPattern;
                    return _this.sendMessageToSlave;
                };
                var errAlreadyReturned = false;
                // Be ready to get the message from the slave before to send it the command
                _this.getMessageFromSlave(messageHeaderToGet, identifierSlave, timeoutToGetMessage)
                    // Job done
                    .then(resolve)
                    .catch(function (err) {
                    if (!errAlreadyReturned) {
                        errAlreadyReturned = true;
                        return reject(err);
                    }
                    return false;
                });
                // Send the command to the slave
                sendMessageGoodFunc()
                    .call(_this, identifierSlave, messageHeaderToSend, messageBodyToSend)
                    .then(function () {
                    // It went well, no wait getMessageFromSlave to get the message
                    // If the message is not coming, getMessageFromSlave will timeout and result of an error
                    //
                    // Nothing to do here anymore Mate!
                    //
                })
                    .catch(function (err) {
                    // The getMessageFromSlave will automatically timeout
                    if (!errAlreadyReturned) {
                        errAlreadyReturned = true;
                        return reject(err);
                    }
                    return false;
                });
            }); },
        });
    };
    return Master1_0;
}(AMaster_1.default));
exports.default = Master1_0;
