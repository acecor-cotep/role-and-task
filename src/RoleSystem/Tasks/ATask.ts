//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import Utils from '../../Utils/Utils.js';
import Errors from '../../Utils/Errors.js';

/**
 * Define what a Task is
 *
 * A Task is a job PROGRAM have to perform (For example, Log, ServerAPI, Calcul... are all tasks)
 * @interface
 */
export default class ATask {
  constructor() {
    this.name = CONSTANT.DEFAULT_TASK.ABSTRACT_TASK.name;

    this.id = CONSTANT.DEFAULT_TASK.ABSTRACT_TASK.id;

    this.active = false;

    // List of connected tasks
    this.connectedTasks = [];
  }

  /**
   * Get the name of the Task
   * @return {String}
   */
  static get name() {
    return this.name;
  }

  /**
   * Is the Task active?
   */
  isActive() {
    return this.active;
  }

  /**
   * SINGLETON implementation
   * @abstract
   */
  static getInstance() {
    return new Promise((_, reject) => reject(new Errors('EXXXX', `Unimplemented getInstance methods in ${Utils.getFunctionName()} child`)));
  }

  /**
   * Get some infos from the task
   */
  gatherInfosFromTask() {
    return new Promise(resolve => resolve({}));
  }

  /**
   * PROGRAM start to run the task
   * @param {Object} args
   * @abstract
   */
  start() {
    return new Promise((_, reject) => reject(new Errors('EXXXX', `Unimplemented start methods in ${Utils.getFunctionName()} child`)));
  }

  /**
   * PROGRAM stop to run the task
   * @param {Object} args
   * @abstract
   */
  stop() {
    return new Promise((_, reject) => reject(new Errors('EXXXX', `Unimplemented stop methods in ${Utils.getFunctionName()} child`)));
  }

  /**
   * Connect the actual task to the given task
   * @param {String} idTaskToConnect
   * @param {Object} args
   * @abstract
   */
  connectToTask() {
    return new Promise((_, reject) => reject(new Errors('EXXXX', `Unimplemented connectToTask methods in ${Utils.getFunctionName()} child`)));
  }

  /**
   * apply the program state on the task
   * @param {Number} programState
   * @param {Number} oldProgramState
   */
  applyNewProgramState() {
    return new Promise(resolve => resolve());
  }

  /**
   * We get news data from here, use it or not, it depends from the task
   *
   * @param {String} dataName
   * @param {Object} data
   * @param {Date} timestamp
   */
  consumeNewsData() {
    // Do not consume the data
  }

  /**
   * Build an head/body pattern message
   * @param {String} head
   * @param {Object} body
   */
  buildHeadBodyMessage(head, body) {
    return JSON.stringify({
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: head,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
    });
  }
}
