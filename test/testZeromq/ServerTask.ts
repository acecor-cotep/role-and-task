//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

import library from '../../src/Library.js';
import ZeroMQServerPull from '../../src/CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerPull.js';

// Imports
let instance: ServerTask | null = null;

/**
 * Define a Simple task which display a message every X seconds
 */
export default class ServerTask extends library.ATask {
  protected descriptor: any;

  protected server: ZeroMQServerPull | null = null;

  constructor() {
    super();

    if (instance) return instance;

    this.name = 'ServerTask';

    this.id = '10';

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
  async applyNewProgramState(programState) { }

  /*
   * ======================================================================================================================================
   *                                                 TASK METHODS
   * ======================================================================================================================================
   */


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
    return instance || new ServerTask();
  }

  /**
   * Start to run the task
   * @override
   */
  async start({
    role,
    portServer,
    ipServer,
    transport = library.CONSTANT.ZERO_MQ.TRANSPORT.IPC,
  }) {
    if (this.active) return true;

    // Attach the Task to the role
    this.role = role;

    this.server = new library.ZeroMQServerPull();
    
    await this.server.start({
      portServer,
      ipServer,
      transport,
      identityPrefix: this.id,
    });

    this.server.listenToIncomingMessage((msg) => {
      console.log(`ServerTask received :: ${msg}`);
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

    // Dettach the Task from the role
    this.role = false;

    return true;
  }
}
