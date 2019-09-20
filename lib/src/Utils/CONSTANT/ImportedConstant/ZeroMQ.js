"use strict";
/* ************************************************************************************* */
/* *******************************  ZERO MQ  ******************************************* */
/* ************************************************************************************* */
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
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(superclass) {
    return /** @class */ (function (_super) {
        __extends(CONSTANT, _super);
        function CONSTANT() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(CONSTANT, "ZERO_MQ", {
            /**
             * ZeroMQ Data
             */
            get: function () {
                return {
                    // The mode you want run ZeroMQ on
                    MODE: {
                        SERVER: 0,
                        CLIENT: 1,
                    },
                    SOCKET_TYPE: {
                        // Look at the ZeroMQ documentation to learn more about which one to use
                        // http://api.zeromq.org/4-0:OMQ-socket
                        OMQ_REQ: 'req',
                        OMQ_REP: 'rep',
                        OMQ_DEALER: 'dealer',
                        OMQ_ROUTER: 'router',
                        OMQ_PUB: 'pub',
                        OMQ_SUB: 'sub',
                        OMQ_XPUB: 'xpub',
                        OMQ_XSUB: 'xsub',
                        OMQ_PUSH: 'push',
                        OMQ_PULL: 'pull',
                        OMQ_PAIR: 'pair',
                        OMQ_STREAM: 'stream',
                    },
                    // default IP to use for a ZeroMQ server
                    DEFAULT_SERVER_IP_ADDRESS: '127.0.0.1',
                    // default port to use for a ZeroMQ server
                    DEFAULT_SERVER_IP_PORT: '19222',
                    // The protocol of the Transport to use (ZeroMQ protocols)
                    TRANSPORT: {
                        // unicast transport using TCP
                        TCP: 'tcp',
                        // local inter-process communication transport
                        IPC: 'ipc',
                        // local in-process (inter-thread) communication transport
                        INPROC: 'inproc',
                        // reliable multicast transport using PGM
                        PGM: 'pgm',
                        EPGM: 'epgm',
                    },
                    // First connection timeout time in ms
                    FIRST_CONNECTION_TIMEOUT: 300000,
                    // Used to name the socket
                    CLIENT_IDENTITY_PREFIX: 'client',
                    // Used to name the socket
                    SERVER_IDENTITY_PREFIX: 'server',
                    // Time between two 'alive' message from client to server
                    CLIENT_KEEP_ALIVE_TIME: 30000,
                    // Message client send to the server
                    CLIENT_MESSAGE: {
                        // Used to know if the client still alive
                        ALIVE: 'i_am_alive',
                        // Used to connect the socket to server
                        HELLO: 'i_exist',
                    },
                    // Message server send to the client
                    SERVER_MESSAGE: {
                        CLOSE_ORDER: 'close_order',
                    },
                    // Some OMQ keywords
                    KEYWORDS_OMQ: {
                        MESSAGE: 'message',
                        ACCEPT: 'accept',
                        CONNECT: 'connect',
                        CLOSE: 'close',
                        CLOSE_ERROR: 'close_error',
                        DISCONNECT: 'disconnect',
                        MONITOR_ERROR: 'monitor_error',
                    },
                    // check for events every 50ms and get all available events. (socket)
                    MONITOR_TIME_CHECK: 50,
                    // After a monitor crash, relaunch the monitor X ms after
                    MONITOR_RELAUNCH_TIME: 500,
                    // After the given time without any proof that a client is connected
                    // Disconnect the user
                    TIMEOUT_CLIENT_NO_PROOF_OF_LIVE: 60000,
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CONSTANT, "SLAVE_CREATION_CONNECTION_TIMEOUT", {
            /**
             * MAx time we wait the new slave to connect at his creation
             */
            get: function () {
                return 60000;
            },
            enumerable: true,
            configurable: true
        });
        return CONSTANT;
    }(superclass));
}
exports.default = default_1;
