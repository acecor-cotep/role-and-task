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
// Imports
var events_1 = __importDefault(require("events"));
var LaunchScenarios_js_1 = __importDefault(require("./LaunchScenarios.js"));
var RoleAndTask_js_1 = __importDefault(require("../RoleAndTask.js"));
var Utils_js_1 = __importDefault(require("../Utils/Utils.js"));
var Errors_js_1 = __importDefault(require("../Utils/Errors.js"));
var CONSTANT_js_1 = __importDefault(require("../Utils/CONSTANT/CONSTANT.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../Utils/PromiseCommandPattern.js"));
// We are in the main here
var SystemBoot = /** @class */ (function () {
    /**
     * Constructor
     */
    function SystemBoot(_a) {
        var mode = _a.mode, modeoptions = _a.modeoptions;
        this.options = {
            mode: mode,
            modeoptions: modeoptions,
        };
        this.launchingModesMap = LaunchScenarios_js_1.default.getMapLaunchingModes();
    }
    /**
     * System initialization (not PROGRAM)
     */
    SystemBoot.systemInitialization = function () {
        // We catch uncaught exceptions
        process.on(CONSTANT_js_1.default.PROCESS_EXCEPTION, function (err) {
            //
            // SPECIFIC TO BLESSED PLUGIN
            //
            //
            // Ignore blessed errors because there is a non blocking issue unresolved in the plugin
            //
            //
            if (err && err.stack && err.stack.match(/^.+blessed.+$/im)) {
                return;
            }
            RoleAndTask_js_1.default.getInstance()
                .errorHappened(err);
        });
        // We catch unhandled promises
        process.on(CONSTANT_js_1.default.UNHANDLED_PROMISE_REJECTION, function (reason) {
            RoleAndTask_js_1.default.getInstance()
                .errorHappened(new Errors_js_1.default('GENERAL_CATCH', "" + String(reason)));
        });
        // We catch warnings
        process.on(CONSTANT_js_1.default.NODE_WARNING, function (reason) {
            Utils_js_1.default.displayMessage({
                str: reason,
                out: process.stderr,
            });
            if (RoleAndTask_js_1.default.getInstance().considerWarningAsErrors) {
                RoleAndTask_js_1.default.getInstance()
                    .errorHappened(new Errors_js_1.default('GENERAL_CATCH', String(reason)));
            }
        });
        // @ts-ignore
        // Set the maximum number of listeners Default is 11
        events_1.default.defaultMaxListeners = CONSTANT_js_1.default.MAX_NUMBER_OF_LISTENER;
    };
    /**
     * PROGRAM System initialization
     */
    SystemBoot.programInitialization = function () {
        // LaunchScenarios the RoleAndTask initialization
        RoleAndTask_js_1.default.getInstance();
    };
    /**
     * All initializations
     */
    SystemBoot.prototype.initialization = function () {
        SystemBoot.systemInitialization();
        SystemBoot.programInitialization();
        return this;
    };
    /**
     * LaunchScenarios PROGRAM
     */
    SystemBoot.prototype.launch = function (launchMasterSlaveConfigurationFile) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var elem, err_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Default launch mode
                            if (!this.options.mode) {
                                throw new Errors_js_1.default('INVALID_LAUNCHING_MODE', 'Missing launching mode');
                            }
                            elem = this.launchingModesMap.find(function (x) { return x.name === _this.options.mode; });
                            if (!elem) {
                                Utils_js_1.default.displayMessage({
                                    str: (new Errors_js_1.default('INVALID_LAUNCHING_MODE', 'Invalid launching mode')).toString(),
                                });
                                return [2 /*return*/, true];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            // LaunchScenarios the thing
                            return [4 /*yield*/, elem.func.call(LaunchScenarios_js_1.default, this.options, launchMasterSlaveConfigurationFile)];
                        case 2:
                            // LaunchScenarios the thing
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            RoleAndTask_js_1.default.getInstance()
                                .errorHappened(err_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    return SystemBoot;
}());
exports.default = SystemBoot;
