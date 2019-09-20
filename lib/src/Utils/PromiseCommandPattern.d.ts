/**
 * Wrapper used because we cannot call executeAsync into the constructor of PromiseCommandPattern directly, and we want a simple and quick use of it
 */
declare function PromiseCommandPatternFunc({ func, error, }: {
    func: Function;
    error?: Function;
}): Promise<any>;
export default PromiseCommandPatternFunc;
