//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import Utils from '../../Utils/Utils.js';
import Errors from '../../Utils/Errors.js';
import TaskHandler from '../Handlers/TaskHandler.js';

/**
 * PROGRAM process have 0 or + defined Role
 *
 * A Role can be described as a purpose to fulfill
 *
 * Example: Master or Slave -> (The purpose of Master is to manage Slave)
 *
 * A ROLE MUST BE DEFINED AS A SINGLETON (Which means the implementation of getInstance)
 *
 * A ROLE CAN BE APPLIED ONLY ONCE (Ex: You can apply the ServerAPI only once, can't apply twice the ServerAPI Role for a PROGRAM instance)
 * @interface
 */
export default abstract class ARole {
  public name: string;

  protected id: number;

  protected active: boolean;

  protected taskHandler: TaskHandler | false;

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
   */
  public setTaskHandler(taskHandler: TaskHandler | false) {
    this.taskHandler = taskHandler;
  }

  public getTaskHandler(): TaskHandler | false {
    return this.taskHandler;
  }

  public async getTask(idTask: string) {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.getTask(idTask);
  }

  /**
   * Start a new task inside the role
   */
  public async startTask(idTask: string, args: any) {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.startTask(idTask, ({
      ...args,
      role: this,
    }));
  }

  /**
   * Stop a task inside a role
   */
  public async stopTask(idTask: string) {
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
   * Is the Role active?
   */
  isActive() {
    return this.active;
  }

  public abstract async start(...args: any): Promise<any>;

  public abstract async stop(...args: any): Promise<any>;

  /**
   * Build an head/body pattern message
   */
  public buildHeadBodyMessage(head: string, body: any) {
    return JSON.stringify({
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: head,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
    });
  }
}
