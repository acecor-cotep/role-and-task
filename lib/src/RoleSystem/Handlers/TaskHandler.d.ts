import AHandler, { ProgramState } from './AHandler.js';
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
export default class TaskHandler extends AHandler<ATask> {
    /**
     * Get all active task in array
     */
    getAllActiveTasks(): ATask[];
    /**
     * Get infos tasks relative to the type of tasks
     */
    getInfosFromAllActiveTasks(): Promise<{
        idTask: string;
        [key: string]: unknown;
    }[]>;
    /**
     * To all tasks apply the new program state
     */
    applyNewProgramState(programState: ProgramState, oldProgramState: ProgramState): Promise<true>;
    /**
     * Start the given Task
     */
    startTask(idTask: string, args: unknown[]): Promise<unknown>;
    /**
     * Stop the given Task
     */
    stopTask(idTask: string, args?: unknown[]): Promise<unknown>;
    /**
     * Stop all the running Tasks
     */
    stopAllTask(args?: unknown[]): Promise<unknown>;
    /**
     * Get a list of running Task status (active or not)
     */
    getTaskListStatus(): {
        name: string;
        id: string;
        isActive: boolean;
    }[];
    getTask(idTask: string): Promise<ATask>;
}
