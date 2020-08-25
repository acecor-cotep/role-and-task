/// <reference types="node" />
import AZeroMQ, { ZmqSocket } from '../AZeroMQ.js';
interface InfosServer {
    ipServer: string;
    portServer: string;
    socketType: string;
    transport: string;
    identityPrefix: string;
}
export declare type ClientIdentityByte = number[];
interface Client {
    clientIdentityString: string;
    clientIdentityByte: ClientIdentityByte;
    timeoutAlive: NodeJS.Timeout | false;
}
/**
 * Server used when you have Bidirectionnal server (like ROUTER)
 */
export default abstract class AZeroMQServer extends AZeroMQ {
    protected clientList: Client[];
    protected infosServer: InfosServer | false;
    protected newConnectionListeningFunction: {
        func: Function;
        context: unknown;
    }[];
    protected newDisconnectionListeningFunction: {
        func: Function;
        context: unknown;
    }[];
    constructor();
    /**
     * Get infos from the server -> ip/port ...etc
     */
    getInfosServer(): InfosServer | false;
    getConnectedClientList(): string[];
    startServer({ ipServer, portServer, socketType, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        socketType?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<ZmqSocket>;
    /**
     * Stop a ZeroMQ Server
     */
    stopServer(): Promise<void>;
    /**
     * Setup a function that is called when a new client get connected
     */
    listenNewConnectedClientEvent(func: Function): void;
    /**
     * Send a message to every connected client
     */
    sendBroadcastMessage(message: string): void;
    /**
     * Close a connection to a client
     */
    closeConnectionToClient(clientIdentityByte: ClientIdentityByte, clientIdentityString: string): void;
    /**
     * Disconnect a user because we have got no proof of life from it since too long
     * long defined by CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE
     */
    disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte: ClientIdentityByte, clientIdentityString: string): void;
    /**
     * Handle a new connection of client to the server
     * (Store it into a list that will be useful create clientConnection/clientDisconnection event)
     */
    handleNewClientToServer(clientIdentityByte: ClientIdentityByte, clientIdentityString: string): void;
    /**
     * Function that is executed to handle client timeout
     * Not proof of life from too long
     */
    timeoutClientConnection(clientIdentityByte: ClientIdentityByte, clientIdentityString: string): void;
    sendMessageToClient(_: ClientIdentityByte, clientIdentityString: string, message: string): void;
    /**
     * We know that the specified client is alive (he sent something to us)
     */
    handleAliveInformationFromSpecifiedClient(clientIdentityByte: ClientIdentityByte, clientIdentityString: string): void;
    removeClientToServer(clientIdentityByte: ClientIdentityByte, clientIdentityString: string): void;
    treatMessageFromClient(): void;
    /**
     * Push the function that will get when a new connection is detected
     */
    listenClientConnectionEvent(func: Function, context?: unknown): void;
    /**
     * Push the function that will get when a disconnection is detected
     */
    listenClientDisconnectionEvent(func: Function, context?: unknown): void;
}
export {};
