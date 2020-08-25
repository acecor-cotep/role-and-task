import AZeroMQClient from '../AZeroMQClient.js';
import { ZmqSocket } from '../../AZeroMQ.js';
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
