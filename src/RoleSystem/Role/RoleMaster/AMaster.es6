//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import ARole from '../ARole.js';
import CONSTANT from '../../../Utils/CONSTANT/CONSTANT.js';

/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 *
 * @interface
 */
export default class AMaster extends ARole {
  constructor() {
    super();

    this.name = CONSTANT.DEFAULT_ROLES.ABSTRACT_MASTER_ROLE.name;
    this.id = CONSTANT.DEFAULT_ROLES.ABSTRACT_MASTER_ROLE.id;
  }
}
