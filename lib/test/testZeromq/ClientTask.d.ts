import library from '../../src/Library.js';
import ZeroMQClientPush from '../../src/CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/ZeroMQClientPush.js';
/**
 * Define a Simple task which display a message every X seconds
 */
export default class ClientTask extends library.ATask {
    protected descriptor: any;
    protected client: ZeroMQClientPush | null;
    constructor();
    /**
     * Connect the actual task to the given task
     */
    connectToTask(idTaskToConnect: string, args: any): Promise<any>;
    /**
     * We get news data from here, use it or not, it depends from the task
     */
    consumeNewsData(dataName: string, data: any, timestamp: number): any;
    /**
     * Use the architecture data we have to generate an array that's gonna resume it
     * You can override it
     */
    dynamicallyRefreshDataIntoList(data: any): any;
    /**
     * Display a message in board
     */
    displayMessage(param: any): void;
    /**
     * apply the eliot state on the task
     * @param {Number} programState
     * @param {Number} oldEliotState
     * @override
     */
    applyNewProgramState(programState: any): Promise<void>;
    startMessageSending(): void;
    stopMessageSending(): void;
    /**
     * SINGLETON implementation
     * @override
     */
    static getInstance(): ClientTask;
    /**
     * Start to run the task
     * @override
     */
    start({ role, ipServer, portServer, transport, }: {
        role: any;
        ipServer: any;
        portServer: any;
        transport: any;
    }): Promise<boolean>;
    /**
     * ELIOT stop to run the task
     * @param {Object} args
     * @override
     */
    stop(): Promise<boolean>;
}
