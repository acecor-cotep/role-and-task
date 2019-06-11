//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import zmq from 'zmq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ from '../AZeroMQ.js';
import Utils from '../../../../Utils/Utils.js';
import Errors from '../../../../Utils/Errors.js';
import PromiseCommandPattern from '../../../../Utils/PromiseCommandPattern.js';

/**
 * Client to use when you have an Bidirectionnal connection - exemple socketType = DEALER
 * This class include custom KeepAlive
 */
export default class AZeroMQClient extends AZeroMQ {
  constructor(keepAliveTime = CONSTANT.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME) {
    super();

    // Mode we are running in
    this.mode = CONSTANT.ZERO_MQ.MODE.CLIENT;

    // Maximal time between messages (if you pass that time between two message, the server will probably say your disconnected)
    this.keepAliveTime = keepAliveTime;

    // Last time the client sent something to the server
    this.lastMessageSent = false;
  }

  /**
   * Start a ZeroMQ Client
   * @param {{ipServer: String, portServer: String, socketType: String, transport: String, identityPrefix: String}} args
   */
  startClient({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    socketType = CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER,
    transport = CONSTANT.ZERO_MQ.TRANSPORT.TCP,
    identityPrefix = CONSTANT.ZERO_MQ.CLIENT_IDENTITY_PREFIX,
  }) {
    return new PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        // If the client is already up
        if (this.active) return resolve();

        // Create the client socket
        this.socket = zmq.socket(socketType);

        // Set an identity to the client
        this.socket.identity = `${identityPrefix}_${process.pid}`;

        // Set a timeout to the connection
        const timeoutConnect = setTimeout(() => {
          // Stop the monitoring
          this.socket.unmonitor();

          // Remove the socket
          delete this.socket;

          this.socket = false;
          this.active = false;

          // Return an error
          return reject(new Errors('E2005'));
        }, CONSTANT.ZERO_MQ.FIRST_CONNECTION_TIMEOUT);

        // Wait the accept of the socket to the server
        // We successfuly get connected
        this.socket.once(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CONNECT, () => {
          // Clear the connection timeout
          clearTimeout(timeoutConnect);

          // Set the last time message we sent a message as now
          this.lastMessageSent = Date.now();

          this.active = true;

          // Treat messages that comes from the server
          this.treatMessageFromServer();

          // First message to send to be declared on the server
          this.clientSayHelloToServer();

          // Send messages every x ms for the server to know you are alive
          this.clientSayHeIsAlive();

          return resolve(this.socket);
        });

        // Start the monitor that will listen to socket news
        this.startMonitor();

        // Connection to the server
        return this.socket.connect(`${transport}://${ipServer}:${portServer}`);
      }),
    });
  }

  /**
   * Stop a ZeroMQ Client
   */
  stopClient() {
    return new PromiseCommandPattern({
      func: () => new Promise((resolve) => {
        // If the client is already down
        if (!this.active) return resolve();

        // Stop the monitoring
        this.stopMonitor();

        // Ask for closure
        this.socket.close();

        // Delete the socket
        delete this.socket;

        this.socket = false;
        this.active = false;

        // Stop the keepAliveTime
        clearTimeout(this.timeoutAlive);

        return resolve();
      }),
    });
  }

  /**
   * Setup a function that is calleed when socket get connected
   * @param {Function} func
   * @param {Object} context
   */
  listenConnectEvent(func) {
    if (!this.active) return;

    this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CONNECT, func);
  }

  /**
   * Setup a function that is calleed when socket get disconnected
   * @param {Function} func
   */
  listenDisconnectEvent(func) {
    if (!this.active) return;

    this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.DISCONNECT, func);
  }

  /**
   * Send a message to the server
   */
  sendMessageToServer(message) {
    if (this.socket && this.active) {
      this.socket.send(message);
    }
  }

  /**
   * Treat messages that comes from server
   */
  treatMessageFromServer() {
    this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, (data) => {
      const dataString = String(data);

      const ret = [{
        //
        //
        // Here we treat special strings
        //
        //
        keyStr: CONSTANT.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER,

        func: () => {
          // Call the stop
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
      if (!ret) Utils.fireUp(this.incomingMessageListeningFunction, [dataString]);
    });
  }

  /**
   * First message to send to the server to be regristered into it
   */
  clientSayHelloToServer() {
    this.sendMessageToServer(CONSTANT.ZERO_MQ.CLIENT_MESSAGE.HELLO);
  }

  /**
   * Say to the server that you are alive
   */
  clientSayHeIsAlive() {
    // Send a message to the server, to him know that you are alive
    this.timeoutAlive = setTimeout(() => {
      // If the communication is not active anymore
      if (!this.active) return;

      // Set the last time message we sent a message as now
      this.lastMessageSent = Date.now();

      // Send a message to the server
      this.sendMessageToServer(CONSTANT.ZERO_MQ.CLIENT_MESSAGE.ALIVE);

      // Call again
      this.clientSayHeIsAlive();
    }, this.keepAliveTime);
  }
}
