//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../../Utils/CONSTANT/CONSTANT.js';
import ASocketCommunicationSystem from '../ASocketCommunicationSystem.js';

// With T the zeromq socket type
export default abstract class AZeroMQ<T> extends ASocketCommunicationSystem {
  protected mode: string | false;
  protected zmqObject: T | null;
  protected monitorTimeout: any;

  constructor() {
    super();

    // Name of the protocol of communication
    this.name = CONSTANT.SOCKET_COMMUNICATION_SYSTEM.ZEROMQ;

    // Mode we are running in (Server or Client)
    this.mode = false;

    // Socket
    this.zmqObject = null;
  }

  /**
   * Return an object that can be used to act the communication system
   * @override
   */
  public getSocket(): T | null {
    return this.zmqObject;
  }
}
