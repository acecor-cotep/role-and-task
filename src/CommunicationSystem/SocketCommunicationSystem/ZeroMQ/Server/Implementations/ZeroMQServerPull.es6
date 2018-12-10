//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AZeroMQServerLight from '../AZeroMQServerLight.js';
import CONSTANT from '../../../../../Utils/CONSTANT/CONSTANT.js';

/**
 * Implements a zeroMQ Server : Type -> PULL
 */
export default class ZeroMQServerPull extends AZeroMQServerLight {
  /**
   * Start a ZeroMQ Server
   * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
   */
  async start({
    ipServer,
    portServer,
    transport,
    identityPrefix,
  }) {
    return this.startServer({
      ipServer,
      portServer,
      transport,
      identityPrefix,
      socketType: CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_PULL,
    });
  }

  /**
   * Stop a ZeroMQ Server
   */
  async stop() {
    return this.stopServer();
  }

  /**
   * Send a message
   * You cannot send a message to client, because the link to client is unidirectionnal
   *
   * @override
   */
  sendMessage() {
    throw new Error('E7014');
  }
}
