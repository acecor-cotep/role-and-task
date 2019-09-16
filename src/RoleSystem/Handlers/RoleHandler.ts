//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AHandler from './AHandler.js';
import PromiseCommandPattern from '../../Utils/PromiseCommandPattern.js';

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
  startRole(idRole, args) {
    return new PromiseCommandPattern({
      func: () => this.startSomething(idRole, args),
    });
  }

  /**
   * Stop the given role
   * @param {Number} idRole
   * @param {Array} args
   */
  stopRole(idRole, args) {
    return new PromiseCommandPattern({
      func: () => this.stopSomething(idRole, args),
    });
  }

  /**
   * Stop all the running roles
   * @param {?Array} args
   */
  stopAllRole(args = []) {
    return new PromiseCommandPattern({
      func: () => this.stopAllSomething(args),
    });
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
