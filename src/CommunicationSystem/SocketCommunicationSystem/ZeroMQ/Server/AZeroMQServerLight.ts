//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import zmq from 'zmq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ, { ZmqSocket } from '../AZeroMQ.js';
import Utils from '../../../../Utils/Utils.js';
import Errors from '../../../../Utils/Errors.js';
import PromiseCommandPattern from '../../../../Utils/PromiseCommandPattern.js';

/**
 * Server used when you have Unidirectionnal server (like PULL)
 */
export default abstract class AZeroMQServerLight extends AZeroMQ {
  constructor() {
    super();

    this.mode = CONSTANT.ZERO_MQ.MODE.SERVER;
  }

  public startServer({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    socketType = CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_PULL,
    transport = CONSTANT.ZERO_MQ.TRANSPORT.TCP,
    identityPrefix = CONSTANT.ZERO_MQ.SERVER_IDENTITY_PREFIX,
  }: {
    ipServer?: string;
    portServer?: string;
    socketType?: string;
    transport?: string;
    identityPrefix?: string;
  }): Promise<ZmqSocket> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        // If the server is already up
        if (this.active) {
          return resolve(this.socket);
        }

        // Check the socket Type
        const check = [
          CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_PULL,

          // ... add here is required
        ].some(x => x === socketType);

        if (!check) {
          return reject(new Errors('E2008', `socketType: ${socketType}`));
        }

        // Create the server socket
        this.socket = zmq.socket(socketType);

        // Set an identity to the server
        (this.socket as ZmqSocket).identity = `${identityPrefix}_${process.pid}`;

        this.startMonitor();

        // Bind the server to a port
        return (this.socket as ZmqSocket).bind(`${transport}://${ipServer}:${portServer}`, (err: Error) => {
          if (err) {
            console.error(`Server ZeroMQ Bind Failed. Transport=${transport} Port=${portServer} IP:${ipServer}`);

            this.stopMonitor();

            delete this.socket;

            this.socket = null;
            this.active = false;

            return reject(new Errors('E2007', `Specific: ${err}`));
          }

          this.treatMessageFromClient();

          this.active = true;

          // We successfuly bind the server
          return resolve(this.socket);
        });
      }),
    });
  }

  public stopServer(): Promise<void> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        // If the server is already down
        if (!this.active || !this.socket) {
          return resolve();
        }

        // Listen to the closure of the socket
        this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CLOSE, () => {
          this.stopMonitor();

          delete this.socket;

          this.socket = null;
          this.active = false;

          return resolve();
        });

        // Error in closure
        this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CLOSE_ERROR, (err: Error, ep: string) =>
          reject(new Errors('E2006', `Endpoint: ${String(err)} - ${ep}`)));

        // Ask for closure (asynchronous)
        return this.socket.close();
      }),
    });
  }

  /**
   * Treat messages that comes from clients
   * send them to the listeners
   */
  public treatMessageFromClient(): void {
    this.socket?.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, (msg: string) => {
      const dataString = String(msg);

      Utils.fireUp(this.incomingMessageListeningFunction, [
        dataString,
      ]);
    });
  }
}
