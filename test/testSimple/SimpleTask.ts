/* eslint-disable no-console */
//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

import library from '../../src/Library.js';
import { ProgramState } from '../../src/RoleSystem/Handlers/AHandler.js';
import { DynamicallyRefreshData } from '../../src/RoleSystem/Tasks/ATask.js';

let instance: SimpleTask | null = null;

/**
 * Define a Simple task which display a message every X seconds
 */
export default class SimpleTask extends library.ATask {
  protected descriptor: any;

  constructor() {
    super();

    if (instance) {
      return instance;
    }

    this.name = 'SimpleTask';

    this.id = '10';

    // Pointer to the role it is assigned to
    this.role = false;

    instance = this;

    return instance;
  }

  /**
   * Connect the actual task to the given task
   */
  public async connectToTask(idTaskToConnect: string, args: any): Promise<any> {
    // unused
  }

  /**
   * We get news data from here, use it or not, it depends from the task
   */
  public consumeNewsData(dataName: string, data: any, timestamp: number): any {
    // unused
  }

  /**
   * Use the architecture data we have to generate an array that's gonna resume it
   * You can override it
   */
  public dynamicallyRefreshDataIntoList(data: DynamicallyRefreshData): any {
    // unused
  }

  /**
   * Display a message in board
   */
  public displayMessage(param: any): void {
    // unused
  }


  /*
   * ======================================================================================================================================
   *                                                  HANDLE STATE CHANGE
   * ======================================================================================================================================
   */

  public async applyNewProgramState(programState: ProgramState) {
    const {
      READY_PROCESS,
      ERROR,
      CLOSE,
    } = library.CONSTANT.DEFAULT_STATES;

    console.log(` > ${(global as any).processPid} : Handling new state ${programState.name}`);

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

  public startDisplay() {
    console.log(` > ${(global as any).processPid} : Start Working`);

    this.descriptor = setInterval(() => {
      console.log(` > ${(global as any).processPid} : working in progress ...`);
    }, 1000);
  }

  public stopDisplay() {
    console.log(` > ${(global as any).processPid} : Stop Working`);

    clearInterval(this.descriptor);
  }


  /*
   * ======================================================================================================================================
   *                                                 OVERRIDE BASICS
   * ======================================================================================================================================
   */

  public static getInstance(): SimpleTask {
    return instance || new SimpleTask();
  }

  public async start({
    role,
  }): Promise<void> {
    if (this.active) {
      return;
    }

    // Attach the Task to the role
    this.role = role;

    this.active = true;
  }

  public async stop(): Promise<void> {
    if (!this.active) {
      return;
    }

    this.active = false;

    // Dettach the Task from the role
    this.role = false;
  }
}
