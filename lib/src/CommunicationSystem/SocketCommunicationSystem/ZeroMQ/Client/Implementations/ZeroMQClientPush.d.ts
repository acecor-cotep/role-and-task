import AZeroMQClientLight from '../AZeroMQClientLight.js';
import { ZmqSocket } from '../../AZeroMQ.js';
/**
 * Implements a zeroMQ Client : Type -> PUSH
 *
 */
export default class ZeroMQClientPush extends AZeroMQClientLight {
    /**
     * Start a ZeroMQ Client
     */
    start({ ipServer, portServer, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<ZmqSocket>;
    stop(): Promise<void>;
    sendMessage(message: any): void;
}
