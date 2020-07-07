/// <reference types="node" />
import ASocketCommunicationSystem from '../ASocketCommunicationSystem.js';
export declare type ZmqSocket = {
    on: Function;
    once: Function;
    monitor: Function;
    unmonitor: Function;
    identity: string;
    connect: Function;
    close: Function;
    bind: Function;
    send: Function;
};
export default abstract class AZeroMQ extends ASocketCommunicationSystem {
    protected mode: string | false;
    protected socket: ZmqSocket | null;
    protected monitorTimeout: NodeJS.Timeout | false;
    constructor();
    /**
     * Return an object that can be used to act the communication system
     * @override
     */
    getSocket(): ZmqSocket | null;
    /**
     * Stop the monitor
     */
    stopMonitor(): void;
    /**
     * Start the monitor that will listen to socket news
     * Check for events every 500ms and get all available events.
     */
    startMonitor(): void;
}
