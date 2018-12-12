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
  start({
    ipServer,
    portServer,
    transport,
    identityPrefix,
  }) {
    return new PromiseCommandPattern({
      func: () => this.startClient({
        ipServer,
        portServer,
        transport,
        identityPrefix,
        socketType: CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_PUSH,
      }),
    });
  }

  /**
   * Stop a ZeroMQ Client
   */
  stop() {
    return new PromiseCommandPattern({
      func: () => this.stopClient(),
    });
  }

  /**
   * Send a message
   * @param {String} message
   */
  sendMessage(message) {
    this.sendMessageToServer(message);
  }
}
