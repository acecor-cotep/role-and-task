//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import Utils from '../../Utils/Utils.js';
import Errors from '../../Utils/Errors.js';
import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';

/**
 * Define the pattern of a link between two tasks
 */
export default abstract class ALink {

  protected linkFrom: boolean = false;
  protected linkTo: boolean = false;

  constructor() { }

  public abstract connectToTask(...args: any): any;

  /**
   * Stop the current connections
   */
  public abstract stop(...args: any): any;

  /**
   * Build an head/body pattern message
   * @param {String} head
   * @param {Object} body
   */
  public buildHeadBodyMessage(head: string, body: any) {
    return JSON.stringify({
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: head,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
    });
  }
}
