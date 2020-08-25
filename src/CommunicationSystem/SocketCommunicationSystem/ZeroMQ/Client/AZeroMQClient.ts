//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

import zmq from 'zmq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ, { ZmqSocket } from '../AZeroMQ.js';
import Utils from '../../../../Utils/Utils.js';
import Errors from '../../../../Utils/Errors.js';

/**
 * Client to use when you have an Bidirectionnal connection - exemple socketType = DEALER
 * This class include custom KeepAlive
 */
export default abstract class AZeroMQClient extends AZeroMQ {
  protected keepAliveTime: number;

  protected lastMessageSent: number | false;

  protected timeoutAlive: NodeJS.Timeout | null = null;

  constructor(keepAliveTime: number = CONSTANT.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME) {
    super();

    // Mode we are running in
    this.mode = CONSTANT.ZERO_MQ.MODE.CLIENT;

    // Maximal time between messages (if you pass that time between two message, the server will probably say your disconnected)
    this.keepAliveTime = keepAliveTime;

    // Last time the client sent something to the server
    this.lastMessageSent = false;
  }

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
    return new Promise((resolve, reject) => {
      if (this.active) {
        return resolve();
      }

      // Create the client socket
      this.socket = zmq.socket(socketType);

      (this.socket as ZmqSocket).identity = `${identityPrefix}_${process.pid}`;

      // Set a timeout to the connection
      const timeoutConnect = setTimeout(() => {
        (this.socket as ZmqSocket).unmonitor();

        delete this.socket;

        this.socket = null;
        this.active = false;

        return reject(new Errors('E2005'));
      }, CONSTANT.ZERO_MQ.FIRST_CONNECTION_TIMEOUT);

      // Wait the accept of the socket to the server
      // We successfuly get connected
      (this.socket as ZmqSocket).once(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CONNECT, () => {
        // Clear the connection timeout
        clearTimeout(timeoutConnect);

        // Set the last time message we sent a message as now
        this.lastMessageSent = Date.now();

        this.active = true;

        this.treatMessageFromServer();

        // First message to send to be declared on the server
        this.clientSayHelloToServer();

        // Send messages every x ms for the server to know you are alive
        this.clientSayHeIsAlive();

        return resolve(this.socket as ZmqSocket);
      });

      // Start the monitor that will listen to socket news
      this.startMonitor();

      // Connection to the server
      return (this.socket as ZmqSocket).connect(`${transport}://${ipServer}:${portServer}`);
    });
  }

  public stopClient(): Promise<void> {
    return new Promise((resolve) => {
      // If the client is already down
      if (!this.active || !this.socket) {
        return resolve();
      }

      this.stopMonitor();

      this.socket.close();

      delete this.socket;

      this.socket = null;
      this.active = false;

      // Stop the keepAliveTime
      if (this.timeoutAlive) {
        clearTimeout(this.timeoutAlive);
      }

      return resolve();
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
    if (this.socket && this.active) {
      this.socket.send(message);
    }
  }

  protected treatMessageFromServer(): void {
    this.socket?.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, (data) => {
      const dataString = String(data);

      const ret = [{
        //
        //
        // Here we treat special strings
        //
        //
        keyStr: CONSTANT.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER,

        func: (): void => {
          this.stop();
        },
      }].some((x) => {
        if (x.keyStr === dataString) {
          x.func();

          return true;
        }

        return false;
      });

      // If the user have a function to deal with incoming messages
      if (!ret) {
        Utils.fireUp(this.incomingMessageListeningFunction, [
          dataString,
        ]);
      }
    });
  }

  /**
   * First message to send to the server to be regristered into it
   */
  public clientSayHelloToServer(): void {
    this.sendMessageToServer(CONSTANT.ZERO_MQ.CLIENT_MESSAGE.HELLO);
  }

  public clientSayHeIsAlive(): void {
    // Send a message to the server, to him know that you are alive
    this.timeoutAlive = setTimeout(() => {
      // If the communication is not active anymore
      if (!this.active) {
        return;
      }

      this.lastMessageSent = Date.now();

      this.sendMessageToServer(CONSTANT.ZERO_MQ.CLIENT_MESSAGE.ALIVE);

      // Call again
      this.clientSayHeIsAlive();
    }, this.keepAliveTime);
  }
}
