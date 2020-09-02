export default class SystemBoot {
    protected options: any;
    protected launchingModesMap: {
        name: string;
        func: Function;
    }[];
    constructor({ mode, modeoptions, }: {
        mode: any;
        modeoptions: any;
    });
    /**
     * System initialization (not PROGRAM)
     */
    protected static systemInitialization(): void;
    protected static programInitialization(): void;
    protected initialization(): this;
    /**
     * LaunchScenarios PROGRAM
     */
    launch(launchMasterSlaveConfigurationFile: any): Promise<any>;
}
