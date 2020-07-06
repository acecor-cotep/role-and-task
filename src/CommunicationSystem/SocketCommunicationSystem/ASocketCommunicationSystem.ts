//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import { ZmqSocket } from './ZeroMQ/AZeroMQ.js';

/**
 * This abstract class described what a socket communication system class must offer
 */
export default abstract class ASocketCommunicationSystem {
  protected name: string;

  protected active: boolean;

  protected incomingMessageListeningFunction: {
    func: Function;
    context: unknown;
  }[];

  constructor() {
    // Setup a name
    this.name = CONSTANT.SOCKET_COMMUNICATION_SYSTEM.ABSTRACT_SOCKET_COMMUNICATION_SYSTEM;

    // Say the communication system is not active
    this.active = false;

    // Function that get called when a new message get received
    this.incomingMessageListeningFunction = [];
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  /**
   * Return an object that can be used to act the communication system
   * @abstract
   */
  public abstract getSocket(): ZmqSocket | null;

  /**
   * Start the communication system
   * @abstract
   */
  public abstract start(...args: unknown[]): Promise<unknown>;

  /**
   * Stop the communication system
   * @abstract
   */
  public abstract stop(...args: unknown[]): Promise<unknown>;

  /**
   * Is the communication sytem active?
   * @return {Boolean}
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Send a message
   * @abstract
   */
  public abstract sendMessage(...args: unknown[]): void;

  /**
   * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
   */
  public listenToIncomingMessage(func: Function, context?: unknown): void {
    this.incomingMessageListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
   */
  public unlistenToIncomingMessage(func: Function): void {
    this.incomingMessageListeningFunction = this.incomingMessageListeningFunction.filter(x => x.func !== func);
  }
}
