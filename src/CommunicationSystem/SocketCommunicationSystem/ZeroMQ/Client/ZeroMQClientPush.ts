//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

// Imports
import * as zmq from 'zeromq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ from '../AZeroMQ.js';
import PromiseCommandPattern from '../../../../Utils/PromiseCommandPattern.js';
import Errors from '../../../../Utils/Errors.js';

/**
 * Client to use when you have an unidirectionnal connection PUSH
 */
export default class ZeroMQClientPush extends AZeroMQ<zmq.Push> {
  protected isClosing: boolean = false;

  constructor() {
    super();

    // Mode we are running in
    this.mode = CONSTANT.ZERO_MQ.MODE.CLIENT;
  }

  protected waitConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.zmqObject) {
        return;
      }

      this.zmqObject.events.on('connect', (data) => {
        resolve();
      });

      this.zmqObject.events.on('connect:delay', (data) => {
        console.error(`ZeroMQClientPush :: got event connect:delay`);

        reject(new Errors('E2009', 'connect:delay'));
      });
    });
  }

  public start({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    transport = CONSTANT.ZERO_MQ.TRANSPORT.TCP,
  }: {
    ipServer?: string,
    portServer?: string,
    transport?: string,
  }): Promise<any> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve) => {
        // If the client is already up
        if (this.active) {
          resolve(this.zmqObject);

          return;
        }

        // Create the client socket
        this.zmqObject = new zmq.Push();

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

        this.zmqObject.events.on('disconnect', () => {
          if (this.isClosing) {
            return;
          }

          console.error(`ZeroMQClientPush :: got unexpected event disconnect`);

          throw new Errors('E2010', 'disconnect');
        });

        this.zmqObject.events.on('end', (data) => {
          console.error(`ZeroMQClientPush :: got event end`);

          throw new Errors('E2010', 'end');
        });

        this.zmqObject.events.on('unknown', (data) => {
          console.error(`ZeroMQClientPush :: got event unknown`);

          throw new Errors('E2010', 'unknown');
        });

        this.waitConnection()
          .then(() => {
            this.active = true;

            resolve(this.zmqObject);
          })
          .catch(() => {
            // Remove the socket
            delete this.zmqObject;

            this.zmqObject = null;
            this.active = false;

            // Return an error
            throw new Errors('E2005');
          });

        this.zmqObject.connect(`${transport}://${ipServer}:${portServer}`);
      }),
    });
  }

  public stop(): Promise<any> {
    return PromiseCommandPattern({
      func: () => {
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
        });
      },
    });
  }

  public async sendMessage(message: string): Promise<void> {
    if (this.zmqObject && this.active) {
      await this.zmqObject.send(message);
    }
  }
}
