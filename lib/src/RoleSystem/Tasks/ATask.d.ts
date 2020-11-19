import ARole, { ArgsObject } from '../Role/ARole.js';
import { ProgramState } from '../Handlers/AHandler.js';
import ZeroMQServerRouter from '../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter.js';
import { CpuAndMemoryStat } from '../../Utils/Utils.js';
import { ClientIdentityByte } from '../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/AZeroMQServer.js';
import Errors from '../../Utils/Errors.js';
export interface Slave {
    clientIdentityString: string;
    clientIdentityByte: ClientIdentityByte;
    programIdentifier: string;
    clientPID: number;
    tasks: ATask[];
    error: false | Errors | Error;
    role?: ARole;
    moreInfos?: any;
}
export interface DynamicallyRefreshData {
    notConfirmedSlaves: Slave[];
    confirmedSlaves: Slave[];
    master: {
        tasks: {
            name: string;
            id: string;
            isActive: boolean;
        }[];
        communication: ZeroMQServerRouter | false;
        ips: string[];
        cpuAndMemory: CpuAndMemoryStat;
        tasksInfos: false | {
            [key: string]: unknown;
            idTask: string;
        }[];
    };
}
/**
 * Define what a Task is
 *
 * A Task is a job PROGRAM have to perform (For example, Log, ServerAPI, Calcul... are all tasks)
 * @interface
 */
export default abstract class ATask {
    name: string;
    active: boolean;
    id: string;
    protected role: ARole | false;
    constructor();
    isActive(): boolean;
    gatherInfosFromTask(): Promise<{}>;
    abstract start(...args: unknown[]): Promise<unknown>;
    abstract stop(...args: unknown[]): Promise<unknown>;
    abstract applyNewProgramState(programState: ProgramState, oldProgramState: ProgramState): Promise<unknown>;
    abstract connectToTask(idTaskToConnect: string, args: ArgsObject): Promise<unknown>;
    /**
     * We get news data from here, use it or not, it depends from the task
     */
    abstract consumeNewsData(dataName: string, data: any, timestamp: number): any;
    /**
     * Use the architecture data we have to generate an array that's gonna resume it
     * You can override it
     */
    abstract dynamicallyRefreshDataIntoList(data: DynamicallyRefreshData): any;
    abstract displayMessage(param: any): void;
    buildHeadBodyMessage(head: string, body: any): string;
}
