//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import CONSTANT from '../../../Utils/CONSTANT/CONSTANT.js';
import ASocketCommunicationSystem from '../ASocketCommunicationSystem.js';
import { Socket } from 'net';

export default abstract class AZeroMQ extends ASocketCommunicationSystem {
  protected mode: string | false;
  protected socket: any;
  protected monitorTimeout: any;

  constructor() {
    super();

    // Name of the protocol of communication
    this.name = CONSTANT.SOCKET_COMMUNICATION_SYSTEM.ZEROMQ;

    // Mode we are running in (Server or Client)
    this.mode = false;

    // Socket
    this.socket = false;

    // Store a ptr to monitor restart timeout
    this.monitorTimeout = false;
  }

  /**
   * Return an object that can be used to act the communication system
   * @override
   */
  public getSocket(): any {
    return this.socket;
  }

  /**
   * Stop the monitor
   */
  public stopMonitor(): void {
    if (this.monitorTimeout) clearTimeout(this.monitorTimeout);

    this.monitorTimeout = false;

    if (this.socket) this.socket.unmonitor();
  }

  /**
   * Start the monitor that will listen to socket news
   * Check for events every 500ms and get all available events.
   */
  public startMonitor() {
    // Handle monitor error
    this.socket.on(CONSTANT.ZERO_MQ.KEYWORDS_OMQ.MONITOR_ERROR, () => {
      if (this.socket) {
        // Restart the monitor if it fail
        this.monitorTimeout = setTimeout(() => {
          if (this.socket) {
            this.socket.monitor(CONSTANT.ZERO_MQ.MONITOR_TIME_CHECK, 0);
          }
        }, CONSTANT.ZERO_MQ.MONITOR_RELAUNCH_TIME);
      }
    });

    // Call monitor, check for events every 50ms and get all available events.
    this.socket.monitor(CONSTANT.ZERO_MQ.MONITOR_TIME_CHECK, 0);
  }
}
