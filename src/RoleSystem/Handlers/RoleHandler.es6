//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AHandler from './AHandler.js';

/**
 * This class handle role for the process
 * Meaning launching a role, stop a role
 */
export default class RoleHandler extends AHandler {
  /**
   * Start the given role
   * @param {Number} idRole
   * @param {Array} args
   */
  async startRole(idRole, args) {
    return this.startSomething(idRole, args);
  }

  /**
   * Stop the given role
   * @param {Number} idRole
   * @param {Array} args
   */
  async stopRole(idRole, args) {
    return this.stopSomething(idRole, args);
  }

  /**
   * Stop all the running roles
   * @param {?Array} args
   */
  stopAllRole(args = []) {
    return this.stopAllSomething(args);
  }

  /**
   * Get a list of running role status (active or not)
   */
  getRoleListStatus() {
    return this.getSomethingListStatus();
  }

  /**
   * Get a role
   * @param {idRole}
   */
  getRole(idRole) {
    return this.getSomething(idRole);
  }
}
