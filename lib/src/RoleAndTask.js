"use strict";
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
var v8_1 = __importDefault(require("v8"));
var CONSTANT_1 = __importDefault(require("./Utils/CONSTANT/CONSTANT"));
var Utils_1 = __importDefault(require("./Utils/Utils"));
var Errors_1 = __importDefault(require("./Utils/Errors"));
var RoleHandler_1 = __importDefault(require("./RoleSystem/Handlers/RoleHandler"));
var PromiseCommandPattern_1 = __importDefault(require("./Utils/PromiseCommandPattern"));
var instance = null;
/**
 * Class which is the interface with the library user
 */
var RoleAndTask = /** @class */ (function () {
    /**
     * Constructor working the Singleton way
     */
    function RoleAndTask() {
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
        this.makesErrorFatal = CONSTANT_1.default.MAKES_ERROR_FATAL;
        // Do we consider warning as errors ?
        this.considerWarningAsErrors = CONSTANT_1.default.CONSIDER_WARNING_AS_ERRORS;
        // The amount of time a master wait for a slave message before to timeout
        this.masterMessageWaitingTimeout = CONSTANT_1.default.MASTER_MESSAGE_WAITING_TIMEOUT;
        // The amount of time a master wait for a slave message to acknowledge the state change before to timeout
        this.masterMessageWaitingTimeoutStateChange = CONSTANT_1.default.MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE;
        // The amount of time a master wait for a slave message before to timeout
        this.masterMessageWaitingTimeoutStopTask = CONSTANT_1.default.MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK;
        this.masterMessageWaitingTimeoutStopChange = 30000;
        //
        //
        // Contains all the tasks referenced
        this.tasks = [];
        // Contains all the roles referenced
        this.roles = [];
        // Contains all the states the system can have
        this.states = [];
        // Array where we store the functions to call when the state change
        this.stateChangeCallbacks = [];
        // The state of program patform
        this.programState = CONSTANT_1.default.DEFAULT_STATES.LAUNCHING;
        // All the orders in a row to change the program state
        this.programStateChangeWaitingList = [];
        // When poping a new process, we start it using a "launching mode", there are two basic launching mode for "slave" and "master"
        // You can set up a custom launching mode
        this.customLaunchingMode = [];
        // Are we quitting?
        this.quitOrder = false;
        // Contains the functions to call to validate mutex take and release in master/slave protocol
        this.masterMutexValidationFunctions = [];
        this.systemBoot = null;
        // Initialize the role handler in here
        this.roleHandler = null;
        this.startDate = new Date();
        if (instance)
            return instance;
        this.tasks = __spreadArrays(Object.keys(CONSTANT_1.default.DEFAULT_TASK)
            .map(function (x) { return CONSTANT_1.default.DEFAULT_TASK[x]; })).filter(function (x) { return x.id !== -1; });
        this.roles = __spreadArrays(Object.keys(CONSTANT_1.default.DEFAULT_ROLES)
            .map(function (x) { return CONSTANT_1.default.DEFAULT_ROLES[x]; })).filter(function (x) { return x.id !== -1; });
        this.states = __spreadArrays(Object.keys(CONSTANT_1.default.DEFAULT_STATES)
            .map(function (x) { return CONSTANT_1.default.DEFAULT_STATES[x]; }));
        // Handle the signals such as SIGINT, SIGTERM...
        this.handleSignals();
        RoleAndTask.watchMemoryUsage();
        instance = this;
        return instance;
    }
    /**
     * Watch the memory usage of the current process.
     *
     * Show a warning at 60+% memory usage consumption
     * Throw an error at 90+% memory usage consumption
     *
     * Show a warning every 30 second at max
     */
    RoleAndTask.watchMemoryUsage = function () {
        var lastWarning = Date.now();
        var lastReport = Date.now();
        setInterval(function () {
            var _a = v8_1.default.getHeapStatistics(), total_heap_size = _a.total_heap_size, heap_size_limit = _a.heap_size_limit;
            var percentageUsed = total_heap_size * 100 / heap_size_limit;
            // Show a warning every 30 sec if a process is too high in memory usage
            if (percentageUsed > 60 && (Date.now() - lastWarning > 30000)) {
                lastWarning = Date.now();
                console.error("Warning: The memory consumption is reaching " + percentageUsed + "% - ELIOT will shut down at soon at it reaches 90+% to prevent memory allocation failure");
                console.error("Memory used :: Using " + total_heap_size + " / " + heap_size_limit);
            }
            if (percentageUsed > 90) {
                console.error("Error: The memory consumption is reaching " + percentageUsed + "% - ELIOT shut down to prevent memory allocation failure");
                console.error("Memory used :: Using " + total_heap_size + " / " + heap_size_limit);
                throw new Error('OUT_OF_MEMORY');
            }
        }, 3000);
    };
    /**
     * Get the good element to treat (Look at specific behavior described into lookAtProgramStateChangePipe comment)
     * (If there is actually something in progress, do nothing)
     */
    RoleAndTask.prototype.getProgramStateChangeToTreat = function () {
        // No change to perform
        if (!this.programStateChangeWaitingList.length)
            return false;
        var inProgress = false;
        var errorElement = false;
        this.programStateChangeWaitingList.some(function (x) {
            // We do nothing if something is in progress exept if error
            if (x.inProgress)
                inProgress = true;
            if (x.programState.id === CONSTANT_1.default.DEFAULT_STATES.ERROR.id) {
                errorElement = x;
                return true;
            }
            return false;
        });
        // Error comes first
        if (errorElement)
            return errorElement;
        // Then in progress
        if (inProgress)
            return false;
        // Then regular
        return this.programStateChangeWaitingList[0];
    };
    /**
     * Some program element got treated, remove them from the pipe
     * @param {Object} elem
     */
    RoleAndTask.prototype.programChangeElementGotTreated = function (elem) {
        this.programStateChangeWaitingList = this.programStateChangeWaitingList.filter(function (x) { return x !== elem; });
        // look if there is something else to do
        this.lookAtProgramStateChangePipe();
    };
    /**
     * Send the message saying the state change to whom is interested to know
     */
    RoleAndTask.prototype.spreadStateToListener = function () {
        var _this = this;
        this.stateChangeCallbacks.forEach(function (_a) {
            var callback = _a.callback;
            setImmediate(function () { return callback(_this.states.find(function (x) { return x.id === _this.programState.id; })); }, 0);
        });
    };
    /**
     * Look at the programStateChangeWaitingList array, and perform an program state change if we need to
     * Specific behavior:
     *
     * (1) Error change state always pass first
     * (2) When you want to change the state as something already true, resolve() directly
     */
    RoleAndTask.prototype.lookAtProgramStateChangePipe = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var elementToTreat, oldProgramState, role, ret, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            elementToTreat = this.getProgramStateChangeToTreat();
                            // Nothing to do
                            if (!elementToTreat)
                                return [2 /*return*/, false];
                            elementToTreat.inProgress = true;
                            // If the state is already the good one
                            if (elementToTreat.programState.id === this.programState.id) {
                                // Resolve the program change as a success
                                elementToTreat.resolve();
                                return [2 /*return*/, this.programChangeElementGotTreated(elementToTreat)];
                            }
                            oldProgramState = this.programState;
                            this.programState = elementToTreat.programState;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.getSlaveNorMaster()];
                        case 2:
                            role = _a.sent();
                            if (!(role.id === CONSTANT_1.default.DEFAULT_ROLES.MASTER_ROLE.id)) return [3 /*break*/, 4];
                            return [4 /*yield*/, role.handleProgramStateChange(elementToTreat.programState, oldProgramState)];
                        case 3:
                            ret = _a.sent();
                            // Say to everyone which is listening that the state changed
                            this.spreadStateToListener();
                            elementToTreat.resolve(ret);
                            return [2 /*return*/, this.programChangeElementGotTreated(elementToTreat)];
                        case 4:
                            // Say to everyone which is listening that the state changed
                            this.spreadStateToListener();
                            // If we are the slave - Do nothing else here (we just set the this.programState)
                            elementToTreat.resolve();
                            return [2 /*return*/, this.programChangeElementGotTreated(elementToTreat)];
                        case 5:
                            err_1 = _a.sent();
                            elementToTreat.reject(err_1);
                            return [2 /*return*/, this.programChangeElementGotTreated(elementToTreat)];
                        case 6: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * Singleton getter
     */
    RoleAndTask.getInstance = function () {
        return instance || new RoleAndTask();
    };
    /**
     * Launch the system
     *
     * We have to load dynamically systemBoot to avoid recursive import
     */
    RoleAndTask.prototype.boot = function () {
        return __awaiter(this, void 0, void 0, function () {
            var SystemBoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SystemBoot = require('./systemBoot/systemBoot.js')
                            .default;
                        this.systemBoot = new SystemBoot({
                            mode: this.mode,
                            modeoptions: this.modeoptions,
                        }).initialization();
                        if (this.systemBoot === null)
                            throw new Errors_1.default('EXXXX', 'systemboot null');
                        // Get the instances of the roles class before to push it into the roleHandler
                        this.roles = this.roles.map(function (x) { return (__assign(__assign({}, x), { 
                            // @ts-ignore
                            obj: x.class.getInstance() })); });
                        // Initialize the role handler in here
                        this.roleHandler = new RoleHandler_1.default(this.roles);
                        return [4 /*yield*/, this.systemBoot
                                .launch(this.launchMasterSlaveConfigurationFile)];
                    case 1:
                        _a.sent();
                        this.startDate = new Date();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Launch the system ** can be called static **
     */
    RoleAndTask.boot = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, RoleAndTask.getInstance()
                        .boot()];
            });
        });
    };
    /**
     * Subscribe to the state change. Returns the descriptor to use to unsubscribe
     */
    RoleAndTask.prototype.subscribeToStateChange = function (callback) {
        var descriptor = Utils_1.default.generateLittleID();
        this.stateChangeCallbacks.push({
            callback: callback,
            descriptor: descriptor,
        });
        return descriptor;
    };
    /**
     * Unsubscribe to state change, passing the descriptor returned by subscribe function
     */
    RoleAndTask.prototype.unSubscribeToStateChange = function (descriptor) {
        this.stateChangeCallbacks = this.stateChangeCallbacks.filter(function (x) { return x.descriptor !== descriptor; });
    };
    /**
     * Declare a new launching mode for processes
     *
     * Basics launching mode are 'slave' and 'master'.
     *
     * > If you want a custom Role maybe you would implement your curstom launching mode
     */
    RoleAndTask.prototype.declareLaunchingMode = function (name, func) {
        this.customLaunchingMode.push({
            name: name,
            func: func,
        });
    };
    /**
     * Remove a custom launching mode
     */
    RoleAndTask.prototype.unDeclareLaunchingMode = function (name) {
        this.customLaunchingMode = this.customLaunchingMode.filter(function (x) { return x.name !== name; });
    };
    /**
     * Declare a new state
     */
    RoleAndTask.prototype.declareState = function (stateConfiguration) {
        this.states.push(stateConfiguration);
    };
    /**
     * Declare a new Role
     *
     * {
     *   name: String,
     *   id: String,
     *   class: ARole,
     * }
     */
    RoleAndTask.prototype.declareRole = function (roleConfiguration) {
        this.roles.push(roleConfiguration);
    };
    /**
     * Declare the given task to the task system
     */
    RoleAndTask.prototype.declareTask = function (taskConfiguration) {
        this.tasks.push(taskConfiguration);
    };
    /**
     * Remove the task from the task list using the task id
     */
    RoleAndTask.prototype.removeTask = function (taskName) {
        this.tasks = this.tasks.filter(function (x) { return x.id !== taskName; });
    };
    /**
     * Get the tasks related to the given role id
     */
    RoleAndTask.prototype.getRoleTasks = function (idRole) {
        return this.tasks.filter(function (x) { return x.idsAllowedRole.includes(idRole); });
    };
    /**
     * Get the roles configuration
     */
    RoleAndTask.prototype.getRoles = function () {
        return this.roles.map(function (x) {
            if (x.id === -1)
                return false;
            return __assign(__assign({}, x), { obj: x.class.getInstance() });
        })
            .filter(function (x) { return x; });
    };
    /**
     * Get the actual running role
     */
    RoleAndTask.prototype.getActualRole = function (possibilities, i) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var roleHandler, role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // If there is no more possibilities - Error
                            if (i >= possibilities.length)
                                throw new Errors_1.default('EXXXX', 'No role available');
                            roleHandler = this.getRoleHandler();
                            if (roleHandler === null)
                                throw new Errors_1.default('EXXXX', 'role handler null');
                            return [4 /*yield*/, roleHandler.getRole(possibilities[i])];
                        case 1:
                            role = _a.sent();
                            // If its not active, do nothing
                            if (!role.isActive()) {
                                // Try next
                                return [2 /*return*/, false];
                            }
                            // Its good we can stop now
                            return [2 /*return*/, role];
                    }
                });
            }); },
        });
    };
    /**
     * Get the slave role nor the master
     * Take the first that is active
     */
    RoleAndTask.prototype.getSlaveNorMaster = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return Utils_1.default.promiseCallUntilTrue({
                functionToCall: _this.getActualRole,
                context: _this,
                args: [
                    _this.roles.map(function (x) { return x.id; }),
                ],
            }); },
        });
    };
    /**
     * Change the program state
     * Role master: Set this.programState & spread the news to itselfs tasks and slaves
     * Role slate: Set the this.programState
     */
    RoleAndTask.prototype.changeProgramState = function (idProgramState) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                // Push the order in the list of state change to perform
                _this.programStateChangeWaitingList.push({
                    resolve: resolve,
                    reject: reject,
                    programState: _this.states.find(function (x) { return x.id === idProgramState; }),
                    inProgress: false,
                });
                _this.lookAtProgramStateChangePipe();
            }); },
        });
    };
    /**
     * Get the name of the task who asked for the display
     */
    RoleAndTask.getTheTaskWhoPerformTheDisplay = function (role) {
        var roleHandler = role.getTaskHandler();
        if (roleHandler === false)
            throw new Errors_1.default('EXXXX', 'role handler false');
        var activeTasks = roleHandler.getAllActiveTasks();
        if (!activeTasks.length)
            return "" + process.pid;
        return activeTasks[0].name;
    };
    /**
     * Handle the display message throught the slaves and master
     * If we are master we display the message
     * If we are a slave we give the messsage to the master
     */
    RoleAndTask.prototype.displayMessage = function (param) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var role, isString, newParam, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getSlaveNorMaster()];
                        case 1:
                            role = _a.sent();
                            isString = Utils_1.default.isAString(param.str);
                            if (isString) {
                                return [2 /*return*/, role.displayMessage(__assign(__assign({}, param), { 
                                        // Add the task who perform the display
                                        from: RoleAndTask.getTheTaskWhoPerformTheDisplay(role), time: Date.now() }))];
                            }
                            newParam = __assign(__assign({}, param), { 
                                // Add the task who perform the display
                                from: RoleAndTask.getTheTaskWhoPerformTheDisplay(role), time: Date.now() });
                            newParam.str = JSON.stringify(newParam.str, null, 2);
                            // Add here the task who performed the display and the time of it
                            return [2 /*return*/, role.displayMessage(newParam)];
                        case 2:
                            e_1 = _a.sent();
                            // Here means that we have no role available, and so that we try to display message
                            // when the role is not even launched
                            // We simply ignore the message
                            // MESSAGE TO THE DEVELOPPER, DISPLAY NOTHING BEFORE ROLES GET STARTED
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * Here we come when an error happened on the system and we want to deal with it,
     * If we are the master, we tell ourselves about it
     * If we are a slave or ... we tell the master about it
     */
    RoleAndTask.prototype.errorHappened = function (err) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var role, e_2, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Error happens
                            Utils_1.default.displayMessage({
                                str: String((err instanceof Error ? (err && err.stack) : err) || err),
                                out: process.stderr,
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 9, , 10]);
                            return [4 /*yield*/, this.getSlaveNorMaster()];
                        case 2:
                            role = _a.sent();
                            if (role.id !== CONSTANT_1.default.DEFAULT_ROLES.MASTER_ROLE.id) {
                                // Send a message to the master
                                return [2 /*return*/, role.tellMasterErrorHappened(err)];
                            }
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 7, , 8]);
                            // If we are the master ourselves, we put program in error
                            return [4 /*yield*/, this.changeProgramState(CONSTANT_1.default.DEFAULT_STATES.ERROR.id)];
                        case 4:
                            // If we are the master ourselves, we put program in error
                            _a.sent();
                            // We did sent the message :)
                            // Display the error message
                            this.displayMessage({
                                str: String((err instanceof Error ? (err && err.stack) : err) || err),
                                tags: [
                                    CONSTANT_1.default.MESSAGE_DISPLAY_TAGS.ERROR,
                                ],
                            });
                            if (!RoleAndTask.getInstance().makesErrorFatal) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.makeTheMasterToQuitTheWholeApp()];
                        case 5:
                            _a.sent();
                            RoleAndTask.exitProgramUnproperDueToError();
                            _a.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            e_2 = _a.sent();
                            // We exit PROGRAM, nothing more we can do
                            // We locally display the error so it will finish into the node-error.log file
                            RoleAndTask.exitProgramMsg('Exit program unproper ERROR HAPPENED', err, e_2);
                            // We use setTimeout tho if there is some others things to do before the quit it will
                            RoleAndTask.exitProgramUnproperDueToError();
                            return [3 /*break*/, 8];
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            e_3 = _a.sent();
                            RoleAndTask.exitProgramMsg('Exit program unproper ERROR HAPPENED CATCH', err, e_3);
                            // We use setTimeout tho if there is some others things to do before the quit it will
                            RoleAndTask.exitProgramUnproperDueToError();
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/, false];
                    }
                });
            }); },
        });
    };
    /**
     * Display messages about exiting program in errorHappened
     */
    RoleAndTask.exitProgramMsg = function (txt, err, e) {
        // We exit PROGRAM, nothing more we can do
        Utils_1.default.displayMessage({
            str: String((err instanceof Error ? (err && err.stack) : err) || err),
            out: process.stderr,
        });
        // We locally display the error so it will finish into the node-error.log file
        Utils_1.default.displayMessage({
            str: String(e),
            out: process.stderr,
        });
        Utils_1.default.displayMessage({
            str: 'Exit program unproper ERROR HAPPENED CATCH',
            out: process.stderr,
        });
    };
    /**
     * Make the master to quit every slaves and every task
     * DO NOT QUIT THE APP
     */
    RoleAndTask.prototype.makeTheMasterToQuitEverySlaveAndTask = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Do nothing when we already got an order for closure
                            if (this.quitOrder)
                                return [2 /*return*/, false];
                            this.quitOrder = true;
                            return [4 /*yield*/, this.getSlaveNorMaster()];
                        case 1:
                            role = _a.sent();
                            // If we are the master - handle it
                            if (role.id !== CONSTANT_1.default.DEFAULT_ROLES.MASTER_ROLE.id)
                                throw new Errors_1.default('EXXXX', 'Closure not possible in a slave');
                            /**
                             * We change the program state to CLOSE
                             */
                            return [4 /*yield*/, this.changeProgramState(CONSTANT_1.default.DEFAULT_STATES.CLOSE.id)];
                        case 2:
                            /**
                             * We change the program state to CLOSE
                             */
                            _a.sent();
                            return [2 /*return*/, this.quit()];
                    }
                });
            }); },
        });
    };
    /**
     * Properly quit the app if we are on master
     * Ignore if we are inside something else
     */
    RoleAndTask.prototype.makeTheMasterToQuitTheWholeApp = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var quit, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // If the state is LAUNCHING do not quit the app
                            if (this.programState.id === CONSTANT_1.default.DEFAULT_STATES.LAUNCHING.id) {
                                this.displayMessage({
                                    str: 'Cannot close PROGRAM when the state is LAUNCHING',
                                });
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.makeTheMasterToQuitEverySlaveAndTask()];
                        case 2:
                            quit = _a.sent();
                            if (quit)
                                RoleAndTask.exitProgramGood();
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _a.sent();
                            RoleAndTask.getInstance()
                                .errorHappened(err_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * We exit PROGRAM unproperly due to an error that can't be fixed regulary
     * (Ex: lose the communication between the slave and the master and we are the slave)
     */
    RoleAndTask.exitProgramUnproperDueToError = function () {
        // Exit after a timeout to let the system makes the displays
        setTimeout(function () { return process.exit(1); }, CONSTANT_1.default.TIMEOUT_LEAVE_PROGRAM_UNPROPER);
    };
    /**
     * We exit PROGRAM when everything had been closed the right way
     */
    RoleAndTask.exitProgramGood = function () {
        Utils_1.default.displayMessage({
            str: 'Exit program good',
            out: process.stderr,
        });
        process.exit(0);
    };
    /**
     * Handle signals
     */
    RoleAndTask.prototype.handleSignals = function () {
        var _this = this;
        // Exit PROGRAM properly
        var signalActionProper = function () { return __awaiter(_this, void 0, void 0, function () {
            var role;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSlaveNorMaster()];
                    case 1:
                        role = _a.sent();
                        // If we are the master - handle it - if we are a slave ignore it
                        if (role.id !== CONSTANT_1.default.DEFAULT_ROLES.MASTER_ROLE.id)
                            return [2 /*return*/];
                        this.makeTheMasterToQuitTheWholeApp();
                        return [2 /*return*/];
                }
            });
        }); };
        // Exit PROGRAM unproperly
        var signalActionUnproper = function () {
            RoleAndTask.exitProgramUnproperDueToError();
        };
        Object.keys(CONSTANT_1.default.SIGNAL)
            .forEach(function (x) {
            process.on(CONSTANT_1.default.SIGNAL[x], function () { return signalActionProper(); });
        });
        Object.keys(CONSTANT_1.default.SIGNAL_UNPROPER)
            .forEach(function (x) {
            process.on(CONSTANT_1.default.SIGNAL_UNPROPER[x], function () { return signalActionUnproper(); });
        });
    };
    /**
     * Spread data to every tasks we locally hold
     */
    RoleAndTask.prototype.spreadDataToEveryLocalTask = function (_a) {
        var _this = this;
        var dataName = _a.dataName, data = _a.data, timestamp = _a.timestamp, limitToTaskList = _a.limitToTaskList;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var role, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getSlaveNorMaster()];
                        case 1:
                            role = _a.sent();
                            role.getTaskHandler()
                                .getAllActiveTasks()
                                .forEach(function (x) {
                                // Do not tell the tasks that do not require to know
                                if (!limitToTaskList || limitToTaskList.some(function (y) { return x.id === y; })) {
                                    // Make it asynchronous!
                                    setTimeout(function () {
                                        x.consumeNewsData(dataName, data, timestamp);
                                    }, 0);
                                }
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            err_3 = _a.sent();
                            this.errorHappened(err_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
        });
    };
    /**
     * THIS METHOD WORK ONLY IN THE MASTER
     * (It get called by HandleProgramTask)
     *
     * It returns in an array the whole system pids (Master + Slaves processes)
     */
    RoleAndTask.prototype.getFullSystemPids = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getMasterRole()];
                        case 1:
                            role = _a.sent();
                            return [2 /*return*/, role.getFullSystemPids()];
                    }
                });
            }); },
        });
    };
    /**
     * Get the master role (error if we are not in master role process)
     */
    RoleAndTask.prototype.getMasterRole = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var roleHandler, roleMaster;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            roleHandler = this.getRoleHandler();
                            if (roleHandler === null)
                                throw new Errors_1.default('EXXXX', 'role handler null');
                            return [4 /*yield*/, roleHandler.getRole(CONSTANT_1.default.DEFAULT_ROLES.MASTER_ROLE.id)];
                        case 1:
                            roleMaster = _a.sent();
                            // If its not active, do nothing
                            if (!roleMaster.isActive())
                                throw new Errors_1.default('EXXXX', 'Master is not active in getMasterRole');
                            // Its good
                            return [2 /*return*/, roleMaster];
                    }
                });
            }); },
        });
    };
    RoleAndTask.prototype.getRoleHandler = function () {
        return this.roleHandler;
    };
    /**
     * Quit everything that is open
     *
     * Including:
     *
     * -> Close the role (Slave or Master)
     * ----> If slave: Close its running tasks
     * ----> If master: Close all the slaves
     */
    RoleAndTask.prototype.quit = function () {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSlaveNorMaster()];
                        case 1:
                            role = _a.sent();
                            return [4 /*yield*/, role.stop()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    /**
     * Declare a new Role
     */
    RoleAndTask.declareRole = function (roleConfiguration) {
        this.getInstance()
            .declareRole(roleConfiguration);
    };
    /**
     * Declare a new State in addition of the defaults ones
     */
    RoleAndTask.declareState = function (stateConfiguration) {
        this.getInstance()
            .declareState(stateConfiguration);
    };
    /**
     * Declare the given task to the task system
     */
    RoleAndTask.declareTask = function (taskConfiguration) {
        this.getInstance()
            .declareTask(taskConfiguration);
    };
    /**
     * Remove the task from the task list using the task id
     */
    RoleAndTask.removeTask = function (taskName) {
        this.getInstance()
            .removeTask(taskName);
    };
    /**
     * Set the configuration through one function
     *
     * Returns the list of the configuration that has been accepted and setted
     */
    RoleAndTask.prototype.setConfiguration = function (opts) {
        var _this = this;
        var availableOpts = [
            'mode',
            'modeoptions',
            'displayTask',
            'launchMasterSlaveConfigurationFile',
            'pathToEntryFile',
            'displayLog',
            'makesErrorFatal',
            'considerWarningAsErrors',
            'masterMessageWaitingTimeout',
            'masterMessageWaitingTimeoutStateChange',
            'masterMessageWaitingTimeoutStopTask',
        ];
        var mandatoryOpts = [
            'mode',
            'modeoptions',
            'launchMasterSlaveConfigurationFile',
            'pathToEntryFile',
        ].reduce(function (tmp, x) {
            tmp[x] = null;
            return tmp;
        }, {});
        var setted = Object.keys(opts)
            .reduce(function (tmp, x) {
            // Unknown key
            if (!availableOpts.includes(x))
                return tmp;
            // Set the option value
            _this[x] = opts[x];
            tmp[x] = opts[x];
            if (mandatoryOpts[x] !== void 0) {
                mandatoryOpts[x] = true;
            }
            return tmp;
        }, {});
        if (Object.values(mandatoryOpts)
            .includes(null)) {
            throw new Error("Mandatory option " + Object.keys(mandatoryOpts).find(function (x) { return mandatoryOpts[x] === null; }) + " is missing");
        }
        // Display the options that has been setted up
        this.displayMessage({
            str: 'role-and-task : Following options has been setted up : ',
        });
        this.displayMessage({
            str: setted,
        });
        return setted;
    };
    /**
     * In master/slave protocol, we ask to get a token
     *
     * SHORTCUT
     */
    RoleAndTask.prototype.takeMutex = function (id) {
        var _this = this;
        return PromiseCommandPattern_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSlaveNorMaster()];
                        case 1:
                            role = _a.sent();
                            return [2 /*return*/, role.takeMutex(id)];
                    }
                });
            }); },
        });
    };
    /**
     * In master/slave protocol, we ask to release the token
     *
     * SHORTCUT
     */
    RoleAndTask.prototype.releaseMutex = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, PromiseCommandPattern_1.default({
                        func: function () { return __awaiter(_this, void 0, void 0, function () {
                            var role;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getSlaveNorMaster()];
                                    case 1:
                                        role = _a.sent();
                                        return [2 /*return*/, role.releaseMutex(id)];
                                }
                            });
                        }); },
                    })];
            });
        });
    };
    /**
     * Contains the functions to call to validate mutex take and release in master/slave protocol
     */
    RoleAndTask.prototype.getMasterMutexFunctions = function () {
        return this.masterMutexValidationFunctions;
    };
    /**
     * Add a function to be called when a user want to take the Mutex related to the given id
     *
     * The function have to throw an error if the token cannot be taken, if it goes well, consider the mutex to be taken
     */
    RoleAndTask.prototype.addMasterMutexFunctions = function (id, funcTake, funcRelease) {
        this.masterMutexValidationFunctions.push({
            id: id,
            funcTake: funcTake,
            funcRelease: funcRelease,
        });
    };
    return RoleAndTask;
}());
exports.default = RoleAndTask;
