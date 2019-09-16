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
export default class ASocketCommunicationSystem {
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
  getName() {
    return this.name;
  }

  /**
   * Setter
   * @param {String} name
   */
  setName(name) {
    this.name = name;
  }

  /**
   * Return an object that can be used to act the communication system
   * @abstract
   */
  getSocket() {
    throw new Errors(`Unimplemented getSocket methods in ${Utils.getFunctionName()} child`);
  }

  /**
   * Start the communication system
   * @abstract
   */
  start() {
    return new Promise((_, reject) => reject(new Errors('EXXXX', `Unimplemented start methods in ${Utils.getFunctionName()} child`)));
  }

  /**
   * Stop the communication system
   * @abstract
   */
  stop() {
    return new Promise((_, reject) => reject(new Errors('EXXXX', `Unimplemented stop methods in ${Utils.getFunctionName()} child`)));
  }

  /**
   * Is the communication sytem active?
   * @return {Boolean}
   */
  isActive() {
    return this.active;
  }

  /**
   * Send a message
   * @abstract
   */
  sendMessage() {
    throw new Errors('EXXXX', `Unimplemented sendMessage methods in ${Utils.getFunctionName()} child`);
  }

  /**
   * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
   * @param {Function} func
   * @param {Object} context
   */
  listenToIncomingMessage(func, context) {
    this.incomingMessageListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
   * @param {Function} func
   */
  unlistenToIncomingMessage(func) {
    this.incomingMessageListeningFunction = this.incomingMessageListeningFunction.filter(x => x.func !== func);
  }
}
