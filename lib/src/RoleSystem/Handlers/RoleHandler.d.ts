import AHandler from './AHandler.js';
import ARole from '../Role/ARole';
/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
export default class RoleHandler extends AHandler<ARole> {
    startRole(idRole: string, args: unknown[]): Promise<unknown>;
    stopRole(idRole: string, args: unknown[]): Promise<unknown>;
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
