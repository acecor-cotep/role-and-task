import AHandler from './AHandler.js';
import ATask from '../Tasks/ATask';
/**
 * This class handle Task for the process
 * Meaning launching a Task, stop a Task
 *
 * data => [{
 *    name: String,
 *    color: String,
 *    id: string,
 *    idsAllowedRole: [Number],
 *    obj: ATask,
 * }],
 *
 * (For example with Role)
 *
 * Call -> constructor(data, mapTaskConstantAndObject);
 */
export default class TaskHandler extends AHandler {
    /**
     * Get all active task in array
     */
    getAllActiveTasks(): any[];
    /**
     * Get infos tasks relative to the type of tasks
     */
    getInfosFromAllActiveTasks(): Promise<any[]>;
    /**
     * To all tasks apply the new program state
     */
    applyNewProgramState(programState: any, oldProgramState: any): Promise<true>;
    /**
     * Start the given Task
     */
    startTask(idTask: string, args: any[]): Promise<any>;
    /**
     * Stop the given Task
     */
    stopTask(idTask: string, args?: any[]): Promise<any>;
    /**
     * Stop all the running Tasks
     */
    stopAllTask(args?: {}): Promise<any>;
    /**
     * Get a list of running Task status (active or not)
     */
    getTaskListStatus(): {
        name: string;
        id: string;
        isActive: boolean;
    }[];
    /**
     * Get a task
     * @param {idTask}
     */
    getTask(idTask: string): Promise<ATask>;
}
