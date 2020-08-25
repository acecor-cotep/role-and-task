import AZeroMQClientLight from '../AZeroMQClientLight.js';
import { ZmqSocket } from '../../AZeroMQ.js';
export default class ZeroMQClientPush extends AZeroMQClientLight {
    start({ ipServer, portServer, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<ZmqSocket>;
    stop(): Promise<void>;
    sendMessage(message: any): void;
}
