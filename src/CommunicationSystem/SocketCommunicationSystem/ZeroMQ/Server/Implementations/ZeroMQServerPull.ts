//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AZeroMQServerLight from '../AZeroMQServerLight.js';
import CONSTANT from '../../../../../Utils/CONSTANT/CONSTANT.js';
import PromiseCommandPattern from '../../../../../Utils/PromiseCommandPattern.js';
import Errors from '../../../../../Utils/Errors.js';
import { ZmqSocket } from '../../AZeroMQ.js';

/**
 * Implements a zeroMQ Server : Type -> PULL
 */
export default class ZeroMQServerPull extends AZeroMQServerLight {
  public start({
    ipServer,
    portServer,
    transport,
    identityPrefix,
  }: {
    ipServer?: string;
    portServer?: string;
    transport?: string;
    identityPrefix?: string;
  }): Promise<ZmqSocket> {
    return PromiseCommandPattern({
      func: () => this.startServer({
        ipServer,
        portServer,
        transport,
        identityPrefix,
        socketType: CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_PULL,
      }),
    });
  }

  public stop(): Promise<void> {
    return PromiseCommandPattern({
      func: () => this.stopServer(),
    });
  }

  /**
   * You cannot send a message to client, because the link to client is unidirectionnal
   */
  public sendMessage(): never {
    throw new Errors('E7014');
  }
}
