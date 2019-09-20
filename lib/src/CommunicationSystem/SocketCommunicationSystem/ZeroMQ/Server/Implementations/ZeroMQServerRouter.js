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
var AZeroMQServer_js_1 = __importDefault(require("../AZeroMQServer.js"));
var CONSTANT_js_1 = __importDefault(require("../../../../../Utils/CONSTANT/CONSTANT.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../../../../Utils/PromiseCommandPattern.js"));
/**
 * Implements a zeroMQ Server : Type -> ROUTER
 *
 */
var ZeroMQServerRouter = /** @class */ (function (_super) {
    __extends(ZeroMQServerRouter, _super);
    function ZeroMQServerRouter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZeroMQServerRouter.prototype.start = function (_a) {
        var _this = this;
        var ipServer = _a.ipServer, portServer = _a.portServer, transport = _a.transport, identityPrefix = _a.identityPrefix;
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.startServer({
                ipServer: ipServer,
                portServer: portServer,
                transport: transport,
                identityPrefix: identityPrefix,
                socketType: CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER,
            }); },
        });
    };
    ZeroMQServerRouter.prototype.stop = function () {
        return this.stopServer();
    };
    ZeroMQServerRouter.prototype.sendMessage = function (clientIdentityByte, clientIdentityString, message) {
        this.sendMessageToClient(clientIdentityByte, clientIdentityString, message);
    };
    return ZeroMQServerRouter;
}(AZeroMQServer_js_1.default));
exports.default = ZeroMQServerRouter;
