//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AHandler from './AHandler.js';
import PromiseCommandPattern from '../../Utils/PromiseCommandPattern.js';
import ARole from '../Role/ARole';

/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
export default class RoleHandler extends AHandler {
  /**
   * Start the given role
   */
  public startRole(idRole: string, args: any[]): Promise<any> {
    return PromiseCommandPattern({
      func: () => this.startSomething(idRole, args),
    });
  }

  /**
   * Stop the given role
   */
  public stopRole(idRole: string, args: any[]): Promise<any> {
    return PromiseCommandPattern({
      func: () => this.stopSomething(idRole, args),
    });
  }

  /**
   * Stop all the running roles
   */
  public stopAllRole(args: any[] = []): Promise<any> {
    return PromiseCommandPattern({
      func: () => this.stopAllSomething(args),
    });
  }

  /**
   * Get a list of running role status (active or not)
   */
  public getRoleListStatus(): {
    name: string,
    id: string | -1,
    isActive: boolean
  }[] {
    return this.getSomethingListStatus();
  }

  /**
   * Get a role
   */
  public getRole(idRole: string): Promise<ARole> {
    return this.getSomething(idRole);
  }
}
