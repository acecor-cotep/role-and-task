/**
 * Define the pattern of a link between two tasks
 */
export default abstract class ALink {
    abstract connectToTask(...args: unknown[]): unknown;
    /**
     * Stop the current connections
     */
    abstract stop(...args: unknown[]): unknown;
    buildHeadBodyMessage(head: string, body: unknown): string;
}
