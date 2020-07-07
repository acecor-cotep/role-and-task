/// <reference types="node" />
import Errors from '../../Utils/Errors.js';
import TaskHandler from '../Handlers/TaskHandler.js';
import ATask from '../Tasks/ATask.js';
export interface DisplayMessage {
    str: string;
    carriageReturn?: boolean;
    out?: NodeJS.WriteStream;
    from?: number | string;
    time?: number;
    tags?: string[];
}
export interface ArgsObject {
    [key: string]: any;
}
/**
 * PROGRAM process have 0 or + defined Role
 *
 * A Role can be described as a purpose to fulfill
 *
 * Example: Master or Slave -> (The purpose of Master is to manage Slave)
 *
 * A ROLE MUST BE DEFINED AS A SINGLETON (Which means the implementation of getInstance)
 *
 * A ROLE CAN BE APPLIED ONLY ONCE (Ex: You can apply the ServerAPI only once, can't apply twice the ServerAPI Role for a PROGRAM instance)
 * @interface
 */
export default abstract class ARole {
    name: string;
    id: number;
    protected active: boolean;
    protected taskHandler: TaskHandler | false;
    protected referenceStartTime: number;
    constructor();
    getReferenceStartTime(): number;
    /**
     * Setup a taskHandler to the role
     * Every Role have its specific tasks
     */
    setTaskHandler(taskHandler: TaskHandler | false): void;
    getTaskHandler(): TaskHandler | false;
    getTask(idTask: string): Promise<ATask>;
    /**
     * Start a new task inside the role
     */
    startTask(idTask: string, args: any): Promise<unknown>;
    abstract displayMessage(param: DisplayMessage): Promise<void>;
    /**
     * Stop a task inside a role
     */
    stopTask(idTask: string): Promise<unknown>;
    /**
     * Get tasks that are available to the role
     */
    stopAllTask(): Promise<unknown>;
    /**
     * Return the list of tasks and theirs status (isActive: true/false)
     */
    getTaskListStatus(): {
        name: string;
        id: string;
        isActive: boolean;
    }[] | Errors;
    /**
     * Is the Role active?
     */
    isActive(): boolean;
    abstract start(...args: unknown[]): Promise<unknown>;
    abstract stop(...args: unknown[]): Promise<unknown>;
    /**
     * Build an head/body pattern message
     */
    buildHeadBodyMessage(head: string, body: unknown): string;
    abstract takeMutex(id: string): Promise<void>;
    abstract releaseMutex(id: string): Promise<void>;
}
