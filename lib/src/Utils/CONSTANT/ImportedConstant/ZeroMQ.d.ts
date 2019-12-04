export default function (superclass: any): {
    new (): {
        [x: string]: any;
    };
    [x: string]: any;
    /**
     * ZeroMQ Data
     */
    readonly ZERO_MQ: {
        MODE: {
            SERVER: number;
            CLIENT: number;
        };
        SOCKET_TYPE: {
            OMQ_REQ: string;
            OMQ_REP: string;
            OMQ_DEALER: string;
            OMQ_ROUTER: string;
            OMQ_PUB: string;
            OMQ_SUB: string;
            OMQ_XPUB: string;
            OMQ_XSUB: string;
            OMQ_PUSH: string;
            OMQ_PULL: string;
            OMQ_PAIR: string;
            OMQ_STREAM: string;
        };
        DEFAULT_SERVER_IP_ADDRESS: string;
        DEFAULT_SERVER_IP_PORT: string;
        TRANSPORT: {
            TCP: string;
            IPC: string;
            INPROC: string;
            PGM: string;
            EPGM: string;
        };
        FIRST_CONNECTION_TIMEOUT: number;
        CLIENT_IDENTITY_PREFIX: string;
        SERVER_IDENTITY_PREFIX: string;
        CLIENT_KEEP_ALIVE_TIME: number;
        CLIENT_MESSAGE: {
            ALIVE: string;
            HELLO: string;
        };
        SERVER_MESSAGE: {
            CLOSE_ORDER: string;
            ALIVE: string;
        };
        KEYWORDS_OMQ: {
            MESSAGE: string;
            ACCEPT: string;
            CONNECT: string;
            CLOSE: string;
            CLOSE_ERROR: string;
            DISCONNECT: string;
            MONITOR_ERROR: string;
        };
        TIMEOUT_CLIENT_NO_PROOF_OF_LIVE: number;
        WAITING_TIME_BETWEEN_TWO_RECEIVE: number;
    };
    /**
     * Max time we wait the new slave to connect at his creation
     */
    readonly SLAVE_CREATION_CONNECTION_TIMEOUT: number;
};
