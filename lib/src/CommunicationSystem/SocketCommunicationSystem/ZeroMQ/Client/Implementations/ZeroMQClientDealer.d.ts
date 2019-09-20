import AZeroMQClient from '../AZeroMQClient.js';
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
    }): Promise<any>;
    stop(): Promise<any>;
    sendMessage(message: string): void;
}
