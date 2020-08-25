/**
 * This class implement the different launch scenarios of PROGRAM
 */
export default class LaunchScenarios {
    static getMapLaunchingModes(): {
        name: string;
        func: Function;
    }[];
    /**
     * Read the Master Slave launch configuration file
     */
    protected static readLaunchMasterSlaveConfigurationFile(filename: string): Promise<any>;
    /**
     * Start PROGRAM in master mode
     */
    static master(_: any, launchMasterSlaveConfigurationFile: string): Promise<any>;
    /**
     * Start PROGRAM in slave mode
     */
    static slave(options: any): Promise<any>;
}
