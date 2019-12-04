//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

// Imports
import * as zmq from 'zeromq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ from '../AZeroMQ.js';
import Utils from '../../../../Utils/Utils.js';
import Errors from '../../../../Utils/Errors.js';
import RoleAndTask from '../../../../RoleAndTask';

/**
 * Client to use when you have an Bidirectionnal connection - exemple socketType = DEALER
 * This class include custom KeepAlive
 */
export default class ZeroMQClientDealer extends AZeroMQ<zmq.Dealer> {
  protected descriptorInfiniteRead: NodeJS.Timeout | null = null;

  protected isClosing: boolean = false;

  protected pingTimeoutDescriptor: NodeJS.Timeout | null = null;

  protected intervalSendAlive: NodeJS.Timeout | null = null;

  constructor() {
    super();

    // Mode we are running in
    this.mode = CONSTANT.ZERO_MQ.MODE.CLIENT;
  }

  protected waitConnection() {
    return new Promise((resolve, reject) => {
      if (!this.zmqObject) {
        return;
      }

      this.zmqObject.events.on('connect', (data) => {
        resolve();
      });

      this.zmqObject.events.on('connect:delay', (data) => {
        console.error(`ZeroMQClientDealer :: got event connect:delay`);

        reject(new Errors('E2009', 'connect:delay'));
      });
    });
  }

  public start({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    transport = CONSTANT.ZERO_MQ.TRANSPORT.TCP,
    identityPrefix = CONSTANT.ZERO_MQ.CLIENT_IDENTITY_PREFIX,
  }: {
    ipServer?: string,
    portServer?: string,
    transport?: string,
    identityPrefix?: string,
  }): Promise<any> {
    return new Promise((resolve) => {
      // If the client is already up
      if (this.active) {
        resolve(this.zmqObject);

        return;
      }

      this.zmqObject = new zmq.Dealer();

      this.zmqObject.connectTimeout = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
      this.zmqObject.heartbeatTimeout = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
      this.zmqObject.heartbeatInterval = CONSTANT.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME;
      this.zmqObject.heartbeatTimeToLive = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
      this.zmqObject.reconnectInterval = -1;
      this.zmqObject.receiveTimeout = 0;

      // Listen to the event we sould not receive :: error handling
      this.zmqObject.events.on('close', (data) => {
        // If this is a regular close, do nothing
        if (this.isClosing || RoleAndTask.getInstance().getActualProgramState().id === CONSTANT.DEFAULT_STATES.CLOSE.id) {
          return;
        }

        console.error(`ZeroMQClientDealer :: got UNWANTED event close :: RoleAndTask actual state <<${RoleAndTask.getInstance().getActualProgramState().name}>>`);

        throw new Errors('E2011', 'ZeroMQClientDealer');
      });

      this.zmqObject.events.on('disconnect', (data) => {
        // If this is a regular close, do nothing
        if (this.isClosing || RoleAndTask.getInstance().getActualProgramState().id === CONSTANT.DEFAULT_STATES.CLOSE.id) {
          return;
        }

        console.error(`ZeroMQClientDealer :: got UNWANTED event disconnect :: address ${data.address} :: RoleAndTask actual state <<${RoleAndTask.getInstance().getActualProgramState().name}>>`);

        // throw new Errors('E2011', 'ZeroMQClientDealer');
      });

      this.zmqObject.events.on('end', (data) => {
        if (this.isClosing) {
          return;
        }

        console.error(`ZeroMQClientDealer :: got UNWANTED event end`);

        throw new Errors('E2010', 'end');
      });

      this.zmqObject.events.on('unknown', (data) => {
        console.error(`ZeroMQClientDealer :: got event unknown`);
      });

      // Set an identity to the client
      this.zmqObject.routingId = `${identityPrefix}_${process.pid}`;

      this.waitConnection()
        .then(() => {
          this.active = true;

          // Treat messages that comes from the server
          this.treatMessageFromServer();

          // First message to send to be declared on the server
          this.clientSayHelloToServer();

          this.startPingRoutine();

          resolve(this.zmqObject);
        })
        .catch(() => {
          // Remove the socket
          delete this.zmqObject;

          this.zmqObject = null;
          this.active = false;

          throw new Errors('E2005');
        });

      this.zmqObject.connect(`${transport}://${ipServer}:${portServer}`);
    });
  }

  /**
 * Send pings to the clients every Xsec 
 */
  protected startPingRoutine() {
    this.intervalSendAlive = setInterval(async () => {
      await this.sendMessage(CONSTANT.ZERO_MQ.CLIENT_MESSAGE.ALIVE);
    }, CONSTANT.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME);

    // Start the ping timeout process
    this.pingTimeoutDescriptor = setTimeout(() => {
      this.handleErrorPingTimeout();
    }, CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);
  }

  protected stopPingRoutine() {
    if (this.intervalSendAlive) {
      clearInterval(this.intervalSendAlive);
    }

    if (this.pingTimeoutDescriptor) {
      clearTimeout(this.pingTimeoutDescriptor);
    }
  }

  public stop(): Promise<any> {
    return new Promise((resolve, reject) => {
      // If the client is already down
      if (!this.active || !this.zmqObject) {
        resolve();

        return;
      }

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

      this.stopPingRoutine();

      // Ask for closure
      this.zmqObject.close();

      this.zmqObject = null;
      this.active = false;

      if (this.descriptorInfiniteRead) {
        clearInterval(this.descriptorInfiniteRead);
      }

      this.descriptorInfiniteRead = null;
    });
  }

  /**
   * Setup a function that is calleed when socket get connected
   */
  public listenConnectEvent(func: Function): void {
    if (!this.active || !this.zmqObject) return;

    this.zmqObject.events.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.CONNECT, (data) => {
      func(data);
    });
  }

  /**
   * Setup a function that is calleed when socket get disconnected
   */
  public listenDisconnectEvent(func: Function): void {
    if (!this.active || !this.zmqObject) return;

    this.zmqObject.events.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.DISCONNECT, (data) => {
      func();
    });
  }

  public async sendMessage(message: string): Promise<void> {
    if (this.zmqObject && this.active) {
      await this.zmqObject.send(message);
    }
  }

  protected handleErrorPingTimeout() {
    throw new Errors('E2009', 'ZeroMQServerRouter');
  }

  /**
   * Receive ping from server
   */
  protected handleNewPing() {
    if (this.pingTimeoutDescriptor) {
      clearTimeout(this.pingTimeoutDescriptor);
    }

    this.pingTimeoutDescriptor = setTimeout(() => {
      this.handleErrorPingTimeout();
    }, CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);
  }

  /**
   * Treat messages that comes from server
   */
  protected treatMessageFromServer(): void {
    const func = async () => {
      try {
        if (this.zmqObject) {
          const [msg] = await this.zmqObject.receive();

          const ret = [{
            //
            //
            // Here we treat special strings
            //
            //
            keyStr: CONSTANT.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER,

            func: () => {
              this.stop();
            },
          }, {
            keyStr: CONSTANT.ZERO_MQ.SERVER_MESSAGE.ALIVE,

            func: () => {
              this.handleNewPing();
            },
          }].some((x) => {
            if (x.keyStr === String(msg)) {
              x.func();

              return true;
            }

            return false;
          });

          // If the user have a function to deal with incoming messages
          if (!ret) {
            Utils.fireUp(this.incomingMessageListeningFunction, [String(msg)]);
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

    // Try to read from the socket
    this.descriptorInfiniteRead = setTimeout(func, CONSTANT.ZERO_MQ.WAITING_TIME_BETWEEN_TWO_RECEIVE);
  }

  /**
   * First message to send to the server to be regristered into it
   */
  public async clientSayHelloToServer(): Promise<void> {
    return this.sendMessage(CONSTANT.ZERO_MQ.CLIENT_MESSAGE.HELLO);
  }
}
