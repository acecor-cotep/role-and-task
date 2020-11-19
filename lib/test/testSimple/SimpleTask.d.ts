import library from '../../src/Library.js';
import { ProgramState } from '../../src/RoleSystem/Handlers/AHandler.js';
import { DynamicallyRefreshData } from '../../src/RoleSystem/Tasks/ATask.js';
/**
 * Define a Simple task which display a message every X seconds
 */
export default class SimpleTask extends library.ATask {
    protected descriptor: any;
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
    dynamicallyRefreshDataIntoList(data: DynamicallyRefreshData): any;
    /**
     * Display a message in board
     */
    displayMessage(param: any): void;
    applyNewProgramState(programState: ProgramState): Promise<void>;
    startDisplay(): void;
    stopDisplay(): void;
    static getInstance(): SimpleTask;
    start({ role, }: {
        role: any;
    }): Promise<void>;
    stop(): Promise<void>;
}
