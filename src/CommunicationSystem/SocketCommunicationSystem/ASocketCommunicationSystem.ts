//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import Utils from '../../Utils/Utils.js';
import Errors from '../../Utils/Errors.js';

/**
 * This abstract class described what a socket communication system class must offer
 */
export default abstract class ASocketCommunicationSystem {
  protected name: string;

  protected active: boolean;

  protected incomingMessageListeningFunction: { func: Function, context: any }[];

  constructor() {
    // Setup a name
    this.name = CONSTANT.SOCKET_COMMUNICATION_SYSTEM.ABSTRACT_SOCKET_COMMUNICATION_SYSTEM;

    // Say the communication system is not active
    this.active = false;

    // Function that get called when a new message get received
    this.incomingMessageListeningFunction = [];
  }

  /**
   * Getter
   * @return {String}
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Setter
   * @param {String} name
   */
  public setName(name: string): void {
    this.name = name;
  }

  /**
   * Return an object that can be used to act the communication system
   * @abstract
   */
  public abstract getSocket(): any;

  /**
   * Start the communication system
   * @abstract
   */
  public abstract start(...args: any): Promise<any>;

  /**
   * Stop the communication system
   * @abstract
   */
  public abstract stop(...args: any): Promise<any>;

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
  public abstract sendMessage(...args: any): void;

  /**
   * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
   * @param {Function} func
   * @param {Object} context
   */
  public listenToIncomingMessage(func: Function, context?: any): void {
    this.incomingMessageListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
   * @param {Function} func
   */
  public unlistenToIncomingMessage(func: Function): void {
    this.incomingMessageListeningFunction = this.incomingMessageListeningFunction.filter(x => x.func !== func);
  }
}
