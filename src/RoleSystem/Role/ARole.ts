//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import Errors from '../../Utils/Errors.js';
import TaskHandler from '../Handlers/TaskHandler.js';
import ATask from '../Tasks/ATask.js';

export interface DisplayMessage {
  str: string;
  carriageReturn?: boolean;
  out?: NodeJS.WriteStream;
  from?: number | string;
  time?: number;
  tags?: string[];
}

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

  public id: number;

  protected active: boolean;

  protected taskHandler: TaskHandler | false;

  // Time taken as reference for the launch of the program
  // It's the same on the master and on all the slaves
  protected referenceStartTime = 0;

  constructor() {
    this.name = CONSTANT.DEFAULT_ROLES.ABSTRACT_ROLE.name;

    this.id = CONSTANT.DEFAULT_ROLES.ABSTRACT_ROLE.id;

    this.active = false;

    // Tasks handled (You need one)
    this.taskHandler = false;
  }

  public getReferenceStartTime(): number {
    return this.referenceStartTime;
  }

  /**
   * Setup a taskHandler to the role
   * Every Role have its specific tasks
   */
  public setTaskHandler(taskHandler: TaskHandler | false): void {
    this.taskHandler = taskHandler;
  }

  public getTaskHandler(): TaskHandler | false {
    return this.taskHandler;
  }

  public async getTask(idTask: string): Promise<ATask> {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.getTask(idTask);
  }

  /**
   * Start a new task inside the role
   */
  public async startTask(idTask: string, args: any): Promise<unknown> {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.startTask(idTask, ({
      ...args,
      role: this,
    }));
  }

  public abstract async displayMessage(param: DisplayMessage): Promise<void>;

  /**
   * Stop a task inside a role
   */
  public async stopTask(idTask: string): Promise<unknown> {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.stopTask(idTask);
  }

  /**
   * Get tasks that are available to the role
   */
  async stopAllTask(): Promise<unknown> {
    if (!this.taskHandler) throw new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.stopAllTask();
  }

  /**
   * Return the list of tasks and theirs status (isActive: true/false)
   */
  getTaskListStatus(): {
    name: string;
    id: string;
    isActive: boolean;
  }[] | Errors {
    if (!this.taskHandler) return new Errors('EXXXX', 'No taskHandler defined');

    return this.taskHandler.getTaskListStatus();
  }

  /**
   * Is the Role active?
   */
  isActive(): boolean {
    return this.active;
  }

  public abstract async start(...args: unknown[]): Promise<unknown>;

  public abstract async stop(...args: unknown[]): Promise<unknown>;

  /**
   * Build an head/body pattern message
   */
  public buildHeadBodyMessage(head: string, body: unknown): string {
    return JSON.stringify({
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: head,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
    });
  }

  public abstract takeMutex(id: string): Promise<void>;

  public abstract releaseMutex(id: string): Promise<void>;
}
