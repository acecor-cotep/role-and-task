import AMaster from './AMaster';
import ZeroMQServerRouter from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/ZeroMQServerRouter';
/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 */
export default class Master1_0 extends AMaster {
    protected pathToEntryFile: string | false;
    protected communicationSystem: ZeroMQServerRouter | false;
    protected slaves: any[];
    protected notConfirmedSlaves: any[];
    protected consoleChildObjectPtr: any[];
    protected newConnectionListeningFunction: {
        func: Function;
        context: any;
    }[];
    protected newDisconnectionListeningFunction: {
        func: Function;
        context: any;
    }[];
    protected cpuUsageAndMemory: any;
    protected tasksInfos: any;
    protected mutexes: any;
    protected intervalFdCpuAndMemory: any;
    protected intervalFdTasksInfos: any;
    constructor();
    /**
     * Init the properties
     */
    protected initProperties(): void;
    /**
     * Get the communicationSystem
     */
    getCommunicationSystem(): ZeroMQServerRouter | false;
    /**
     * SINGLETON implementation
     * @override
     */
    static getInstance(): Master1_0;
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
    listenSlaveConnectionEvent(func: Function, context?: any): void;
    /**
     * Push a function that get fired when a slave get disconnected
     */
    listenSlaveDisconnectionEvent(func: Function, context?: any): void;
    /**
     * Return the array that contains non-confirmed slaves
     */
    getNonConfirmedSlaves(): any[];
    /**
     *  Get an array that contains confirmed slaves
     */
    getSlaves(): any[];
    /**
     * We get asked to spread a news to every slave tasks and our tasks
     *
     * WARNING - DO NOT SEND IT TO NON-REGULAR SLAVES (CRON_EXECUTOR_ROLE FOR EXAMPLE)
     */
    sendDataToEveryProgramTaskWhereverItIsLowLevel(_: any, __: any, body: any): void;
    /**
     * We get asked to spread a news to every slave tasks and our tasks
     */
    sendDataToEveryProgramTaskWhereverItIs(data: any): void;
    /**
     * Tell the Task about something happend in slaves
     */
    tellMasterAboutSlaveError(clientIdentityString: string, err: Error): void;
    /**
     * An error happended into a slave, what do we do?
     */
    errorHappenedIntoSlave(_: any[], clientIdentityString: string, body: string): Promise<void>;
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
    protected protocolTakeMutex(_: any[], clientIdentityString: string, body: any): Promise<void>;
    /**
     * Release the mutex behind the given ID
     */
    protected protocolReleaseMutex(_: any[], clientIdentityString: string, body: any): Promise<void>;
    /**
     * Define the master/slave basic protocol
     * (Authentification)
     */
    protected protocolMasterSlave(): void;
    /**
     * We got news about a slave -> infos
     * Store it and call HandleProgramTask if it's up
     */
    protected infosAboutSlaveIncomming(_: any[], clientIdentityString: string, data: any): void;
    /**
     * Returns in an array the whole system pids (Master + Slaves processes)
     */
    getFullSystemPids(): Promise<string[]>;
    /**
     * Connect the second Task to the first one
     * @param {String} idTaskToConnectTo
     * @param {String} idTaskToConnect
     * @param {Object} args
     */
    connectMasterToTask(idTaskToConnectTo: string, idTaskToConnect: string, args: any): Promise<any>;
    /**
     * Connect the second Task to the first one
     * @param {String} identifierSlave - Identifier of the slave that host the idTaskToConnectTo
     * @param {String} idTaskToConnectTo
     * @param {String} idTaskToConnect
     * @param {Object} args
     */
    connectTaskToTask(identifierSlave: string, idTaskToConnectTo: string, idTaskToConnect: string, args: any): Promise<any>;
    /**
     * Modify the status of the task attached to the given identifier
     * (local data, have no impact in the real slave)
     */
    protected modifyTaskStatusToSlaveLocalArray(identifier: string, idTask: string, status: boolean): void;
    /**
     * When called: Add a task to a slave
     */
    startTaskToSlave(identifier: string, idTask: string, args?: any): Promise<any>;
    /**
     * List the existing slaves
     */
    listSlaves(): any[];
    /**
     * List a slave tasks using its identifier (Ask the slave to it)
     */
    protected distantListSlaveTask(identifier: string): Promise<any>;
    /**
     * List a slave tasks using its identifier (Use local data to it)
     * @param {String} identifier
     */
    listSlaveTask(identifier: string): Promise<any>;
    /**
     * Handle the fact the program state change
     * We spread the data on our tasks and to our slaves
     * @param {Number} programState
     * @param {Number} oldProgramState
     */
    handleProgramStateChange(programState: any, oldProgramState: any): Promise<any>;
    /**
     * Return only the slaves that are regular slaves (not CRON_EXECUTOR_ROLE for example)
     */
    getSlavesOnlyThatAreRegularSlaves(): any[];
    /**
     * Tell all slave that the program state did change
     *
     * WARNING - DO NOT INCLUDE CRON_EXECUTOR_ROLE SLAVES INTO THE PIPE
     */
    protected tellAllSlaveThatProgramStateChanged(programState: any, oldProgramState: any): Promise<any>;
    /**
     * Tell a slave that program state did change
     */
    tellASlaveThatProgramStateChanged(slaveIdentifier: string, programState: any, oldProgramState: any): Promise<any>;
    /**
     * When called: Remove an existing slave(s)
     */
    protected removeExistingSlave(identifiersSlaves: string[]): Promise<any>;
    /**
     * Kill a slave using its identifier
     */
    killSlave(programIdentifier: string): void;
    /**
     * When called: remove a task from slave
     *
     * THIS FUNCTION HAVE SPECIAL TIMEOUT FOR SLAVE ANSWER
     */
    removeTaskFromSlave(identifier: string, idTask: string, args?: any): Promise<any>;
    /**
     * Display a message directly
     */
    displayMessage(param: any): Promise<any>;
    /**
     * Start a new slave not in a console but in a regular process
     */
    startNewSlaveInProcessMode(slaveOpts: {
        opts: string[];
        uniqueSlaveId: String;
    }, _: any, connectionTimeout: number): Promise<any>;
    /**
     * Tell one task about what changed in the architecture
     */
    protected tellOneTaskAboutArchitectureChange(idTask: string): Promise<any>;
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
    protected sendMessageToSlaveHeadBodyPattern(programIdentifier: string, headString: string, bodyString: string): Promise<any>;
    /**
     * Send a message to a slave using an programIdentifier
     */
    protected sendMessageToSlave(programIdentifier: string, message: string): Promise<any>;
    /**
     * Get a slave using its program id
     */
    protected getSlaveByProgramIdentifier(programIdentifier: string): any;
    /**
     * Using the programIdentifier, wait a specific incoming message from a specific slave
     *
     * Messages are like: { head: Object, body: Object }
     *
     * If there is no answer before the timeout, stop waiting and send an error
     */
    protected getMessageFromSlave(headString: string, programIdentifier: string, timeout?: number): Promise<any>;
    /**
     * Send the cpu load to the server periodically
     */
    protected infiniteGetCpuAndMemory(): Promise<any>;
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
    }): Promise<any>;
    /**
     * Get the hierarchy level of the given task
     */
    static getHierarchyLevelByIdTask(computeListClosure: any, idTask: string): any;
    /**
     * Sort the array ASC by closureHierarchy
     */
    static sortArray(ptr: any): any;
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
    }): Promise<any>;
}
