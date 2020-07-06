//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import ARole from '../Role/ARole.js';

/**
 * Define what a Task is
 *
 * A Task is a job PROGRAM have to perform (For example, Log, ServerAPI, Calcul... are all tasks)
 * @interface
 */
export default abstract class ATask {
  public name: string;

  public active: boolean;

  public id: string;

  protected connectedTasks: any[];

  protected role: ARole | false = false;

  constructor() {
    this.name = CONSTANT.DEFAULT_TASK.ABSTRACT_TASK.name;

    this.id = CONSTANT.DEFAULT_TASK.ABSTRACT_TASK.id;

    this.active = false;

    // List of connected tasks
    this.connectedTasks = [];
  }

  /**
   * Is the Task active?
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Get some infos from the task
   */
  public gatherInfosFromTask(): Promise<{}> {
    return new Promise(resolve => resolve({}));
  }

  /**
   * PROGRAM start to run the task
   */
  public abstract start(...args: any): Promise<any>;

  /**
   * PROGRAM stop to run the task
   */
  public abstract stop(...args: any): Promise<any>;

  /**
   * apply the program state on the task
   */
  public abstract applyNewProgramState(programState: any, oldProgramState: any): Promise<any>;

  /**
   * Connect the actual task to the given task
   */
  public abstract connectToTask(idTaskToConnect: string, args: any): Promise<any>;

  /**
   * We get news data from here, use it or not, it depends from the task
   */
  public abstract consumeNewsData(dataName: string, data: any, timestamp: number): any;

  /**
   * Use the architecture data we have to generate an array that's gonna resume it
   * You can override it
   */
  public abstract dynamicallyRefreshDataIntoList(data: any): any;

  /**
   * Display a message in board
   */
  public abstract displayMessage(param: any): void;

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
