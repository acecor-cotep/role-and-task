//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

import library from '../../src/Library.js';
import ZeroMQClientPush from '../../src/CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/ZeroMQClientPush.js';

// Imports
let instance: ClientTask | null = null;

/**
 * Define a Simple task which display a message every X seconds
 */
export default class ClientTask extends library.ATask {
  protected descriptor: any;
  protected client: ZeroMQClientPush | null = null;

  constructor() {
    super();

    if (instance) return instance;

    this.name = 'ClientTask';

    this.id = '11';

    // Pointer to the role it is assigned to
    this.role = false;

    instance = this;

    return instance;
  }

  /**
   * Connect the actual task to the given task
   */
  public async connectToTask(idTaskToConnect: string, args: any): Promise<any> { }

  /**
   * We get news data from here, use it or not, it depends from the task
   */
  public consumeNewsData(dataName: string, data: any, timestamp: number): any { }

  /**
   * Use the architecture data we have to generate an array that's gonna resume it
   * You can override it
   */
  public dynamicallyRefreshDataIntoList(data: any): any { }

  /**
   * Display a message in board
   */
  public displayMessage(param: any): void { }


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

    // @ts-ignore
    console.log(` > ${process.pid} : Handling new state ${programState.name}`);

    // Depending on the state of the system we are starting or stoping the dispay

    if (programState.id === READY_PROCESS.id) {
      this.startMessageSending();

      return;
    }

    if (programState.id === CLOSE.id || programState.id === ERROR.id) {
      this.stopMessageSending();
    }
  }

  /*
   * ======================================================================================================================================
   *                                                 TASK METHODS
   * ======================================================================================================================================
   */

  startMessageSending() {
    // @ts-ignore
    console.log(` > ${process.pid} : Start sending messages`);

    this.descriptor = setInterval(() => {
      if (this.client) {
        this.client.sendMessage(` > ${process.pid} : working in progress ...`);
      }
    }, 1000);
  }

  stopMessageSending() {
    // @ts-ignore
    console.log(` > ${process.pid} : Stop sending messages`);

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
    return instance || new ClientTask();
  }

  /**
   * Start to run the task
   * @override
   */
  async start({
    role,
    ipServer,
    portServer,
    transport,
  }) {
    if (this.active) return true;

    // Attach the Task to the role
    this.role = role;

    this.client = new library.ZeroMQClientPush();

    await this.client.start({
      ipServer,
      portServer,
      transport,
    });

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

    if (this.client) {
      console.log('ASKED THE CLIENT TO STOP');
      await this.client.stop();
    }

    this.client = null;

    // Dettach the Task from the role
    this.role = false;

    return true;
  }
}
