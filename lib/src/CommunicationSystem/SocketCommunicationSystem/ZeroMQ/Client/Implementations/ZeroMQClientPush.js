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
var AZeroMQClientLight_js_1 = __importDefault(require("../AZeroMQClientLight.js"));
var CONSTANT_js_1 = __importDefault(require("../../../../../Utils/CONSTANT/CONSTANT.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../../../../Utils/PromiseCommandPattern.js"));
var ZeroMQClientPush = /** @class */ (function (_super) {
    __extends(ZeroMQClientPush, _super);
    function ZeroMQClientPush() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZeroMQClientPush.prototype.start = function (_a) {
        var _this = this;
        var ipServer = _a.ipServer, portServer = _a.portServer, transport = _a.transport, identityPrefix = _a.identityPrefix;
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.startClient({
                ipServer: ipServer,
                portServer: portServer,
                transport: transport,
                identityPrefix: identityPrefix,
                socketType: CONSTANT_js_1.default.ZERO_MQ.SOCKET_TYPE.OMQ_PUSH,
            }); },
        });
    };
    ZeroMQClientPush.prototype.stop = function () {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () { return _this.stopClient(); },
        });
    };
    ZeroMQClientPush.prototype.sendMessage = function (message) {
        this.sendMessageToServer(message);
    };
    return ZeroMQClientPush;
}(AZeroMQClientLight_js_1.default));
exports.default = ZeroMQClientPush;
