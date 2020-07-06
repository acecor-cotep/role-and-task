//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import zmq from 'zmq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ, { ZmqSocket } from '../AZeroMQ.js';
import PromiseCommandPattern from '../../../../Utils/PromiseCommandPattern.js';
import Errors from '../../../../Utils/Errors.js';

/**
 * Client to use when you have an unidirectionnal connection - exemple socketType = Push
 */
export default abstract class AZeroMQClientLight extends AZeroMQ {
  constructor() {
    super();

    // Mode we are running in
    this.mode = CONSTANT.ZERO_MQ.MODE.CLIENT;
  }

  /**
   * Start a ZeroMQ Client
   */
  public startClient({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    socketType = CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER,
    transport = CONSTANT.ZERO_MQ.TRANSPORT.TCP,
    identityPrefix = CONSTANT.ZERO_MQ.CLIENT_IDENTITY_PREFIX,
  }: {
    ipServer?: string;
    portServer?: string;
    socketType?: string;
    transport?: string;
    identityPrefix?: string;
  }): Promise<ZmqSocket> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        // If the client is already up
        if (this.active) return resolve();

        // Create the client socket
        this.socket = zmq.socket(socketType);

        // Set an identity to the client
        (this.socket as ZmqSocket).identity = `${identityPrefix}_${process.pid}`;

        // Set a timeout to the connection
        const timeoutConnect = setTimeout(() => {
          // Stop the monitoring
          this.socket?.unmonitor();

          // Remove the socket
          delete this.socket;

          this.socket = null;
          this.active = false;

          // Return an error
          return reject(new Errors('E2005'));
        }, CONSTANT.ZERO_MQ.FIRST_CONNECTION_TIMEOUT);

        // Wait the accept of the socket to the server
        // We successfuly get connected
        this.socket?.once(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CONNECT, () => {
          // Clear the connection timeout
          clearTimeout(timeoutConnect);

          this.active = true;

          return resolve(this.socket);
        });

        // Start the monitor that will listen to socket news
        this.startMonitor();

        // Connection to the server
        return this.socket?.connect(`${transport}://${ipServer}:${portServer}`);
      }),
    });
  }

  /**
   * Stop a ZeroMQ Client
   */
  public stopClient(): Promise<void> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve) => {
        // If the client is already down
        if (!this.active) return resolve();

        // Stop the monitoring
        this.stopMonitor();

        // Ask for closure
        this.socket?.close();

        // Delete the socket
        delete this.socket;

        this.socket = null;
        this.active = false;

        return resolve();
      }),
    });
  }

  /**
   * Setup a function that is calleed when socket get connected
   */
  public listenConnectEvent(func: Function): void {
    if (!this.active) return;

    this.socket?.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CONNECT, func);
  }

  /**
   * Setup a function that is calleed when socket get disconnected
   */
  public listenDisconnectEvent(func: Function): void {
    if (!this.active) return;

    this.socket?.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.DISCONNECT, func);
  }

  public sendMessageToServer(message: string): void {
    if (this.socket && this.active) this.socket.send(message);
  }
}
