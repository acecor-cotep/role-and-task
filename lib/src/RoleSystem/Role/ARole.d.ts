import Errors from '../../Utils/Errors.js';
import TaskHandler from '../Handlers/TaskHandler.js';
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
    protected id: number;
    protected active: boolean;
    protected taskHandler: TaskHandler | false;
    constructor();
    /**
     * Setup a taskHandler to the role
     * Every Role have its specific tasks
     */
    setTaskHandler(taskHandler: TaskHandler | false): void;
    getTaskHandler(): TaskHandler | false;
    getTask(idTask: string): Promise<import("../Tasks/ATask.js").default>;
    /**
     * Start a new task inside the role
     */
    startTask(idTask: string, args: any): Promise<any>;
    /**
     * Stop a task inside a role
     */
    stopTask(idTask: string): Promise<any>;
    /**
     * Get tasks that are available to the role
     */
    stopAllTask(): Promise<any>;
    /**
     * Return the list of tasks and theirs status (isActive: true/false)
     */
    getTaskListStatus(): Errors | {
        name: string;
        id: string;
        isActive: boolean;
    }[];
    /**
     * Is the Role active?
     */
    isActive(): boolean;
    abstract start(...args: any): Promise<any>;
    abstract stop(...args: any): Promise<any>;
    /**
     * Build an head/body pattern message
     */
    buildHeadBodyMessage(head: string, body: any): string;
}
