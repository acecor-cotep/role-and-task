import ASocketCommunicationSystem from '../ASocketCommunicationSystem.js';
export default abstract class AZeroMQ<T> extends ASocketCommunicationSystem {
    protected mode: string | false;
    protected zmqObject: T | null;
    protected monitorTimeout: any;
    constructor();
    /**
     * Return an object that can be used to act the communication system
     * @override
     */
    getSocket(): T | null;
}
