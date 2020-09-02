export default abstract class ALink {
    abstract connectToTask(...args: unknown[]): unknown;
    abstract stop(...args: unknown[]): unknown;
    buildHeadBodyMessage(head: string, body: unknown): string;
}
