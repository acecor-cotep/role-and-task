import ASlave from './ASlave.js';
import ZeroMQClientDealer from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientDealer.js';
import Errors from '../../../Utils/Errors.js';
/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 */
export default class Slave1_0 extends ASlave {
    protected communicationSystem: ZeroMQClientDealer | false;
    protected intervalFdCpuAndMemory: any;
    protected intervalFdTasksInfos: any;
    /**
     * Ask if we want a brand new instance (If you don't create a new instance here as asked
     * you will have trouble in inheritance - child of this class)
     */
    constructor(oneshotNewInstance?: boolean);
    /**
     * SINGLETON implementation
     */
    static getInstance(): Slave1_0;
    /**
     * Get the communicationSystem
     */
    getCommunicationSystem(): ZeroMQClientDealer | false;
    /**
     * Display a message by giving it to the master
     */
    displayMessage(params: any): void;
    /**
     * Send the task list to the server
     */
    protected sendTaskList(): void;
    /**
     * We send our tasks and the type of slave we are
     */
    protected sendConfirmationInformations(): void;
    /**
     * We get asked to spread a news to every slave tasks -> Send the request to master
     */
    protected sendDataToEveryProgramTaskWhereverItIs(data: any): void;
    /**
     * Send message to server using head/body pattern
     */
    protected sendHeadBodyMessageToServer(head: string, body: any): void;
    /**
     * Start a task
     */
    protected protocolStartTask(body: {
        idTask: string;
        args: any;
    }): Promise<any>;
    /**
     * Stop a task
     */
    protected protocolStopTask(body: any): Promise<any>;
    /**
     * As a slave we send our infos to the master throught this method
     * Infos are: IP Address, CPU and memory Load, tasks infos ...
     */
    protected protocolSendMyInfosToMaster({ ip, cpuAndMemory, tasksInfos, }: any): Promise<any>;
    /**
     * Connect a task to an other task
     * @param {Object} body
     */
    protected protocolConnectTasks(body: any): Promise<any>;
    /**
     * We got a news from the master. We have to spread the news to every tasks we hold.
     * @param {{dataName: String, data: Object, timestamp: Date}} body
     */
    protected static protocolGenericChannelData(body: any): void;
    /**
     * We got a news about PROGRAM state change
     * We tell all our tasks about the change and send a result of spread to the master
     * @param {{ programState: any, oldProgramState: any }} body
     */
    protected protocolStateChange(body: any): Promise<any>;
    /**
     * We got an error that happended into the slave process
     * We send the error to the master, to make it do something about it
     * @param {Error)} err
     */
    tellMasterErrorHappened(err: Errors | Error): void;
    /**
     * We want to take the mutex behind the given id
     */
    takeMutex(id: string): Promise<any>;
    /**
     * We want to release the mutex behind the given id
     */
    releaseMutex(id: string): Promise<any>;
    /**
     * Define the protocol between master and a slaves
     */
    protected protocolMasterSlave(): void;
    /**
     * Send the cpu and memory load to the server periodically
     */
    protected infiniteSendCpuAndMemoryLoadToMaster(): void;
    /**
     * Send the cpu and memory load to the server periodically
     */
    protected infiniteSendTasksInfosToMaster(): void;
    /**
     * Start the slave1_0
     */
    protected startSlave1_0({ ipServer, portServer, identifier, eliotStartTime, }: {
        ipServer: string;
        portServer: string;
        identifier: string;
        eliotStartTime: string;
    }): Promise<any>;
    start(args: any): Promise<any>;
    stop(): Promise<any>;
    /**
     * Send the data to the server
     * @param {String} data
     */
    protected sendMessageToServer(data: any): void;
    /**
     * Wait a specific incoming message from the server
     *
     * Messages are like: { head: Object, body: Object }
     *
     * If there is no answer before the timeout, stop waiting and send an error
     */
    protected getMessageFromServer(headString: string, timeout?: number): Promise<any>;
    /**
     * Send the given message and wait for the response
     *
     * HERE WE CREATE TWO EXECUTIONS LIFES
     *
     * Put isHeadBodyPattern = true if you want to use the headBodyPattern
     *
     * @param {Object} args
     */
    protected sendMessageAndWaitForTheResponse({ messageHeaderToSend, messageBodyToSend, messageHeaderToGet, isHeadBodyPattern, timeoutToGetMessage, }: {
        messageHeaderToSend: string;
        messageBodyToSend: any;
        messageHeaderToGet: string;
        isHeadBodyPattern: boolean;
        timeoutToGetMessage?: undefined | number;
    }): Promise<any>;
}
