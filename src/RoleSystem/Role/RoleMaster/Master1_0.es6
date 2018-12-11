//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import childProcess from 'child_process';
import AMaster from './AMaster.js';
import CONSTANT from '../../../Utils/CONSTANT/CONSTANT.js';
import TaskHandler from '../../Handlers/TaskHandler.js';
import ZeroMQServerRouter from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter.js';
import Utils from '../../../Utils/Utils.js';
import RoleAndTask from '../../../RoleAndTask.js';

let instance = null;

/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 */
export default class Master1_0 extends AMaster {
  constructor() {
    super();

    if (instance) return instance;

    this.name = CONSTANT.DEFAULT_ROLE.MASTER_ROLE.name;
    this.id = CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id;

    this.pathToEntryFile = false;

    // Get the tasks related to the master role
    const tasks = RoleAndTask.getInstance()
      .getRoleTasks(CONSTANT.DEFAULT_ROLE.MASTER_ROLE.id);

    // Define all tasks handled by this role
    this.setTaskHandler(new TaskHandler(tasks));

    this.initProperties();

    instance = this;

    return instance;
  }

  /**
   * Init the properties
   */
  initProperties() {
    // Define none communicationSystem for now
    this.communicationSystem = false;

    // Array of current approved slaves
    this.slaves = [];

    // Array of slaves that are in the confirmation process
    this.notConfirmedSlaves = [];

    // Array that contains the relation between console process ptr and eliotIdentifier
    // We use it too when there is no console launch, because it work with both soluce
    this.consoleChildObjectPtr = [];

    // Functions called when something happend to a slave connection
    this.newConnectionListeningFunction = [];
    this.newDisconnectionListeningFunction = [];

    // Data we keep as attribute to give to handleEliotTask later
    this.cpuUsageAndMemory = false;
    this.tasksInfos = false;
  }

  /**
   * Get the communicationSystem
   */
  getCommunicationSystem() {
    return this.communicationSystem;
  }

  /**
   * SINGLETON implementation
   * @override
   */
  static getInstance() {
    return instance || new Master1_0();
  }

  /**
   * Pull a function that get fired when a slave get connected
   */
  unlistenSlaveConnectionEvent(func) {
    this.newConnectionListeningFunction = this.newConnectionListeningFunction.filter(x => x.func !== func);
  }

  /**
   * Pull a function that get fired when a slave get disconnected
   */
  unlistenSlaveDisconnectionEvent(func) {
    this.newDisconnectionListeningFunction = this.newDisconnectionListeningFunction.filter(x => x.func !== func);
  }

  /**
   * Push a function that get fired when a slave get connected
   */
  listenSlaveConnectionEvent(func, context) {
    this.newConnectionListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Push a function that get fired when a slave get disconnected
   */
  listenSlaveDisconnectionEvent(func) {
    this.newDisconnectionListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Return the array that contains non-confirmed slaves
   */
  getNonConfirmedSlaves() {
    return this.notConfirmedSlaves;
  }

  /**
   *  Get an array that contains confirmed slaves
   */
  getSlaves() {
    return this.slaves;
  }

  /**
   * We get asked to spread a news to every slave tasks and our tasks
   *
   * WARNING - DO NOT SEND IT TO NON-REGULAR SLAVES (CRON_EXECUTOR_ROLE FOR EXAMPLE)
   *
   * @param {[Byte]} clientIdentityByte
   * @param {String} clientIdentityString
   * @param {Object} data
   */
  sendDataToEveryELIOTTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, body) {
    const regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();

    // Open the body to get the list of tasks we limit the spread on
    const {
      limitToTaskList,
    } = body;


    // For each slave
    regularSlaves.forEach((x) => {
      // Only send the data to the slaves that holds a tasks that need to know about the message
      if (!limitToTaskList || x.tasks.some(y => y.isActive && limitToTaskList.includes(y.id))) {
        // Send a message to every running slaves
        this.sendMessageToSlaveHeadBodyPattern(x.eliotIdentifier, CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, body);
      }
    });

    // For itself tasks
    RoleAndTask.getInstance()
      .spreadDataToEveryLocalTask(body);
  }

  /**
   * We get asked to spread a news to every slave tasks and our tasks
   */
  sendDataToEveryELIOTTaskWhereverItIs(data) {
    this.sendDataToEveryELIOTTaskWhereverItIsLowLevel(false, false, data);
  }

  /**
   * Tell the handleEliotTask about something happend in slaves
   */
  tellHandleEliotTaskAboutSlaveError(clientIdentityString, err) {
    const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);

    if (!slave) return;

    slave.error = err;
    this.somethingChangedAboutSlavesOrI();
  }

  /**
   * An error happended into a slave, what do we do?
   * @param {Array} clientIdentityByte
   * @param {String} clientIdentityString
   * @param {String} body
   */
  async errorHappenedIntoSlave(clientIdentityByte, clientIdentityString, body) {
    // const err = Errors.deserialize(body);
    const err = new Error('Deserialized');

    // Display the error
    Utils.displayMessage({
      str: String((err && err.stack) || err),
      out: process.stderr,
    });

    try {
      // Get the client that got the problem
      // We try to change the eliot state to error
      await RoleAndTask.getInstance()
        .changeEliotState(CONSTANT.ELIOT_STATE.ERROR);

      // We goodly changed the eliot state
      // Add informations on error

      Utils.displayMessage({
        str: String((err && err.stack) || err),
        out: process.stderr,
      });

      // Tell the task handleEliot that there had been an error for the slave
      this.tellHandleEliotTaskAboutSlaveError(clientIdentityString, err);

      // If the errors are supposed to be fatal, exit!
      if (CONSTANT.MAKES_ERROR_FATAL) {
        RoleAndTask.exitEliotUnproperDueToError();
      }
      // We leave the process because something get broken
    } catch (errNested) {
      Utils.displayMessage({
        str: 'Exit eliot unproper ERROR HAPPENED IN SLAVE',
        out: process.stderr,
      });

      Utils.displayMessage({
        str: String((errNested && errNested.stack) || errNested),
        out: process.stderr,
      });

      RoleAndTask.exitEliotUnproperDueToError();
    }
  }

  /**
   * Handle a slave that ask for database initialization
   * @param {Array} clientIdentityByte
   * @param {String} clientIdentityString
   */
  async protocolHandleDatabaseInitializationAsk(clientIdentityByte, clientIdentityString) {
    const {
      ASK_DB_INIT,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);

    try {
      await RoleAndTask.getInstance()
        .askForDatabaseInitialization();

      this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, ASK_DB_INIT, JSON.stringify({
        error: false,
      }));
    } catch (err) {
      this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, ASK_DB_INIT, JSON.stringify({
        error: err.serialize(),
      }));
    }
  }

  /**
   * Handle a slave that say the database initialization is done
   * @param {Array} clientIdentityByte
   * @param {String} clientIdentityString
   */
  async protocolHandleDatabaseInitializationDone(clientIdentityByte, clientIdentityString) {
    const {
      DB_INIT_DONE,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);

    if (!slave) {
      return this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, DB_INIT_DONE, JSON.stringify({
        error: String(new Error('SLAVE_ERROR')),
      }));
    }

    try {
      await RoleAndTask.getInstance()
        .databaseIntializationDone();

      this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, DB_INIT_DONE, JSON.stringify({
        error: false,
      }));
    } catch (err) {
      this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, DB_INIT_DONE, JSON.stringify({
        error: err.serialize(),
      }));
    }

    return false;
  }

  /**
   * Handle a slave that ask for database connection change
   * @param {Array} clientIdentityByte
   * @param {String} clientIdentityString
   */
  async protocolHandleDatabaseConnectionChangeAsk(clientIdentityByte, clientIdentityString, body) {
    const {
      ASK_DATABASE_CONNECTION_CHANGE,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);

    try {
      await RoleAndTask.getInstance()
        .askForDatabaseConnectionChange(body);

      this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, ASK_DATABASE_CONNECTION_CHANGE, JSON.stringify({
        error: false,
      }));
    } catch (err) {
      this.sendMessageToSlaveHeadBodyPattern(slave.eliotIdentifier, ASK_DATABASE_CONNECTION_CHANGE, JSON.stringify({
        error: err.serialize(),
      }));
    }
  }

  /**
   * Ask every slave to perform a connection data change and do it yourself
   */
  async askForDatabaseConnectionChange(newLogsToApply) {
    const regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();

    // For each slave
    // Send a message to every running slaves
    const rets = await Promise.all(regularSlaves.map(x => this.sendMessageAndWaitForTheResponse({
      identifierSlave: x.eliotIdentifier,
      isHeadBodyPattern: true,
      messageHeaderToSend: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.CHANGE_DATABASE_CONNECTION,
      messageBodyToSend: newLogsToApply,
      messageHeaderToGet: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.CHANGE_DATABASE_CONNECTION,
    })));

    // We get either an errors object or an error
    if (rets.some(x => x !== '')) {
      // We got an error
      return rets.find(x => x !== '');
    }

    // We change our own database connection
    await RoleAndTask.getInstance()
      .changeDatabaseConnection(newLogsToApply);

    return false;
  }

  /**
   * Define the master/slave basic protocol
   * (Authentification)
   */
  protocolMasterSlave() {
    // Shortcuts
    const {
      HEAD,
      BODY,
    } = CONSTANT.PROTOCOL_KEYWORDS;

    const {
      SLAVE_CONFIRMATION_INFORMATIONS,
      GENERIC_CHANNEL_DATA,
      OUTPUT_TEXT,
      INFOS_ABOUT_SLAVES,
      ERROR_HAPPENED,
      ASK_DB_INIT,
      DB_INIT_DONE,
      ASK_DATABASE_CONNECTION_CHANGE,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    // Listen at new Socket connection
    //
    // 1/ Check if the new slave have a correct identifier
    // 2/ Ask the slave for running tasks
    // 3/ Get the slave answer
    // 4/ Add the slave into handled slave
    //
    this.getCommunicationSystem()
      .listenClientConnectionEvent((clientIdentityByte, clientIdentityString) => {
        const [
          eliotIdentifier,
          clientPID,
        ] = clientIdentityString.split('_');

        // Look at the identity of the slave (and if we have duplicate)
        if (this.slaves.find(x => x.eliotIdentifier === eliotIdentifier) ||
          this.notConfirmedSlaves.find(x => x.eliotIdentifier === eliotIdentifier)) {
          // Identity already in use by an other slave
          // Close the connection
          RoleAndTask.getInstance()
            .displayMessage({
              str: `[${this.name}] Refuse slave cause of identity`.cyan,
            });

          return this.getCommunicationSystem()
            .closeConnectionToClient(clientIdentityByte, clientIdentityString);
        }

        // So here the client do not exist already and the identifier is free

        // Add the slave into the declared not confirmed array
        this.notConfirmedSlaves.push({
          clientIdentityString,
          clientIdentityByte,
          eliotIdentifier,
          clientPID,
          tasks: [],
          error: false,
        });

        // Ask the slaves about its tasks
        return this.getCommunicationSystem()
          .sendMessageToClient(clientIdentityByte, clientIdentityString, SLAVE_CONFIRMATION_INFORMATIONS);
      });

    // Listen to slaves disconnection
    this.getCommunicationSystem()
      .listenClientDisconnectionEvent((clientIdentityString) => {
        this.slaves = this.slaves.filter((x) => {
          if (x.clientIdentityString === clientIdentityString) {
            RoleAndTask.getInstance()
              .displayMessage({
                str: `[${this.name}] Slave get removed (connection)`.red,
              });

            // Fire when a slave get disconnected
            Utils.fireUp(this.newDisconnectionListeningFunction, [x]);

            return false;
          }

          return true;
        });

        this.notConfirmedSlaves = this.notConfirmedSlaves.filter((x) => {
          if (x.clientIdentityString === clientIdentityString) {
            RoleAndTask.getInstance()
              .displayMessage({
                str: `[${this.name}] Non-confirmed slave get removed (connection)`.red,
              });

            // Fire when a slave get disconnected
            Utils.fireUp(this.newDisconnectionListeningFunction, [x]);

            return false;
          }

          return true;
        });
      });

    // Confirm a slave that wasn't
    const confirmSlave = (clientIdentityByte, clientIdentityString, dataJSON) => {
      const index = this.notConfirmedSlaves.findIndex(x => x.clientIdentityString === clientIdentityString);

      if (index === -1) return;

      // Confirm the slave
      const slave = this.notConfirmedSlaves[index];

      slave.tasks = dataJSON[BODY].tasks;
      slave.role = dataJSON[BODY].role;

      this.slaves.push(slave);

      this.notConfirmedSlaves.splice(index, 1);

      // Fire when a slave get connected
      Utils.fireUp(this.newConnectionListeningFunction, [slave]);
    };

    // We listen to incoming messages
    this.getCommunicationSystem()
      .listenToIncomingMessage((clientIdentityByte, clientIdentityString, dataString) => {
        const dataJSON = Utils.convertStringToJSON(dataString);

        // Here we got all messages that comes from clients (so slaves)
        // Check if the message answer particular message
        // If it does apply the particular job
        [{
          //
          // Check about the slave infos
          //
          checkFunc: () => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === SLAVE_CONFIRMATION_INFORMATIONS),
          // It means we get the tasks list
          applyFunc: () => confirmSlave(clientIdentityByte, clientIdentityString, dataJSON),
        }, {
          //
          // Check about generic news
          //
          checkFunc: () => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === GENERIC_CHANNEL_DATA),
          applyFunc: () => this.sendDataToEveryELIOTTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        }, {
          //
          // Check about messages to display
          //
          checkFunc: () => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === OUTPUT_TEXT),
          applyFunc: () => this.displayMessage(dataJSON[BODY]),
        }, {
          //
          // Check about infos about slaves
          //
          checkFunc: () => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === INFOS_ABOUT_SLAVES),
          applyFunc: () => this.infosAboutSlaveIncomming(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        }, {
          //
          // Check about error happened into slave
          //
          checkFunc: () => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ERROR_HAPPENED),
          applyFunc: () => this.errorHappenedIntoSlave(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        }, {
          //
          // Check about slave asking for DB initialization
          //
          checkFunc: () => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ASK_DB_INIT),
          applyFunc: () => this.protocolHandleDatabaseInitializationAsk(clientIdentityByte, clientIdentityString),
        }, {
          //
          // Check about slave asking for DB initialization
          //
          checkFunc: () => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === DB_INIT_DONE),
          applyFunc: () => this.protocolHandleDatabaseInitializationDone(clientIdentityByte, clientIdentityString),
        }, {
          //
          // Check about slave asking for DB update startup
          //
          checkFunc: () => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ASK_DATABASE_CONNECTION_CHANGE),
          applyFunc: () => this.protocolHandleDatabaseConnectionChangeAsk(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        }].forEach((x) => {
          if (x.checkFunc()) x.applyFunc();
        });
      });
  }

  /**
   * We got news about a slave -> infos
   * Store it and call HandleEliotTask if it's up
   * @param {Object} clientIdentityByte
   * @param {String} clientIdentityString
   * @param {Object} data
   */
  infosAboutSlaveIncomming(clientIdentityByte, clientIdentityString, data) {
    // Get the right slave
    const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);
    const notConfirmedSlave = this.notConfirmedSlaves.find(x => x.clientIdentityString === clientIdentityString);

    const ptr = slave || notConfirmedSlave;

    if (!ptr) return;

    if (!ptr.moreInfos) ptr.moreInfos = {};

    // Apply values to moreInfos
    [
      'cpuAndMemory',
      'ips',
      'tasksInfos',
    ]
    .forEach((x) => {
      // To get the 0 value
      if (data[x] !== void 0) ptr.moreInfos[x] = data[x];
    });

    // Tell something changed in the conf
    this.somethingChangedAboutSlavesOrI();
  }

  /**
   * Returns in an array the whole system pids (Master + Slaves processes)
   */
  getFullSystemPids() {
    return new Promise((resolve) => {
      resolve([
        String(process.pid),
        ...this.slaves.map(x => String(x.clientPID)),
      ]);
    });
  }

  /**
   * Connect the second Task to the first one
   * @param {String} idTaskToConnectTo
   * @param {String} idTaskToConnect
   * @param {Object} args
   */
  async connectMasterToTask(idTaskToConnectTo, idTaskToConnect, args) {
    try {
      RoleAndTask.getInstance()
        .displayMessage({
          str: Utils.monoline([
              `[${this.name}] Ask Master to connect the Task N°${idTaskToConnect}`,
              ` to the Task N°${idTaskToConnectTo}`,
            ])
            .blue,
        });

      const task = await this.getTaskHandler()
        .getTask(idTaskToConnectTo);

      // We get the task
      // Error if the task is not active
      if (!task.isActive()) {
        throw new Error(`E7009 : idTask: ${idTaskToConnectTo}`);
      }

      // Ask the connection to be made
      const connection = task.connectToTask(idTaskToConnect, args);

      RoleAndTask.getInstance()
        .displayMessage({
          str: Utils.monoline([
              `[${this.name}] Task N°${idTaskToConnect} correctly connected to Task `,
              `N°${idTaskToConnectTo} in Master`,
            ])
            .green,
        });

      return connection;
    } catch (err) {
      RoleAndTask.getInstance()
        .displayMessage({
          str: Utils.monoline([
              `[${this.name}] Task N°${idTaskToConnect} failed to be connected`,
              ` to Task N°${idTaskToConnectTo} in Master`,
            ])
            .red,
        });

      throw err;
    }
  }

  /**
   * Connect the second Task to the first one
   * @param {String} identifierSlave - Identifier of the slave that host the idTaskToConnectTo
   * @param {String} idTaskToConnectTo
   * @param {String} idTaskToConnect
   * @param {Object} args
   */
  async connectTaskToTask(identifierSlave, idTaskToConnectTo, idTaskToConnect, args) {
    const ret = await this.sendMessageAndWaitForTheResponse({
      identifierSlave,
      isHeadBodyPattern: true,
      messageHeaderToSend: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.CONNECT_TASK_TO_TASK,

      messageBodyToSend: {
        idTask: idTaskToConnectTo,
        idTaskToConnect,
        args,
      },

      messageHeaderToGet: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.CONNECT_TASK_TO_TASK,
    });

    // We get either an errors object or an error
    if (ret === '') return ret;

    throw ret;
  }

  /**
   * Modify the status of the task attached to the given identifier
   * (local data, have no impact in the real slave)
   * @param {String} identifier
   * @param {String} idTask
   * @param {Boolean} status
   */
  modifyTaskStatusToSlaveLocalArray(identifier, idTask, status) {
    this.slaves.some((x, xi) => {
      if (x.eliotIdentifier === identifier) {
        return x.tasks.some((y, yi) => {
          if (y.id === idTask) {
            this.slaves[xi].tasks[yi].isActive = status;

            return true;
          }

          return false;
        });
      }

      return false;
    });
  }

  /**
   * When called: Add a task to a slave
   * @param {String} identifier
   * @param {String} idTask
   */
  async startTaskToSlave(identifier, idTask, args = {}) {
    const ret = await this.sendMessageAndWaitForTheResponse({
      identifierSlave: identifier,
      isHeadBodyPattern: true,
      messageHeaderToSend: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK,

      messageBodyToSend: {
        idTask,
        args,
      },

      messageHeaderToGet: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK,
    });

    // We get either an errors object or an error
    if (ret === '') {
      // Modify the task status for the given slave
      this.modifyTaskStatusToSlaveLocalArray(identifier, idTask, true);

      // Say something changed
      this.somethingChangedAboutSlavesOrI();

      return ret;
    }

    // throw Errors.deserialize(ret);
    throw new Error('deserialize');
  }

  /**
   * List the existing slaves
   */
  async listSlaves() {
    return this.master.getSlave;
  }

  /**
   * List a slave tasks using its identifier (Ask the slave to it)
   * @param {String} identifier
   */
  async distantListSlaveTask(identifier) {
    return this.sendMessageAndWaitForTheResponse({
      identifierSlave: identifier,
      isHeadBodyPattern: false,
      messageHeaderToSend: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
      messageBodyToSend: {},
      messageHeaderToGet: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
    });
  }

  /**
   * List a slave tasks using its identifier (Use local data to it)
   * @param {String} identifier
   */
  async listSlaveTask(identifier) {
    // Look for the slave in confirmSlave
    const slave = this.getSlaveByEliotIdentifier(identifier);

    return slave.tasks;
  }

  /**
   * Handle the fact the eliot state change
   * We spread the data on our tasks and to our slaves
   * @param {Number} eliotState
   * @param {Number} oldEliotState
   */
  async handleEliotStateChange(eliotState, oldEliotState) {
    return Promise.all([
      // Spread to our tasks
      this.getTaskHandler()
      .applyNewEliotState(eliotState, oldEliotState),

      // Spread to slaves
      this.tellAllSlaveThatEliotStateChanged(eliotState, oldEliotState),

      // The spread n slaves went well
    ]);
  }

  /**
   * Return only the slaves that are regular slaves (not CRON_EXECUTOR_ROLE for example)
   */
  getSlavesOnlyThatAreRegularSlaves() {
    return this.slaves.filter(x => x.role.id === CONSTANT.DEFAULT_ROLE.SLAVE_ROLE.id);
  }

  /**
   * Tell all slave that the eliot state did change
   *
   * WARNING - DO NOT INCLUDE CRON_EXECUTOR_ROLE SLAVES INTO THE PIPE
   *
   * @param {Number} eliotState
   * @param {Number} oldEliotState
   */
  async tellAllSlaveThatEliotStateChanged(eliotState, oldEliotState) {
    const regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();

    return Promise.all(regularSlaves.map(x => this.tellASlaveThatEliotStateChanged(x.eliotIdentifier, eliotState, oldEliotState)));
  }

  /**
   * Tell a slave that eliot state did change
   * @param {String} slaveIdentifier
   * @param {Number} eliotState
   * @param {Number} oldEliotState
   */
  async tellASlaveThatEliotStateChanged(slaveIdentifier, eliotState, oldEliotState) {
    const {
      STATE_CHANGE,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    const ret = await this.sendMessageAndWaitForTheResponse({
      identifierSlave: slaveIdentifier,
      isHeadBodyPattern: true,
      messageHeaderToSend: STATE_CHANGE,

      messageBodyToSend: {
        eliotState,
        oldEliotState,
      },

      messageHeaderToGet: STATE_CHANGE,
      timeoutToGetMessage: CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT_STATE_CHANGE,
    });

    // We get either an errors object or an error
    if (ret === '') return ret;

    RoleAndTask.getInstance()
      .displayMessage({
        str: `[${this.name}] eliot state get not spread in Slave N°${slaveIdentifier}`.red,
      });

    throw new Error('deserialize');

    // throw Errors.deserialize(ret);
  }

  /**
   * When called: Remove an existing slave(s)
   * @param {Array} identifiersSlaves
   * @param {?Number} _i
   */
  async removeExistingSlave(identifiersSlaves) {
    return Utils.promiseQueue([
      // Close all slaves
      ...identifiersSlaves.map(x => ({
        functionToCall: this.sendMessageToSlave,

        context: this,

        args: [
          x,
          CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.CLOSE,
        ],
      })),

      // Say that something changed
      {
        functionToCall: this.somethingChangedAboutSlavesOrI,
        context: this,
      },
    ]);
  }

  /**
   * Kill a slave using its identifier
   * @param {String} eliotIdentifier
   */
  killSlave(eliotIdentifier) {
    // Look for the given identifier
    this.consoleChildObjectPtr.filter((x) => {
      if (x.eliotIdentifier === eliotIdentifier) {
        try {
          // Kill the process
          process.kill(x.pid, CONSTANT.SIGNAL_UNPROPER.SIGUSR1);

          // Remove the slave from the slave list
          this.slaves = this.slaves.filter(y => !(y.eliotIdentifier === eliotIdentifier));
        } catch (err) {
          // Ignore the error, because the slave is dead anyway to us
        }

        return false;
      }

      return true;
    });
  }

  /**
   * When called: remove a task from slave
   *
   * THIS FUNCTION HAVE SPECIAL TIMEOUT FOR SLAVE ANSWER
   *
   * @param {String} identifier
   * @param {String} idTask
   * @param {Object} args
   */
  async removeTaskFromSlave(identifier, idTask, args = {}) {
    const {
      STOP_TASK,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    RoleAndTask.getInstance()
      .displayMessage({
        str: `[${this.name}] Ask Slave N°${identifier} to stop the Task N°${idTask}`.blue,
      });

    const ret = await this.sendMessageAndWaitForTheResponse({
      identifierSlave: identifier,
      isHeadBodyPattern: true,
      messageHeaderToSend: STOP_TASK,

      messageBodyToSend: {
        idTask,
        args,
      },

      messageHeaderToGet: STOP_TASK,
      timeoutToGetMessage: CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT_STOP_TASK,
    });

    // We get either an errors object or an error
    if (ret === '') {
      RoleAndTask.getInstance()
        .displayMessage({
          str: `[${this.name}] Task N°${idTask} correctly stopped in Slave N°${identifier}`.green,
        });

      // Modify the task status for the given slave
      this.modifyTaskStatusToSlaveLocalArray(identifier, idTask, false);

      return ret;
    }

    RoleAndTask.getInstance()
      .displayMessage({
        str: `[${this.name}] Task N°${idTask} failed to be stopped to Slave N°${identifier}`.red,
      });

    throw ret;
  }

  /**
   * Display a message directly
   * @param {Object} param
   */
  async displayMessage(param) {
    try {
      // If we have the display task active, we give the message to it
      if (this.displayTask) {
        const task = await this.getTaskHandler()
          .getTask(this.displayTask);

        // If we disallow log display, stop it here
        if (!RoleAndTask.getInstance()
          .getDisplayLog()) {
          return false;
        }

        if (task.isActive()) {
          return task.displayMessage(param);
        }
      }

      // If not we display
      Utils.displayMessage(param);
    } catch (err) {
      // Ignore error - We can't display the data - it do not require further error treatment
      // Store the message into file tho
      Utils.displayMessage({
        str: String(err.stack || err),
        out: process.stderr,
      });
    }

    return false;
  }

  /**
   * Start a new slave not in a console but in a regular process
   * @param {{opts: String, uniqueSlaveId: String}} slaveOpts
   * @param {Object} specificOpts - (Spawn options)
   * @param {String} connectionTimeout
   */
  startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout) {
    return new Promise((resolve, reject) => {
      // We create a unique Id that will referenciate the slave at the connexion
      const uniqueSlaveId = (slaveOpts && slaveOpts.uniqueSlaveId) || Utils.generateUniqueEliotID();

      // Options to send to the new created slave
      const eliotOpts = (slaveOpts && slaveOpts.opts) || [
        `--${CONSTANT.ELIOT_LAUNCHING_PARAMETERS.MODE.name}`,
        `${CONSTANT.ELIOT_LAUNCHING_MODE.SLAVE}`,
        `--${CONSTANT.ELIOT_LAUNCHING_PARAMETERS.MODE_OPTIONS.name}`,
        `${CONSTANT.SLAVE_START_ARGS.IDENTIFIER}=${uniqueSlaveId}`,
      ];

      // Options to give to fork(...)
      const forkOpts = {};

      // If there is no path to the entry file to execute
      if (!this.pathToEntryFile) {
        throw new Error('Cannot start the slave : No pathToEntryFile configured');
      }

      // Path that lead to the exe of ELIOT
      const pathToExec = this.pathToEntryFile;

      // LaunchScenarios eliot in slave mode in a different process
      const child = childProcess.fork(pathToExec, eliotOpts, forkOpts);

      // LaunchScenarios a timeout of connection
      const timeoutConnection = setTimeout(() => {
        // Kill the process we did created
        child.kill(CONSTANT.SIGNAL_TO_KILL_SLAVE_COMMAND);

        return reject(new Error(`E7003 : Timeout ${connectionTimeout} ms passed`));
      }, connectionTimeout);

      // Look at error event (If it get fired it means the program failed to get launched)
      // Handle the fact a child can result an error later on after first connection
      // Error detected
      child.on('error', err => reject(new Error(`E7003 : Exit Code: ${err}`)));

      // Handle the fact a child get closed
      // The close can be wanted, or not
      child.on('close', (code) => {
        // No error
        RoleAndTask.getInstance()
          .displayMessage({
            str: `Slave Close: ${code}`.red,
          });
      });

      // Handle the fact a child exit
      // The exit can be wanted or not
      child.on('exit', (code) => {
        // No error
        RoleAndTask.getInstance()
          .displayMessage({
            str: `Slave Exit: ${code}`.red,
          });
      });

      // Now we need to look at communicationSystem of the master to know if the new slave connect to ELIOT
      // If we pass a connection timeout time, we kill the process we just created and return an error
      const connectEvent = (slaveInfos) => {
        // Wait for a new client with the identifier like -> uniqueSlaveId_processId
        if (slaveInfos && slaveInfos.eliotIdentifier === uniqueSlaveId) {
          // We got our slave working well
          clearTimeout(timeoutConnection);
          this.unlistenSlaveConnectionEvent(connectEvent);

          // Store the child data
          this.consoleChildObjectPtr.push({
            eliotIdentifier: uniqueSlaveId,
            pid: slaveInfos.clientPID,
          });

          return resolve({
            ...slaveInfos,
            pid: slaveInfos.clientPID,
          });
        }

        // This is not our slave

        return false;
      };

      this.listenSlaveConnectionEvent(connectEvent);
    });
  }

  /**
   * Do something when an information changed about ELIOT architecture
   */
  async somethingChangedAboutSlavesOrI() {
    // const task = await this.getHandleEliotTaskShortcut();
    const task = null;

    // No HandleEliotTask so -> don't tell a new archiecture is here
    if (!task) return;

    // Tell HandleEliotTask about new conf
    task.dynamicallyRefreshDataIntoList({
      notConfirmedSlaves: this.notConfirmedSlaves,
      confirmedSlaves: this.slaves,

      master: {
        tasks: this.getTaskHandler()
          .getTaskListStatus(),
        communication: this.getCommunicationSystem(),
        ips: Utils.givesLocalIps(),
        cpuAndMemory: this.cpuUsageAndMemory,
        tasksInfos: this.tasksInfos,
      },
    });
  }

  /**
   * When called : start a new slave
   * Take options in parameters or start a regular slave
   *
   * @param {{opts: String, uniqueSlaveId: String}} slaveOpts
   * @param {Object} specificOpts - (Spawn options)
   * @param {String} connectionTimeout
   */
  async startNewSlave(slaveOpts, specificOpts, connectionTimeout = CONSTANT.SLAVE_CREATION_CONNECTION_TIMEOUT) {
    const ret = await this.startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout);

    // Say something changed
    this.somethingChangedAboutSlavesOrI();

    return ret;
  }

  /**
   * Send a message that match head/body pattern
   *
   * Messages are like: { head: Object, body: Object }
   *
   * @param {String} eliotIdentifier
   * @param {String} headString
   * @param {String} bodyString
   */
  async sendMessageToSlaveHeadBodyPattern(eliotIdentifier, headString, bodyString) {
    // Build up the message
    const message = {
      [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: headString,
      [CONSTANT.PROTOCOL_KEYWORDS.BODY]: bodyString,
    };

    // Send the message
    return this.sendMessageToSlave(eliotIdentifier, JSON.stringify(message));
  }

  /**
   * Send a message to a slave using an eliotIdentifier
   * @param {String} eliotIdentifier
   * @param {String} message
   */
  async sendMessageToSlave(eliotIdentifier, message) {
    // Look for the slave in confirmSlave
    const slave = this.getSlaveByEliotIdentifier(eliotIdentifier);

    // Send the message
    this.getCommunicationSystem()
      .sendMessageToClient(slave.clientIdentityByte, slave.clientIdentityString, message);

    return true;
  }

  /**
   * Get a slave using its eliot id
   * @param {String} eliotIdentifier
   */
  getSlaveByEliotIdentifier(eliotIdentifier) {
    // Look for the slave in confirmSlave
    const slave = this.slaves.find(x => x.eliotIdentifier === eliotIdentifier);

    return slave || new Error(`E7004 : Identifier: ${eliotIdentifier}`);
  }

  /**
   * Using the eliotIdentifier, wait a specific incoming message from a specific slave
   *
   * Messages are like: { head: Object, body: Object }
   *
   * If there is no answer before the timeout, stop waiting and send an error
   * @param {String} headString
   * @param {String} eliotIdentifier
   * @param {Number} timeout - in ms
   */
  getMessageFromSlave(headString, eliotIdentifier, timeout = CONSTANT.MASTER_MESSAGE_WAITING_TIMEOUT) {
    return new Promise((resolve, reject) => {
      let timeoutFunction = false;

      // Look for the slave in confirmSlave
      const slave = this.getSlaveByEliotIdentifier(eliotIdentifier);

      // Function that will receive messages from slaves
      const msgListener = (clientIdentityByte, clientIdentityString, dataString) => {
        // Check the identifier to be the one we are waiting a message for

        if (clientIdentityString === slave.clientIdentityString) {
          const dataJSON = Utils.convertStringToJSON(dataString);

          // Here we got all messages that comes from clients (so slaves)
          // Check if the message answer particular message
          if (dataJSON && dataJSON[CONSTANT.PROTOCOL_KEYWORDS.HEAD] &&
            dataJSON[CONSTANT.PROTOCOL_KEYWORDS.HEAD] === headString) {
            // Stop the timeout
            clearTimeout(timeoutFunction);

            // Stop the listening
            this.getCommunicationSystem()
              .unlistenToIncomingMessage(msgListener);

            // We get our message
            return resolve(dataJSON[CONSTANT.PROTOCOL_KEYWORDS.BODY]);
          }
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
   * Send the cpu load to the server periodically
   */
  infiniteGetCpuAndMemory() {
    if (this.intervalFdCpuAndMemory) return;

    if (CONSTANT.DISPLAY_CPU_MEMORY_CHANGE_TIME) {
      // When we connect, we send our infos to the master
      this.intervalFdCpuAndMemory = setInterval(async () => {
        try {
          const cpuAndMemory = await Utils.getCpuAndMemoryLoad();

          this.cpuUsageAndMemory = cpuAndMemory;

          // Say something change
          this.somethingChangedAboutSlavesOrI();

          if (!this.active && this.intervalFdCpuAndMemory) {
            clearInterval(this.intervalFdCpuAndMemory);

            this.intervalFdCpuAndMemory = false;
          }
        } catch (err) {
          RoleAndTask.getInstance()
            .errorHappened(err);
        }
      }, CONSTANT.DISPLAY_CPU_MEMORY_CHANGE_TIME);
    }
  }

  /**
   * Get periodically the infos about tasks running in master
   */
  async infiniteGetTasksInfos() {
    if (this.intervalFdTasksInfos) return;

    this.intervalFdTasksInfos = setInterval(async () => {
      try {
        const infos = await this.taskHandler.getInfosFromAllActiveTasks();

        this.tasksInfos = infos;

        this.somethingChangedAboutSlavesOrI();

        // If the role is still active we call it back
        if (!this.active && this.intervalFdTasksInfos) {
          clearInterval(this.intervalFdTasksInfos);

          this.intervalFdTasksInfos = false;
        }
      } catch (err) {
        RoleAndTask.getInstance()
          .errorHappened(err);
      }
    }, CONSTANT.SLAVES_INFOS_CHANGE_TIME);
  }

  /**
   * ELIOT start to play the role
   *
   * A master is defined as:
   * A master have a Server ZeroMQ open
   * A master is connected to Slaves
   *
   * pathToEntryFile is the path we will use to start new slaves
   *
   * @param {Object} args
   * @override
   */
  async start({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
  }) {
    // Reinitialize some properties
    this.initProperties();

    // Create the OMQ Server
    this.communicationSystem = new ZeroMQServerRouter();

    // Start the communication system
    await this.communicationSystem.start({
      ipServer,
      portServer,
      transport: CONSTANT.ZERO_MQ.TRANSPORT.IPC,
    });

    this.active = true;

    this.protocolMasterSlave();

    // Say something changed
    this.somethingChangedAboutSlavesOrI();

    // LaunchScenarios an infite get of cpu usage to give to handleEliotTask
    this.infiniteGetCpuAndMemory();

    // LaunchScenarios an infite get of tasks infos to give to handleEliotTask
    this.infiniteGetTasksInfos();

    return true;
  }

  /**
   * Get the hierarchy level of the given task
   */
  static getHierarchyLevelByIdTask(computeListClosure, idTask) {
    let toRet;

    computeListClosure.some((x) => {
      if (x.idTask === idTask) {
        toRet = x.closureHierarchy;

        return true;
      }

      return false;
    });

    return toRet;
  }

  /**
   * Sort the array ASC by closureHierarchy
   */
  static sortArray(ptr) {
    const arr = ptr;

    for (let i = 0; i < (arr.length - 1); i += 1) {
      if (arr[i].closureHierarchy > arr[i + 1].closureHierarchy) {
        const tmp = arr[i + 1];

        arr[i + 1] = arr[i];

        arr[i] = tmp;

        i = -1;
      }
    }

    return arr;
  }

  /**
   * This methods return the task we need to stop first
   * There is an hierarchie in tasks closure
   */
  chooseWhichTaskToStop() {
    const tasksMaster = this.getTaskHandler()
      .getTaskListStatus();

    // Compute a list in order of tasksID to close (following the closure hierarchy)
    const computeListClosure = Master1_0.sortArray(tasksMaster.map(x => ({
      idTask: x.id,
      closureHierarchy: x.closureHierarchy,
    })));

    // Now look at slaves tasks, then master task, about the task that is the higher in closure hierarchy
    const ret = {
      idTaskToRemove: false,
      isMasterTask: false,
      isSlaveTask: false,
      identifierSlave: false,
      hierarchyLevel: false,
      args: {},
    };

    const foundHighestInHierarchy = this.slaves.some(x => x.tasks.some((y) => {
      // Look at the hierarchy level of the given task
      const hierarchyY = Master1_0.getHierarchyLevelByIdTask(computeListClosure, y.id);

      if (!y.isActive) return false;

      // Look if this hierarchy is higher than the save one
      if (ret.hierarchyLevel === false || (ret.hierarchyLevel > hierarchyY)) {
        // Save the task to be the one that get to be removed (for now!)
        ret.hierarchyLevel = hierarchyY;
        ret.idTaskToRemove = y.id;
        ret.isSlaveTask = true;
        ret.isMasterTask = false;
        ret.identifierSlave = x.eliotIdentifier;

        // If the task we have is the highest in hierarchy, no need to look furthers
        if (computeListClosure.length && hierarchyY === computeListClosure[0].closureHierarchy) return true;
      }

      return false;
    }));

    if (foundHighestInHierarchy) return ret;

    // We didn't found the higest task in the hierarchy so look at master tasks, its maybe there
    tasksMaster.some((x) => {
      const hierarchyX = Master1_0.getHierarchyLevelByIdTask(computeListClosure, x.id);

      if (!x.isActive) return false;

      // Look if this hierarchy is higher than the save one
      if (ret.hierarchyLevel === false || (ret.hierarchyLevel > hierarchyX)) {
        // Save the task to be the one that get to be removed (for now!)
        ret.hierarchyLevel = hierarchyX;
        ret.idTaskToRemove = x.id;
        ret.isSlaveTask = false;
        ret.isMasterTask = true;
        ret.identifierSlave = false;

        // If the task we have is the highest in hierarchy, no need to look furthers
        if (computeListClosure.length && hierarchyX === computeListClosure[0].closureHierarchy) return true;
      }
      return false;
    });

    return ret;
  }

  /**
   * Stop all tasks on every slave and master following a specific closure order
   * (Some tasks must be closed before/after some others)
   *
   * WARNING RECURSIVE CALL
   */
  async stopAllTaskOnEverySlaveAndMaster() {
    // close one of the task
    // master or slave task
    const {
      idTaskToRemove,
      isMasterTask,
      isSlaveTask,
      identifierSlave,
      args,
    } = this.chooseWhichTaskToStop();

    // No more task to stop
    if (idTaskToRemove === false) {
      // Say something changed
      this.somethingChangedAboutSlavesOrI();

      return true;
    }

    if (isMasterTask) {
      await this.getTaskHandler()
        .stopTask(idTaskToRemove, args);

      // Call next
      return this.stopAllTaskOnEverySlaveAndMaster();
    }

    if (isSlaveTask) {
      await this.removeTaskFromSlave(identifierSlave, idTaskToRemove, args);

      // Call next
      return this.stopAllTaskOnEverySlaveAndMaster();
    }

    return true;
  }

  /**
   * ELIOT stop to play the role
   * @param {Object} args
   * @override
   */
  async stop() {
    // Say bye to every slaves
    await this.stopAllTaskOnEverySlaveAndMaster();

    await this.removeExistingSlave(this.slaves.map(x => x.eliotIdentifier));

    // Stop the infinite loops
    if (this.intervalFdCpuAndMemory) clearInterval(this.intervalFdCpuAndMemory);

    if (this.intervalFdTasksInfos) clearInterval(this.intervalFdTasksInfos);

    // Stop the communication system
    await this.communicationSystem.stop();

    this.active = false;

    return true;
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
    identifierSlave,
    messageHeaderToSend,
    messageBodyToSend,
    messageHeaderToGet,
    isHeadBodyPattern,

    // Can be equals to undefined -> default timeout
    timeoutToGetMessage,
  }) {
    return new Promise((resolve, reject) => {
      // We switch to the appropriated func
      const sendMessageGoodFunc = () => {
        if (isHeadBodyPattern) return this.sendMessageToSlaveHeadBodyPattern;

        return this.sendMessageToSlave;
      };

      let errAlreadyReturned = false;

      // Be ready to get the message from the slave before to send it the command
      this.getMessageFromSlave(messageHeaderToGet, identifierSlave, timeoutToGetMessage)
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
      sendMessageGoodFunc()
        .call(this, identifierSlave, messageHeaderToSend, messageBodyToSend)
        .then(() => {
          // It went well, no wait getMessageFromSlave to get the message
          // If the message is not coming, getMessageFromSlave will timeout and result of an error

          //
          // Nothing to do here anymore Mate!
          //
        })
        .catch((err) => {
          // The getMessageFromSlave will automatically timeout
          if (!errAlreadyReturned) {
            errAlreadyReturned = true;

            return reject(err);
          }

          return false;
        });
    });
  }
}
