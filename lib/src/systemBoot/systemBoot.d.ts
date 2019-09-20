export default class SystemBoot {
    protected options: any;
    protected launchingModesMap: {
        name: string;
        func: Function;
    }[];
    /**
     * Constructor
     */
    constructor({ mode, modeoptions, }: {
        mode: any;
        modeoptions: any;
    });
    /**
     * System initialization (not PROGRAM)
     */
    protected static systemInitialization(): void;
    /**
     * PROGRAM System initialization
     */
    protected static programInitialization(): void;
    /**
     * All initializations
     */
    protected initialization(): this;
    /**
     * LaunchScenarios PROGRAM
     */
    launch(launchMasterSlaveConfigurationFile: any): Promise<any>;
}
