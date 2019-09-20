import ASocketCommunicationSystem from '../ASocketCommunicationSystem.js';
export default abstract class AZeroMQ extends ASocketCommunicationSystem {
    protected mode: string | false;
    protected socket: any;
    protected monitorTimeout: any;
    constructor();
    /**
     * Return an object that can be used to act the communication system
     * @override
     */
    getSocket(): any;
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
