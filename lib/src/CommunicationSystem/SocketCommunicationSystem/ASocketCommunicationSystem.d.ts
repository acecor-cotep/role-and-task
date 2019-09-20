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
    /**
     * Getter
     * @return {String}
     */
    getName(): string;
    /**
     * Setter
     * @param {String} name
     */
    setName(name: string): void;
    /**
     * Return an object that can be used to act the communication system
     * @abstract
     */
    abstract getSocket(): any;
    /**
     * Start the communication system
     * @abstract
     */
    abstract start(...args: any): Promise<any>;
    /**
     * Stop the communication system
     * @abstract
     */
    abstract stop(...args: any): Promise<any>;
    /**
     * Is the communication sytem active?
     * @return {Boolean}
     */
    isActive(): boolean;
    /**
     * Send a message
     * @abstract
     */
    abstract sendMessage(...args: any): void;
    /**
     * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
     * @param {Function} func
     * @param {Object} context
     */
    listenToIncomingMessage(func: Function, context?: any): void;
    /**
     * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
     * @param {Function} func
     */
    unlistenToIncomingMessage(func: Function): void;
}
