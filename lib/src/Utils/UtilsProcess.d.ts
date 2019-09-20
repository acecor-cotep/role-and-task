/**
 * This class handle all processes that are related to PROGRAM instance
 */
export default class UtilsProcess {
    /**
     * Constructor
     */
    constructor();
    /**
     * Singleton implementation
     */
    static getInstance(): UtilsProcess;
    /**
     * Return an array that contains all zombies pids
     */
    protected static getZombieFromAllPid(allPids: string[], goodPids: string[]): string[];
    /**
     * Evaluate PROGRAM processes and return a list of Zombies and Healthy processes that are actually running
     */
    static evaluateProgramProcesses(): Promise<any>;
    /**
     * Evaluate the number of processus that exist
     */
    static evaluateNumberOfProcessThatExist(): Promise<string[]>;
    /**
     * Kill one process
     */
    static killOneProcess(pid: string): Promise<string>;
}
