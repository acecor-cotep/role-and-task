/// <reference types="node" />
/**
 * Contain utilitaries functions
 */
export default class Utils {
    protected static generatedId: number;
    /**
     * Get an unique id (Specific to Program)
     * USE THE PID OF THE APP TO GET AN INTER-PROGRAM UNIQUE IDENTIFIER
     */
    static generateUniqueProgramID(): string;
    /**
     * Generate a little ID usefull for log for example
     */
    static generateLittleID(): string;
    /**
     * Generate a random value from min to max
     */
    static generateRandom(min: number, max: number, round?: boolean): number;
    /**
     * Return the name of thekey that are behind the given value
     */
    static getJsonCorrespondingKey(json: any, value: string): string | undefined;
    /**
     * Create a monoline from an array which is usefull when you have a line that is too long
     */
    static monoline(parts: string[]): string;
    /**
     * Call recursively the function given in parameter for each iteration of the object
     * It works for a given function pattern
     * Call resolve with an array that contains results of called functions
     */
    static recursiveCallFunction({ context, func, objToIterate, nameToSend, nameTakenInDocs, additionnalJsonData, additionnalParams, _i, _rets, }: {
        context: any;
        func: Function;
        objToIterate: any[];
        nameToSend: string | null;
        nameTakenInDocs?: string | null;
        additionnalJsonData?: any;
        additionnalParams?: any[];
        _i?: number;
        _rets?: any[];
    }): Promise<any[]>;
    /**
     * Get the Ips of the local machine
     */
    static givesLocalIps(): string[];
    /**
     * Convert a string to JSON
     * If he cannot parse it, return false
     */
    static convertStringToJSON(dataString: string): any;
    /**
     * Execute a command line
     * By default, set the maxBuffer option to 2GB
     */
    static execCommandLine(cmd: string, options?: any): Promise<string>;
    /**
     * Generate a string using the given char repeated x time
     */
    static generateStringFromSameChar(character: string, nb: number): string;
    /**
     * Execute a command line
     * Execute the given onStdout function when stdout datas are given
     * When onStdout is not set, do nothing about the data
     * Execute the given onStderr function when stderr datas are given
     * When onStderr is not set, do nothing about the data
     */
    static execStreamedCommandLine({ cmd, options, processArray, onStdout, onStderr, }: {
        cmd: string;
        options: string[];
        processArray: boolean | Array<any>;
        onStdout: Function | false;
        onStderr: Function | false;
    }): Promise<string>;
    /**
     * Sleep some time
     */
    static sleep(timeInMs: number): Promise<any>;
    /**
     * Display a message in console
     * @param {{
     *   str: String,
     *   carriageReturn: Boolean,
     *   out: any,
     *   from: String,
     * }}
     */
    static displayMessage({ str, carriageReturn, out, from, time, }: {
        str: string;
        carriageReturn?: boolean;
        out?: NodeJS.WriteStream;
        from?: any;
        time?: number;
    }): void;
    /**
     * Read a file asynchronously
     */
    static readFile(filename: string, options?: string): Promise<string>;
    /**
     * Parse hjson content (Human JSON --> npm module)
     * @param {String} content
     */
    static parseHjsonContent(content: string): Promise<Object>;
    /**
     * DO NOT CALL IT DIRECTLY, it is used by promiseCallUntilTrue
     *
     * RECURSIVE
     */
    static executePromiseCallUntilTrue({ functionToCall, context, args, i, }: {
        functionToCall: Function;
        context: any;
        args: any[];
        i?: number;
    }): Promise<any>;
    /**
     * Call the given function until it return something different than false
     *
     * If the function returns :
     *
     * false                                -> We make an another call with the same args
     * true                                 -> We stop the calls and return true
     * { args: something }                  -> We make an another call with the new given args
     * { args: something, i: something }    -> We make an another call with the new given args and changing the i
     * anything else                        -> we stop the calls and return wathever it is
     *
     * {
     *   functionToCall,
     *   context,
     *   args,
     *   i = 0,
     * }
     *
     * i is the index you can force to start with instead of 0
     */
    static promiseCallUntilTrue(conf: {
        functionToCall: Function;
        context: any;
        args: any[];
        i?: number;
    }): Promise<any>;
    /**
     * DO NOT CALL IT DIRECTLY, it is used by promiseQueue
     *
     * RECURSIVE
     */
    static executePromiseQueue(conf: any, _rets?: Array<any>, _i?: number): any;
    /**
     * Execute the given functions one by one, and the return the ret of them in an array
     *
     * -> it's a Promise.all but one by one instead of parallel
     *
     * [{
     *   // The function you want to call
     *   functionToCall,
     *
     *   // The context to use when you are calling it
     *   context,
     *
     *   // The argument to pass to the functionToCall (must be in an array)
     *   args,
     * }]
     */
    static promiseQueue(conf: any): Promise<any>;
    /**
     * Return the name of the function that call this function
     * IT'S A HACK
     */
    static getFunctionName(numberFuncToGoBack?: number): string;
    /**
     * Fire functions that are in the given array and pass args to it
     * @param {[?({func: Function, context: any },func)]} arrayOfFunction
     * @param {Array} args
     */
    static fireUp(arrayOfFunction: any, args: any): void;
    /**
     * Is the given parameter an array
     */
    static isAnArray(v: any): boolean;
    /**
     * Check if we got a version in a String
     * @param {Object} v
     * @return {Boolean}
     */
    static isAVersion(v: any): boolean;
    /**
     * Check if we got a Boolean
     * @param {Object} v
     * @return {Boolean}
     */
    static isABoolean(v: any): boolean;
    /**
     * Check if we got a Boolean (permissive with true and false strings)
     * @param {Object} v
     * @return {Boolean}
     */
    static isABooleanPermissive(v: any): boolean;
    /**
     * Check if we got an ID
     * @param {Object} v
     * @return {Boolean}
     */
    static isAnID(v: any): boolean;
    /**
     * Check if we got a null value
     *
     * Is considered NULL :
     * - an empty String
     * - the value 0
     * - the boolean false
     * - the null value
     * - undefined
     *
     * @param {Object} v
     * @return {Boolean}
     */
    static isNull(v: any): boolean;
    /**
     * Check if we got a String
     * @param {Object} v
     * @return {Boolean}
     */
    static isAString(v: any): boolean;
    /**
     * Check if we got an unsigned Integer
     * @param {Object} v
     * @return {Boolean}
     */
    static isAnUnsignedInteger(v: any): boolean;
    /**
     * Check if we got a timestamp
     * @param {Object} v
     * @return {Boolean}
     */
    static isATimestamp(v: any): boolean;
    /**
     * Check if we got an Integer
     * @param {Object} v
     * @return {Boolean}
     */
    static isAnInteger(v: any): boolean;
    /**
     * Check if we got a Float
     * @param {Object} v
     * @return {Boolean}
     */
    static isAFloat(v: any): boolean;
    /**
     * Get the Cpu usage & memory of the current pid
     */
    static getCpuAndMemoryLoad(): Promise<unknown>;
    /**
     * Check if we got an Integer
     * @param {Object} v
     * @return {Boolean}
     */
    static isAnIPAddress(v: any): boolean;
    /**
     * Do we have a json in parameters?
     *
     * WARNING: JSON.PARSE ACCEPT PLAIN NUMBERS AND NULL AS VALUES
     *
     * @param {Object} v
     * @return {Boolean}
     */
    static isAJSON(v: any): boolean;
    /**
     * Transform v into a boolean - (this function is usefull for console commands)
     * @param {Object} v
     * @return {Boolean}
     */
    static toBoolean(v: any): boolean;
}
