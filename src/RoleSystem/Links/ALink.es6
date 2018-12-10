//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import Utils from '../../Utils/Utils.js';
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';

/**
 * Define the pattern of a link between two tasks
 */
export default class ALink {
  /**
   * Constructor
   */
  constructor() {
    this.linkFrom = false;
    this.linkTo = false;
  }

  /**
   * Connect to the given task
   * @abstract
   */
  connectToTask() {
    throw new Error(`Function ${Utils.getFunctionName()} must be redefined in child`);
  }

  /**
   * Stop the current connections
   * @abstract
   */
  stop() {
    throw new Error(`Function ${Utils.getFunctionName()} must be redefined in child`);
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
