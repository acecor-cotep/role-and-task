import AZeroMQServerLight from '../AZeroMQServerLight.js';
/**
 * Implements a zeroMQ Server : Type -> PULL
 */
export default class ZeroMQServerPull extends AZeroMQServerLight {
    start({ ipServer, portServer, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<any>;
    stop(): Promise<any>;
    /**
     * You cannot send a message to client, because the link to client is unidirectionnal
     */
    sendMessage(): void;
}
