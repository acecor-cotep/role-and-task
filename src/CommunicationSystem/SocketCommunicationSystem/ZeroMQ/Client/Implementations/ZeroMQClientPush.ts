//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AZeroMQClientLight from '../AZeroMQClientLight.js';
import CONSTANT from '../../../../../Utils/CONSTANT/CONSTANT.js';
import PromiseCommandPattern from '../../../../../Utils/PromiseCommandPattern.js';
import { ZmqSocket } from '../../AZeroMQ.js';

export default class ZeroMQClientPush extends AZeroMQClientLight {
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
        socketType: CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_PUSH,
      }),
    });
  }

  public stop(): Promise<void> {
    return PromiseCommandPattern({
      func: () => this.stopClient(),
    });
  }

  public sendMessage(message): void {
    this.sendMessageToServer(message);
  }
}
