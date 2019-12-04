/// <reference types="node" />
import * as zmq from 'zeromq';
import AZeroMQ from '../AZeroMQ.js';
/**
 * Server used when you have Unidirectionnal PULL server
 */
export default class ZeroMQServerPull extends AZeroMQ<zmq.Pull> {
    protected descriptorInfiniteRead: NodeJS.Timeout | null;
    protected isClosing: boolean;
    constructor();
    start({ ipServer, portServer, transport, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
    }): Promise<any>;
    stop(): Promise<any>;
    /**
     * Treat messages that comes from clients
     * send them to the listeners
     */
    treatMessageFromClient(): void;
    sendMessage(...args: any): void;
}
