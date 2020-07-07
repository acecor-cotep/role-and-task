import AHandler from './AHandler.js';
import ARole from '../Role/ARole';
/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
export default class RoleHandler extends AHandler<ARole> {
    /**
     * Start the given role
     */
    startRole(idRole: string, args: unknown[]): Promise<unknown>;
    /**
     * Stop the given role
     */
    stopRole(idRole: string, args: unknown[]): Promise<unknown>;
    /**
     * Stop all the running roles
     */
    stopAllRole(args?: unknown[]): Promise<unknown>;
    /**
     * Get a list of running role status (active or not)
     */
    getRoleListStatus(): {
        name: string;
        id: string | -1;
        isActive: boolean;
    }[];
    getRole(idRole: string): Promise<ARole>;
}
