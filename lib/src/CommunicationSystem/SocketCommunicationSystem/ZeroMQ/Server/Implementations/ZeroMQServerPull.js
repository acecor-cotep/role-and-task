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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var AZeroMQServerLight_js_1 = __importDefault(require("../AZeroMQServerLight.js"));
var CONSTANT_js_1 = __importDefault(require("../../../../../Utils/CONSTANT/CONSTANT.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../../../../Utils/PromiseCommandPattern.js"));
var Errors_js_1 = __importDefault(require("../../../../../Utils/Errors.js"));
/**
 * Implements a zeroMQ Server : Type -> PULL
 */
var ZeroMQServerPull = /** @class */ (function (_super) {
    __extends(ZeroMQServerPull, _super);
    function ZeroMQServerPull() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZeroMQServerPull.prototype.start = function (_a) {
        var _this = this;
        var ipServer = _a.ipServer, portServer = _a.portServer, transport = _a.transport, identityPrefix = _a.identityPrefix;
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.startServer({
                ipServer: ipServer,
                portServer: portServer,
                transport: transport,
                identityPrefix: identityPrefix,
                socketType: CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_PULL,
            }); },
        });
    };
    ZeroMQServerPull.prototype.stop = function () {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.stopServer(); },
        });
    };
    /**
     * You cannot send a message to client, because the link to client is unidirectionnal
     */
    ZeroMQServerPull.prototype.sendMessage = function () {
        throw new Errors_js_1.default('E7014');
    };
    return ZeroMQServerPull;
}(AZeroMQServerLight_js_1.default));
exports.default = ZeroMQServerPull;
