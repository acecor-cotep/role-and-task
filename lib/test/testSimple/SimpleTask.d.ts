import library from '../../src/Library.js';
/**
 * Define a Simple task which display a message every X seconds
 */
export default class SimpleTask extends library.ATask {
    protected descriptor: any;
    /**
     * Constructor
     */
    constructor();
    /**
     * Connect the actual task to the given task
     */
    connectToTask(idTaskToConnect: string, args: any): Promise<any>;
    /**
     * We get news data from here, use it or not, it depends from the task
     */
    consumeNewsData(dataName: string, data: any, timestamp: number): any;
    /**
     * Use the architecture data we have to generate an array that's gonna resume it
     * You can override it
     */
    dynamicallyRefreshDataIntoList(data: any): any;
    /**
     * Display a message in board
     */
    displayMessage(param: any): void;
    /**
     * apply the eliot state on the task
     * @param {Number} programState
     * @param {Number} oldEliotState
     * @override
     */
    applyNewProgramState(programState: any): Promise<void>;
    startDisplay(): void;
    stopDisplay(): void;
    /**
     * SINGLETON implementation
     * @override
     */
    static getInstance(): SimpleTask;
    /**
     * Start to run the task
     * @override
     */
    start({ role, }: {
        role: any;
    }): Promise<boolean>;
    /**
     * ELIOT stop to run the task
     * @param {Object} args
     * @override
     */
    stop(): Promise<boolean>;
}
