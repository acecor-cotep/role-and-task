//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//

// Imports
import * as zmq from 'zeromq';
import CONSTANT from '../../../../Utils/CONSTANT/CONSTANT.js';
import AZeroMQ from '../AZeroMQ.js';
import Utils from '../../../../Utils/Utils.js';
import Errors from '../../../../Utils/Errors.js';
import PromiseCommandPattern from '../../../../Utils/PromiseCommandPattern.js';
import RoleAndTask from '../../../../RoleAndTask';

/**
 * Server used when you have Unidirectionnal PULL server
 */
export default class ZeroMQServerPull extends AZeroMQ<zmq.Pull> {
  protected descriptorInfiniteRead: NodeJS.Timeout | null = null;

  protected isClosing: boolean = false;

  constructor() {
    super();

    // Mode we are running in
    this.mode = CONSTANT.ZERO_MQ.MODE.SERVER;
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
      func: async () => {
        // If the server is already up
        if (this.active) {
          return this.zmqObject;
        }

        // Create the server socket
        this.zmqObject = new zmq.Pull();

        this.zmqObject.connectTimeout = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
        this.zmqObject.heartbeatTimeout = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
        this.zmqObject.heartbeatInterval = CONSTANT.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME;
        this.zmqObject.heartbeatTimeToLive = CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
        this.zmqObject.reconnectInterval = -1;

        // Listen to the event we sould not receive :: error handling
        this.zmqObject.events.on('close', (data) => {
          // If this is a regular close, do nothing
          if (this.isClosing || RoleAndTask.getInstance().getActualProgramState().id === CONSTANT.DEFAULT_STATES.CLOSE.id) {
            return;
          }

          console.error(`ZeroMQServerPull :: got event close when it wasn't expected`);

          throw new Errors('E2011', `ZeroMQServerPull :: RoleAndTask actual state <<${RoleAndTask.getInstance().getActualProgramState().name}>>`);
        });

        // Disconnect of a client
        this.zmqObject.events.on('disconnect', (data) => {
          // If this is a regular close, do nothing
          if (this.isClosing || RoleAndTask.getInstance().getActualProgramState().id === CONSTANT.DEFAULT_STATES.CLOSE.id) {
            return;
          }

          console.error(`ZeroMQServerPull :: got event disconnect when it wasn't expected`);

          // throw new Errors('E2011', `ZeroMQServerPull :: Address ${data.address} :: RoleAndTask actual state <<${RoleAndTask.getInstance().getActualProgramState().name}>>`);
        });

        this.zmqObject.events.on('end', (data) => {
          if (this.isClosing) {
            return;
          }

          console.error(`ZeroMQServerPull :: got UNWANTED event end`);

          throw new Errors('E2010', 'end');
        });

        this.zmqObject.events.on('unknown', (data) => {
          console.error(`ZeroMQServerPull :: got event unknown`);
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

        this.active = true;

        // We successfuly bind the server
        return this.zmqObject;
      },
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

      if (this.descriptorInfiniteRead) {
        clearInterval(this.descriptorInfiniteRead);
      }

      this.descriptorInfiniteRead = null;
    });
  }

  /**
   * Treat messages that comes from clients
   * send them to the listeners
   */
  public treatMessageFromClient(): void {
    const func = async () => {
      try {
        if (this.zmqObject) {
          const [msg] = await this.zmqObject.receive();

          Utils.fireUp(this.incomingMessageListeningFunction, [
            String(msg),
          ]);
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

  // Cannot send messages as PULL
  public sendMessage(...args: any): void {
    throw new Errors('E7014');
  }
}
