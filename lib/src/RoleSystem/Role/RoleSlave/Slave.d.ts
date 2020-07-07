/// <reference types="node" />
import ASlave from './ASlave.js';
import ZeroMQClientDealer from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientDealer.js';
import Errors from '../../../Utils/Errors.js';
import { ProgramState } from '../../Handlers/AHandler.js';
import { DisplayMessage, ArgsObject } from '../ARole.js';
/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 */
export default class Slave extends ASlave {
    protected communicationSystem: ZeroMQClientDealer | false;
    protected intervalFdCpuAndMemory: NodeJS.Timeout | null;
    protected intervalFdTasksInfos: NodeJS.Timeout | null;
    /**
     * Ask if we want a brand new instance (If you don't create a new instance here as asked
     * you will have trouble in inheritance - child of this class)
     */
    constructor(oneshotNewInstance?: boolean);
    /**
     * SINGLETON implementation
     */
    static getInstance(): Slave;
    /**
     * Get the communicationSystem
     */
    getCommunicationSystem(): ZeroMQClientDealer | false;
    /**
     * Display a message by giving it to the master
     */
    displayMessage(params: DisplayMessage): Promise<void>;
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
    protected sendHeadBodyMessageToServer(head: string, body: unknown): void;
    /**
     * Start a task
     */
    protected protocolStartTask(body: {
        idTask: string;
        args: ArgsObject;
    }): Promise<void>;
    /**
     * Stop a task
     */
    protected protocolStopTask(body: {
        idTask: string;
        args: ArgsObject;
    }): Promise<void>;
    /**
     * As a slave we send our infos to the master throught this method
     * Infos are: IP Address, CPU and memory Load, tasks infos ...
     */
    protected protocolSendMyInfosToMaster({ ip, cpuAndMemory, tasksInfos, }: any): Promise<void>;
    /**
     * Connect a task to an other task
     */
    protected protocolConnectTasks(body: {
        idTask: string;
        idTaskToConnect: string;
        args: ArgsObject;
    }): Promise<void>;
    /**
     * We got a news from the master. We have to spread the news to every tasks we hold.
     */
    protected static protocolGenericChannelData(body: {
        dataName: string;
        data: any;
        timestamp: number;
        limitToTaskList: string[];
    }): void;
    /**
     * We got a news about PROGRAM state change
     * We tell all our tasks about the change and send a result of spread to the master
     */
    protected protocolStateChange(body: {
        programState: ProgramState;
        oldProgramState: ProgramState;
    }): Promise<void>;
    /**
     * We got an error that happended into the slave process
     * We send the error to the master, to make it do something about it
     */
    tellMasterErrorHappened(err: Errors | Error): void;
    /**
     * We want to take the mutex behind the given id
     */
    takeMutex(id: string): Promise<void>;
    /**
     * We want to release the mutex behind the given id
     */
    releaseMutex(id: string): Promise<void>;
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
     * Start the Slave
     */
    protected startSlave({ ipServer, portServer, identifier, eliotStartTime, }: {
        ipServer: string;
        portServer: string;
        identifier: string;
        eliotStartTime: string;
    }): Promise<void>;
    start(args: {
        ipServer: string;
        portServer: string;
        identifier: string;
        eliotStartTime: string;
    }): Promise<void>;
    stop(): Promise<void>;
    /**
     * Send the data to the server
     */
    protected sendMessageToServer(data: string): void;
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
