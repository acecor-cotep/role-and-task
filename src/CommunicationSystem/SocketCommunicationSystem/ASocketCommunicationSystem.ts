//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

import CONSTANT from '../../Utils/CONSTANT/CONSTANT.js';
import { ZmqSocket } from './ZeroMQ/AZeroMQ.js';

export default abstract class ASocketCommunicationSystem {
  protected name: string;

  protected active: boolean;

  protected incomingMessageListeningFunction: {
    func: Function;
    context: unknown;
  }[];

  constructor() {
    this.name = CONSTANT.SOCKET_COMMUNICATION_SYSTEM.ABSTRACT_SOCKET_COMMUNICATION_SYSTEM;

    this.active = false;

    this.incomingMessageListeningFunction = [];
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public abstract getSocket(): ZmqSocket | null;

  public abstract start(...args: unknown[]): Promise<unknown>;

  public abstract stop(...args: unknown[]): Promise<unknown>;

  public isActive(): boolean {
    return this.active;
  }

  public abstract sendMessage(...args: unknown[]): void;

  /**
   * Push the function that will handle incoming regular message (no keepAlive messages or others specific)
   */
  public listenToIncomingMessage(func: Function, context?: unknown): void {
    this.incomingMessageListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Pull the function that will handle incoming regular message (no keepAlive messages or others specific)
   */
  public unlistenToIncomingMessage(func: Function): void {
    this.incomingMessageListeningFunction = this.incomingMessageListeningFunction.filter(x => x.func !== func);
  }
}
