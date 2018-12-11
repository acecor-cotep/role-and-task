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

    this.name = CONSTANT.DEFAULT_ROLE.ABSTRACT_MASTER_ROLE.name;
    this.id = CONSTANT.DEFAULT_ROLE.ABSTRACT_MASTER_ROLE.id;
  }

  /**
   * Getter
   */
  getDisplayTask() {
    return this.displayTask;
  }

  /**
   * Set the task which will gonna handle the display, if there is not specified, the display is going to be made in stdout
   */
  setDisplayTask(displayTask) {
    this.displayTask = displayTask;
  }

  /**
   * Getter
   */
  getPathToEntryFile() {
    return this.pathToEntryFile;
  }

  /**
   * Setup the entry point of your program
   *
   * We we are launching new slaves, we gonna use it
   */
  setPathToEntryFile(pathToEntryFile) {
    this.pathToEntryFile = pathToEntryFile;
  }
}
