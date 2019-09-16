//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import AZeroMQServerLight from '../AZeroMQServerLight.js';
import CONSTANT from '../../../../../Utils/CONSTANT/CONSTANT.js';
import PromiseCommandPattern from '../../../../../Utils/PromiseCommandPattern.js';
import Errors from '../../../../../Utils/Errors.js';

/**
 * Implements a zeroMQ Server : Type -> PULL
 */
export default class ZeroMQServerPull extends AZeroMQServerLight {
  /**
   * Start a ZeroMQ Server
   * @param {{ipServer: String, portServer: String, transport: String, identityPrefix: String}} args
   */
  start({
    ipServer,
    portServer,
    transport,
    identityPrefix,
  }) {
    return new PromiseCommandPattern({
      func: () => this.startServer({
        ipServer,
        portServer,
        transport,
        identityPrefix,
        socketType: CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_PULL,
      }),
    });
  }

  /**
   * Stop a ZeroMQ Server
   */
  stop() {
    return new PromiseCommandPattern({
      func: () => this.stopServer(),
    });
  }

  /**
   * Send a message
   * You cannot send a message to client, because the link to client is unidirectionnal
   *
   * @override
   */
  sendMessage() {
    throw new Errors('E7014');
  }
}
