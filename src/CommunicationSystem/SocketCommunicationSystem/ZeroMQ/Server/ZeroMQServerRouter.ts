//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

// Imports
import * as zmq from 'zeromq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ from '../AZeroMQ.js';
import Utils from '../../../../Utils/Utils.js';
import PromiseCommandPattern from '../../../../Utils/PromiseCommandPattern.js';
import Errors from '../../../../Utils/Errors.js';
import RoleAndTask from '../../../../RoleAndTask';
import { clearInterval } from 'timers';

/**
 * Server used when you have Bidirectionnal server ROUTER
 * 
 * 
 *  We have implemented a custom ping system because the inner ping system doesn't work properly.
 *  In fact, it triggers random event "disconnect". We sould try it later to see if it get corrected
 * 
 */
export default class ZeroMQServerRouter extends AZeroMQ<zmq.Router> {
  protected isClosing: boolean = false;

  protected descriptorInfiniteRead: NodeJS.Timeout | null = null;

  protected clientList: {
    clientIdentityString: string,
    clientIdentityByte: Buffer,
    intervalSendAlive: NodeJS.Timeout | null,
    timeoutReceiveAlive: NodeJS.Timeout | null,
  }[];

  protected infosServer: any;

  protected newConnectionListeningFunction: { func: Function, context: any }[];

  protected newDisconnectionListeningFunction: { func: Function, context: any }[];

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
  public getInfosServer(): Object {
    return this.infosServer;
  }

  /**
   * Return the list of connected clients
   * @return {Array}
   */
  public getConnectedClientList(): string[] {
    return this.clientList.map(x => x.clientIdentityString);
  }

  /**
   * Start a ZeroMQ Server
   */
  public start({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    transport = CONSTANT.ZERO_MQ.TRANSPORT.TCP,
    identityPrefix = CONSTANT.ZERO_MQ.SERVER_IDENTITY_PREFIX,
  }: {
    ipServer?: string,
    portServer?: string,
    transport?: string,
    identityPrefix?: string,
  }): Promise<any> {
    return PromiseCommandPattern({
      func: async () => {
        // If the server is already up
        if (this.active) return this.zmqObject;

        // Create the server socket
        this.zmqObject = new zmq.Router();

        this.zmqObject.connectTimeout = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
        this.zmqObject.heartbeatTimeout = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
        this.zmqObject.heartbeatInterval = CONSTANT.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME;
        this.zmqObject.heartbeatTimeToLive = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
        this.zmqObject.reconnectInterval = -1;

        // Set an identity to the server
        this.zmqObject.routingId = `${identityPrefix}_${process.pid}`;

        // Listen to the event we sould not receive :: error handling
        this.zmqObject.events.on('close', (data) => {
          // If this is a regular close, do nothing
          if (this.isClosing || RoleAndTask.getInstance().getActualProgramState().id === CONSTANT.DEFAULT_STATES.CLOSE.id) {
            return;
          }

          console.error(`ZeroMQServerRouter :: got event close when it wasn't expected`);

          throw new Errors('E2011', `ZeroMQServerRouter :: RoleAndTask actual state <<${RoleAndTask.getInstance().getActualProgramState().name}>>`);
        });

        this.zmqObject.events.on('disconnect', (data) => {
          // If this is a regular close, do nothing
          if (this.isClosing || RoleAndTask.getInstance().getActualProgramState().id === CONSTANT.DEFAULT_STATES.CLOSE.id) {
            return;
          }

          console.error(`ZeroMQServerRouter :: got event disconnect when it wasn't expected`);

          // throw new Errors('E2011', `ZeroMQServerRouter :: ${data.address} :: RoleAndTask actual state <<${RoleAndTask.getInstance().getActualProgramState().name}>>`);
        });

        this.zmqObject.events.on('end', (data) => {
          if (this.isClosing || RoleAndTask.getInstance().getActualProgramState().id === CONSTANT.DEFAULT_STATES.CLOSE.id) {
            return;
          }

          console.error(`ZeroMQServerRouter :: got UNWANTED event end`);

          throw new Errors('E2010', 'end');
        });

        this.zmqObject.events.on('unknown', (data) => {
          console.error(`ZeroMQServerRouter :: got event unknown`);
        });

        try {
          await this.zmqObject.bind(`${transport}://${ipServer}:${portServer}`);
        } catch (err) {
          // Log something
          console.error(`Server ZeroMQ Bind Failed. Transport=${transport} Port=${portServer} IP:${ipServer}`);

          // Remove the socket
          delete this.zmqObject;

          this.zmqObject = null;
          this.active = false;

          // Return an error
          throw new Errors('E2007', `Specific: ${err}`);
        }

        // Start to handle client messages
        this.treatMessageFromClient();

        this.infosServer = {
          ipServer,
          portServer,
          transport,
          identityPrefix,
        };

        this.active = true;

        // We successfuly bind the server
        return this.zmqObject;
      },
    });
  }

  /**
   * Stop a ZeroMQ Server
   */
  public stop(): Promise<any> {
    return PromiseCommandPattern({
      func: () => {
        return new Promise((resolve, reject) => {
          // If the server is already down
          if (!this.active || !this.zmqObject) {
            resolve();

            return;
          }

          // When ZeroMQ close, we can have multiple events triggered, such as end/close

          this.isClosing = true;

          this.zmqObject.events.on('close', (data) => {
            resolve();
          });

          this.zmqObject.events.on('close:error', (data) => {
            reject(new Errors('E2010', `close:error :: ${data.error}`));
          });

          this.zmqObject.events.on('end', (data) => {
            resolve();
          });

          this.zmqObject.close();

          this.zmqObject = null;
          this.active = false;

          // Empty the clientList
          this.clientList = [];

          this.infosServer = false;

          if (this.descriptorInfiniteRead) {
            clearInterval(this.descriptorInfiniteRead);
          }

          this.descriptorInfiniteRead = null;
        });
      },
    });
  }

  /**
   * Send a message to every connected client
   */
  public async sendBroadcastMessage(message: string): Promise<void> {
    await Promise.all(this.clientList.map(x => this.sendMessage(x.clientIdentityByte, x.clientIdentityString, message)));
  }

  /**
   * Close a connection to a client
   */
  public closeConnectionToClient(clientIdentityByte: Buffer, clientIdentityString: string): void {
    this.sendMessage(clientIdentityByte, clientIdentityString, CONSTANT.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER);

    // Remove the client data from the array
    this.removeClientToServer(clientIdentityByte, clientIdentityString);
  }

  /**
   * Disconnect a user because we have got no proof of life from it since too long
   * long defined by CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE
   */
  public disconnectClientDueToTimeoutNoProofOfLive(clientIdentityByte: Buffer, clientIdentityString: string): void {
    // Send a bye message to the client, in case he's coming back
    this.closeConnectionToClient(clientIdentityByte, clientIdentityString);
  }

  /**
   * Handle a new connection of client to the server
   * (Store it into a list that will be useful create clientConnection/clientDisconnection event)
   */
  public handleNewClientToServer(clientIdentityByte: Buffer, clientIdentityString: string): void {
    // We put the client into a list of connected client
    const exist = this.clientList.some(x => x.clientIdentityString === clientIdentityString);

    if (!exist) {
      this.clientList.push({
        clientIdentityString,
        clientIdentityByte,
        intervalSendAlive: null,
        timeoutReceiveAlive: null,
      });

      this.startPingRoutine(clientIdentityString);

      Utils.fireUp(this.newConnectionListeningFunction, [
        clientIdentityByte,
        clientIdentityString,
      ]);
    }
  }

  /**
   * Send pings to the clients every Xsec 
   */
  protected startPingRoutine(clientIdentityString) {
    const client = this.clientList.find(x => x.clientIdentityString === clientIdentityString);

    if (!client) {
      return;
    }

    client.intervalSendAlive = setInterval(async () => {
      await this.sendMessage(new Buffer(''), clientIdentityString, CONSTANT.ZERO_MQ.CLIENT_MESSAGE.ALIVE);
    }, CONSTANT.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME);

    client.timeoutReceiveAlive = setTimeout(() => {
      this.handleErrorPingTimeout();
    }, CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);
  }

  protected stopPingRoutine(clientIdentityString) {
    const client = this.clientList.find(x => x.clientIdentityString === clientIdentityString);

    if (!client) {
      return;
    }

    if (client.intervalSendAlive) {
      clearInterval(client.intervalSendAlive);
    }

    if (client.timeoutReceiveAlive) {
      clearTimeout(client.timeoutReceiveAlive);
    }
  }

  protected handleErrorPingTimeout() {
    throw new Errors('E2009', 'ZeroMQServerRouter');
  }

  /**
   * A ping arrived for the client, update the timeout date
   */
  protected handleNewPing(clientIdentityString) {
    const client = this.clientList.find(x => x.clientIdentityString === clientIdentityString);

    if (!client) {
      return;
    }

    if (client.timeoutReceiveAlive) {
      clearTimeout(client.timeoutReceiveAlive);
    }

    client.timeoutReceiveAlive = setTimeout(() => {
      this.handleErrorPingTimeout();
    }, CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);
  }

  public async sendMessage(_: Buffer, clientIdentityString: string, message: string) {
    if (this.zmqObject && this.active) {
      await this.zmqObject.send([
        clientIdentityString,
        message,
      ]);
    }
  }

  /**
   * Remove a client from the clientList array
   */
  public removeClientToServer(clientIdentityByte: Buffer, clientIdentityString: string): void {
    this.clientList = this.clientList.filter(x => x.clientIdentityString !== clientIdentityString);

    this.stopPingRoutine(clientIdentityString);

    Utils.fireUp(this.newDisconnectionListeningFunction, [
      clientIdentityByte,
      clientIdentityString,
    ]);
  }

  /**
   * Treat messages that comes from clients
   */
  public treatMessageFromClient(): void {
    const func = async () => {
      try {
        if (this.zmqObject) {
          const [clientIdentityByte, data] = await this.zmqObject.receive();

          const dataString = String(data);
          const clientIdentityString = String(clientIdentityByte);

          const ret = [
            //
            //
            // Here we treat special strings
            //
            //
            {
              keyStr: CONSTANT.ZERO_MQ.CLIENT_MESSAGE.HELLO,
              func: () => this.handleNewClientToServer(clientIdentityByte, clientIdentityString),
            },
            {
              keyStr: CONSTANT.ZERO_MQ.CLIENT_MESSAGE.ALIVE,
              func: () => this.handleNewPing(clientIdentityString),
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
        }
      } catch (err) {
        // Normal to have an EAGAIN here when quitting the socket
      }

      if (this.descriptorInfiniteRead) {
        clearTimeout(this.descriptorInfiniteRead);
      }

      this.descriptorInfiniteRead = setTimeout(func, CONSTANT.ZERO_MQ.WAITING_TIME_BETWEEN_TWO_RECEIVE);
    };

    this.descriptorInfiniteRead = setTimeout(func, CONSTANT.ZERO_MQ.WAITING_TIME_BETWEEN_TWO_RECEIVE);
  }

  /**
   * Push the function that will get when a new connection is detected
   */
  public listenClientConnectionEvent(func: Function, context?: any): void {
    this.newConnectionListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Push the function that will get when a disconnection is detected
   */
  public listenClientDisconnectionEvent(func: Function, context?: any): void {
    this.newDisconnectionListeningFunction.push({
      func,
      context,
    });
  }
}
