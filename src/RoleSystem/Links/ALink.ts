//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';

export default abstract class ALink {
  public abstract connectToTask(...args: unknown[]): unknown;

  public abstract stop(...args: unknown[]): unknown;

  public buildHeadBodyMessage(head: string, body: unknown): string {
    return JSON.stringify({
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: head,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
    });
  }
}
