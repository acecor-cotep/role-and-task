import ARole from '../Role/ARole.js';
/**
 * Define what a Task is
 *
 * A Task is a job PROGRAM have to perform (For example, Log, ServerAPI, Calcul... are all tasks)
 * @interface
 */
export default abstract class ATask {
    name: string;
    protected active: boolean;
    protected id: string;
    protected connectedTasks: any[];
    protected role: ARole | false;
    constructor();
    /**
     * Is the Task active?
     */
    isActive(): boolean;
    /**
     * Get some infos from the task
     */
    gatherInfosFromTask(): Promise<{}>;
    /**
     * PROGRAM start to run the task
     */
    abstract start(...args: any): Promise<any>;
    /**
     * PROGRAM stop to run the task
     */
    abstract stop(...args: any): Promise<any>;
    /**
     * apply the program state on the task
     */
    abstract applyNewProgramState(programState: number, oldProgramState: number): Promise<any>;
    /**
     * Connect the actual task to the given task
     */
    abstract connectToTask(idTaskToConnect: string, args: any): Promise<any>;
    /**
     * We get news data from here, use it or not, it depends from the task
     */
    abstract consumeNewsData(dataName: string, data: any, timestamp: number): any;
    /**
     * Use the architecture data we have to generate an array that's gonna resume it
     * You can override it
     */
    abstract dynamicallyRefreshDataIntoList(data: any): any;
    /**
     * Display a message in board
     */
    abstract displayMessage(param: any): void;
    /**
     * Build an head/body pattern message
     */
    buildHeadBodyMessage(head: string, body: any): string;
}
