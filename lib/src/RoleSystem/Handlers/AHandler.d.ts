/**
 * This class handle something
 */
export default abstract class AHandler {
    protected something: any;
    /**
     * @param {Object} data
     * @param {{[String]: Class}} mapSomethingConstantAndObject
     * Map that match the constant of something with the actual Something classes
     */
    constructor(data: any);
    /**
     * Ask something from Something
     */
    genericAskingSomethingToDoSomething(idSomething: string | -1, args: any, funcToCall: string): Promise<any>;
    /**
     * Start the given Something
     */
    startSomething(idSomething: string | -1, args: any): Promise<any>;
    /**
     * Stop the given Something
     */
    stopSomething(idSomething: string | -1, args: any): Promise<any>;
    /**
     * Stop all the running Something
     */
    stopAllSomething(args?: any): Promise<any>;
    /**
     * Get an object using the id of it
     */
    getSomething(idSomething: string | -1): Promise<any>;
    /**
     * Get all something in array
     */
    getAllSomething(): any[];
    /**
     * Get a list of running something status (active or not)
     */
    getSomethingListStatus(): {
        name: string;
        id: string;
        isActive: boolean;
    }[];
}
