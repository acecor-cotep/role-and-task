import AZeroMQ, { ZmqSocket } from '../AZeroMQ.js';
/**
 * Client to use when you have an unidirectionnal connection - exemple socketType = Push
 */
export default abstract class AZeroMQClientLight extends AZeroMQ {
    constructor();
    startClient({ ipServer, portServer, socketType, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        socketType?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<ZmqSocket>;
    stopClient(): Promise<void>;
    /**
     * Setup a function that is calleed when socket get connected
     */
    listenConnectEvent(func: Function): void;
    /**
     * Setup a function that is calleed when socket get disconnected
     */
    listenDisconnectEvent(func: Function): void;
    sendMessageToServer(message: string): void;
}
