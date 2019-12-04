/**
 * This abstract class described what a socket communication system class must offer
 */
export default abstract class ASocketCommunicationSystem {
    protected name: string;
    protected active: boolean;
    protected incomingMessageListeningFunction: {
        func: Function;
        context: any;
    }[];
    constructor();
    getName(): string;
    setName(name: string): void;
    /**
     * Return an object that can be used to act the communication system
     */
    abstract getSocket(): any;
    /**
     * Start the communication system
     */
    abstract start(...args: any): Promise<any>;
    /**
     * Stop the communication system
     */
    abstract stop(...args: any): Promise<any>;
    isActive(): boolean;
    abstract sendMessage(...args: any): void;
    /**
     * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
     */
    listenToIncomingMessage(func: Function, context?: any): void;
    /**
     * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
     */
    unlistenToIncomingMessage(func: Function): void;
}
