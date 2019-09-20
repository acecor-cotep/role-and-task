import AZeroMQServer from '../AZeroMQServer.js';
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
    }): Promise<any>;
    stop(): Promise<any>;
    sendMessage(clientIdentityByte: any[], clientIdentityString: string, message: string): void;
}
