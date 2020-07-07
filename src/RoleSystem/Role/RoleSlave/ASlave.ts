//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import ARole from '../ARole.js';
import CONSTANT from '../../../Utils/CONSTANT/CONSTANT.js';
import Errors from '@cotep/errors';

/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 *
 * @interface
 */
export default abstract class ASlave extends ARole {
  constructor() {
    super();

    this.name = CONSTANT.DEFAULT_ROLES.ABSTRACT_SLAVE_ROLE.name;
    this.id = CONSTANT.DEFAULT_ROLES.ABSTRACT_SLAVE_ROLE.id;
  }

  public abstract tellMasterErrorHappened(err: Errors | Error): void;
}
