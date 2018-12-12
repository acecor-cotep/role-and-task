//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import Utils from '../../Utils/Utils.js';
import Errors from '../../Utils/Errors.js';

/**
 * ELIOT process have 0 or + defined Role
 *
 * A Role can be described as a purpose to fulfill
 *
 * Example: Master or Slave -> (The purpose of Master is to manage Slave)
 *
 * A ROLE MUST BE DEFINED AS A SINGLETON (Which means the implementation of getInstance)
 *
 * A ROLE CAN BE APPLIED ONLY ONCE (Ex: You can apply the ServerAPI only once, can't apply twice the ServerAPI Role for a ELIOT instance)
 * @interface
 */
export default class ARole {
  constructor() {
    this.name = CONSTANT.DEFAULT_ROLES.ABSTRACT_ROLE.name;

    this.id = CONSTANT.DEFAULT_ROLES.ABSTRACT_ROLE.id;

    this.active = false;

    // Tasks handled (You need one)
    this.taskHandler = false;
  }

  /**
   * Setup a taskHandler to the role
   * Every Role have its specific tasks
   * @param {TaskHandler} taskHandler
   */
  setTaskHandler(taskHandler) {
    this.taskHandler = taskHandler;
  }

  /**
   * Return the task handler
   */
  getTaskHandler() {
    return this.taskHandler;
  }

  /**
   * Return the given task
   * @param {Number} idTask
   */
  async getTask(idTask) {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.getTask(idTask);
  }

  /**
   * Start a new task inside the role
   * @param {String} idTask
   * @param {Object} args
   */
  async startTask(idTask, args) {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.startTask(idTask, ({
      ...args,
      role: this,
    }));
  }

  /**
   * Stop a task inside a role
   * @param {String} idTask
   */
  async stopTask(idTask) {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.stopTask(idTask);
  }

  /**
   * Get tasks that are available to the role
   */
  async stopAllTask() {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.stopAllTask();
  }

  /**
   * Return the list of tasks and theirs status (isActive: true/false)
   */
  getTaskListStatus() {
    if (!this.taskHandler) return new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.getTaskListStatus();
  }

  /**
   * Get the name of the Role
   * @return {String}
   */
  static get name() {
    return this.name;
  }

  /**
   * Is the Role active?
   */
  isActive() {
    return this.active;
  }

  /**
   * SINGLETON implementation
   * @abstract
   */
  static async getInstance() {
    throw new Errors('EXXXX', `Unimplemented getInstance methods in ${Utils.getFunctionName()} child`);
  }

  /**
   * ELIOT start to play the role
   * @param {Object} args
   * @abstract
   */
  async start() {
    throw new Errors('EXXXX', `Unimplemented getInstance methods in ${Utils.getFunctionName()} child`);
  }

  /**
   * ELIOT stop to play the role
   * @param {Object} args
   * @abstract
   */
  async stop() {
    throw new Errors('EXXXX', `Unimplemented getInstance methods in ${Utils.getFunctionName()} child`);
  }

  /**
   * Build an head/body pattern message
   * @param {String} head
   * @param {Object} body
   */
  buildHeadBodyMessage(head, body) {
    return JSON.stringify({
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: head,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
    });
  }
}
