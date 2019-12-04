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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var ASlave_js_1 = __importDefault(require("./ASlave.js"));
var CONSTANT_js_1 = __importDefault(require("../../../Utils/CONSTANT/CONSTANT.js"));
var TaskHandler_js_1 = __importDefault(require("../../Handlers/TaskHandler.js"));
var Utils_js_1 = __importDefault(require("../../../Utils/Utils.js"));
var Errors_js_1 = __importDefault(require("../../../Utils/Errors.js"));
var RoleAndTask_js_1 = __importDefault(require("../../../RoleAndTask.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../../Utils/PromiseCommandPattern.js"));
var ZeroMQClientDealer_js_1 = __importDefault(require("../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/ZeroMQClientDealer.js"));
var instance = null;
/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 */
var Slave1_0 = /** @class */ (function (_super) {
    __extends(Slave1_0, _super);
    /**
     * Ask if we want a brand new instance (If you don't create a new instance here as asked
     * you will have trouble in inheritance - child of this class)
     */
    function Slave1_0(oneshotNewInstance) {
        if (oneshotNewInstance === void 0) { oneshotNewInstance = false; }
        var _this = _super.call(this) || this;
        // Define none communicationSystem for now
        _this.communicationSystem = false;
        if (instance && !oneshotNewInstance)
            return instance;
        _this.name = CONSTANT_js_1.default.DEFAULT_ROLES.SLAVE_ROLE.name;
        _this.id = CONSTANT_js_1.default.DEFAULT_ROLES.SLAVE_ROLE.id;
        // Get the tasks related to the master role
        var tasks = RoleAndTask_js_1.default.getInstance()
            .getRoleTasks(CONSTANT_js_1.default.DEFAULT_ROLES.SLAVE_ROLE.id);
        // Define all tasks handled by this role
        _this.setTaskHandler(new TaskHandler_js_1.default(tasks));
        if (oneshotNewInstance)
            return _this;
        instance = _this;
        return instance;
    }
    /**
     * SINGLETON implementation
     */
    Slave1_0.getInstance = function () {
        return instance || new Slave1_0();
    };
    /**
     * Get the communicationSystem
     */
    Slave1_0.prototype.getCommunicationSystem = function () {
        return this.communicationSystem;
    };
    /**
     * Display a message by giving it to the master
     */
    Slave1_0.prototype.displayMessage = function (params) {
        // If we disallow log display, stop it here
        if (!RoleAndTask_js_1.default.getInstance()
            .displayLog)
            return;
        this.sendHeadBodyMessageToServer(CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.OUTPUT_TEXT, params);
    };
    /**
     * Send the task list to the server
     */
    Slave1_0.prototype.sendTaskList = function () {
        var handler = this.getTaskHandler();
        if (handler === false)
            throw new Errors_js_1.default('EXXXX', 'no task handler');
        var buildMsg = this.buildHeadBodyMessage(CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS, handler.getTaskListStatus());
        var communication = this.getCommunicationSystem();
        if (communication === false)
            throw new Errors_js_1.default('EXXXX', 'no communication');
        return communication.sendMessage(buildMsg);
    };
    /**
     * We send our tasks and the type of slave we are
     */
    Slave1_0.prototype.sendConfirmationInformations = function () {
        var handler = this.getTaskHandler();
        if (handler === false)
            throw new Errors_js_1.default('EXXXX', 'no task handler');
        var buildMsg = this.buildHeadBodyMessage(CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.SLAVE_CONFIRMATION_INFORMATIONS, {
            tasks: handler.getTaskListStatus(),
            role: {
                id: this.id,
                name: this.name,
            },
        });
        var communication = this.getCommunicationSystem();
        if (communication === false)
            throw new Errors_js_1.default('EXXXX', 'no communication');
        return communication.sendMessage(buildMsg);
    };
    /**
     * We get asked to spread a news to every slave tasks -> Send the request to master
     */
    Slave1_0.prototype.sendDataToEveryProgramTaskWhereverItIs = function (data) {
        var buildMsg = this.buildHeadBodyMessage(CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, data);
        var communication = this.getCommunicationSystem();
        if (communication === false)
            throw new Errors_js_1.default('EXXXX', 'no communication');
        communication.sendMessage(buildMsg);
    };
    /**
     * Send message to server using head/body pattern
     */
    Slave1_0.prototype.sendHeadBodyMessageToServer = function (head, body) {
        var buildMsg = this.buildHeadBodyMessage(head, body);
        var communication = this.getCommunicationSystem();
        if (communication === false)
            throw new Errors_js_1.default('EXXXX', 'no communication');
        // Error in message
        return communication.sendMessage(buildMsg);
    };
    /**
     * Start a task
     */
    Slave1_0.prototype.protocolStartTask = function (body) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var START_TASK, handler, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            START_TASK = CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK;
                            // We should have something like { idTask: String, args: {} }
                            if (!body || !body.idTask || !body.args) {
                                // Error in message
                                return [2 /*return*/, this.sendHeadBodyMessageToServer(START_TASK, new Errors_js_1.default('E7006')
                                        .serialize())];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            handler = this.getTaskHandler();
                            if (handler === false)
                                throw new Errors_js_1.default('EXXXX', 'no task handler');
                            return [4 /*yield*/, handler.startTask(body.idTask, __assign(__assign({}, body.args), { role: this }))];
                        case 2:
                            _a.sent();
                            // Task get successfuly added
                            this.sendHeadBodyMessageToServer(START_TASK, '');
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            this.sendHeadBodyMessageToServer(START_TASK, err_1 instanceof Errors_js_1.default ? (err_1.serialize && err_1.serialize()) : String(err_1));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, false];
                    }
                });
            }); },
        });
    };
    /**
     * Stop a task
     */
    Slave1_0.prototype.protocolStopTask = function (body) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var STOP_TASK, handler, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            STOP_TASK = CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STOP_TASK;
                            // We should have something like { idTask: String, args: {} }
                            if (!body || !body.idTask || !body.args) {
                                // Error in message
                                return [2 /*return*/, this.sendHeadBodyMessageToServer(STOP_TASK, new Errors_js_1.default('E7006')
                                        .serialize())];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            handler = this.getTaskHandler();
                            if (handler === false)
                                throw new Errors_js_1.default('EXXXX', 'no task handler');
                            return [4 /*yield*/, handler.stopTask(body.idTask, body.args)];
                        case 2:
                            _a.sent();
                            // Task get successfuly stopped
                            this.sendHeadBodyMessageToServer(STOP_TASK, '');
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _a.sent();
                            this.sendHeadBodyMessageToServer(STOP_TASK, err_2 instanceof Errors_js_1.default ? (err_2.serialize && err_2.serialize()) : String(err_2));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, false];
                    }
                });
            }); },
        });
    };
    /**
     * As a slave we send our infos to the master throught this method
     * Infos are: IP Address, CPU and memory Load, tasks infos ...
     */
    Slave1_0.prototype.protocolSendMyInfosToMaster = function (_a) {
        var _this = this;
        var ip = _a.ip, cpuAndMemory = _a.cpuAndMemory, tasksInfos = _a.tasksInfos;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var INFOS_ABOUT_SLAVES, infos, ret, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            INFOS_ABOUT_SLAVES = CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.INFOS_ABOUT_SLAVES;
                            infos = {};
                            // Add the ip address
                            if (ip)
                                infos.ips = Utils_js_1.default.givesLocalIps();
                            // Add the tasks infos
                            if (tasksInfos)
                                infos.tasksInfos = tasksInfos;
                            if (!cpuAndMemory) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Utils_js_1.default.getCpuAndMemoryLoad()];
                        case 2:
                            ret = _a.sent();
                            infos.cpuAndMemory = ret;
                            this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
                            return [3 /*break*/, 4];
                        case 3:
                            err_3 = _a.sent();
                            infos.cpuAndMemory = err_3 instanceof Errors_js_1.default ? (err_3.serialize && err_3.serialize()) : String(err_3);
                            this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, false];
                        case 5: return [2 /*return*/, this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos)];
                    }
                });
            }); },
        });
    };
    /**
     * Connect a task to an other task
     * @param {Object} body
     */
    Slave1_0.prototype.protocolConnectTasks = function (body) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, CONNECT_TASK_TO_TASK, START_TASK, handler, task, err_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES, CONNECT_TASK_TO_TASK = _a.CONNECT_TASK_TO_TASK, START_TASK = _a.START_TASK;
                            // We should have something like { idTask: String, idTaskToConnect: String, args: {} }
                            if (!body || !body.idTask || !body.idTaskToConnect || !body.args) {
                                // Error in message
                                return [2 /*return*/, this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, new Errors_js_1.default('E7006')
                                        .serialize())];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, , 8]);
                            handler = this.getTaskHandler();
                            if (handler === false)
                                throw new Errors_js_1.default('EXXXX', 'no task handler');
                            return [4 /*yield*/, handler.getTask(body.idTask)];
                        case 2:
                            task = _b.sent();
                            if (!!task.isActive()) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.sendHeadBodyMessageToServer(START_TASK, new Errors_js_1.default('E7009', "idTask: " + body.idTask))];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 4: 
                        // Ask the connection to be made
                        return [4 /*yield*/, task.connectToTask(body.idTaskToConnect, body.args)];
                        case 5:
                            // Ask the connection to be made
                            _b.sent();
                            _b.label = 6;
                        case 6:
                            this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, '');
                            return [3 /*break*/, 8];
                        case 7:
                            err_4 = _b.sent();
                            this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, err_4.serialize());
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/, false];
                    }
                });
            }); },
        });
    };
    /**
     * We got a news from the master. We have to spread the news to every tasks we hold.
     * @param {{dataName: String, data: Object, timestamp: Date}} body
     */
    Slave1_0.protocolGenericChannelData = function (body) {
        // For itself tasks
        RoleAndTask_js_1.default.getInstance()
            .spreadDataToEveryLocalTask(body);
    };
    /**
     * We got a news about PROGRAM state change
     * We tell all our tasks about the change and send a result of spread to the master
     * @param {{ programState: any, oldProgramState: any }} body
     */
    Slave1_0.prototype.protocolStateChange = function (body) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var STATE_CHANGE, handler, err_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            STATE_CHANGE = CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.STATE_CHANGE;
                            // We should have something like { programState: any }
                            if (!body || !body.programState || !body.oldProgramState) {
                                // Error in message
                                return [2 /*return*/, this.sendHeadBodyMessageToServer(STATE_CHANGE, new Errors_js_1.default('E7006')
                                        .serialize())];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            // Store the new state
                            return [4 /*yield*/, RoleAndTask_js_1.default.getInstance()
                                    .changeProgramState(body.programState.id)];
                        case 2:
                            // Store the new state
                            _a.sent();
                            handler = this.getTaskHandler();
                            if (handler === false)
                                throw new Errors_js_1.default('EXXXX', 'no task handler');
                            // Apply the new state
                            return [4 /*yield*/, handler.applyNewProgramState(body.programState, body.oldProgramState)];
                        case 3:
                            // Apply the new state
                            _a.sent();
                            // New state get successfuly spread
                            return [2 /*return*/, this.sendHeadBodyMessageToServer(STATE_CHANGE, '')];
                        case 4:
                            err_5 = _a.sent();
                            // New state didn't get successfuly spread
                            this.sendHeadBodyMessageToServer(STATE_CHANGE, err_5 instanceof Errors_js_1.default ? (err_5.serialize && err_5.serialize()) : String(err_5));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/, false];
                    }
                });
            }); },
        });
    };
    /**
     * We got an error that happended into the slave process
     * We send the error to the master, to make it do something about it
     * @param {Error)} err
     */
    Slave1_0.prototype.tellMasterErrorHappened = function (err) {
        // Send the error to the master
        this.sendHeadBodyMessageToServer(CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.ERROR_HAPPENED, String(new Errors_js_1.default(err.toString())));
    };
    /**
     * We want to take the mutex behind the given id
     */
    Slave1_0.prototype.takeMutex = function (id) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var TAKE_MUTEX, ret, json;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            TAKE_MUTEX = CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.TAKE_MUTEX;
                            return [4 /*yield*/, this.sendMessageAndWaitForTheResponse({
                                    messageHeaderToSend: TAKE_MUTEX,
                                    messageBodyToSend: JSON.stringify({
                                        id: id,
                                    }),
                                    messageHeaderToGet: TAKE_MUTEX,
                                    isHeadBodyPattern: true,
                                    timeoutToGetMessage: CONSTANT_js_1.default.MASTER_SLAVE_MUTEX_MESSAGES_WAITING_TIMEOUT,
                                })];
                        case 1:
                            ret = _a.sent();
                            json = Utils_js_1.default.convertStringToJSON(ret);
                            if (!json || !json.error)
                                return [2 /*return*/, true];
                            throw Errors_js_1.default.deserialize(json.error);
                    }
                });
            }); },
        });
    };
    /**
     * We want to release the mutex behind the given id
     */
    Slave1_0.prototype.releaseMutex = function (id) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var RELEASE_MUTEX, ret, json;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            RELEASE_MUTEX = CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES.RELEASE_MUTEX;
                            return [4 /*yield*/, this.sendMessageAndWaitForTheResponse({
                                    messageHeaderToSend: RELEASE_MUTEX,
                                    messageBodyToSend: JSON.stringify({
                                        id: id,
                                    }),
                                    messageHeaderToGet: RELEASE_MUTEX,
                                    isHeadBodyPattern: true,
                                    timeoutToGetMessage: CONSTANT_js_1.default.MASTER_SLAVE_MUTEX_MESSAGES_WAITING_TIMEOUT,
                                })];
                        case 1:
                            ret = _a.sent();
                            json = Utils_js_1.default.convertStringToJSON(ret);
                            if (!json || !json.error)
                                return [2 /*return*/, true];
                            throw Errors_js_1.default.deserialize(json.error);
                    }
                });
            }); },
        });
    };
    /**
     * Define the protocol between master and a slaves
     */
    Slave1_0.prototype.protocolMasterSlave = function () {
        var _this = this;
        var communication = this.getCommunicationSystem();
        if (communication === false)
            throw new Errors_js_1.default('EXXXX', 'no communication');
        // We listen to incoming messages
        communication.listenToIncomingMessage(function (dataString) {
            var dataJSON = Utils_js_1.default.convertStringToJSON(dataString);
            var _a = CONSTANT_js_1.default.PROTOCOL_KEYWORDS, HEAD = _a.HEAD, BODY = _a.BODY;
            var _b = CONSTANT_js_1.default.PROTOCOL_MASTER_SLAVE.MESSAGES, LIST_TASKS = _b.LIST_TASKS, START_TASK = _b.START_TASK, STOP_TASK = _b.STOP_TASK, CONNECT_TASK_TO_TASK = _b.CONNECT_TASK_TO_TASK, GENERIC_CHANNEL_DATA = _b.GENERIC_CHANNEL_DATA, CLOSE = _b.CLOSE, STATE_CHANGE = _b.STATE_CHANGE, SLAVE_CONFIRMATION_INFORMATIONS = _b.SLAVE_CONFIRMATION_INFORMATIONS;
            // Here we got all messages that comes from server (so master)
            // Check if the message answer particular message
            // If it does apply the particular job
            [{
                    // Check about the list of tasks
                    checkFunc: function () { return dataString === LIST_TASKS; },
                    // It means we get asked about our tasks list
                    applyFunc: function () { return _this.sendTaskList(); },
                }, {
                    // Check about the ask for infos
                    checkFunc: function () { return dataString === SLAVE_CONFIRMATION_INFORMATIONS; },
                    // It means we get asked about our informations
                    applyFunc: function () { return _this.sendConfirmationInformations(); },
                }, {
                    // Check about add a task
                    checkFunc: function () { return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === START_TASK; },
                    // It means we get asked about starting a task
                    applyFunc: function () { return _this.protocolStartTask(dataJSON[BODY]); },
                }, {
                    // Check about connect a task to an other task
                    checkFunc: function () { return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === CONNECT_TASK_TO_TASK; },
                    applyFunc: function () { return _this.protocolConnectTasks(dataJSON[BODY]); },
                }, {
                    // Check about news about generic channel data
                    checkFunc: function () { return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === GENERIC_CHANNEL_DATA; },
                    applyFunc: function () { return Slave1_0.protocolGenericChannelData(dataJSON[BODY]); },
                }, {
                    // Check about news about program state
                    checkFunc: function () { return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === STATE_CHANGE; },
                    applyFunc: function () { return _this.protocolStateChange(dataJSON[BODY]); },
                }, {
                    // Check about close order
                    checkFunc: function () { return dataString === CLOSE; },
                    applyFunc: function () { return __awaiter(_this, void 0, void 0, function () {
                        var e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.stop()];
                                case 1:
                                    _a.sent();
                                    RoleAndTask_js_1.default.exitProgramGood();
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    Utils_js_1.default.displayMessage({
                                        str: "Exit program unproper CLOSE ORDER FAILED [" + String(e_1) + "]",
                                        out: process.stderr,
                                    });
                                    RoleAndTask_js_1.default.exitProgramUnproperDueToError();
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); },
                }, {
                    // Check about close a task
                    checkFunc: function () { return dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === STOP_TASK; },
                    applyFunc: function () { return _this.protocolStopTask(dataJSON[BODY]); },
                }].forEach(function (x) {
                if (x.checkFunc())
                    x.applyFunc();
            });
        }, this);
    };
    /**
     * Send the cpu and memory load to the server periodically
     */
    Slave1_0.prototype.infiniteSendCpuAndMemoryLoadToMaster = function () {
        var _this = this;
        if (this.intervalFdCpuAndMemory)
            return;
        if (CONSTANT_js_1.default.DISPLAY_CPU_MEMORY_CHANGE_TIME) {
            // When we connect, we send our infos to the master
            this.intervalFdCpuAndMemory = setInterval(function () {
                _this.protocolSendMyInfosToMaster({
                    cpuAndMemory: true,
                });
                if (!_this.active && _this.intervalFdCpuAndMemory) {
                    clearInterval(_this.intervalFdCpuAndMemory);
                    _this.intervalFdCpuAndMemory = false;
                }
            }, CONSTANT_js_1.default.DISPLAY_CPU_MEMORY_CHANGE_TIME);
        }
    };
    /**
     * Send the cpu and memory load to the server periodically
     */
    Slave1_0.prototype.infiniteSendTasksInfosToMaster = function () {
        var _this = this;
        if (this.intervalFdTasksInfos)
            return;
        // When we connect, we send our infos to the master
        this.intervalFdTasksInfos = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var handler, infos, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        handler = this.getTaskHandler();
                        if (handler === false)
                            throw new Errors_js_1.default('EXXXX', 'no task handler');
                        return [4 /*yield*/, handler.getInfosFromAllActiveTasks()];
                    case 1:
                        infos = _a.sent();
                        // Send the data to the master
                        this.protocolSendMyInfosToMaster({
                            tasksInfos: infos,
                        });
                        // If the role is still active we call it back
                        if (!this.active && this.intervalFdTasksInfos) {
                            clearInterval(this.intervalFdTasksInfos);
                            this.intervalFdTasksInfos = false;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        RoleAndTask_js_1.default.getInstance()
                            .errorHappened(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, CONSTANT_js_1.default.SLAVES_INFOS_CHANGE_TIME);
    };
    /**
     * Start the slave1_0
     */
    Slave1_0.prototype.startSlave1_0 = function (_a) {
        var _this = this;
        var _b = _a.ipServer, ipServer = _b === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _b, _c = _a.portServer, portServer = _c === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _c, identifier = _a.identifier, eliotStartTime = _a.eliotStartTime;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Create the OMQ Server
                            this.communicationSystem = new ZeroMQClientDealer_js_1.default();
                            // This time is coming from the master, it's the same among all slaves
                            this.referenceStartTime = Number(eliotStartTime);
                            this.protocolMasterSlave();
                            // Start the communication system
                            return [4 /*yield*/, this.communicationSystem.start({
                                    ipServer: ipServer,
                                    portServer: portServer,
                                    transport: CONSTANT_js_1.default.ZERO_MQ.TRANSPORT.IPC,
                                    identityPrefix: identifier,
                                })];
                        case 1:
                            // Start the communication system
                            _a.sent();
                            this.active = true;
                            // When we connect, we send our infos to the master
                            this.protocolSendMyInfosToMaster({
                                ip: true,
                            });
                            // Every X sec get the CPU and the Memory and send it to the master
                            this.infiniteSendCpuAndMemoryLoadToMaster();
                            // Every X sec get infos from the active tasks and send them to the master
                            this.infiniteSendTasksInfosToMaster();
                            // Look at when we get connected
                            this.communicationSystem.listenConnectEvent(function (client) {
                                RoleAndTask_js_1.default.getInstance()
                                    .displayMessage({
                                    str: ("Connected " + client).yellow,
                                });
                            });
                            // Look at when we get disconnected
                            this.communicationSystem.listenDisconnectEvent(function (client) { return RoleAndTask_js_1.default.getInstance()
                                .displayMessage({
                                str: ("Disconnected " + client).yellow,
                            }); });
                            return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    Slave1_0.prototype.start = function (args) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.startSlave1_0(args); },
        });
    };
    Slave1_0.prototype.stop = function () {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var handler, communication;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            RoleAndTask_js_1.default.getInstance()
                                .displayMessage({
                                str: 'Ask Role Slave To Stop'.cyan,
                            });
                            handler = this.getTaskHandler();
                            if (handler === false)
                                throw new Errors_js_1.default('EXXXX', 'no task handler');
                            // Stop all its tasks
                            return [4 /*yield*/, handler.stopAllTask()];
                        case 1:
                            // Stop all its tasks
                            _a.sent();
                            // Stop the infinite loops
                            if (this.intervalFdCpuAndMemory)
                                clearInterval(this.intervalFdCpuAndMemory);
                            if (this.intervalFdTasksInfos)
                                clearInterval(this.intervalFdTasksInfos);
                            communication = this.getCommunicationSystem();
                            if (communication === false)
                                throw new Errors_js_1.default('EXXXX', 'no communication');
                            // Stop the communication system
                            return [4 /*yield*/, communication.stop()];
                        case 2:
                            // Stop the communication system
                            _a.sent();
                            RoleAndTask_js_1.default.getInstance()
                                .displayMessage({
                                str: 'Role Slave Stopped'.red,
                            });
                            this.active = false;
                            return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    /**
     * Send the data to the server
     * @param {String} data
     */
    Slave1_0.prototype.sendMessage = function (data) {
        var communication = this.getCommunicationSystem();
        if (communication === false)
            throw new Errors_js_1.default('EXXXX', 'no communication');
        communication.sendMessage(data);
    };
    /**
     * Wait a specific incoming message from the server
     *
     * Messages are like: { head: Object, body: Object }
     *
     * If there is no answer before the timeout, stop waiting and send an error
     */
    Slave1_0.prototype.getMessageFromServer = function (headString, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = RoleAndTask_js_1.default.getInstance().masterMessageWaitingTimeout; }
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                var timeoutFunction = false;
                var communication = _this.getCommunicationSystem();
                if (communication === false)
                    throw new Errors_js_1.default('EXXXX', 'no communication');
                // Function that will receive messages from the server
                var msgListener = function (dataString) {
                    var dataJSON = Utils_js_1.default.convertStringToJSON(dataString);
                    // Here we got all messages that comes from the server
                    // Check if the message answer particular message
                    if (dataJSON && dataJSON[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.HEAD] && dataJSON[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.HEAD] === headString) {
                        // Stop the timeout
                        clearTimeout(timeoutFunction);
                        // Stop the listening
                        communication.unlistenToIncomingMessage(msgListener);
                        // We get our message
                        return resolve(dataJSON[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.BODY]);
                    }
                    return false;
                };
                // If the function get triggered, we reject an error
                timeoutFunction = setTimeout(function () {
                    console.error('SLAVE :: getMessageFromServer :: TIMEOUT');
                    // Stop the listening
                    communication.unlistenToIncomingMessage(msgListener);
                    // Return an error
                    return reject(new Errors_js_1.default('E7005'));
                }, timeout);
                // Listen to incoming messages
                return communication.listenToIncomingMessage(msgListener, _this);
            }); },
        });
    };
    /**
     * Send the given message and wait for the response
     *
     * HERE WE CREATE TWO EXECUTIONS LIFES
     *
     * Put isHeadBodyPattern = true if you want to use the headBodyPattern
     *
     * @param {Object} args
     */
    Slave1_0.prototype.sendMessageAndWaitForTheResponse = function (_a) {
        var _this = this;
        var messageHeaderToSend = _a.messageHeaderToSend, messageBodyToSend = _a.messageBodyToSend, messageHeaderToGet = _a.messageHeaderToGet, isHeadBodyPattern = _a.isHeadBodyPattern, 
        // Can be equals to undefined -> default timeout
        timeoutToGetMessage = _a.timeoutToGetMessage;
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve, reject) {
                var errAlreadyReturned = false;
                // Be ready to get the message from the slave before to send it the command
                _this.getMessageFromServer(messageHeaderToGet, timeoutToGetMessage)
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
                if (isHeadBodyPattern)
                    return _this.sendHeadBodyMessageToServer(messageHeaderToSend, messageBodyToSend);
                return _this.sendMessage(messageBodyToSend);
                // It went well, no wait getMessageFromServer to get the message
                // If the message is not coming, getMessageFromServer will timeout and result of an error
                //
                // Nothing to do here anymore Mate!
                //
            }); },
        });
    };
    return Slave1_0;
}(ASlave_js_1.default));
exports.default = Slave1_0;
