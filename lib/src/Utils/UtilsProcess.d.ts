/**
 * This class handle all processes that are related to PROGRAM instance
 */
export default class UtilsProcess {
    constructor();
    static getInstance(): UtilsProcess;
    protected static getZombieFromAllPid(allPids: string[], goodPids: string[]): string[];
    /**
     * Evaluate PROGRAM processes and return a list of Zombies and Healthy processes that are actually running
     */
    static evaluateProgramProcesses(): Promise<any>;
    /**
     * Evaluate the number of processus that exist
     */
    static evaluateNumberOfProcessThatExist(): Promise<string[]>;
    static killOneProcess(pid: string): Promise<string>;
}
