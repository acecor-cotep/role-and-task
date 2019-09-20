import AHandler from './AHandler.js';
import ARole from '../Role/ARole';
/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
export default class RoleHandler extends AHandler {
    /**
     * Start the given role
     */
    startRole(idRole: string, args: any[]): Promise<any>;
    /**
     * Stop the given role
     */
    stopRole(idRole: string, args: any[]): Promise<any>;
    /**
     * Stop all the running roles
     */
    stopAllRole(args?: any[]): Promise<any>;
    /**
     * Get a list of running role status (active or not)
     */
    getRoleListStatus(): {
        name: string;
        id: string | -1;
        isActive: boolean;
    }[];
    /**
     * Get a role
     */
    getRole(idRole: string): Promise<ARole>;
}
