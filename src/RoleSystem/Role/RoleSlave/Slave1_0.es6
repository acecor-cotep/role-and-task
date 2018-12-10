//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import ASlave from './ASlave.js';
import CONSTANT from '../../../Utils/CONSTANT/CONSTANT.js';
import ZeroMQClientDealer from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientDealer.js';
import TaskHandler from '../../Handlers/TaskHandler.js';
import Utils from '../../../Utils/Utils.js';
import Core from '../../../Core/Core.js';
import RoleAndTask from '../../../RoleAndTask.js';

let instance = null;

/**
 * Define the Role of Slave which have a job of executant.
 *
 * Execute orders and special tasks.
 */
export default class Slave1_0 extends ASlave {
  /**
   * Ask if we want a brand new instance (If you don't create a new instance here as asked
   * you will have trouble in inheritance - child of this class)
   */
  constructor(oneshotNewInstance = false) {
    super();

    if (instance && !oneshotNewInstance) return instance;

    this.name = CONSTANT.DEFAULT_ROLE.SLAVE_ROLE.name;
    this.id = CONSTANT.DEFAULT_ROLE.SLAVE_ROLE.id;

    // Get the tasks related to the master role
    const tasks = RoleAndTask.getInstance()
      .getRoleTasks(CONSTANT.DEFAULT_ROLE.SLAVE_ROLE);

    // Define none communicationSystem for now
    this.communicationSystem = false;

    // Define all tasks handled by this role
    this.setTaskHandler(new TaskHandler(tasks));

    if (oneshotNewInstance) return this;

    instance = this;

    return instance;
  }

  /**
   * SINGLETON implementation
   * @override
   */
  static getInstance() {
    return instance || new Slave1_0();
  }

  /**
   * Get the communicationSystem
   */
  getCommunicationSystem() {
    return this.communicationSystem;
  }

  /**
   * Display a message by giving it to the master
   * @param {Object} param
   */
  displayMessage(params) {
    // If we disallow log display, stop it here
    if (!CONSTANT.DISPLAY_LOGS) return;

    this.sendHeadBodyMessageToServer(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.OUTPUT_TEXT, params);
  }

  /**
   * Send the task list to the server
   */
  sendTaskList() {
    const buildMsg = this.buildHeadBodyMessage(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS, this.getTaskHandler()
      .getTaskListStatus());

    return this.getCommunicationSystem()
      .sendMessageToServer(buildMsg);
  }

  /**
   * We send our tasks and the type of slave we are
   */
  sendConfirmationInformations() {
    const buildMsg = this.buildHeadBodyMessage(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.SLAVE_CONFIRMATION_INFORMATIONS, {
      tasks: this.getTaskHandler()
        .getTaskListStatus(),

      role: {
        id: this.id,
        name: this.name,
      },
    });

    return this.getCommunicationSystem()
      .sendMessageToServer(buildMsg);
  }

  /**
   * We get asked to spread a news to every slave tasks -> Send the request to master
   * @param {String} dataName
   * @param {Object} data
   * @param {Date} timestamp
   */
  sendDataToEveryELIOTTaskWhereverItIs(data) {
    const buildMsg = this.buildHeadBodyMessage(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, data);

    this.getCommunicationSystem()
      .sendMessageToServer(buildMsg);
  }

  /**
   * Send message to server using head/body pattern
   * @param {String} head
   * @param {Object} body
   */
  sendHeadBodyMessageToServer(head, body) {
    const buildMsg = this.buildHeadBodyMessage(head, body);

    // Error in message
    return this.getCommunicationSystem()
      .sendMessageToServer(buildMsg);
  }

  /**
   * Start a task
   * @param {{idTask: String, args: Object}} body
   */
  async protocolStartTask(body) {
    const {
      START_TASK,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    // We should have something like { idTask: String, args: {} }
    if (!body || !body.idTask || !body.args) {
      // Error in message
      return this.sendHeadBodyMessageToServer(START_TASK, new Error('E7006')
        .serialize());
    }

    try {
      await this.getTaskHandler()
        .startTask(body.idTask, {
          ...body.args,
          role: this,
        });

      // Task get successfuly added
      this.sendHeadBodyMessageToServer(START_TASK, '');
    } catch (err) {
      this.sendHeadBodyMessageToServer(START_TASK, err.serialize());
    }

    return false;
  }

  /**
   * Stop a task
   * @param {Object} body
   */
  async protocolStopTask(body) {
    const {
      STOP_TASK,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    // We should have something like { idTask: String, args: {} }
    if (!body || !body.idTask || !body.args) {
      // Error in message
      return this.sendHeadBodyMessageToServer(STOP_TASK, new Error('E7006')
        .serialize());
    }

    try {
      await this.getTaskHandler()
        .stopTask(body.idTask, body.args);

      // Task get successfuly stopped
      this.sendHeadBodyMessageToServer(STOP_TASK, '');
    } catch (err) {
      this.sendHeadBodyMessageToServer(STOP_TASK, err.serialize());
    }

    return false;
  }

  /**
   * As a slave we send our infos to the master throught this method
   * Infos are: IP Address, CPU and memory Load, tasks infos ...
   */
  async protocolSendMyInfosToMaster({
    ip,
    cpuAndMemory,
    tasksInfos,
  }) {
    const {
      INFOS_ABOUT_SLAVES,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    const infos = {};

    // Add the ip address
    if (ip) infos.ips = Utils.givesLocalIps();

    // Add the tasks infos
    if (tasksInfos) infos.tasksInfos = tasksInfos;

    // Add the cpu and memory Load
    if (cpuAndMemory) {
      try {
        const ret = await Utils.getCpuAndMemoryLoad();

        infos.cpuAndMemory = ret;

        this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
      } catch (err) {
        infos.cpuAndMemory = err.serialize();

        this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
      }

      return false;
    }

    return this.sendHeadBodyMessageToServer(INFOS_ABOUT_SLAVES, infos);
  }

  /**
   * Connect a task to an other task
   * @param {Object} body
   */
  async protocolConnectTasks(body) {
    const {
      CONNECT_TASK_TO_TASK,
      START_TASK,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    // We should have something like { idTask: String, idTaskToConnect: String, args: {} }
    if (!body || !body.idTask || !body.idTaskToConnect || !body.args) {
      // Error in message
      return this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, new Error('E7006')
        .serialize());
    }

    try {
      const task = await this.getTaskHandler()
        .getTask(body.idTask);

      // We get the task
      // Error if the task is not active
      if (!task.isActive()) {
        await this.sendHeadBodyMessageToServer(START_TASK, new Error(`E7009 : idTask: ${body.idTask}`));
      } else {
        // Ask the connection to be made
        await task.connectToTask(body.idTaskToConnect, body.args);
      }

      this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, '');
    } catch (err) {
      this.sendHeadBodyMessageToServer(CONNECT_TASK_TO_TASK, err.serialize());
    }

    return false;
  }

  /**
   * We got a news from the master. We have to spread the news to every tasks we hold.
   * @param {{dataName: String, data: Object, timestamp: Date}} body
   */
  static protocolGenericChannelData(body) {
    // For itself tasks
    Core.getInstance()
      .spreadDataToEveryLocalTask(body);
  }

  /**
   * We got a news about ELIOT state change
   * We tell all our tasks about the change and send a result of spread to the master
   * @param {{ eliotState: Number, oldEliotState: Number }} body
   */
  async protocolStateChange(body) {
    const {
      STATE_CHANGE,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    // We should have something like { eliotState: Number }
    if (!body || !body.eliotState || !body.oldEliotState) {
      // Error in message
      return this.sendHeadBodyMessageToServer(STATE_CHANGE, new Error('E7006')
        .serialize());
    }

    try {
      // Store the new state
      await Core.getInstance()
        .changeEliotState(body.eliotState);

      // Apply the new state
      await this.getTaskHandler()
        .applyNewEliotState(body.eliotState, body.oldEliotState);

      // New state get successfuly spread
      return this.sendHeadBodyMessageToServer(STATE_CHANGE, '');
    } catch (err) {
      // New state didn't get successfuly spread
      this.sendHeadBodyMessageToServer(STATE_CHANGE, err.serialize());
    }

    return false;
  }

  /**
   * We got an error that happended into the slave process
   * We send the error to the master, to make it do something about it
   * @param {Error)} err
   */
  tellMasterErrorHappened(err) {
    // Send the error to the master
    this.sendHeadBodyMessageToServer(CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.ERROR_HAPPENED, String(new Error(err)));
  }

  /**
   * Tell the master that the database initialization is done
   */
  async databaseIntializationDone() {
    const {
      DB_INIT_DONE,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    const ret = await this.sendMessageAndWaitForTheResponse({
      messageHeaderToSend: DB_INIT_DONE,
      messageBodyToSend: '',
      messageHeaderToGet: DB_INIT_DONE,
      isHeadBodyPattern: true,
      timeoutToGetMessage: CONSTANT.MASTER_SLAVE_DB_INIT_MESSAGES_WAITING_TIMEOUT,
    });

    const json = Utils.convertStringToJSON(ret);

    if (!json || !json.error) return true;

    throw new Error('Deserialized');
    // throw Errors.deserialize(json.error);
  }

  /**
   * Ask the master to perform a database initialization
   */
  async askForDatabaseInitialization() {
    const {
      ASK_DB_INIT,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    const ret = await this.sendMessageAndWaitForTheResponse({
      messageHeaderToSend: ASK_DB_INIT,
      messageBodyToSend: '',
      messageHeaderToGet: ASK_DB_INIT,
      isHeadBodyPattern: true,
      timeoutToGetMessage: CONSTANT.MASTER_SLAVE_DB_INIT_MESSAGES_WAITING_TIMEOUT,
    });

    const json = Utils.convertStringToJSON(ret);

    if (!json || !json.error) return true;

    return new Error('Deserialized');

    // return Errors.deserialize(json.error);
  }

  /**
   * Ask the master to perform a database connection change
   */
  async askForDatabaseConnectionChange(newLogsToApply) {
    const {
      ASK_DATABASE_CONNECTION_CHANGE,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    const ret = await this.sendMessageAndWaitForTheResponse({
      messageHeaderToSend: ASK_DATABASE_CONNECTION_CHANGE,
      messageBodyToSend: newLogsToApply,
      messageHeaderToGet: ASK_DATABASE_CONNECTION_CHANGE,
      isHeadBodyPattern: true,
      timeoutToGetMessage: CONSTANT.MASTER_SLAVE_DB_INIT_MESSAGES_WAITING_TIMEOUT,
    });

    const json = Utils.convertStringToJSON(ret);

    if (!json || !json.error) return true;

    return new Error('Deserialized');
    // return Errors.deserialize(json.error);
  }

  /**
   * We get an order of setting up new database connections
   */
  async protocolDatabaseConnectionChange(body) {
    const {
      CHANGE_DATABASE_CONNECTION,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    try {
      // Apply the new connection
      await Core.getInstance()
        .changeDatabaseConnection(body);

      // New connection get successfuly setted
      this.sendHeadBodyMessageToServer(CHANGE_DATABASE_CONNECTION, '');
    } catch (err) {
      // New state didn't get successfuly setted
      this.sendHeadBodyMessageToServer(CHANGE_DATABASE_CONNECTION, err.serialize());
    }
  }

  /**
   * Define the protocol between master and a slaves
   */
  protocolMasterSlave() {
    // We listen to incoming messages
    this.getCommunicationSystem()
      .listenToIncomingMessage((dataString) => {
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
          CHANGE_DATABASE_CONNECTION,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        // Here we got all messages that comes from server (so master)
        // Check if the message answer particular message
        // If it does apply the particular job
        [{
          // Check about the list of tasks
          checkFunc: () => dataString === LIST_TASKS,

          // It means we get asked about our tasks list
          applyFunc: () => this.sendTaskList(),
        }, {
          // Check about the ask for infos
          checkFunc: () => dataString === SLAVE_CONFIRMATION_INFORMATIONS,

          // It means we get asked about our informations
          applyFunc: () => this.sendConfirmationInformations(),
        }, {
          // Check about add a task
          checkFunc: () => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === START_TASK,

          // It means we get asked about starting a task
          applyFunc: () => this.protocolStartTask(dataJSON[BODY]),
        }, {
          // Check about connect a task to an other task
          checkFunc: () => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === CONNECT_TASK_TO_TASK,
          applyFunc: () => this.protocolConnectTasks(dataJSON[BODY]),
        }, {
          // Check about news about generic channel data
          checkFunc: () => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === GENERIC_CHANNEL_DATA,
          applyFunc: () => Slave1_0.protocolGenericChannelData(dataJSON[BODY]),
        }, {
          // Check about news about eliot state
          checkFunc: () => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === STATE_CHANGE,
          applyFunc: () => this.protocolStateChange(dataJSON[BODY]),
        }, {
          // Check about news about eliot connection change
          checkFunc: () => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === CHANGE_DATABASE_CONNECTION,
          applyFunc: () => this.protocolDatabaseConnectionChange(dataJSON[BODY]),
        }, {
          // Check about close order
          checkFunc: () => dataString === CLOSE,
          applyFunc: async () => {
            try {
              await this.stop();

              Core.exitEliotGood();
            } catch (e) {
              Utils.displayMessage({
                str: `Exit eliot unproper CLOSE ORDER FAILED [${String(e)}]`,
                out: process.stderr,
              });

              Core.exitEliotUnproperDueToError();
            }
          },
        }, {
          // Check about close a task
          checkFunc: () => dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === STOP_TASK,
          applyFunc: () => this.protocolStopTask(dataJSON[BODY]),
        }].forEach((x) => {
          if (x.checkFunc()) x.applyFunc();
        });
      });
  }

  /**
   * Send the cpu and memory load to the server periodically
   */
  infiniteSendCpuAndMemoryLoadToMaster() {
    if (this.intervalFdCpuAndMemory) return;

    if (CONSTANT.DISPLAY_CPU_MEMORY_CHANGE_TIME) {
      // When we connect, we send our infos to the master
      this.intervalFdCpuAndMemory = setInterval(() => {
        this.protocolSendMyInfosToMaster({
          cpuAndMemory: true,
        });

        if (!this.active && this.intervalFdCpuAndMemory) {
          clearInterval(this.intervalFdCpuAndMemory);
          this.intervalFdCpuAndMemory = false;
        }
      }, CONSTANT.DISPLAY_CPU_MEMORY_CHANGE_TIME);
    }
  }

  /**
   * Send the cpu and memory load to the server periodically
   */
  infiniteSendTasksInfosToMaster() {
    if (this.intervalFdTasksInfos) return;

    // When we connect, we send our infos to the master
    this.intervalFdTasksInfos = setInterval(async () => {
      try {
        const infos = await this.taskHandler.getInfosFromAllActiveTasks();

        // Send the data to the master
        this.protocolSendMyInfosToMaster({
          tasksInfos: infos,
        });

        // If the role is still active we call it back
        if (!this.active && this.intervalFdTasksInfos) {
          clearInterval(this.intervalFdTasksInfos);

          this.intervalFdTasksInfos = false;
        }
      } catch (err) {
        Core.getInstance()
          .errorHappened(err);
      }
    }, CONSTANT.SLAVES_INFOS_CHANGE_TIME);
  }

  /**
   * Start the slave1_0
   * @param {Object} args
   * @override
   */
  async startSlave1_0({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
    identifier,
  }) {
    // Create the OMQ Server
    this.communicationSystem = new ZeroMQClientDealer();

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
      Core.getInstance()
        .displayMessage({
          str: `Connected ${client}`.yellow,
        });
    });

    // Look at when we get disconnected
    this.communicationSystem.listenDisconnectEvent(client => Core.getInstance()
      .displayMessage({
        str: `Disconnected ${client}`.yellow,
      }));

    return true;
  }

  /**
   * ELIOT start to play the role
   * @param {Object} args
   * @override
   */
  async start(args) {
    return this.startSlave1_0(args);
  }

  /**
   * ELIOT stop to play the role
   * @param {Object} args
   * @override
   */
  async stop() {
    Core.getInstance()
      .displayMessage({
        str: 'Ask Role Slave To Stop'.cyan,
      });

    // Stop all its tasks
    await this.getTaskHandler()
      .stopAllTask();

    // Stop the infinite loops
    if (this.intervalFdCpuAndMemory) clearInterval(this.intervalFdCpuAndMemory);

    if (this.intervalFdTasksInfos) clearInterval(this.intervalFdTasksInfos);

    // Stop the communication system
    await this.communicationSystem.stop();

    Core.getInstance()
      .displayMessage({
        str: 'Role Slave Stopped'.red,
      });

    this.active = false;

    return true;
  }

  /**
   * Send the data to the server
   * @param {String} data
   */
  sendMessageToServer(data) {
    this.getCommunicationSystem()
      .sendMessageToServer(data);
  }

  /**
   * Wait a specific incoming message from the server
   *
   * Messages are like: { head: Object, body: Object }
   *
   * If there is no answer before the timeout, stop waiting and send an error
   * @param {String} headString
   * @param {Number} timeout - in ms
   */
  getMessageFromServer(headString, timeout = CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT) {
    return new Promise((resolve, reject) => {
      let timeoutFunction = false;

      // Function that will receive messages from the server
      const msgListener = (dataString) => {
        const dataJSON = Utils.convertStringToJSON(dataString);

        // Here we got all messages that comes from the server
        // Check if the message answer particular message
        if (dataJSON && dataJSON[CONSTANT.PROTOCOL_KEYWORDS.HEAD] && dataJSON[CONSTANT.PROTOCOL_KEYWORDS.HEAD] === headString) {
          // Stop the timeout
          clearTimeout(timeoutFunction);

          // Stop the listening
          this.getCommunicationSystem()
            .unlistenToIncomingMessage(msgListener);

          // We get our message
          return resolve(dataJSON[CONSTANT.PROTOCOL_KEYWORDS.BODY]);
        }

        return false;
      };

      // If the function get triggered, we reject an error
      timeoutFunction = setTimeout(() => {
        // Stop the listening
        this.getCommunicationSystem()
          .unlistenToIncomingMessage(msgListener);

        // Return an error
        return reject(new Error('E7005'));
      }, timeout);

      // Listen to incoming messages
      return this.getCommunicationSystem()
        .listenToIncomingMessage(msgListener);
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
  sendMessageAndWaitForTheResponse({
    messageHeaderToSend,
    messageBodyToSend,
    messageHeaderToGet,
    isHeadBodyPattern,

    // Can be equals to undefined -> default timeout
    timeoutToGetMessage,
  }) {
    return new Promise((resolve, reject) => {
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
      if (isHeadBodyPattern) return this.sendHeadBodyMessageToServer(messageHeaderToSend, messageBodyToSend);

      return this.sendMessageToServer(messageBodyToSend);

      // It went well, no wait getMessageFromServer to get the message
      // If the message is not coming, getMessageFromServer will timeout and result of an error

      //
      // Nothing to do here anymore Mate!
      //
    });
  }
}
