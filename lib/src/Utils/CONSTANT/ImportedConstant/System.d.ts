export default function (superclass: any): {
    new (): {
        [x: string]: any;
    };
    [x: string]: any;
    /**
     * Time to wait before to exit unproperly to let the system makes the displays
     */
    readonly TIMEOUT_LEAVE_PROGRAM_UNPROPER: number;
    /**
     * Return the max number of listener
     */
    readonly MAX_NUMBER_OF_LISTENER: number;
    /**
     * time in ms between two cpu usage lookup for utilsCPUMonitoring
     */
    readonly TIMING_OF_CPU_MONITORING: number;
    /**
     * Signals to treat (When you get them you soft QUIT)
     */
    readonly SIGNAL: {
        SIGINT: string;
        SIGHUP: string;
        SIGQUIT: string;
        SIGABRT: string;
        SIGTERM: string;
    };
    /**
     * Port number is from 0 to 65535
     */
    readonly MAX_PORT_NUMBER: number;
    /**
     * Process exceptions to catch
     */
    readonly PROCESS_EXCEPTION: string;
    /**
     * Process exceptions to catch
     */
    readonly UNHANDLED_PROMISE_REJECTION: string;
    /**
     * Process warning to catch
     */
    readonly NODE_WARNING: string;
    /**
     * When you get that signal QUIT not properly
     */
    readonly SIGNAL_UNPROPER: {
        SIGUSR1: string;
    };
    /**
     * When we launch a new slave (before the connection) (master1_0)
     */
    readonly SIGNAL_TO_KILL_SLAVE_COMMAND: string;
};
