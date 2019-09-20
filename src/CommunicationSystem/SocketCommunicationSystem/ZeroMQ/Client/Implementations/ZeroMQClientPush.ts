//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AZeroMQClientLight from '../AZeroMQClientLight.js';
import CONSTANT from '../../../../../Utils/CONSTANT/CONSTANT.js';
import PromiseCommandPattern from '../../../../../Utils/PromiseCommandPattern.js';

/**
 * Implements a zeroMQ Client : Type -> PUSH
 *
 */
export default class ZeroMQClientPush extends AZeroMQClientLight {
  /**
   * Start a ZeroMQ Client
   * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
   */
  public start({
    ipServer,
    portServer,
    transport,
    identityPrefix,
  }: {
    ipServer?: string,
    portServer?: string,
    transport?: string,
    identityPrefix?: string,
  }): Promise<any> {
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

  public stop(): Promise<any> {
    return PromiseCommandPattern({
      func: () => this.stopClient(),
    });
  }

  public sendMessage(message): void {
    this.sendMessageToServer(message);
  }
}
