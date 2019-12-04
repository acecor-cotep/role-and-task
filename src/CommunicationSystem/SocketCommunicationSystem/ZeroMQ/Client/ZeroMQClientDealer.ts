//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

// Imports
import * as zmq from 'zeromq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ from '../AZeroMQ.js';
import Utils from '../../../../Utils/Utils.js';
import Errors from '../../../../Utils/Errors.js';

/**
 * Client to use when you have an Bidirectionnal connection - exemple socketType = DEALER
 * This class include custom KeepAlive
 */
export default class ZeroMQClientDealer extends AZeroMQ<zmq.Dealer> {
  protected descriptorInfiniteRead: NodeJS.Timeout | null = null;

  protected isClosing: boolean = false;

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

      // Listen to the event we sould not receive :: error handling
      this.zmqObject.events.on('close', (data) => {
        // If this is a regular close, do nothing
        if (this.isClosing) {
          return;
        }

        throw new Errors('E2011');
      });

      this.zmqObject.events.on('end', (data) => {
        console.error(`ZeroMQClientDealer :: got event end`);

        throw new Errors('E2010', 'end');
      });

      this.zmqObject.events.on('unknown', (data) => {
        console.error(`ZeroMQClientDealer :: got event unknown`);

        throw new Errors('E2010', 'unknown');
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

  public stop(): Promise<any> {
    return new Promise((resolve, reject) => {
      // If the client is already down
      if (!this.active || !this.zmqObject) {
        resolve();

        return;
      }

      this.isClosing = true;

      this.zmqObject.events.on('close', (data) => {
        this.isClosing = false;

        resolve();
      });

      this.zmqObject.events.on('close:error', (data) => {
        this.isClosing = false;

        reject(new Errors('E2010', `close:error :: ${data.error}`));
      });

      // Ask for closure
      this.zmqObject.close();

      // Delete the socket
      delete this.zmqObject;

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
              // Call the stop
              this.stop();
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
        console.error('DEALER :: Catch error on the fly', err);
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
