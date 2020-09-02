"use strict";
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//
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
var CONSTANT_js_1 = __importDefault(require("../../Utils/CONSTANT/CONSTANT.js"));
var Errors_js_1 = __importDefault(require("../../Utils/Errors.js"));
/**
 * PROGRAM process have 0 or + defined Role
 *
 * A Role can be described as a purpose to fulfill
 *
 * Example: Master or Slave -> (The purpose of Master is to manage Slave)
 *
 * A ROLE MUST BE DEFINED AS A SINGLETON (Which means the implementation of getInstance)
 *
 * A ROLE CAN BE APPLIED ONLY ONCE (Ex: You can apply the ServerAPI only once, can't apply twice the ServerAPI Role for a PROGRAM instance)
 * @interface
 */
var ARole = /** @class */ (function () {
    function ARole() {
        // Time taken as reference for the launch of the program
        // It's the same on the master and on all the slaves
        this.referenceStartTime = 0;
        this.name = CONSTANT_js_1.default.DEFAULT_ROLES.ABSTRACT_ROLE.name;
        this.id = CONSTANT_js_1.default.DEFAULT_ROLES.ABSTRACT_ROLE.id;
        this.active = false;
        // Tasks handled (You need one)
        this.taskHandler = false;
    }
    ARole.prototype.getReferenceStartTime = function () {
        return this.referenceStartTime;
    };
    /**
     * Setup a taskHandler to the role
     * Every Role have its specific tasks
     */
    ARole.prototype.setTaskHandler = function (taskHandler) {
        this.taskHandler = taskHandler;
    };
    ARole.prototype.getTaskHandler = function () {
        return this.taskHandler;
    };
    ARole.prototype.getTask = function (idTask) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.taskHandler) {
                    throw new Errors_js_1.default('EXXXX', 'No taskHandler defined');
                }
                return [2 /*return*/, this.taskHandler.getTask(idTask)];
            });
        });
    };
    ARole.prototype.startTask = function (idTask, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.taskHandler) {
                    throw new Errors_js_1.default('EXXXX', 'No taskHandler defined');
                }
                return [2 /*return*/, this.taskHandler.startTask(idTask, (__assign(__assign({}, args), { role: this })))];
            });
        });
    };
    ARole.prototype.stopTask = function (idTask) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.taskHandler) {
                    throw new Errors_js_1.default('EXXXX', 'No taskHandler defined');
                }
                return [2 /*return*/, this.taskHandler.stopTask(idTask)];
            });
        });
    };
    ARole.prototype.stopAllTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.taskHandler) {
                    throw new Errors_js_1.default('EXXXX', 'No taskHandler defined');
                }
                return [2 /*return*/, this.taskHandler.stopAllTask()];
            });
        });
    };
    ARole.prototype.getTaskListStatus = function () {
        if (!this.taskHandler) {
            return new Errors_js_1.default('EXXXX', 'No taskHandler defined');
        }
        return this.taskHandler.getTaskListStatus();
    };
    ARole.prototype.isActive = function () {
        return this.active;
    };
    ARole.prototype.buildHeadBodyMessage = function (head, body) {
        var _a;
        return JSON.stringify((_a = {},
            _a[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.HEAD] = head,
            _a[CONSTANT_js_1.default.PROTOCOL_KEYWORDS.BODY] = body,
            _a));
    };
    return ARole;
}());
exports.default = ARole;
