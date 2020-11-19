/// <reference types="node" />
import AMaster from './AMaster';
import ZeroMQServerRouter from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter';
import Errors from '../../../Utils/Errors';
import ATask, { Slave } from '../../Tasks/ATask';
import { ClientIdentityByte } from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/AZeroMQServer';
import { ProgramState } from '../../Handlers/AHandler';
import { DisplayMessage } from '../ARole';
interface ConsoleChildObjectPtr {
    programIdentifier: string;
    pid: number;
}
interface Mutex {
    [key: string]: boolean;
}
/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 */
export default class Master extends AMaster {
    protected pathToEntryFile: string | false;
    protected communicationSystem: ZeroMQServerRouter | false;
    protected slaves: Slave[];
    protected notConfirmedSlaves: Slave[];
    protected consoleChildObjectPtr: ConsoleChildObjectPtr[];
    protected newConnectionListeningFunction: {
        func: Function;
        context: unknown;
    }[];
    protected newDisconnectionListeningFunction: {
        func: Function;
        context: unknown;
    }[];
    protected cpuUsageAndMemory: any;
    protected tasksInfos: {
        [key: string]: unknown;
        idTask: string;
    }[] | false;
    protected mutexes: Mutex;
    protected intervalFdCpuAndMemory: NodeJS.Timeout | null;
    protected intervalFdTasksInfos: NodeJS.Timeout | null;
    constructor();
    /**
     * Init the properties
     */
    protected initProperties(): void;
    getCommunicationSystem(): ZeroMQServerRouter | false;
    static getInstance(): Master;
    /**
     * Pull a function that get fired when a slave get connected
     */
    unlistenSlaveConnectionEvent(func: Function): void;
    /**
     * Pull a function that get fired when a slave get disconnected
     */
    unlistenSlaveDisconnectionEvent(func: Function): void;
    /**
     * Push a function that get fired when a slave get connected
     */
    listenSlaveConnectionEvent(func: Function, context?: unknown): void;
    /**
     * Push a function that get fired when a slave get disconnected
     */
    listenSlaveDisconnectionEvent(func: Function, context?: unknown): void;
    getNonConfirmedSlaves(): Slave[];
    getSlaves(): Slave[];
    /**
     * We get asked to spread a news to every slave tasks and our tasks
     *
     * WARNING - DO NOT SEND IT TO NON-REGULAR SLAVES (CRON_EXECUTOR_ROLE FOR EXAMPLE)
     */
    sendDataToEveryProgramTaskWhereverItIsLowLevel(_: ClientIdentityByte, __: string, body: {
        dataName: string;
        data: any;
        timestamp: number;
        limitToTaskList: string[];
    }): void;
    /**
     * We get asked to spread a news to every slave tasks and our tasks
     */
    sendDataToEveryProgramTaskWhereverItIs(data: any): void;
    tellMasterAboutSlaveError(clientIdentityString: string, err: Error): void;
    errorHappenedIntoSlave(_: ClientIdentityByte, clientIdentityString: string, body: string): Promise<void>;
    /**
     * In master/slave protocol, we ask to get a token. We get directly asked as the master
     */
    takeMutex(id: string): Promise<void>;
    /**
     * In master/slave protocol, we ask to release the token. We get directly asked as the master.
     */
    releaseMutex(id: string): Promise<void>;
    /**
     * Take the mutex behind the given ID if it's available
     */
    protected protocolTakeMutex(_: ClientIdentityByte, clientIdentityString: string, body: {
        id: string;
    }): Promise<void>;
    /**
     * Release the mutex behind the given ID
     */
    protected protocolReleaseMutex(_: ClientIdentityByte, clientIdentityString: string, body: {
        id: string;
    }): Promise<void>;
    /**
     * Define the master/slave basic protocol
     * (Authentification)
     */
    protected protocolMasterSlave(): void;
    /**
     * We got news about a slave -> infos
     * Store it and call HandleProgramTask if it's up
     */
    protected infosAboutSlaveIncomming(_: ClientIdentityByte, clientIdentityString: string, data: any): void;
    /**
     * Returns in an array the whole system pids (Master + Slaves processes)
     */
    getFullSystemPids(): Promise<string[]>;
    /**
     * Connect the second Task to the first one
     */
    connectMasterToTask(idTaskToConnectTo: string, idTaskToConnect: string, args: unknown[]): Promise<void>;
    /**
     * Connect the second Task to the first one
     */
    connectTaskToTask(identifierSlave: string, idTaskToConnectTo: string, idTaskToConnect: string, args: unknown[]): Promise<string>;
    /**
     * Modify the status of the task attached to the given identifier
     * (local data, have no impact in the real slave)
     */
    protected modifyTaskStatusToSlaveLocalArray(identifier: string, idTask: string, status: boolean): void;
    /**
     * When called: Add a task to a slave
     */
    startTaskToSlave(identifier: string, idTask: string, args: unknown[]): Promise<string>;
    listSlaves(): Slave[];
    /**
     * List a slave tasks using its identifier (Ask the slave to it)
     */
    protected distantListSlaveTask(identifier: string): Promise<unknown>;
    /**
     * List a slave tasks using its identifier (Use local data to it)
     */
    listSlaveTask(identifier: string): Promise<ATask[]>;
    /**
     * Handle the fact the program state change
     * We spread the data on our tasks and to our slaves
     */
    handleProgramStateChange(programState: ProgramState, oldProgramState: ProgramState): Promise<void>;
    /**
     * Return only the slaves that are regular slaves (not CRON_EXECUTOR_ROLE for example)
     */
    getSlavesOnlyThatAreRegularSlaves(): Slave[];
    /**
     * Tell all slave that the program state did change
     *
     * WARNING - DO NOT INCLUDE CRON_EXECUTOR_ROLE SLAVES INTO THE PIPE
     */
    protected tellAllSlaveThatProgramStateChanged(programState: ProgramState, oldProgramState: ProgramState): Promise<void>;
    tellASlaveThatProgramStateChanged(slaveIdentifier: string, programState: ProgramState, oldProgramState: ProgramState): Promise<string>;
    protected removeExistingSlave(identifiersSlaves: string[]): Promise<void>;
    /**
     * Kill a slave using its identifier
     */
    killSlave(programIdentifier: string): void;
    /**
     * When called: remove a task from slave
     *
     * THIS FUNCTION HAVE SPECIAL TIMEOUT FOR SLAVE ANSWER
     */
    removeTaskFromSlave(identifier: string, idTask: string, args: unknown[]): Promise<string>;
    /**
     * Display a message directly
     */
    displayMessage(param: DisplayMessage): Promise<void>;
    /**
     * Start a new slave not in a console but in a regular process
     */
    startNewSlaveInProcessMode(slaveOpts: {
        opts: string[];
        uniqueSlaveId: string;
    }, _: any, connectionTimeout: number): Promise<Slave>;
    /**
     * Tell one task about what changed in the architecture
     */
    protected tellOneTaskAboutArchitectureChange(idTask: string): Promise<void>;
    /**
     * Do something when an information changed about PROGRAM architecture
     */
    protected somethingChangedAboutSlavesOrI(): Promise<void>;
    /**
     * When called : start a new slave
     * Take options in parameters or start a regular slave
     */
    startNewSlave(slaveOpts: {
        opts: string[];
        uniqueSlaveId: string;
    }, specificOpts: any, connectionTimeout?: number): Promise<string>;
    /**
     * Send a message that match head/body pattern
     *
     * Messages are like: { head: Object, body: Object }
     */
    protected sendMessageToSlaveHeadBodyPattern(programIdentifier: string, headString: string, body: unknown): Promise<true>;
    /**
     * Send a message to a slave using an programIdentifier
     */
    protected sendMessageToSlave(programIdentifier: string, message: string): Promise<true>;
    /**
     * Get a slave using its program id
     */
    protected getSlaveByProgramIdentifier(programIdentifier: string): Slave | Errors;
    /**
     * Using the programIdentifier, wait a specific incoming message from a specific slave
     *
     * Messages are like: { head: Object, body: Object }
     *
     * If there is no answer before the timeout, stop waiting and send an error
     */
    protected getMessageFromSlave(headString: string, programIdentifier: string, timeout?: number): Promise<unknown>;
    /**
     * Send the cpu load to the server periodically
     */
    protected infiniteGetCpuAndMemory(): Promise<void>;
    /**
     * Get periodically the infos about tasks running in master
     */
    protected infiniteGetTasksInfos(): void;
    /**
     * PROGRAM start to play the role
     *
     * A master is defined as:
     * A master have a Server ZeroMQ open
     * A master is connected to Slaves
     *
     * pathToEntryFile is the path we will use to start new slaves
     *
     * @param {Object} args
     * @override
     */
    start({ ipServer, portServer, }: {
        ipServer: string;
        portServer: string;
    }): Promise<true>;
    /**
     * Get the hierarchy level of the given task
     */
    static getHierarchyLevelByIdTask(computeListClosure: any, idTask: string): Promise<boolean | number>;
    /**
     * Sort the array ASC by closureHierarchy
     */
    static sortArray<T extends {
        closureHierarchy: number;
    }>(ptr: T[]): T[];
    /**
     * This methods return the task we need to stop first
     * There is an hierarchie in tasks closure
     */
    protected chooseWhichTaskToStop(): any;
    /**
     * Stop all tasks on every slave and master following a specific closure order
     * (Some tasks must be closed before/after some others)
     *
     * WARNING RECURSIVE CALL
     */
    protected stopAllTaskOnEverySlaveAndMaster(): Promise<any>;
    stop(): Promise<any>;
    /**
     * Send the given message and wait for the response
     *
     * HERE WE CREATE TWO EXECUTIONS LIFES
     *
     * Put isHeadBodyPattern = true if you want to use the headBodyPattern
     */
    sendMessageAndWaitForTheResponse({ identifierSlave, messageHeaderToSend, messageBodyToSend, messageHeaderToGet, isHeadBodyPattern, timeoutToGetMessage, }: {
        identifierSlave: string;
        messageHeaderToSend: string;
        messageBodyToSend: any;
        messageHeaderToGet: string;
        isHeadBodyPattern: boolean;
        timeoutToGetMessage?: undefined | number;
    }): Promise<unknown>;
}
export {};
