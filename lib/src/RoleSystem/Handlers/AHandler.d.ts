import { ArgsObject } from '../Role/ARole.js';
export interface Something<T> {
    [key: string]: {
        id: string;
        obj: T;
        name: string;
    };
}
export interface MinimalSomethingType {
    isActive: () => boolean;
}
export interface ProgramState {
    id: number;
    name: string;
}
/**
 * This class handle something
 */
export default abstract class AHandler<T extends MinimalSomethingType> {
    protected something: Something<T>;
    /**
     * Map that match the constant of something with the actual Something classes
     */
    constructor(data: Something<T>);
    /**
     * Ask something from Something
     */
    genericAskingSomethingToDoSomething(idSomething: string | -1, args: ArgsObject, funcToCall: string): Promise<unknown>;
    startSomething(idSomething: string | -1, args: ArgsObject): Promise<unknown>;
    stopSomething(idSomething: string | -1, args: ArgsObject): Promise<unknown>;
    stopAllSomething(args?: unknown[]): Promise<unknown>;
    /**
     * Get an object using the id of it
     */
    getSomething(idSomething: string | -1): Promise<T>;
    getAllSomething(): T[];
    /**
     * Get a list of running something status (active or not)
     */
    getSomethingListStatus(): {
        name: string;
        id: string;
        isActive: boolean;
    }[];
}
