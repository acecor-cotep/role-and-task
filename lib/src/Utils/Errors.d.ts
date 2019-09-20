import ErrorsLibrary from '@cotep/errors';
/**
 * Handles errors in application. It contains Error codes and functions to manage them
 */
export default class Errors extends ErrorsLibrary {
    /**
     * Display the colored error
     * @override
     */
    displayColoredError(): void;
    /**
     * Display the recorded error
     * @override
     */
    displayError(): void;
}
