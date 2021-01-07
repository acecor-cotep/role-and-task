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
/*
 * This class contain utilitaries functions
 */
// Includes
var os_1 = __importDefault(require("os"));
var command_line_args_1 = __importDefault(require("command-line-args"));
var moment_1 = __importDefault(require("moment"));
var fs_1 = __importDefault(require("fs"));
var hjson_1 = __importDefault(require("hjson"));
var pidusage_1 = __importDefault(require("pidusage"));
var child_process_1 = __importDefault(require("child_process"));
var CONSTANT_js_1 = __importDefault(require("./CONSTANT/CONSTANT.js"));
var Errors_js_1 = __importDefault(require("./Errors.js"));
/**
 * Contain utilitaries functions
 */
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /**
     * Get an unique id (Specific to Program)
     * USE THE PID OF THE APP TO GET AN INTER-PROGRAM UNIQUE IDENTIFIER
     */
    Utils.generateUniqueProgramID = function () {
        if (!Utils.generatedId) {
            Utils.generatedId = 2;
        }
        Utils.generatedId += 1;
        return process.pid + "x" + Utils.generatedId;
    };
    // Do we launch master or slave or oldway?
    // Get the options
    Utils.extractOptionsFromCommandLineArgs = function (extraOptions) {
        if (extraOptions === void 0) { extraOptions = []; }
        return command_line_args_1.default(__spreadArrays([
            {
                // Theses must be like --mode optA=12 optB=9
                name: CONSTANT_js_1.default.PROGRAM_LAUNCHING_PARAMETERS.MODE.name,
                alias: CONSTANT_js_1.default.PROGRAM_LAUNCHING_PARAMETERS.MODE.alias,
                type: String,
            },
            {
                // Theses must be like --mode-options optA=12 optB=9
                name: CONSTANT_js_1.default.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name,
                alias: CONSTANT_js_1.default.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.alias,
                type: String,
                multiple: true,
            }
        ], extraOptions));
    };
    /**
     * Takes option-key = ['optA=12', 'optB=78', ...]
     * and return {
     *   optA: '12',
     *   optB: '78',
     * }
     */
    Utils.parseEqualsArrayOptions = function (options, name) {
        // If there is none informations
        if (!options || !options[name]) {
            return {};
        }
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
    };
    /**
     * Generate a little ID usefull for log for example
     */
    Utils.generateLittleID = function () {
        return Math.random()
            .toString(36)
            .substr(2, 10);
    };
    /**
     * Generate a random value from min to max
     */
    Utils.generateRandom = function (min, max, round) {
        if (round === void 0) { round = true; }
        var nb = (Math.random() * ((max - min) + 1)) + min;
        if (round) {
            return Math.floor(nb);
        }
        return nb;
    };
    /**
     * Return the name of thekey that are behind the given value
     */
    Utils.getJsonCorrespondingKey = function (json, value) {
        return Object.keys(json)
            .find(function (x) { return json[x] === value; });
    };
    /**
     * Create a monoline from an array which is usefull when you have a line that is too long
     */
    Utils.monoline = function (parts) {
        return parts.reduce(function (str, x) { return "" + str + x; }, '');
    };
    /**
     * Call recursively the function given in parameter for each iteration of the object
     * It works for a given function pattern
     * Call resolve with an array that contains results of called functions
     */
    Utils.recursiveCallFunction = function (_a) {
        var context = _a.context, func = _a.func, objToIterate = _a.objToIterate, _b = _a.nameToSend, nameToSend = _b === void 0 ? '_id' : _b, _c = _a.nameTakenInDocs, nameTakenInDocs = _c === void 0 ? '_id' : _c, _d = _a.additionnalJsonData, additionnalJsonData = _d === void 0 ? {} : _d, _e = _a.additionnalParams, additionnalParams = _e === void 0 ? [] : _e, _f = _a._i, _i = _f === void 0 ? 0 : _f, _g = _a._rets, _rets = _g === void 0 ? [] : _g;
        return __awaiter(this, void 0, void 0, function () {
            var val, obj, ret;
            var _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (!objToIterate) {
                            return [2 /*return*/, _rets];
                        }
                        // If our job is done
                        if (_i >= objToIterate.length) {
                            return [2 /*return*/, _rets];
                        }
                        val = nameTakenInDocs ? objToIterate[_i][nameTakenInDocs] : objToIterate[_i];
                        obj = nameToSend ? (_h = {},
                            _h[nameToSend] = val,
                            _h) : val;
                        // if we have a JSON object and additionnalJsonData
                        if (nameToSend) {
                            Object.keys(additionnalJsonData)
                                .forEach(function (x) {
                                obj[x] = additionnalJsonData[x];
                            });
                        }
                        return [4 /*yield*/, func.apply(context, __spreadArrays([obj], additionnalParams))];
                    case 1:
                        ret = _j.sent();
                        // Call next
                        return [2 /*return*/, Utils.recursiveCallFunction({
                                context: context,
                                func: func,
                                objToIterate: objToIterate,
                                nameToSend: nameToSend,
                                nameTakenInDocs: nameTakenInDocs,
                                additionnalJsonData: additionnalJsonData,
                                additionnalParams: additionnalParams,
                                _i: _i + 1,
                                _rets: (ret ? __spreadArrays(_rets, [
                                    ret,
                                ]) : _rets),
                            })];
                }
            });
        });
    };
    /**
     * Get the Ips of the local machine
     */
    Utils.givesLocalIps = function () {
        try {
            // Get network interfaces
            var interfaces_1 = os_1.default.networkInterfaces();
            return Object.keys(interfaces_1)
                .reduce(function (tmp, x) { return tmp.concat(interfaces_1[x]); }, [])
                .filter(function (iface) { return iface.family === 'IPv4' && !iface.internal; })
                .map(function (iface) { return iface.address; });
        }
        catch (err) {
            return [
                String((err && err.stack) || err),
            ];
        }
    };
    /**
     * Convert a string to JSON
     * If he cannot parse it, return false
     */
    Utils.convertStringToJSON = function (dataString) {
        return (function () {
            try {
                return JSON.parse(dataString);
            }
            catch (_) {
                return false;
            }
        })();
    };
    /**
     * Execute a command line
     * By default, set the maxBuffer option to 2GB
     */
    Utils.execCommandLine = function (cmd, options) {
        if (options === void 0) { options = {
            maxBuffer: 1024 * 2000,
        }; }
        return new Promise(function (resolve, reject) {
            child_process_1.default.exec(cmd, options, function (err, res) {
                if (err) {
                    return reject(new Errors_js_1.default('E8191', "" + String(err)));
                }
                return resolve(res);
            });
        });
    };
    /**
     * Generate a string using the given char repeated x time
     */
    Utils.generateStringFromSameChar = function (character, nb) {
        return character.repeat(nb);
    };
    /**
     * Execute a command line
     * Execute the given onStdout function when stdout datas are given
     * When onStdout is not set, do nothing about the data
     * Execute the given onStderr function when stderr datas are given
     * When onStderr is not set, do nothing about the data
     */
    Utils.execStreamedCommandLine = function (_a) {
        var cmd = _a.cmd, _b = _a.options, options = _b === void 0 ? [] : _b, _c = _a.processArray, processArray = _c === void 0 ? false : _c, onStdout = _a.onStdout, onStderr = _a.onStderr;
        return new Promise(function (resolve, reject) {
            var ls = child_process_1.default.spawn(cmd, options);
            if (processArray instanceof Array) {
                processArray.push(ls);
            }
            if (!onStdout) {
                ls.stdout.on('data', function () { return true; });
            }
            else {
                // @ts-ignore
                ls.stdout.on('data', onStdout);
            }
            if (!onStderr) {
                ls.stderr.on('data', function () { return true; });
            }
            else {
                // @ts-ignore
                ls.stderr.on('data', onStderr);
            }
            ls.on('close', function (code) {
                if (code === 'SIGINT') {
                    reject(code);
                }
                if (processArray instanceof Array) {
                    var index = processArray.indexOf(ls);
                    if (index !== -1 && processArray instanceof Array) {
                        processArray.splice(index, 1);
                    }
                }
                resolve(code);
            });
            ls.on('error', function (err) {
                if (processArray instanceof Array) {
                    var index = processArray.indexOf(ls);
                    if (index !== -1) {
                        processArray.splice(index, 1);
                    }
                }
                reject(new Errors_js_1.default('E8200', "" + err.toString()));
            });
        });
    };
    Utils.sleep = function (timeInMs) {
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(); }, timeInMs);
        });
    };
    Utils.displayMessage = function (_a) {
        var str = _a.str, _b = _a.carriageReturn, carriageReturn = _b === void 0 ? true : _b, _c = _a.out, out = _c === void 0 ? process.stdout : _c, _d = _a.from, from = _d === void 0 ? process.pid : _d, _e = _a.time, time = _e === void 0 ? Date.now() : _e;
        out.write(moment_1.default(time).format(CONSTANT_js_1.default.MOMENT_CONSOLE_DATE_DISPLAY_FORMAT) + ":" + from + " > - " + str + (carriageReturn ? '\n' : ''));
    };
    /**
     * Read a file asynchronously
     */
    Utils.readFile = function (filename, options) {
        if (options === void 0) { options = 'utf8'; }
        return new Promise(function (resolve, reject) {
            fs_1.default.readFile(filename, options, function (err, data) {
                if (err) {
                    return reject(new Errors_js_1.default('E8088', "filename: " + filename, String(err)));
                }
                return resolve(data);
            });
        });
    };
    /**
     * Parse hjson content (Human JSON --> npm module)
     */
    Utils.parseHjsonContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, hjson_1.default.parse(content)];
                }
                catch (err) {
                    throw new Errors_js_1.default('E8089', "" + String(err));
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * DO NOT CALL IT DIRECTLY, it is used by promiseCallUntilTrue
     *
     * RECURSIVE
     */
    Utils.executePromiseCallUntilTrue = function (_a) {
        var functionToCall = _a.functionToCall, context = _a.context, args = _a.args, _b = _a.i, i = _b === void 0 ? 0 : _b;
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, functionToCall.apply(context, __spreadArrays(args, [
                            i,
                        ]))];
                    case 1:
                        ret = _c.sent();
                        if (ret !== false && ret.args === void 0) {
                            return [2 /*return*/, ret];
                        }
                        // Call again
                        return [2 /*return*/, Utils.executePromiseCallUntilTrue({
                                functionToCall: functionToCall,
                                context: context,
                                args: ret.args === void 0 ? args : ret.args,
                                i: ret.i === void 0 ? i + 1 : ret.i,
                            })];
                }
            });
        });
    };
    /**
     * Call the given function until it return something different than false
     *
     * If the function returns :
     *
     * false                                -> We make an another call with the same args
     * true                                 -> We stop the calls and return true
     * { args: something }                  -> We make an another call with the new given args
     * { args: something, i: something }    -> We make an another call with the new given args and changing the i
     * anything else                        -> we stop the calls and return wathever it is
     *
     * {
     *   functionToCall,
     *   context,
     *   args,
     *   i = 0,
     * }
     *
     * i is the index you can force to start with instead of 0
     */
    Utils.promiseCallUntilTrue = function (conf) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Utils.executePromiseCallUntilTrue(conf)];
            });
        });
    };
    /**
     * DO NOT CALL IT DIRECTLY, it is used by promiseQueue
     *
     * RECURSIVE
     */
    Utils.executePromiseQueue = function (conf, _rets, _i) {
        if (_rets === void 0) { _rets = []; }
        if (_i === void 0) { _i = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, functionToCall, _b, context, _c, args, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        // Is the job done?
                        if (_i >= conf.length) {
                            return [2 /*return*/, _rets];
                        }
                        _a = conf[_i], functionToCall = _a.functionToCall, _b = _a.context, context = _b === void 0 ? this : _b, _c = _a.args, args = _c === void 0 ? [] : _c;
                        _e = (_d = _rets).push;
                        return [4 /*yield*/, functionToCall.apply(context, args)];
                    case 1:
                        _e.apply(_d, [_f.sent()]);
                        // Call next
                        return [2 /*return*/, Utils.executePromiseQueue(conf, _rets, _i + 1)];
                }
            });
        });
    };
    /**
     * Execute the given functions one by one, and the return the ret of them in an array
     *
     * -> it's a Promise.all but one by one instead of parallel
     *
     * [{
     *   // The function you want to call
     *   functionToCall,
     *
     *   // The context to use when you are calling it
     *   context,
     *
     *   // The argument to pass to the functionToCall (must be in an array)
     *   args,
     * }]
     */
    Utils.promiseQueue = function (conf) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Utils.executePromiseQueue(conf)];
            });
        });
    };
    /**
     * Return the name of the function that call this function
     * IT'S A HACK
     */
    Utils.getFunctionName = function (numberFuncToGoBack) {
        if (numberFuncToGoBack === void 0) { numberFuncToGoBack = 1; }
        var err = new Error('tmpErr');
        var splitted = (err.stack || '')
            .split('\n');
        // If we cannot succeed to find the good function name, return the whole data
        if (numberFuncToGoBack >= splitted.length) {
            return err.stack || '';
        }
        var trimmed = splitted[numberFuncToGoBack]
            .trim();
        // If we cannot succeed to find the good function name, return the whole data
        if (!trimmed.length) {
            return err.stack || '';
        }
        return trimmed.split(' ')[1];
    };
    /**
     * Fire functions that are in the given array and pass args to it
     */
    Utils.fireUp = function (arrayOfFunction, args) {
        var _this = this;
        if (arrayOfFunction.length) {
            arrayOfFunction.forEach(function (x) {
                if (typeof x === 'function') {
                    x.apply(_this, args);
                }
                else {
                    x.func.apply(x.context || _this, args);
                }
            });
        }
    };
    Utils.isAnArray = function (v) {
        return Utils.isAJSON(v) && v instanceof Array;
    };
    Utils.isAVersion = function (v) {
        if (!v) {
            return false;
        }
        var regexp = /^(\d+(\.\d+)*)$/;
        return regexp.test(v);
    };
    Utils.isABoolean = function (v) {
        return typeof v === 'boolean' || v === 'true' || v === 'false';
    };
    /**
     * Check if we got a Boolean (permissive with true and false strings)
     */
    Utils.isABooleanPermissive = function (v) {
        return Utils.isABoolean(v) || (v === 'true') || (v === 'false');
    };
    Utils.isAnID = function (v) {
        if (!v || (typeof v !== 'string')) {
            return false;
        }
        return new RegExp("^[a-f\\d]{" + String(CONSTANT_js_1.default.MONGO_DB_ID_LENGTH) + "}$", 'i')
            .test(v);
    };
    /**
     * Check if we got a null value
     *
     * Is considered NULL :
     * - an empty String
     * - the value 0
     * - the boolean false
     * - the null value
     * - undefined
     */
    Utils.isNull = function (v) {
        return (v === null) || (v === 0) || (v === false) || (v === 'null') || (v === void 0);
    };
    Utils.isAString = function (v) {
        return typeof v === 'string';
    };
    Utils.isAnUnsignedInteger = function (v) {
        if (v === void 0 || v === null || v instanceof Array || (typeof v === 'object' && !(v instanceof Number))) {
            return false;
        }
        if (v instanceof Number && v >= 0) {
            return true;
        }
        var regexp = /^\+?(0|[0-9]\d*)$/;
        return regexp.test(v);
    };
    Utils.isATimestamp = function (v) {
        if (!v) {
            return false;
        }
        if (v instanceof Date) {
            return true;
        }
        if (typeof v !== 'string' && typeof v !== 'number') {
            return false;
        }
        return (new Date(Number(v)))
            .getTime() > 0;
    };
    Utils.isAnInteger = function (v) {
        if (v === void 0 ||
            v === null ||
            v instanceof Array ||
            (typeof v === 'object' && !(v instanceof Number))) {
            return false;
        }
        if (v instanceof Number) {
            return true;
        }
        var regexp = /^[+-]?(0|[1-9]\d*)$/;
        return regexp.test(v);
    };
    Utils.isAFloat = function (v) {
        if (v === void 0 ||
            v === null ||
            v instanceof Array ||
            (typeof v === 'object' && !(v instanceof Number))) {
            return false;
        }
        var regexp = /^[+-]?\d+(\.\d+)?$/;
        return regexp.test(v);
    };
    /**
     * Get the Cpu usage & memory of the current pid
     */
    Utils.getCpuAndMemoryLoad = function () {
        return new Promise(function (resolve, reject) {
            pidusage_1.default(process.pid, function (err, stat) {
                if (err) {
                    return reject(err);
                }
                return resolve(stat);
            });
        });
    };
    Utils.isAnIPAddress = function (v) {
        if (!Utils.isAString(v)) {
            return false;
        }
        var regexpIpv4 = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
        var regexpIpv6 = /^::ffff:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
        return regexpIpv4.test(v) || regexpIpv6.test(v);
    };
    /**
     * Do we have a json in parameters?
     *
     * WARNING: JSON.PARSE ACCEPT PLAIN NUMBERS AND NULL AS VALUES
     */
    Utils.isAJSON = function (v) {
        // handle the null case
        if (v === null || v === false || v === void 0) {
            return false;
        }
        // handle one part of numbers
        if (v instanceof Number) {
            return false;
        }
        if (typeof v === 'object') {
            return true;
        }
        if (!Utils.isAString(v)) {
            return false;
        }
        // Test a json contains {} or [] data in it
        var regexpJson = /(({*})|(\[*\]))+/;
        if (!regexpJson.test(v)) {
            return false;
        }
        try {
            JSON.parse(v);
            // handle the numbers
            if (Utils.isAnInteger(v) || Utils.isAFloat(v)) {
                return false;
            }
            return true;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * Transform v into a boolean - (this function is usefull for console commands)
     */
    Utils.toBoolean = function (v) {
        if (typeof v === 'boolean') {
            return v;
        }
        if (v === 'false') {
            return false;
        }
        if (v === 'true') {
            return true;
        }
        return !!v;
    };
    return Utils;
}());
exports.default = Utils;
