import AZeroMQ from '../AZeroMQ.js';
/**
 * Server used when you have Bidirectionnal server (like ROUTER)
 */
export default abstract class AZeroMQServer extends AZeroMQ {
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
    startServer({ ipServer, portServer, socketType, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        socketType?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<any>;
    /**
     * Stop a ZeroMQ Server
     */
    stopServer(): Promise<any>;
    /**
     * Setup a function that is called when a new client get connected
     * @param {Function} func
     */
    listenNewConnectedClientEvent(func: Function): void;
    /**
     * Send a message to every connected client
     * @param {String} message
     */
    sendBroadcastMessage(message: string): void;
    /**
     * Close a connection to a client
     */
    closeConnectionToClient(clientIdentityByte: any[], clientIdentityString: string): void;
    /**
     * Disconnect a user because we have got no proof of life from it since too long
     * long defined by CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE
     */
    disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte: any[], clientIdentityString: string): void;
    /**
     * Handle a new connection of client to the server
     * (Store it into a list that will be useful create clientConnection/clientDisconnection event)
     */
    handleNewClientToServer(clientIdentityByte: any[], clientIdentityString: string): void;
    /**
     * Function that is executed to handle client timeout
     * Not proof of life from too long
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */
    timeoutClientConnection(clientIdentityByte: any[], clientIdentityString: string): void;
    sendMessageToClient(_: any[], clientIdentityString: string, message: string): void;
    /**
     * We know that the specified client is alive (he sent something to us)
     */
    handleAliveInformationFromSpecifiedClient(clientIdentityByte: any[], clientIdentityString: string): void;
    /**
     * Remove a client from the clientList array
     * @param {Arrray} clientIdentityByte
     * @param {String} clientIdentityString
     */
    removeClientToServer(clientIdentityByte: any[], clientIdentityString: string): void;
    /**
     * Treat messages that comes from clients
     */
    treatMessageFromClient(): void;
    /**
     * Push the function that will get when a new connection is detected
     * @param {Function} func
     * @param {Object} context
     */
    listenClientConnectionEvent(func: Function, context?: any): void;
    /**
     * Push the function that will get when a disconnection is detected
     * @param {Function} func
     * @param {Object} context
     */
    listenClientDisconnectionEvent(func: Function, context?: any): void;
}
