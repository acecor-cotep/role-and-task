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
var Library_js_1 = __importDefault(require("../../src/Library.js"));
// Imports
var instance = null;
/**
 * Define a Simple task which display a message every X seconds
 */
var ClientTask = /** @class */ (function (_super) {
    __extends(ClientTask, _super);
    function ClientTask() {
        var _this = _super.call(this) || this;
        _this.client = null;
        if (instance)
            return instance;
        _this.name = 'ClientTask';
        _this.id = '11';
        // Pointer to the role it is assigned to
        _this.role = false;
        instance = _this;
        return instance;
    }
    /**
     * Connect the actual task to the given task
     */
    ClientTask.prototype.connectToTask = function (idTaskToConnect, args) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /**
     * We get news data from here, use it or not, it depends from the task
     */
    ClientTask.prototype.consumeNewsData = function (dataName, data, timestamp) { };
    /**
     * Use the architecture data we have to generate an array that's gonna resume it
     * You can override it
     */
    ClientTask.prototype.dynamicallyRefreshDataIntoList = function (data) { };
    /**
     * Display a message in board
     */
    ClientTask.prototype.displayMessage = function (param) { };
    /*
     * ======================================================================================================================================
     *                                                  HANDLE STATE CHANGE
     * ======================================================================================================================================
     */
    /**
     * apply the eliot state on the task
     * @param {Number} programState
     * @param {Number} oldEliotState
     * @override
     */
    ClientTask.prototype.applyNewProgramState = function (programState) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, READY_PROCESS, ERROR, CLOSE;
            return __generator(this, function (_b) {
                _a = Library_js_1.default.CONSTANT.DEFAULT_STATES, READY_PROCESS = _a.READY_PROCESS, ERROR = _a.ERROR, CLOSE = _a.CLOSE;
                // @ts-ignore
                console.log(" > " + process.pid + " : Handling new state " + programState.name);
                // Depending on the state of the system we are starting or stoping the dispay
                if (programState.id === READY_PROCESS.id) {
                    this.startMessageSending();
                    return [2 /*return*/];
                }
                if (programState.id === CLOSE.id || programState.id === ERROR.id) {
                    this.stopMessageSending();
                }
                return [2 /*return*/];
            });
        });
    };
    /*
     * ======================================================================================================================================
     *                                                 TASK METHODS
     * ======================================================================================================================================
     */
    ClientTask.prototype.startMessageSending = function () {
        var _this = this;
        // @ts-ignore
        console.log(" > " + process.pid + " : Start sending messages");
        this.descriptor = setInterval(function () {
            // @ts-ignore
            _this.client.sendMessageToServer(" > " + process.pid + " : working in progress ...");
        }, 1000);
    };
    ClientTask.prototype.stopMessageSending = function () {
        // @ts-ignore
        console.log(" > " + process.pid + " : Stop sending messages");
        clearInterval(this.descriptor);
    };
    /*
     * ======================================================================================================================================
     *                                                 OVERRIDE BASICS
     * ======================================================================================================================================
     */
    /**
     * SINGLETON implementation
     * @override
     */
    ClientTask.getInstance = function () {
        return instance || new ClientTask();
    };
    /**
     * Start to run the task
     * @override
     */
    ClientTask.prototype.start = function (_a) {
        var role = _a.role, ipServer = _a.ipServer, portServer = _a.portServer, transport = _a.transport;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.active)
                            return [2 /*return*/, true];
                        // Attach the Task to the role
                        this.role = role;
                        this.client = new Library_js_1.default.ZeroMQClientPush();
                        return [4 /*yield*/, this.client.start({
                                ipServer: ipServer,
                                portServer: portServer,
                                transport: transport,
                                identityPrefix: this.id,
                            })];
                    case 1:
                        _b.sent();
                        this.active = true;
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * ELIOT stop to run the task
     * @param {Object} args
     * @override
     */
    ClientTask.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.active)
                    return [2 /*return*/, true];
                this.active = false;
                // Dettach the Task from the role
                this.role = false;
                return [2 /*return*/, true];
            });
        });
    };
    return ClientTask;
}(Library_js_1.default.ATask));
exports.default = ClientTask;
