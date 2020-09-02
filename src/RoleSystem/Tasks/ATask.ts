//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import ARole, { ArgsObject } from '../Role/ARole.js';
import { ProgramState } from '../Handlers/AHandler.js';

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

  protected role: ARole | false = false;

  constructor() {
    this.name = CONSTANT.DEFAULT_TASK.ABSTRACT_TASK.name;

    this.id = CONSTANT.DEFAULT_TASK.ABSTRACT_TASK.id;

    this.active = false;
  }

  public isActive(): boolean {
    return this.active;
  }

  public gatherInfosFromTask(): Promise<{}> {
    return new Promise(resolve => resolve({}));
  }

  public abstract start(...args: unknown[]): Promise<unknown>;

  public abstract stop(...args: unknown[]): Promise<unknown>;

  public abstract applyNewProgramState(programState: ProgramState, oldProgramState: ProgramState): Promise<unknown>;

  public abstract connectToTask(idTaskToConnect: string, args: ArgsObject): Promise<unknown>;

  /**
   * We get news data from here, use it or not, it depends from the task
   */
  public abstract consumeNewsData(dataName: string, data: any, timestamp: number): any;

  /**
   * Use the architecture data we have to generate an array that's gonna resume it
   * You can override it
   */
  public abstract dynamicallyRefreshDataIntoList(data: any): any;

  public abstract displayMessage(param: any): void;

  public buildHeadBodyMessage(head: string, body: any): string {
    return JSON.stringify({
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: head,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
    });
  }
}
