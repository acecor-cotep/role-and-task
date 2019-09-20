import AZeroMQClientLight from '../AZeroMQClientLight.js';
/**
 * Implements a zeroMQ Client : Type -> PUSH
 *
 */
export default class ZeroMQClientPush extends AZeroMQClientLight {
    /**
     * Start a ZeroMQ Client
     * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
     */
    start({ ipServer, portServer, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<any>;
    stop(): Promise<any>;
    sendMessage(message: any): void;
}
