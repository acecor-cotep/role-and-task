import ARole from '../ARole.js';
import Errors from '@cotep/errors';
/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 *
 * @interface
 */
export default abstract class ASlave extends ARole {
    constructor();
    abstract tellMasterErrorHappened(err: Errors | Error): void;
}
