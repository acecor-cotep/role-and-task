/* ************************************************************************************* */
/* *******************************  ZERO MQ  ******************************************* */
/* ************************************************************************************* */


export default function (superclass: any) {
  return class CONSTANT extends superclass {
    /**
     * ZeroMQ Data
     */
    public static get ZERO_MQ() {
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

          // Used to know if the client still alive
          ALIVE: 'i_am_alive'
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

        // After the given time without any proof that a client is connected
        // Disconnect the user
        TIMEOUT_CLIENT_NO_PROOF_OF_LIVE: 60000,

        // Time to wait after a .receive() to do a receive again
        WAITING_TIME_BETWEEN_TWO_RECEIVE: 0,
      };
    }

    /**
     * Max time we wait the new slave to connect at his creation
     */
    public static get SLAVE_CREATION_CONNECTION_TIMEOUT() {
      return 60000;
    }
  };
}
