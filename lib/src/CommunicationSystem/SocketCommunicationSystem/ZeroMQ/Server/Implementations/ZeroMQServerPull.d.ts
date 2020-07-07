import AZeroMQServerLight from '../AZeroMQServerLight.js';
import { ZmqSocket } from '../../AZeroMQ.js';
/**
 * Implements a zeroMQ Server : Type -> PULL
 */
export default class ZeroMQServerPull extends AZeroMQServerLight {
    start({ ipServer, portServer, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<ZmqSocket>;
    stop(): Promise<void>;
    /**
     * You cannot send a message to client, because the link to client is unidirectionnal
     */
    sendMessage(): never;
}
