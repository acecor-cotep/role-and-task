"use strict";
//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var zmq = __importStar(require("zeromq"));
var CONSTANT_js_1 = __importDefault(require("../../../../Utils/CONSTANT/CONSTANT.js"));
var AZeroMQ_js_1 = __importDefault(require("../AZeroMQ.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../../../Utils/PromiseCommandPattern.js"));
var Errors_js_1 = __importDefault(require("../../../../Utils/Errors.js"));
var RoleAndTask_1 = __importDefault(require("../../../../RoleAndTask"));
/**
 * Client to use when you have an unidirectionnal connection PUSH
 */
var ZeroMQClientPush = /** @class */ (function (_super) {
    __extends(ZeroMQClientPush, _super);
    function ZeroMQClientPush() {
        var _this = _super.call(this) || this;
        _this.isClosing = false;
        // Mode we are running in
        _this.mode = CONSTANT_js_1.default.ZERO_MQ.MODE.CLIENT;
        return _this;
    }
    ZeroMQClientPush.prototype.waitConnection = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.zmqObject) {
                return;
            }
            _this.zmqObject.events.on('connect', function (data) {
                resolve();
            });
            _this.zmqObject.events.on('connect:delay', function (data) {
                console.error("ZeroMQClientPush :: got event connect:delay");
                reject(new Errors_js_1.default('E2009', 'connect:delay'));
            });
        });
    };
    ZeroMQClientPush.prototype.start = function (_a) {
        var _this = this;
        var _b = _a.ipServer, ipServer = _b === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _b, _c = _a.portServer, portServer = _c === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _c, _d = _a.transport, transport = _d === void 0 ? CONSTANT_js_1.default.ZERO_MQ.TRANSPORT.TCP : _d;
        return PromiseCommandPattern_js_1.default({
            func: function () { return new Promise(function (resolve) {
                // If the client is already up
                if (_this.active) {
                    resolve(_this.zmqObject);
                    return;
                }
                // Create the client socket
                _this.zmqObject = new zmq.Push();
                _this.zmqObject.connectTimeout = CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
                _this.zmqObject.heartbeatTimeout = CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
                _this.zmqObject.heartbeatInterval = CONSTANT_js_1.default.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME;
                _this.zmqObject.heartbeatTimeToLive = CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
                // Listen to the event we sould not receive :: error handling
                _this.zmqObject.events.on('close', function (data) {
                    // If this is a regular close, do nothing
                    if (_this.isClosing || RoleAndTask_1.default.getInstance().getActualProgramState().id === CONSTANT_js_1.default.DEFAULT_STATES.CLOSE.id) {
                        return;
                    }
                    console.error("ZeroMQClientPush :: got UNWANTED event close :: RoleAndTask actual state <<" + RoleAndTask_1.default.getInstance().getActualProgramState().name + ">>");
                    throw new Errors_js_1.default('E2011', "ZeroMQClientPush :: RoleAndTask actual state <<" + RoleAndTask_1.default.getInstance().getActualProgramState().name + ">>");
                });
                _this.zmqObject.events.on('disconnect', function (data) {
                    // If this is a regular close, do nothing
                    if (_this.isClosing || RoleAndTask_1.default.getInstance().getActualProgramState().id === CONSTANT_js_1.default.DEFAULT_STATES.CLOSE.id) {
                        return;
                    }
                    console.error("ZeroMQClientPush :: got UNWANTED event disconnect :: " + data.address + " :: RoleAndTask actual state <<" + RoleAndTask_1.default.getInstance().getActualProgramState().name + ">>");
                    // throw new Errors('E2011', `ZeroMQClientPush :: RoleAndTask actual state <<${RoleAndTask.getInstance().getActualProgramState().name}>>`);
                });
                _this.zmqObject.events.on('end', function (data) {
                    if (_this.isClosing) {
                        return;
                    }
                    console.error("ZeroMQClientPush :: got UNWANTED event end");
                    throw new Errors_js_1.default('E2010', 'end');
                });
                _this.zmqObject.events.on('unknown', function (data) {
                    console.error("ZeroMQClientPush :: got event unknown");
                });
                _this.waitConnection()
                    .then(function () {
                    _this.active = true;
                    resolve(_this.zmqObject);
                })
                    .catch(function () {
                    // Remove the socket
                    delete _this.zmqObject;
                    _this.zmqObject = null;
                    _this.active = false;
                    // Return an error
                    throw new Errors_js_1.default('E2005');
                });
                _this.zmqObject.connect(transport + "://" + ipServer + ":" + portServer);
            }); },
        });
    };
    ZeroMQClientPush.prototype.stop = function () {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () {
                return new Promise(function (resolve, reject) {
                    // If the client is already down
                    if (!_this.active || !_this.zmqObject) {
                        resolve();
                        return;
                    }
                    _this.isClosing = true;
                    _this.zmqObject.events.on('close', function (data) {
                        resolve();
                    });
                    _this.zmqObject.events.on('close:error', function (data) {
                        reject(new Errors_js_1.default('E2010', "close:error :: " + data.error));
                    });
                    _this.zmqObject.events.on('end', function (data) {
                        resolve();
                    });
                    _this.zmqObject.close();
                    _this.zmqObject = null;
                    _this.active = false;
                });
            },
        });
    };
    ZeroMQClientPush.prototype.sendMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.zmqObject && this.active)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.zmqObject.send(message)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return ZeroMQClientPush;
}(AZeroMQ_js_1.default));
exports.default = ZeroMQClientPush;
