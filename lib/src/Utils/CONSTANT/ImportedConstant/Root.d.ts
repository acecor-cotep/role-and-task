/**
 * This class is a Singleton
 */
export default function (superclass: any): {
    new (): {
        [x: string]: any;
    };
    [x: string]: any;
    /**
     * Return the unique instance of the class
     */
    getInstance(): {
        [x: string]: any;
    };
    /**
     * When you want to get the function name, how many back do you go for
     */
    readonly NUMBER_OF_LEVEL_TO_GO_BACK_PROMISE_PATTERN: number;
    /**
     * When you want to get the function name, how many back do you go for
     */
    readonly NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_CLASSIC: number;
    /**
     * When you want to get the function name, how many back do you go for
     */
    readonly NUMBER_OF_LEVEL_TO_GO_BACK_ERROR_HANDLE_STACK_TRACE: number;
    /**
     * In which mode PROGRAM is launched to by default
     * THIS DATA IS AFFECTED BY THE CONFIGURATION FILE
     */
    readonly DEFAULT_LAUNCHING_MODE: string;
    /**
     * Default tasks
     */
    readonly DEFAULT_TASK: {
        ABSTRACT_TASK: {
            name: string;
            color: string;
            id: number;
            idsAllowedRole: never[];
        };
    };
    /**
     * Default states of the system
     */
    readonly DEFAULT_STATES: {
        LAUNCHING: {
            name: string;
            id: number;
        };
        READY_PROCESS: {
            name: string;
            id: number;
        };
        ERROR: {
            name: string;
            id: number;
        };
        CLOSE: {
            name: string;
            id: number;
        };
    };
    /**
     * Ids of the default roles
     *
     * Have to use require to avoid circular import
     */
    readonly DEFAULT_ROLES: {
        ABSTRACT_ROLE: {
            name: string;
            id: number;
        };
        ABSTRACT_MASTER_ROLE: {
            name: string;
            id: number;
        };
        ABSTRACT_SLAVE_ROLE: {
            name: string;
            id: number;
        };
        MASTER_ROLE: {
            name: string;
            id: number;
            class: any;
        };
        SLAVE_ROLE: {
            name: string;
            id: number;
            class: any;
        };
    };
    /**
     * Different program launching mode and the keywords to use in CLI to pick one of them
     */
    readonly PROGRAM_LAUNCHING_MODE: {
        MASTER: string;
        SLAVE: string;
    };
    /**
     * Different program launching parameters
     */
    readonly PROGRAM_LAUNCHING_PARAMETERS: {
        MODE: {
            name: string;
            alias: string;
        };
        MODE_OPTIONS: {
            name: string;
            alias: string;
        };
    };
    /**
     * Path to get the main
     */
    readonly PATH_TO_MAIN: string;
    /**
     * Socket Communication systems that can be used on PROGRAM
     */
    readonly SOCKET_COMMUNICATION_SYSTEM: {
        ABSTRACT_SOCKET_COMMUNICATION_SYSTEM: string;
        ZEROMQ: string;
    };
    /**
     * Keywords used in communication protocols between tasks
     */
    readonly PROTOCOL_KEYWORDS: {
        HEAD: string;
        BODY: string;
    };
    /**
     * Master/Slave messages used in theirs protocols
     */
    readonly PROTOCOL_MASTER_SLAVE: {
        MESSAGES: {
            CLOSE: string;
            SLAVE_CONFIRMATION_INFORMATIONS: string;
            LIST_TASKS: string;
            CONNECT_TASK_TO_TASK: string;
            START_TASK: string;
            STOP_TASK: string;
            STATE_CHANGE: string;
            GENERIC_CHANNEL_DATA: string;
            OUTPUT_TEXT: string;
            INFOS_ABOUT_SLAVES: string;
            ERROR_HAPPENED: string;
            TAKE_MUTEX: string;
            RELEASE_MUTEX: string;
        };
    };
    /**
     * Args that are passed to a slave to start
     */
    readonly SLAVE_START_ARGS: {
        IP_SERVER: string;
        PORT_SERVER: string;
        IDENTIFIER: string;
    };
    /**
     * The amount of time a master wait for a slave message before to timeout
     */
    readonly MASTER_MESSAGE_WAITING_TIMEOUT: number;
    /**
     * The amount of time a linkApi wait for an answer from calculApi before to timeout
     */
    readonly WAIT_LINK_API_MESSAGE: number;
    /**
     * Do we consider warning as errors?
     */
    readonly CONSIDER_WARNING_AS_ERRORS: boolean;
    /**
     * Makes error fatal, which means we are exiting instead of getting into ERROR mode
     */
    readonly MAKES_ERROR_FATAL: boolean;
    /**
     * The amount of time a master wait for a slave message to acknowledge the state change before to timeout
     */
    readonly MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE: number;
    /**
     * The amount of time a master wait for a slave message before to timeout
     */
    readonly MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK: number;
    /**
     * Args that are passed to a master to start
     */
    readonly MASTER_START_ARGS: {
        IP_SERVER: string;
        PORT_SERVER: string;
    };
    /**
     * Tags that specify the purpose of a text to display.
     * Theses tags are used when we want to redirect the data to display
     */
    readonly MESSAGE_DISPLAY_TAGS: {
        PROGRAM_STATE: number;
        ROLE_DISPLAY: number;
        ERROR: number;
    };
    /**
     * How many ms between we get data from all tasks and give it to master
     */
    readonly SLAVES_INFOS_CHANGE_TIME: number;
    /**
     * Say how many time between two look at CPU and memory usage for slaves and master process
     */
    readonly DISPLAY_CPU_MEMORY_CHANGE_TIME: number;
    /**
     * String that ask for a quit of PROGRAM whole system
     */
    readonly QUIT: string;
};
