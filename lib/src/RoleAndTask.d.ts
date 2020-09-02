import Errors from './Utils/Errors';
import RoleHandler from './RoleSystem/Handlers/RoleHandler';
import SystemBoot from './systemBoot/systemBoot';
import ARole, { DisplayMessage } from './RoleSystem/Role/ARole';
import ATask from './RoleSystem/Tasks/ATask';
interface State {
    name: string;
    id: number;
}
interface ProgramStateChange {
    resolve: Function;
    reject: Function;
    programState: State;
    inProgress: boolean;
}
export interface Task {
    id: string;
    name: string;
    color: string;
    closureHierarchy: number;
    idsAllowedRole: string[];
    obj: ATask;
    notifyAboutArchitectureChange?: boolean;
}
interface Role {
    name: string;
    id: string | -1;
    'class': typeof ARole;
    obj?: ARole;
}
/**
 * Class which is the interface with the library user
 */
export default class RoleAndTask {
    launchMasterSlaveConfigurationFile: string | false;
    pathToEntryFile: string | false;
    displayTask: string | false;
    displayLog: boolean;
    makesErrorFatal: boolean;
    considerWarningAsErrors: boolean;
    masterMessageWaitingTimeout: number;
    masterMessageWaitingTimeoutStateChange: number;
    masterMessageWaitingTimeoutStopTask: number;
    masterMessageWaitingTimeoutStopChange: number;
    tasks: Task[];
    protected roles: Role[];
    protected states: State[];
    protected stateChangeCallbacks: {
        callback: Function;
        descriptor: string;
    }[];
    protected programState: State;
    protected programStateChangeWaitingList: ProgramStateChange[];
    customLaunchingMode: {
        name: string;
        func: Function;
    }[];
    protected quitOrder: boolean;
    protected masterMutexValidationFunctions: {
        id: string;
        funcTake: Function;
        funcRelease: Function;
    }[];
    protected systemBoot: SystemBoot | null;
    protected mode: any;
    protected modeoptions: any;
    protected roleHandler: RoleHandler | null;
    protected startDate: Date;
    /**
     * Constructor working the Singleton way
     */
    constructor();
    /**
     * Watch the memory usage of the current process.
     *
     * Show a warning at 60+% memory usage consumption
     * Throw an error at 90+% memory usage consumption
     *
     * Show a warning every 30 second at max
     */
    protected static watchMemoryUsage(): void;
    /**
     * Get the good element to treat (Look at specific behavior described into lookAtProgramStateChangePipe comment)
     * (If there is actually something in progress, do nothing)
     */
    protected getProgramStateChangeToTreat(): ProgramStateChange | false;
    /**
     * Some program element got treated, remove them from the pipe
     */
    protected programChangeElementGotTreated(elem: false | ProgramStateChange): void;
    /**
     * Send the message saying the state change to whom is interested to know
     */
    spreadStateToListener(): void;
    /**
     * Look at the programStateChangeWaitingList array, and perform an program state change if we need to
     * Specific behavior:
     *
     * (1) Error change state always pass first
     * (2) When you want to change the state as something already true, resolve() directly
     */
    protected lookAtProgramStateChangePipe(): Promise<void>;
    /**
     * Singleton getter
     */
    static getInstance(): RoleAndTask;
    /**
     * Launch the system
     *
     * We have to load dynamically systemBoot to avoid recursive import
     */
    boot(): Promise<void>;
    /**
     * Launch the system ** can be called static **
     */
    static boot(): Promise<void>;
    /**
     * Subscribe to the state change. Returns the descriptor to use to unsubscribe
     */
    subscribeToStateChange(callback: Function): string;
    /**
     * Unsubscribe to state change, passing the descriptor returned by subscribe function
     */
    unSubscribeToStateChange(descriptor: string): void;
    /**
     * Declare a new launching mode for processes
     *
     * Basics launching mode are 'slave' and 'master'.
     *
     * > If you want a custom Role maybe you would implement your curstom launching mode
     */
    declareLaunchingMode(name: string, func: Function): void;
    /**
     * Remove a custom launching mode
     */
    unDeclareLaunchingMode(name: string): void;
    /**
     * Declare a new state
     */
    declareState(stateConfiguration: State): void;
    /**
     * Declare a new Role
     *
     * {
     *   name: String,
     *   id: String,
     *   class: ARole,
     * }
     */
    declareRole(roleConfiguration: {
        name: string;
        id: string;
        'class': typeof ARole;
    }): void;
    /**
     * Declare the given task to the task system
     */
    declareTask(taskConfiguration: Task): void;
    /**
     * Remove the task from the task list using the task id
     */
    removeTask(taskName: string): void;
    /**
     * Get the tasks related to the given role id
     */
    getRoleTasks(idRole: string): Task[];
    /**
     * Get the roles configuration
     */
    getRoles(): (Role | false)[];
    getActualRole(possibilities: string[], i: number): Promise<false | ARole>;
    /**
     * Get the slave role nor the master
     * Take the first that is active
     */
    getSlaveNorMaster(): Promise<false | ARole>;
    /**
     * Change the program state
     * Role master: Set this.programState & spread the news to itselfs tasks and slaves
     * Role slate: Set the this.programState
     */
    changeProgramState(idProgramState: number): Promise<void>;
    static getTheTaskWhoPerformTheDisplay(role: ARole): string;
    /**
     * Handle the display message throught the slaves and master
     * If we are master we display the message
     * If we are a slave we give the messsage to the master
     */
    displayMessage(param: DisplayMessage): Promise<false>;
    /**
     * Here we come when an error happened on the system and we want to deal with it,
     * If we are the master, we tell ourselves about it
     * If we are a slave or ... we tell the master about it
     */
    errorHappened(err: Error | Errors): Promise<void>;
    /**
     * Display messages about exiting program in errorHappened
     */
    static exitProgramMsg(txt: string, err: Error | Errors, e: Error | Errors): void;
    /**
     * Make the master to quit every slaves and every task
     * DO NOT QUIT THE APP
     */
    makeTheMasterToQuitEverySlaveAndTask(): Promise<boolean>;
    /**
     * Properly quit the app if we are on master
     * Ignore if we are inside something else
     */
    makeTheMasterToQuitTheWholeApp(): Promise<void>;
    /**
     * We exit PROGRAM unproperly due to an error that can't be fixed regulary
     * (Ex: lose the communication between the slave and the master and we are the slave)
     */
    static exitProgramUnproperDueToError(): void;
    /**
     * We exit PROGRAM when everything had been closed the right way
     */
    static exitProgramGood(): void;
    handleSignals(): void;
    spreadDataToEveryLocalTask({ dataName, data, timestamp, limitToTaskList, }: {
        dataName: string;
        data: any;
        timestamp: number;
        limitToTaskList: string[];
    }): Promise<void>;
    /**
     * THIS METHOD WORK ONLY IN THE MASTER
     * (It get called by HandleProgramTask)
     *
     * It returns in an array the whole system pids (Master + Slaves processes)
     */
    getFullSystemPids(): Promise<string[]>;
    /**
     * Get the master role (error if we are not in master role process)
     */
    getMasterRole(): Promise<ARole>;
    getRoleHandler(): RoleHandler | null;
    /**
     * Quit everything that is open
     *
     * Including:
     *
     * -> Close the role (Slave or Master)
     * ----> If slave: Close its running tasks
     * ----> If master: Close all the slaves
     */
    quit(): Promise<void>;
    static declareRole(roleConfiguration: {
        name: string;
        id: string;
        'class': typeof ARole;
    }): void;
    /**
     * Declare a new State in addition of the defaults ones
     */
    static declareState(stateConfiguration: {
        name: string;
        id: number;
    }): void;
    static declareTask(taskConfiguration: Task): void;
    static removeTask(taskName: string): void;
    /**
     * Set the configuration through one function
     *
     * Returns the list of the configuration that has been accepted and setted
     */
    setConfiguration(opts: any): {};
    /**
     * In master/slave protocol, we ask to get a token
     *
     * SHORTCUT
     */
    takeMutex(id: string): Promise<void>;
    /**
     * In master/slave protocol, we ask to release the token
     *
     * SHORTCUT
     */
    releaseMutex(id: string): Promise<void>;
    /**
     * Contains the functions to call to validate mutex take and release in master/slave protocol
     */
    getMasterMutexFunctions(): {
        id: string;
        funcTake: Function;
        funcRelease: Function;
    }[];
    /**
     * Add a function to be called when a user want to take the Mutex related to the given id
     *
     * The function have to throw an error if the token cannot be taken, if it goes well, consider the mutex to be taken
     */
    addMasterMutexFunctions(id: string, funcTake: Function, funcRelease: Function): void;
}
export {};
