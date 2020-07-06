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
  public abstract connectToTask(...args: unknown[]): unknown;

  /**
   * Stop the current connections
   */
  public abstract stop(...args: unknown[]): unknown;

  /**
   * Build an head/body pattern message
   */
  public buildHeadBodyMessage(head: string, body: unknown): string {
    return JSON.stringify({
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: head,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
    });
  }
}
