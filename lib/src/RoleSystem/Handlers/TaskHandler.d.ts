import AHandler, { ProgramState } from './AHandler.js';
import ATask from '../Tasks/ATask';
import { ArgsObject } from '../Role/ARole.js';
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
    getAllActiveTasks(): ATask[];
    getInfosFromAllActiveTasks(): Promise<{
        idTask: string;
        [key: string]: unknown;
    }[]>;
    applyNewProgramState(programState: ProgramState, oldProgramState: ProgramState): Promise<true>;
    startTask(idTask: string, args?: ArgsObject): Promise<unknown>;
    stopTask(idTask: string, args?: ArgsObject): Promise<unknown>;
    stopAllTask(args?: unknown[]): Promise<unknown>;
    getTaskListStatus(): {
        name: string;
        id: string;
        isActive: boolean;
    }[];
    getTask(idTask: string): Promise<ATask>;
}
