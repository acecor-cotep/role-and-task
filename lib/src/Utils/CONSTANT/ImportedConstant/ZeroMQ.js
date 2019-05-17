"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

/* ************************************************************************************* */

/* *******************************  ZERO MQ  ******************************************* */

/* ************************************************************************************* */
function _default(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(CONSTANT, _superclass);

      function CONSTANT() {
        (0, _classCallCheck2["default"])(this, CONSTANT);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CONSTANT).apply(this, arguments));
      }

      (0, _createClass2["default"])(CONSTANT, null, [{
        key: "ZERO_MQ",

        /**
         * ZeroMQ Data
         */
        get: function get() {
          return {
            // The mode you want run ZeroMQ on
            MODE: {
              SERVER: 0,
              CLIENT: 1
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
              OMQ_STREAM: 'stream'
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
              EPGM: 'epgm'
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
              HELLO: 'i_exist'
            },
            // Message server send to the client
            SERVER_MESSAGE: {
              CLOSE_ORDER: 'close_order'
            },
            // Some OMQ keywords
            KEYWORDS_OMQ: {
              MESSAGE: 'message',
              ACCEPT: 'accept',
              CONNECT: 'connect',
              CLOSE: 'close',
              CLOSE_ERROR: 'close_error',
              DISCONNECT: 'disconnect',
              MONITOR_ERROR: 'monitor_error'
            },
            // check for events every 50ms and get all available events. (socket)
            MONITOR_TIME_CHECK: 50,
            // After a monitor crash, relaunch the monitor X ms after
            MONITOR_RELAUNCH_TIME: 500,
            // After the given time without any proof that a client is connected
            // Disconnect the user
            TIMEOUT_CLIENT_NO_PROOF_OF_LIVE: 60000
          };
        }
        /**
         * MAx time we wait the new slave to connect at his creation
         */

      }, {
        key: "SLAVE_CREATION_CONNECTION_TIMEOUT",
        get: function get() {
          return 60000;
        }
      }]);
      return CONSTANT;
    }(superclass)
  );
}
//# sourceMappingURL=ZeroMQ.js.map
