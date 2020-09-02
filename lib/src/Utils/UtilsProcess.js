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
var child_process_1 = __importDefault(require("child_process"));
var Utils_js_1 = __importDefault(require("./Utils.js"));
var Errors_js_1 = __importDefault(require("./Errors.js"));
var RoleAndTask_js_1 = __importDefault(require("../RoleAndTask.js"));
var instance = null;
/**
 * This class handle all processes that are related to PROGRAM instance
 */
var UtilsProcess = /** @class */ (function () {
    function UtilsProcess() {
        if (instance) {
            return instance;
        }
        instance = this;
        return instance;
    }
    UtilsProcess.getInstance = function () {
        return instance || new UtilsProcess();
    };
    UtilsProcess.getZombieFromAllPid = function (allPids, goodPids) {
        return allPids.filter(function (x) { return !goodPids.includes(x); });
    };
    /**
     * Evaluate PROGRAM processes and return a list of Zombies and Healthy processes that are actually running
     */
    UtilsProcess.evaluateProgramProcesses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var healthy, allProcess, zombies;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RoleAndTask_js_1.default.getInstance()
                            .getFullSystemPids()];
                    case 1:
                        healthy = _a.sent();
                        return [4 /*yield*/, UtilsProcess.evaluateNumberOfProcessThatExist()];
                    case 2:
                        allProcess = _a.sent();
                        zombies = UtilsProcess.getZombieFromAllPid(allProcess, healthy);
                        return [2 /*return*/, {
                                zombies: zombies,
                                healthy: healthy,
                            }];
                }
            });
        });
    };
    /**
     * Evaluate the number of processus that exist
     */
    UtilsProcess.evaluateNumberOfProcessThatExist = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        child_process_1.default.exec(Utils_js_1.default.monoline([
                            // Display the processes
                            'ps aux',
                            // Give the result to the next command
                            ' | ',
                            // Use a regexp to identify the lines that correspond to PROGRAM processes only [+ tests mocha processes]
                            'grep -oEi \'([0-9].+?node.+src/systemBoot.+)|([0-9].+?node.+node_modules.+?mocha.+)\'',
                        ]), function (error, stdout, stderr) {
                            // Error of childProcess
                            if (error) {
                                return reject(new Errors_js_1.default('E8083', "" + String(error)));
                            }
                            // Error of the console command
                            if (stderr) {
                                return reject(new Errors_js_1.default('E8083', "" + String(stderr)));
                            }
                            // Pass a second regexp to remove the pid of the commands themselves moreover npm scripts
                            var regexp = /^((?!grep|npm).)+$/img;
                            var filtered = stdout.match(regexp) || [];
                            // Now we extract pid from filtered data
                            var pids = filtered.map(function (x) { return String(x.split(' ')[0]); });
                            // Exclude processes about the command itself
                            return resolve(pids);
                        });
                    })];
            });
        });
    };
    UtilsProcess.killOneProcess = function (pid) {
        return new Promise(function (resolve, reject) {
            child_process_1.default.exec("kill -9 " + pid, function (error, stdout, stderr) {
                // Error of childProcess
                if (error) {
                    return reject(new Errors_js_1.default('E8083', "" + String(error)));
                }
                // Error of the console command
                if (stderr) {
                    return reject(new Errors_js_1.default('E8083', "" + String(stderr)));
                }
                return resolve(pid);
            });
        });
    };
    return UtilsProcess;
}());
exports.default = UtilsProcess;
