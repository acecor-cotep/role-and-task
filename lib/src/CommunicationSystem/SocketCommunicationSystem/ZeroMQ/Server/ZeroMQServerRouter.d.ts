/// <reference types="node" />
import * as zmq from 'zeromq';
import AZeroMQ from '../AZeroMQ.js';
/**
 * Server used when you have Bidirectionnal server ROUTER
 */
export default class ZeroMQServerRouter extends AZeroMQ<zmq.Router> {
    protected isClosing: boolean;
    protected descriptorInfiniteRead: NodeJS.Timeout | null;
    protected clientList: any[];
    protected infosServer: any;
    protected newConnectionListeningFunction: {
        func: Function;
        context: any;
    }[];
    protected newDisconnectionListeningFunction: {
        func: Function;
        context: any;
    }[];
    constructor();
    /**
     * Get infos from the server -> ip/port ...etc
     */
    getInfosServer(): Object;
    /**
     * Return the list of connected clients
     * @return {Array}
     */
    getConnectedClientList(): string[];
    /**
     * Start a ZeroMQ Server
     */
    start({ ipServer, portServer, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<any>;
    /**
     * Stop a ZeroMQ Server
     */
    stop(): Promise<any>;
    /**
     * Send a message to every connected client
     */
    sendBroadcastMessage(message: string): Promise<void>;
    /**
     * Close a connection to a client
     */
    closeConnectionToClient(clientIdentityByte: Buffer, clientIdentityString: string): void;
    /**
     * Disconnect a user because we have got no proof of life from it since too long
     * long defined by CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE
     */
    disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte: Buffer, clientIdentityString: string): void;
    /**
     * Handle a new connection of client to the server
     * (Store it into a list that will be useful create clientConnection/clientDisconnection event)
     */
    handleNewClientToServer(clientIdentityByte: Buffer, clientIdentityString: string): void;
    sendMessage(_: Buffer, clientIdentityString: string, message: string): Promise<void>;
    /**
     * Remove a client from the clientList array
     */
    removeClientToServer(clientIdentityByte: Buffer, clientIdentityString: string): void;
    /**
     * Treat messages that comes from clients
     */
    treatMessageFromClient(): void;
    /**
     * Push the function that will get when a new connection is detected
     */
    listenClientConnectionEvent(func: Function, context?: any): void;
    /**
     * Push the function that will get when a disconnection is detected
     */
    listenClientDisconnectionEvent(func: Function, context?: any): void;
}
