import AZeroMQServer, { ClientIdentityByte } from '../AZeroMQServer.js';
import { ZmqSocket } from '../../AZeroMQ.js';
/**
 * Implements a zeroMQ Server : Type -> ROUTER
 *
 */
export default class ZeroMQServerRouter extends AZeroMQServer {
    start({ ipServer, portServer, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<ZmqSocket>;
    stop(): Promise<void>;
    sendMessage(clientIdentityByte: ClientIdentityByte, clientIdentityString: string, message: string): void;
}
