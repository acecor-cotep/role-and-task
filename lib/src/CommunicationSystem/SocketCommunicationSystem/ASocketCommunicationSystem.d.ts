import { ZmqSocket } from './ZeroMQ/AZeroMQ.js';
/**
 * This abstract class described what a socket communication system class must offer
 */
export default abstract class ASocketCommunicationSystem {
    protected name: string;
    protected active: boolean;
    protected incomingMessageListeningFunction: {
        func: Function;
        context: unknown;
    }[];
    constructor();
    getName(): string;
    setName(name: string): void;
    /**
     * Return an object that can be used to act the communication system
     * @abstract
     */
    abstract getSocket(): ZmqSocket | null;
    /**
     * Start the communication system
     * @abstract
     */
    abstract start(...args: unknown[]): Promise<unknown>;
    /**
     * Stop the communication system
     * @abstract
     */
    abstract stop(...args: unknown[]): Promise<unknown>;
    /**
     * Is the communication sytem active?
     * @return {Boolean}
     */
    isActive(): boolean;
    /**
     * Send a message
     * @abstract
     */
    abstract sendMessage(...args: unknown[]): void;
    /**
     * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
     */
    listenToIncomingMessage(func: Function, context?: unknown): void;
    /**
     * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
     */
    unlistenToIncomingMessage(func: Function): void;
}
