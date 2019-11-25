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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var path_1 = __importDefault(require("path"));
var colors_1 = __importDefault(require("colors"));
var command_line_args_1 = __importDefault(require("command-line-args"));
var Utils_1 = __importDefault(require("../../src/Utils/Utils"));
var Library_1 = __importDefault(require("../../src/Library"));
var SimpleTask_1 = __importDefault(require("./SimpleTask"));
var roleAndTask = new Library_1.default.RoleAndTask();
/**
 * Takes option-key = ['optA=12', 'optB=78', ...]
 * and return [
 *   optA: '12',
 *   optB: '78',
 * ]
 */
function parseEqualsArrayOptions(options, name) {
    // If there is none informations
    if (!options || !options[name])
        return {};
    if (!(options[name] instanceof Array)) {
        throw new Error("INVALID_LAUNCHING_PARAMETER : " + name);
    }
    var tmp;
    var parsedOptions = {};
    var ret = options[name].some(function (x) {
        tmp = x.split('=');
        // If the pattern optA=value isn't respected return an error
        if (tmp.length !== 2) {
            return true;
        }
        parsedOptions[tmp[0]] = tmp[1];
        return false;
    });
    if (ret) {
        throw new Error("INVALID_LAUNCHING_PARAMETER : " + name);
    }
    return parsedOptions;
}
// Attach a color to the pid so you can easily identify it and see that there are 3 processes
var colorsArray = [
    'yellow',
    'red',
    'blue',
    'cyan',
    'red',
    'magenta',
    'bgRed',
    'bgGreen',
    'bgYellow',
    'bgBlue',
    'bgMagenta',
    'bgCyan',
    'rainbow',
    'america',
    'trap',
];
var colorToUse = colorsArray[Utils_1.default.generateRandom(0, colorsArray.length - 1)];
var processPid = colors_1.default[colorToUse](String(process.pid));
// Store the string in global so it can be used in the Task runned in the process
// @ts-ignore
global.processPid = processPid;
console.log("\n > ################################################\n >        Run TestSimple : Process " + processPid + "\n >        Use : Ctrl + C to leave\n > ################################################\n\n");
// Declare the Task
roleAndTask.declareTask({
    name: 'SimpleTask',
    // Name of the task in the configuration file
    id: 'simple-task',
    // In which order we close the task ? Because we have only one task, it's 1
    closureHierarchy: 1,
    // The color to use when performing display
    color: colorToUse,
    // Say the task can be runned on both Slave and Master process
    idsAllowedRole: [
        Library_1.default.CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id,
        Library_1.default.CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id,
    ],
    // The task object
    obj: SimpleTask_1.default.getInstance(),
});
// Do we launch master or slave or oldway?
// Get the options
var options = command_line_args_1.default([{
        // Theses must be like --mode optA=12 optB=9
        name: Library_1.default.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.name,
        alias: Library_1.default.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.alias,
        type: String,
    }, {
        // Theses must be like --mode-options optA=12 optB=9
        name: Library_1.default.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name,
        alias: Library_1.default.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.alias,
        type: String,
        multiple: true,
    }]);
// We have something like mode-options = ['optA=12', 'optB=78', ...]
var modeoptions = parseEqualsArrayOptions(options, Library_1.default.CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name);
var mode = options.mode;
// Set the configuration of the library
roleAndTask.setConfiguration({
    // Mandatory
    // Mode lauching (master of slave)
    mode: mode,
    // Options object (identifier or other things)
    modeoptions: modeoptions,
    // Where the file describing the architecture to create is
    launchMasterSlaveConfigurationFile: path_1.default.resolve(__dirname) + "/../../../test/testSimple/minimalArchitecture.hjson",
    // Where is the file we use to launch the processes (the actual file)
    pathToEntryFile: path_1.default.resolve(__dirname) + "/main.js",
});
/**
 * Subscribe to the state change and display it
 */
roleAndTask.subscribeToStateChange(function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var role, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, roleAndTask.getSlaveNorMaster()];
            case 1:
                role = _a.sent();
                if (role && role.id === Library_1.default.CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id) {
                    console.log(" > " + processPid + " : New State detected : " + state.name + "/#" + state.id);
                }
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Startup the whole processus launch thing
 */
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, roleAndTask.boot()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
