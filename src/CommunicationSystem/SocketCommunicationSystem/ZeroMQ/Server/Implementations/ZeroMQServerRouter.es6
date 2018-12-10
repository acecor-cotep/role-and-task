//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AZeroMQServer from '../AZeroMQServer.js';
import CONSTANT from '../../../../../Utils/CONSTANT/CONSTANT.js';

/**
 * Implements a zeroMQ Server : Type -> ROUTER
 *
 */
export default class ZeroMQServerRouter extends AZeroMQServer {
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
      socketType: CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER,
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
   * @param {Arrray} clientIdentityByte
   * @param {String} clientIdentityString
   * @param {String} message
   */
  sendMessage(clientIdentityByte, clientIdentityString, message) {
    this.sendMessageToClient(clientIdentityByte, clientIdentityString, message);
  }
}
