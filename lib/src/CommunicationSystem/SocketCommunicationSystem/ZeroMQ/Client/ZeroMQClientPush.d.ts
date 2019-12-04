import * as zmq from 'zeromq';
import AZeroMQ from '../AZeroMQ.js';
/**
 * Client to use when you have an unidirectionnal connection PUSH
 */
export default class ZeroMQClientPush extends AZeroMQ<zmq.Push> {
    protected isClosing: boolean;
    constructor();
    protected waitConnection(): Promise<void>;
    start({ ipServer, portServer, transport, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
    }): Promise<any>;
    stop(): Promise<any>;
    sendMessage(message: string): Promise<void>;
}
