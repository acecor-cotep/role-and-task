"use strict";
//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
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
var CONSTANT_js_1 = __importDefault(require("../Utils/CONSTANT/CONSTANT.js"));
var Utils_js_1 = __importDefault(require("../Utils/Utils.js"));
var applyConfigurationMasterSlaveLaunch_js_1 = __importDefault(require("./applyConfigurationMasterSlaveLaunch.js"));
var RoleAndTask_js_1 = __importDefault(require("../RoleAndTask.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../Utils/PromiseCommandPattern.js"));
var Errors_js_1 = __importDefault(require("../Utils/Errors.js"));
/**
 * This class implement the different launch scenarios of PROGRAM
 */
var LaunchScenarios = /** @class */ (function () {
    function LaunchScenarios() {
    }
    /**
     * Get the map of launching modes
     */
    LaunchScenarios.getMapLaunchingModes = function () {
        return __spreadArrays([{
                name: CONSTANT_js_1.default.PROGRAM_LAUNCHING_MODE.MASTER,
                func: LaunchScenarios.master,
            }, {
                name: CONSTANT_js_1.default.PROGRAM_LAUNCHING_MODE.SLAVE,
                func: LaunchScenarios.slave,
            }], RoleAndTask_js_1.default.getInstance().customLaunchingMode);
    };
    /**
     * Read the Master Slave launch configuration file
     */
    LaunchScenarios.readLaunchMasterSlaveConfigurationFile = function (filename) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = Utils_js_1.default).parseHjsonContent;
                        return [4 /*yield*/, Utils_js_1.default.readFile(filename)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            }); }); },
        });
    };
    /**
     * Start PROGRAM in master mode
     */
    LaunchScenarios.master = function (_, launchMasterSlaveConfigurationFile) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var launchConfFileContent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Say to people in which state we are at launch -> LAUNCHING
                        return [4 /*yield*/, RoleAndTask_js_1.default.getInstance().spreadStateToListener()];
                        case 1:
                            // Say to people in which state we are at launch -> LAUNCHING
                            _a.sent();
                            return [4 /*yield*/, LaunchScenarios.readLaunchMasterSlaveConfigurationFile(launchMasterSlaveConfigurationFile)];
                        case 2:
                            launchConfFileContent = _a.sent();
                            return [4 /*yield*/, applyConfigurationMasterSlaveLaunch_js_1.default(launchConfFileContent)];
                        case 3:
                            _a.sent();
                            // Here we can put the system as ready
                            return [4 /*yield*/, RoleAndTask_js_1.default.getInstance()
                                    .changeProgramState(CONSTANT_js_1.default.DEFAULT_STATES.READY_PROCESS.id)];
                        case 4:
                            // Here we can put the system as ready
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    /**
     * Start PROGRAM in slave mode
     */
    LaunchScenarios.slave = function (options) {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var roleHandler;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            roleHandler = RoleAndTask_js_1.default.getInstance()
                                .getRoleHandler();
                            if (roleHandler === null)
                                throw new Errors_js_1.default('EXXXX', 'role handler is null');
                            return [4 /*yield*/, roleHandler.startRole(CONSTANT_js_1.default.DEFAULT_ROLES.SLAVE_ROLE.id, options.modeoptions)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            }); },
        });
    };
    return LaunchScenarios;
}());
exports.default = LaunchScenarios;
