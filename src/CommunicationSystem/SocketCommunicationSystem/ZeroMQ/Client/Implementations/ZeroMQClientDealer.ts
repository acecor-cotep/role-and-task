//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AZeroMQClient from '../AZeroMQClient.js';
import CONSTANT from '../../../../../Utils/CONSTANT/CONSTANT.js';
import PromiseCommandPattern from '../../../../../Utils/PromiseCommandPattern.js';
import { ZmqSocket } from '../../AZeroMQ.js';

/**
 * Implements a zeroMQ Client : Type -> DEALER
 *
 */
export default class ZeroMQClientDealer extends AZeroMQClient {
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
      func: () => this.startClient({
        ipServer,
        portServer,
        transport,
        identityPrefix,
        socketType: CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER,
      }),
    });
  }

  public stop(): Promise<void> {
    return PromiseCommandPattern({
      func: () => this.stopClient(),
    });
  }

  public sendMessage(message: string): void {
    this.sendMessageToServer(message);
  }
}
