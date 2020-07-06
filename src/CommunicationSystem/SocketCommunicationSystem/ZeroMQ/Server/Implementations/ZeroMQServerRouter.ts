//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AZeroMQServer, { ClientIdentityByte } from '../AZeroMQServer.js';
import CONSTANT from '../../../../../Utils/CONSTANT/CONSTANT.js';
import PromiseCommandPattern from '../../../../../Utils/PromiseCommandPattern.js';
import { ZmqSocket } from '../../AZeroMQ.js';

/**
 * Implements a zeroMQ Server : Type -> ROUTER
 *
 */
export default class ZeroMQServerRouter extends AZeroMQServer {
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
        socketType: CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER,
      }),
    });
  }

  public stop(): Promise<void> {
    return this.stopServer();
  }

  public sendMessage(clientIdentityByte: ClientIdentityByte, clientIdentityString: string, message: string): void {
    this.sendMessageToClient(clientIdentityByte, clientIdentityString, message);
  }
}
