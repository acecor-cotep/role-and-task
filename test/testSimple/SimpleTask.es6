//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

import library from '../../src/Library.js';

// Imports
let instance = null;

/**
 * Define a Simple task which display a message every X seconds
 */
export default class SimpleTask extends library.ATask {
  /**
   * Constructor
   */
  constructor() {
    super();

    if (instance) return instance;

    this.name = 'SimpleTask';

    this.id = 10;

    // Pointer to the role it is assigned to
    this.role = false;

    instance = this;

    return instance;
  }

  /*
   * ======================================================================================================================================
   *                                                  HANDLE STATE CHANGE
   * ======================================================================================================================================
   */

  /**
   * apply the eliot state on the task
   * @param {Number} programState
   * @param {Number} oldEliotState
   * @override
   */
  async applyNewProgramState(programState) {
    const {
      READY_PROCESS,
      ERROR,
      CLOSE,
    } = library.CONSTANT.DEFAULT_STATES;

    console.log(` > ${global.processPid} : Handling new state ${programState.name}`);

    // Depending on the state of the system we are starting or stoping the dispay

    // If all is ready, we start the display
    if (programState.id === READY_PROCESS.id) {
      this.startDisplay();

      return;
    }

    // If we close of if we got an error, we stop the display
    if (programState.id === CLOSE.id || programState.id === ERROR.id) {
      this.stopDisplay();
    }
  }

  /*
   * ======================================================================================================================================
   *                                                 TASK METHODS
   * ======================================================================================================================================
   */

  startDisplay() {
    console.log(` > ${global.processPid} : Start Working`);

    this.descriptor = setInterval(() => {
      console.log(` > ${global.processPid} : working in progress ...`);
    }, 1000);
  }

  stopDisplay() {
    console.log(` > ${global.processPid} : Stop Working`);

    clearInterval(this.descriptor);
  }


  /*
   * ======================================================================================================================================
   *                                                 OVERRIDE BASICS
   * ======================================================================================================================================
   */

  /**
   * SINGLETON implementation
   * @override
   */
  static getInstance() {
    return instance || new SimpleTask();
  }

  /**
   * Start to run the task
   * @override
   */
  async start({
    role,
  }) {
    if (this.active) return true;

    // Attach the Task to the role
    this.role = role;

    this.active = true;

    return true;
  }

  /**
   * ELIOT stop to run the task
   * @param {Object} args
   * @override
   */
  async stop() {
    if (!this.active) return true;

    this.active = false;

    // Dettach the Task from the role
    this.role = false;

    return true;
  }
}
