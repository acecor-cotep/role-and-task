//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import ASlave from './ASlave.js';
import CONSTANT from '../../../Utils/CONSTANT/CONSTANT.js';
import ZeroMQClientDealer from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientDealer.js';
import TaskHandler from '../../Handlers/TaskHandler.js';
import Utils from '../../../Utils/Utils.js';
import Errors from '../../../Utils/Errors.js';
import RoleAndTask from '../../../RoleAndTask.js';
import PromiseCommandPattern from '../../../Utils/PromiseCommandPattern.js';
import { ProgramState } from '../../Handlers/AHandler.js';
import { DisplayMessage, ArgsObject } from '../ARole.js';

let instance: Slave | null = null;

/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 */
export default class Slave extends ASlave {
  // Define none communicationSystem for now
  protected communicationSystem: ZeroMQClientDealer | false = false;

  protected intervalFdCpuAndMemory: NodeJS.Timeout | null = null;

  protected intervalFdTasksInfos: NodeJS.Timeout | null = null;

  /**
   * Ask if we want a brand new instance (If you don't create a new instance here as asked
   * you will have trouble in inheritance - child of this class)
   */
  constructor(oneshotNewInstance = false) {
    super();

    if (instance && !oneshotNewInstance) {
      return instance;
    }

    this.name = CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.name;
    this.id = CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id;

    // Get the tasks related to the master role
    const tasks = RoleAndTask.getInstance()
      .getRoleTasks(CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id);

    // Define all tasks handled by this role
    // We turn the tasks array into an object containing the tasks
    this.setTaskHandler(new TaskHandler(tasks.reduce((tmp, x) => {
      tmp[x.name] = x;

      return tmp;
    }, {})));

    if (oneshotNewInstance) {
      return this;
    }

    instance = this;

    return instance;
  }

  public static getInstance(): Slave {
    return instance || new Slave();
  }

  public getCommunicationSystem(): ZeroMQClientDealer | false {
    return this.communicationSystem;
  }

  /**
   * Display a message by giving it to the master
   */
  public async displayMessage(params: DisplayMessage): Promise<void> {
    // If we disallow log display, stop it here
    if (!RoleAndTask.getInstance().displayLog) {
      return;
    }

    this.sendHeadBodyMessageToServer(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.OUTPUT_TEXT, params);
  }

  protected sendTaskList(): void {
    const handler: TaskHandler | false = this.getTaskHandler();

    if (handler === false) {
      throw new Errors('EXXXX', 'no task handler');
    }

    const buildMsg = this.buildHeadBodyMessage(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS, handler.getTaskListStatus());

    const communication: ZeroMQClientDealer | false = this.getCommunicationSystem();

    if (communication === false) {
      throw new Errors('EXXXX', 'no communication');
    }

    return communication.sendMessageToServer(buildMsg);
  }

  /**
   * We send our tasks and the type of slave we are
   */
  protected sendConfirmationInformations(): void {
    const handler: TaskHandler | false = this.getTaskHandler();

    if (handler === false) {
      throw new Errors('EXXXX', 'no task handler');
    }

    const buildMsg = this.buildHeadBodyMessage(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.SLAVE_CONFIRMATION_INFORMATIONS, {
      tasks: handler.getTaskListStatus(),

      role: {
        id: this.id,
        name: this.name,
      },
    });

    const communication: ZeroMQClientDealer | false = this.getCommunicationSystem();

    if (communication === false) {
      throw new Errors('EXXXX', 'no communication');
    }

    return communication.sendMessageToServer(buildMsg);
  }

  /**
   * We get asked to spread a news to every slave tasks -> Send the request to master
   */
  protected sendDataToEveryProgramTaskWhereverItIs(data): void {
    const buildMsg = this.buildHeadBodyMessage(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, data);

    const communication: ZeroMQClientDealer | false = this.getCommunicationSystem();

    if (communication === false) {
      throw new Errors('EXXXX', 'no communication');
    }

    communication.sendMessageToServer(buildMsg);
  }

  protected sendHeadBodyMessageToServer(head: string, body: unknown): void {
    const buildMsg = this.buildHeadBodyMessage(head, body);

    const communication: ZeroMQClientDealer | false = this.getCommunicationSystem();

    if (communication === false) {
      throw new Errors('EXXXX', 'no communication');
    }

    // Error in message
    return communication.sendMessageToServer(buildMsg);
  }

  protected protocolStartTask(body: {
    idTask: string;
    args: ArgsObject;
  }): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          START_TASK,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        // We should have something like { idTask: String, args: {} }
        if (!body || !body.idTask || !body.args) {
          // Error in message
          return this.sendHeadBodyMessageToServer(START_TASK, new Errors('E7006')
            .serialize());
        }

        try {
          const handler: TaskHandler | false = this.getTaskHandler();

          if (handler === false) {
            throw new Errors('EXXXX', 'no task handler');
          }

          await handler.startTask(body.idTask, {
            ...body.args,
            role: this,
          });

          // Task get successfuly added
          this.sendHeadBodyMessageToServer(START_TASK, '');
        } catch (err) {
          this.sendHeadBodyMessageToServer(START_TASK, err instanceof Errors ? (err.serialize && err.serialize()) : String(err));
        }
      },
    });
  }

  protected protocolStopTask(body: {
    idTask: string;
    args: ArgsObject;
  }): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          STOP_TASK,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        // We should have something like { idTask: String, args: {} }
        if (!body || !body.idTask || !body.args) {
          // Error in message
          return this.sendHeadBodyMessageToServer(STOP_TASK, new Errors('E7006')
            .serialize());
        }

        try {
          const handler: TaskHandler | false = this.getTaskHandler();

          if (handler === false) {
            throw new Errors('EXXXX', 'no task handler');
          }

          await handler.stopTask(body.idTask, body.args);

          // Task get successfuly stopped
          this.sendHeadBodyMessageToServer(STOP_TASK, '');
        } catch (err) {
          this.sendHeadBodyMessageToServer(STOP_TASK, err instanceof Errors ? (err.serialize && err.serialize()) : String(err));
        }
      },
    });
  }

  /**
   * As a slave we send our infos to the master throught this method
   * Infos are: IP Address, CPU and memory Load, tasks infos ...
   */
  protected protocolSendMyInfosToMaster({
    ip,
    cpuAndMemory,
    tasksInfos,
  }: any): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          INFOS_ABOUT_SLAVES,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        const infos: any = {};

        // Add the ip address
        if (ip) {
          infos.ips = Utils.givesLocalIps();
        }

        // Add the tasks infos
        if (tasksInfos) {
          infos.tasksInfos = tasksInfos;
        }

        // Add the cpu and memory Load
        if (cpuAndMemory) {
          try {
            const ret = await Utils.getCpuAndMemoryLoad();

            infos.cpuAndMemory = ret;

            this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
          } catch (err) {
            infos.cpuAndMemory = err instanceof Errors ? (err.serialize && err.serialize()) : String(err);

            this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
          }

          return false;
        }

        return this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
      },
    });
  }

  /**
   * Connect a task to an other task
   */
  protected protocolConnectTasks(body: {
    idTask: string;
    idTaskToConnect: string;
    args: ArgsObject;
  }): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          CONNECT_TASK_TO_TASK,
          START_TASK,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        // We should have something like { idTask: String, idTaskToConnect: String, args: {} }
        if (!body || !body.idTask || !body.idTaskToConnect || !body.args) {
          // Error in message
          return this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, new Errors('E7006')
            .serialize());
        }

        try {
          const handler: TaskHandler | false = this.getTaskHandler();

          if (handler === false) {
            throw new Errors('EXXXX', 'no task handler');
          }

          const task = await handler.getTask(body.idTask);

          // We get the task
          // Error if the task is not active
          if (!task.isActive()) {
            this.sendHeadBodyMessageToServer(START_TASK, new Errors('E7009', `idTask: ${body.idTask}`));
          } else {
            // Ask the connection to be made
            await task.connectToTask(body.idTaskToConnect, body.args);
          }

          this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, '');
        } catch (err) {
          this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, err.serialize());
        }
      },
    });
  }

  /**
   * We got a news from the master. We have to spread the news to every tasks we hold.
   */
  protected static protocolGenericChannelData(body: {
    dataName: string;
    data: any;
    timestamp: number;
    limitToTaskList: string[];
  }): void {
    // For itself tasks
    RoleAndTask.getInstance()
      .spreadDataToEveryLocalTask(body);
  }

  /**
   * We got a news about PROGRAM state change
   * We tell all our tasks about the change and send a result of spread to the master
   */
  protected protocolStateChange(body: {
    programState: ProgramState;
    oldProgramState: ProgramState;
  }): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          STATE_CHANGE,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        // We should have something like { programState: any }
        if (!body || !body.programState || !body.oldProgramState) {
          // Error in message
          return this.sendHeadBodyMessageToServer(STATE_CHANGE, new Errors('E7006')
            .serialize());
        }

        try {
          // Store the new state
          await RoleAndTask.getInstance()
            .changeProgramState(body.programState.id);

          const handler: TaskHandler | false = this.getTaskHandler();

          if (handler === false) {
            throw new Errors('EXXXX', 'no task handler');
          }

          // Apply the new state
          await handler.applyNewProgramState(body.programState, body.oldProgramState);

          // New state get successfuly spread
          return this.sendHeadBodyMessageToServer(STATE_CHANGE, '');
        } catch (err) {
          // New state didn't get successfuly spread
          this.sendHeadBodyMessageToServer(STATE_CHANGE, err instanceof Errors ? (err.serialize && err.serialize()) : String(err));
        }
      },
    });
  }

  /**
   * We got an error that happended into the slave process
   * We send the error to the master, to make it do something about it
   */
  public tellMasterErrorHappened(err: Errors | Error): void {
    // Send the error to the master
    this.sendHeadBodyMessageToServer(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.ERROR_HAPPENED, String(new Errors(err.toString())));
  }

  /**
   * We want to take the mutex behind the given id
   */
  public takeMutex(id: string): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          TAKE_MUTEX,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        const ret = await this.sendMessageAndWaitForTheResponse({
          messageHeaderToSend: TAKE_MUTEX,

          messageBodyToSend: JSON.stringify({
            id,
          }),

          messageHeaderToGet: TAKE_MUTEX,
          isHeadBodyPattern: true,
          timeoutToGetMessage: CONSTANT.MASTER_SLAVE_MUTEX_MESSAGES_WAITING_TIMEOUT,
        });

        const json = Utils.convertStringToJSON(ret);

        if (!json || !json.error) {
          return;
        }

        throw Errors.deserialize(json.error);
      },
    });
  }

  /**
   * We want to release the mutex behind the given id
   */
  public releaseMutex(id: string): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          RELEASE_MUTEX,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        const ret = await this.sendMessageAndWaitForTheResponse({
          messageHeaderToSend: RELEASE_MUTEX,

          messageBodyToSend: JSON.stringify({
            id,
          }),

          messageHeaderToGet: RELEASE_MUTEX,
          isHeadBodyPattern: true,
          timeoutToGetMessage: CONSTANT.MASTER_SLAVE_MUTEX_MESSAGES_WAITING_TIMEOUT,
        });

        const json = Utils.convertStringToJSON(ret);

        if (!json || !json.error) {
          return;
        }

        throw Errors.deserialize(json.error);
      },
    });
  }

  /**
   * Define the protocol between master and a slaves
   */
  protected protocolMasterSlave(): void {
    const communication: ZeroMQClientDealer | false = this.getCommunicationSystem();

    if (communication === false) {
      throw new Errors('EXXXX', 'no communication');
    }

    // We listen to incoming messages
    communication.listenToIncomingMessage((dataString) => {
      const dataJSON = Utils.convertStringToJSON(dataString);
      const {
        HEAD,
        BODY,
      } = CONSTANT.PROTOCOL_KEYWORDS;

      const {
        LIST_TASKS,
        START_TASK,
        STOP_TASK,
        CONNECT_TASK_TO_TASK,
        GENERIC_CHANNEL_DATA,
        CLOSE,
        STATE_CHANGE,
        SLAVE_CONFIRMATION_INFORMATIONS,
      } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

      // Here we got all messages that comes from server (so master)
      // Check if the message answer particular message
      // If it does apply the particular job
      [
        // Check about the list of tasks
        {
          checkFunc: (): boolean => dataString === LIST_TASKS,

          // It means we get asked about our tasks list
          applyFunc: (): void => this.sendTaskList(),
        },

        // Check about the ask for infos
        {
          checkFunc: (): boolean => dataString === SLAVE_CONFIRMATION_INFORMATIONS,

          // It means we get asked about our informations
          applyFunc: (): void => this.sendConfirmationInformations(),
        },

        // Check about add a task
        {
          checkFunc: (): boolean => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === START_TASK,

          // It means we get asked about starting a task
          applyFunc: (): Promise<void> => this.protocolStartTask(dataJSON[BODY]),
        },

        // Check about connect a task to an other task
        {
          checkFunc: (): boolean => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === CONNECT_TASK_TO_TASK,
          applyFunc: (): Promise<void> => this.protocolConnectTasks(dataJSON[BODY]),
        },

        // Check about news about generic channel data
        {
          checkFunc: (): boolean => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === GENERIC_CHANNEL_DATA,
          applyFunc: (): void => Slave.protocolGenericChannelData(dataJSON[BODY]),
        },

        // Check about news about program state
        {
          checkFunc: (): boolean => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === STATE_CHANGE,
          applyFunc: (): Promise<void> => this.protocolStateChange(dataJSON[BODY]),
        },

        // Check about close order
        {
          checkFunc: (): boolean => dataString === CLOSE,
          applyFunc: async (): Promise<void> => {
            try {
              await this.stop();

              RoleAndTask.exitProgramGood();
            } catch (e) {
              Utils.displayMessage({
                str: `Exit program unproper CLOSE ORDER FAILED [${String(e)}]`,
                out: process.stderr,
              });

              RoleAndTask.exitProgramUnproperDueToError();
            }
          },
        },

        // Check about close a task
        {
          checkFunc: (): boolean => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === STOP_TASK,
          applyFunc: (): Promise<void> => this.protocolStopTask(dataJSON[BODY]),
        }].forEach((x) => {
          if (x.checkFunc()) {
            x.applyFunc();
          }
        });
    }, this);
  }

  /**
   * Send the cpu and memory load to the server periodically
   */
  protected infiniteSendCpuAndMemoryLoadToMaster(): void {
    if (this.intervalFdCpuAndMemory) {
      return;
    }

    if (CONSTANT.DISPLAY_CPU_MEMORY_CHANGE_TIME) {
      // When we connect, we send our infos to the master
      this.intervalFdCpuAndMemory = setInterval(() => {
        this.protocolSendMyInfosToMaster({
          cpuAndMemory: true,
        });

        if (!this.active && this.intervalFdCpuAndMemory) {
          clearInterval(this.intervalFdCpuAndMemory);
          this.intervalFdCpuAndMemory = null;
        }
      }, CONSTANT.DISPLAY_CPU_MEMORY_CHANGE_TIME);
    }
  }

  /**
   * Send the cpu and memory load to the server periodically
   */
  protected infiniteSendTasksInfosToMaster(): void {
    if (this.intervalFdTasksInfos) {
      return;
    }

    // When we connect, we send our infos to the master
    this.intervalFdTasksInfos = setInterval(async () => {
      try {
        const handler: TaskHandler | false = this.getTaskHandler();

        if (handler === false) {
          throw new Errors('EXXXX', 'no task handler');
        }

        const infos = await handler.getInfosFromAllActiveTasks();

        // Send the data to the master
        this.protocolSendMyInfosToMaster({
          tasksInfos: infos,
        });

        // If the role is still active we call it back
        if (!this.active && this.intervalFdTasksInfos) {
          clearInterval(this.intervalFdTasksInfos);

          this.intervalFdTasksInfos = null;
        }
      } catch (err) {
        RoleAndTask.getInstance()
          .errorHappened(err);
      }
    }, CONSTANT.SLAVES_INFOS_CHANGE_TIME);
  }

  /**
   * Start the Slave
   */
  protected startSlave({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    identifier,
    eliotStartTime,
  }: {
    ipServer: string;
    portServer: string;
    identifier: string;
    eliotStartTime: string;
  }): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        // Create the OMQ Server
        this.communicationSystem = new ZeroMQClientDealer();

        // This time is coming from the master, it's the same among all slaves
        this.referenceStartTime = Number(eliotStartTime);

        this.protocolMasterSlave();

        // Start the communication system
        await this.communicationSystem.start({
          ipServer,
          portServer,
          transport: CONSTANT.ZERO_MQ.TRANSPORT.IPC,
          identityPrefix: identifier,
        });

        this.active = true;

        // When we connect, we send our infos to the master
        this.protocolSendMyInfosToMaster({
          ip: true,
        });

        // Every X sec get the CPU and the Memory and send it to the master
        this.infiniteSendCpuAndMemoryLoadToMaster();

        // Every X sec get infos from the active tasks and send them to the master
        this.infiniteSendTasksInfosToMaster();

        // Look at when we get connected
        this.communicationSystem.listenConnectEvent((client) => {
          RoleAndTask.getInstance()
            .displayMessage({
              str: `Connected ${client}`.yellow,
            });
        });

        // Look at when we get disconnected
        this.communicationSystem.listenDisconnectEvent(client => RoleAndTask.getInstance()
          .displayMessage({
            str: `Disconnected ${client}`.yellow,
          }));
      },
    });
  }

  public start(args: {
    ipServer: string;
    portServer: string;
    identifier: string;
    eliotStartTime: string;
  }): Promise<void> {
    return PromiseCommandPattern({
      func: () => this.startSlave(args),
    });
  }

  public stop(): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        RoleAndTask.getInstance()
          .displayMessage({
            str: 'Ask Role Slave To Stop'.cyan,
          });

        const handler: TaskHandler | false = this.getTaskHandler();

        if (handler === false) {
          throw new Errors('EXXXX', 'no task handler');
        }

        // Stop all its tasks
        await handler.stopAllTask();

        // Stop the infinite loops
        if (this.intervalFdCpuAndMemory) {
          clearInterval(this.intervalFdCpuAndMemory);
        }

        if (this.intervalFdTasksInfos) {
          clearInterval(this.intervalFdTasksInfos);
        }

        const communication: ZeroMQClientDealer | false = this.getCommunicationSystem();

        if (communication === false) {
          throw new Errors('EXXXX', 'no communication');
        }

        // Stop the communication system
        await communication.stop();

        RoleAndTask.getInstance()
          .displayMessage({
            str: 'Role Slave Stopped'.red,
          });

        this.active = false;

        return true;
      },
    });
  }

  /**
   * Send the data to the server
   */
  protected sendMessageToServer(data: string): void {
    const communication: ZeroMQClientDealer | false = this.getCommunicationSystem();

    if (communication === false) {
      throw new Errors('EXXXX', 'no communication');
    }

    communication.sendMessageToServer(data);
  }

  /**
   * Wait a specific incoming message from the server
   *
   * Messages are like: { head: Object, body: Object }
   *
   * If there is no answer before the timeout, stop waiting and send an error
   */
  protected getMessageFromServer(headString: string, timeout: number = RoleAndTask.getInstance().masterMessageWaitingTimeout): Promise<any> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        let timeoutFunction: any = false;

        const communication: ZeroMQClientDealer | false = this.getCommunicationSystem();

        if (communication === false) {
          throw new Errors('EXXXX', 'no communication');
        }

        // Function that will receive messages from the server
        const msgListener = (dataString): void => {
          const dataJSON = Utils.convertStringToJSON(dataString);

          // Here we got all messages that comes from the server
          // Check if the message answer particular message
          if (dataJSON && dataJSON[CONSTANT.PROTOCOL_KEYWORDS.HEAD] && dataJSON[CONSTANT.PROTOCOL_KEYWORDS.HEAD] === headString) {
            // Stop the timeout
            clearTimeout(timeoutFunction);

            // Stop the listening
            communication.unlistenToIncomingMessage(msgListener);

            // We get our message
            return resolve(dataJSON[CONSTANT.PROTOCOL_KEYWORDS.BODY]);
          }
        };

        // If the function get triggered, we reject an error
        timeoutFunction = setTimeout(() => {
          // Stop the listening
          communication.unlistenToIncomingMessage(msgListener);

          // Return an error
          return reject(new Errors('E7005'));
        }, timeout);

        // Listen to incoming messages
        return communication.listenToIncomingMessage(msgListener, this);
      }),
    });
  }

  /**
   * Send the given message and wait for the response
   *
   * HERE WE CREATE TWO EXECUTIONS LIFES
   *
   * Put isHeadBodyPattern = true if you want to use the headBodyPattern
   *
   * @param {Object} args
   */
  protected sendMessageAndWaitForTheResponse({
    messageHeaderToSend,
    messageBodyToSend,
    messageHeaderToGet,
    isHeadBodyPattern,

    // Can be equals to undefined -> default timeout
    timeoutToGetMessage,
  }: {
    messageHeaderToSend: string;
    messageBodyToSend: any;
    messageHeaderToGet: string;
    isHeadBodyPattern: boolean;

    // Can be equals to undefined -> default timeout
    timeoutToGetMessage?: undefined | number,
  }): Promise<any> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        let errAlreadyReturned = false;

        // Be ready to get the message from the slave before to send it the command
        this.getMessageFromServer(messageHeaderToGet, timeoutToGetMessage)
          // Job done
          .then(resolve)
          .catch((err) => {
            if (!errAlreadyReturned) {
              errAlreadyReturned = true;

              return reject(err);
            }

            return false;
          });

        // Send the command to the slave
        if (isHeadBodyPattern) {
          return this.sendHeadBodyMessageToServer(messageHeaderToSend, messageBodyToSend);
        }

        return this.sendMessageToServer(messageBodyToSend);

        // It went well, no wait getMessageFromServer to get the message
        // If the message is not coming, getMessageFromServer will timeout and result of an error

        //
        // Nothing to do here anymore Mate!
        //
      }),
    });
  }
}
