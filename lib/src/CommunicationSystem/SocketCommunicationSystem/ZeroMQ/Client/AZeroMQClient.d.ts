import AZeroMQ from '../AZeroMQ.js';
/**
 * Client to use when you have an Bidirectionnal connection - exemple socketType = DEALER
 * This class include custom KeepAlive
 */
export default abstract class AZeroMQClient extends AZeroMQ {
    protected keepAliveTime: number;
    protected lastMessageSent: number | false;
    protected timeoutAlive: any;
    constructor(keepAliveTime?: number);
    /**
     * Start a ZeroMQ Client
     */
    startClient({ ipServer, portServer, socketType, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        socketType?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<any>;
    /**
     * Stop a ZeroMQ Client
     */
    stopClient(): Promise<any>;
    /**
     * Setup a function that is calleed when socket get connected
     */
    listenConnectEvent(func: Function): void;
    /**
     * Setup a function that is calleed when socket get disconnected
     */
    listenDisconnectEvent(func: Function): void;
    /**
     * Send a message to the server
     */
    sendMessageToServer(message: string): void;
    /**
     * Treat messages that comes from server
     */
    protected treatMessageFromServer(): void;
    /**
     * First message to send to the server to be regristered into it
     */
    clientSayHelloToServer(): void;
    /**
     * Say to the server that you are alive
     */
    clientSayHeIsAlive(): void;
}
