/**
 * Define the pattern of a link between two tasks
 */
export default abstract class ALink {
    protected linkFrom: boolean;
    protected linkTo: boolean;
    constructor();
    abstract connectToTask(...args: any): any;
    /**
     * Stop the current connections
     */
    abstract stop(...args: any): any;
    /**
     * Build an head/body pattern message
     * @param {String} head
     * @param {Object} body
     */
    buildHeadBodyMessage(head: string, body: any): string;
}
