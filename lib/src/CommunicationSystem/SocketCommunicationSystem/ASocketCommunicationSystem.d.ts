import { ZmqSocket } from './ZeroMQ/AZeroMQ.js';
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
    abstract getSocket(): ZmqSocket | null;
    abstract start(...args: unknown[]): Promise<unknown>;
    abstract stop(...args: unknown[]): Promise<unknown>;
    isActive(): boolean;
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
