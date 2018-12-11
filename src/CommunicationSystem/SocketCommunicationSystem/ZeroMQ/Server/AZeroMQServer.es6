//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import zmq from 'zmq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ from '../AZeroMQ.js';
import Utils from '../../../../Utils/Utils.js';

/**
 * Server used when you have Bidirectionnal server (like ROUTER)
 */
export default class AZeroMQServer extends AZeroMQ {
  constructor() {
    super();

    // Mode we are running in
    this.mode = CONSTANT.ZERO_MQ.MODE.SERVER;

    // List of server client
    this.clientList = [];

    // Infos about server options
    this.infosServer = false;

    // Function to deal with the incoming regular messages
    this.newConnectionListeningFunction = [];

    this.newDisconnectionListeningFunction = [];
  }

  /**
   * Get infos from the server -> ip/port ...etc
   */
  getInfosServer() {
    return this.infosServer;
  }

  /**
   * Return the list of connected clients
   * @return {Array}
   */
  getConnectedClientList() {
    return this.clientList.map(x => x.clientIdentityString);
  }

  /**
   * Start a ZeroMQ Server
   * @param {{ipServer: String, portServer: String, socketType: String, transport: String, identityPrefix: String}} args
   */
  startServer({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    socketType = CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER,
    transport = CONSTANT.ZERO_MQ.TRANSPORT.TCP,
    identityPrefix = CONSTANT.ZERO_MQ.SERVER_IDENTITY_PREFIX,
  }) {
    return new Promise((resolve, reject) => {
      // If the server is already up
      if (this.active) return resolve(this.socket);

      // Check the socket Type
      const check = [
        CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_ROUTER,
        CONSTANT.ZERO_MQ.SOCKET_TYPE.OMQ_DEALER,
        // ... add here is required
      ].some(x => x === socketType);

      if (!check) return reject(new Error(`E2008 : socketType: ${socketType}`));

      // Create the server socket
      this.socket = zmq.socket(socketType);

      // Set an identity to the server
      this.socket.identity = `${identityPrefix}_${process.pid}`;

      // Start the monitor that will listen to socket news
      this.startMonitor();

      // Bind the server to a port
      return this.socket.bind(`${transport}://${ipServer}:${portServer}`, (err) => {
        if (err) {
          // Log something
          console.error(`Server ZeroMQ Bind Failed. Transport=${transport} Port=${portServer} IP:${ipServer}`);

          // Stop the monitoring
          this.stopMonitor();

          // Remove the socket
          delete this.socket;

          this.socket = false;
          this.active = false;

          // Return an error
          return reject(new Error(`E2007 : Specific: ${err}`));
        }

        // Start to handle client messages
        this.treatMessageFromClient();

        this.infosServer = {
          ipServer,
          portServer,
          socketType,
          transport,
          identityPrefix,
        };

        this.active = true;

        // We successfuly bind the server
        return resolve(this.socket);
      });
    });
  }

  /**
   * Stop a ZeroMQ Server
   */
  stopServer() {
    return new Promise((resolve, reject) => {
      // If the server is already down
      if (!this.active) return resolve();

      // Listen to the closure of the socket
      this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CLOSE, () => {
        // Successfuly close
        // Stop the monitoring
        this.stopMonitor();

        // Delete the socket
        delete this.socket;

        this.socket = false;
        this.active = false;

        // Empty the clientList
        this.clientList = [];

        this.infosServer = false;

        return resolve();
      });

      // Error in closure
      this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CLOSE_ERROR, (err, ep) => reject(new Error(`E2006 : Endpoint: ${String(err)} ${ep}`)));

      // Ask for closure
      return this.socket.close();
    });
  }

  /**
   * Setup a function that is called when a new client get connected
   * @param {Function} func
   */
  listenNewConnectedClientEvent(func) {
    if (!this.active) return;

    this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.ACCEPT, func);
  }

  /**
   * Send a message to every connected client
   * @param {String} message
   */
  sendBroadcastMessage(message) {
    this.clientList.forEach(x => this.sendMessageToClient(x.clientIdentityByte, x.clientIdentityString, message));
  }

  /**
   * Close a connection to a client
   */
  closeConnectionToClient(clientIdentityByte, clientIdentityString) {
    this.sendMessageToClient(clientIdentityByte, clientIdentityString, CONSTANT.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER);

    // Remove the client data from the array
    this.removeClientToServer(clientIdentityByte, clientIdentityString);
  }

  /**
   * Disconnect a user because we have got no proof of life from it since too long
   * long defined by CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE
   * @param {Arrray} clientIdentityByte
   * @param {String} clientIdentityString
   */
  disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte, clientIdentityString) {
    // Send a bye message to the client, in case he's coming back
    this.closeConnectionToClient(clientIdentityByte, clientIdentityString);
  }

  /**
   * Handle a new connection of client to the server
   * (Store it into a list that will be useful create clientConnection/clientDisconnection event)
   * @param {Arrray} clientIdentityByte
   * @param {String} clientIdentityString
   */
  handleNewClientToServer(clientIdentityByte, clientIdentityString) {
    // We put the client into a list of connected client
    const exist = this.clientList.some(x => x.clientIdentityString === clientIdentityString);

    if (!exist) {
      this.clientList.push({
        clientIdentityString,
        clientIdentityByte,
        timeoutAlive: false,
      });

      Utils.fireUp(this.newConnectionListeningFunction, [
        clientIdentityByte,
        clientIdentityString,
      ]);
    }

    // Call a function that will disconnected the client from the server is he sent nothing
    // in a pre-defined period
    this.timeoutClientConnection(clientIdentityByte, clientIdentityString);
  }

  /**
   * Function that is executed to handle client timeout
   * Not proof of life from too long
   * @param {Arrray} clientIdentityByte
   * @param {String} clientIdentityString
   */
  timeoutClientConnection(clientIdentityByte, clientIdentityString) {
    // Function execution
    const timeout = () => {
      // Disconnect the user to the server
      this.disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte, clientIdentityString);
    };

    this.clientList.some((x, xi) => {
      if (x.clientIdentityString === clientIdentityString) {
        // If we had a pre-existing timeout, relaunch it
        if (this.clientList[xi].timeoutAlive) clearTimeout(this.clientList[xi].timeoutAlive);

        // Create a timeout
        this.clientList[xi].timeoutAlive = setTimeout(() => timeout(), CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);

        return true;
      }

      return false;
    });
  }

  /**
   * Send a message to the client
   * @param {Arrray} clientIdentityByte
   * @param {String} clientIdentityString
   * @param {String} message
   */
  sendMessageToClient(clientIdentityByte, clientIdentityString, message) {
    if (this.socket && this.active) {
      this.socket.send([
        clientIdentityString,
        message,
      ]);
    }
  }

  /**
   * We know that the specified client is alive (he sent something to us)
   * @param {Arrray} clientIdentityByte
   * @param {String} clientIdentityString
   */
  handleAliveInformationFromSpecifiedClient(clientIdentityByte, clientIdentityString) {
    this.clientList.some((x) => {
      if (clientIdentityString === x.clientIdentityString) {
        // Handle the user timeout
        this.timeoutClientConnection(clientIdentityByte, clientIdentityString);

        return true;
      }

      return false;
    });
  }

  /**
   * Remove a client from the clientList array
   * @param {Arrray} clientIdentityByte
   * @param {String} clientIdentityString
   */
  removeClientToServer(clientIdentityByte, clientIdentityString) {
    this.clientList = this.clientList.filter(x => x.clientIdentityString !== clientIdentityString);

    Utils.fireUp(this.newDisconnectionListeningFunction, [
      clientIdentityByte,
      clientIdentityString,
    ]);
  }

  /**
   * Treat messages that comes from clients
   */
  treatMessageFromClient() {
    this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.MESSAGE, (clientIdentityByte, data) => {
      const dataString = String(data);
      const clientIdentityString = String(clientIdentityByte);

      const ret = [
        //
        //
        // Here we treat special strings
        //
        //
        {
          keyStr: CONSTANT.ZERO_MQ.CLIENT_MESSAGE.ALIVE,
          func: () => {
            // We got a keepAlive message from client
            // We got something from the client we know he's not disconnected
            this.handleAliveInformationFromSpecifiedClient(clientIdentityByte, clientIdentityString);
          },
        }, {
          keyStr: CONSTANT.ZERO_MQ.CLIENT_MESSAGE.HELLO,
          func: () => this.handleNewClientToServer(clientIdentityByte, clientIdentityString),
        },
      ].some((x) => {
        if (x.keyStr === dataString) {
          x.func();

          return true;
        }

        return false;
      });

      // If the user have a function to deal with incoming messages
      if (!ret) {
        Utils.fireUp(this.incomingMessageListeningFunction, [
          clientIdentityByte,
          clientIdentityString,
          dataString,
        ]);
      }

      if (!ret) {
        // We got something from the client we know he's not disconnected
        this.handleAliveInformationFromSpecifiedClient(clientIdentityByte, clientIdentityString);
      }
    });
  }

  /**
   * Push the function that will get when a new connection is detected
   * @param {Function} func
   * @param {Object} context
   */
  listenClientConnectionEvent(func, context) {
    this.newConnectionListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Push the function that will get when a disconnection is detected
   * @param {Function} func
   * @param {Object} context
   */
  listenClientDisconnectionEvent(func, context) {
    this.newDisconnectionListeningFunction.push({
      func,
      context,
    });
  }
}
