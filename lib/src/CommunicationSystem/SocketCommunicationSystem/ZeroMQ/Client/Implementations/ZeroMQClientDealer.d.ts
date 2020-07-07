import AZeroMQClient from '../AZeroMQClient.js';
import { ZmqSocket } from '../../AZeroMQ.js';
/**
 * Implements a zeroMQ Client : Type -> DEALER
 *
 */
export default class ZeroMQClientDealer extends AZeroMQClient {
    start({ ipServer, portServer, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<ZmqSocket>;
    stop(): Promise<void>;
    sendMessage(message: string): void;
}
