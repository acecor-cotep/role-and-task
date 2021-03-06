//
// Copyright (c) 2016 by Cotep. All Rights Reserved.
//

// Imports
import childProcess from 'child_process';
import AMaster from './AMaster';
import CONSTANT from '../../../Utils/CONSTANT/CONSTANT';
import TaskHandler from '../../Handlers/TaskHandler';
import ZeroMQServerRouter from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter';
import Utils from '../../../Utils/Utils';
import Errors from '../../../Utils/Errors';
import RoleAndTask from '../../../RoleAndTask';
import PromiseCommandPattern from '../../../Utils/PromiseCommandPattern';
import ATask, { Slave } from '../../Tasks/ATask';
import { ClientIdentityByte } from '../../../CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/AZeroMQServer';
import { ProgramState } from '../../Handlers/AHandler';
import { DisplayMessage } from '../ARole';

let instance: Master | null = null;

interface ConsoleChildObjectPtr {
  programIdentifier: string;
  pid: number;
}

interface Mutex {
  [key: string]: boolean;
}

/**
 * Define the Role of Master which have a job of manager.
 *
 * Manage Slaves.
 */
export default class Master extends AMaster {
  protected pathToEntryFile: string | false = false;

  // Define none communicationSystem for now
  protected communicationSystem: ZeroMQServerRouter | false = false;

  // Array of current approved slaves
  protected slaves: Slave[] = [];

  // Array of slaves that are in the confirmation process
  protected notConfirmedSlaves: Slave[] = [];

  // Array that contains the relation between console process ptr and programIdentifier
  // We use it too when there is no console launch, because it work with both soluce
  protected consoleChildObjectPtr: ConsoleChildObjectPtr[] = [];

  // Functions called when something happend to a slave connection
  protected newConnectionListeningFunction: {
    func: Function;
    context: unknown;
  }[] = [];

  protected newDisconnectionListeningFunction: {
    func: Function;
    context: unknown;
  }[] = [];

  // Data we keep as attribute to give to handleProgramTask later
  protected cpuUsageAndMemory: any = false;

  protected tasksInfos: {
    [key: string]: unknown;
    idTask: string;
  }[] | false = false;

  // Store the mutexes here, we use to avoid concurrency between slaves on specific actions
  protected mutexes: Mutex = {};

  protected intervalFdCpuAndMemory: NodeJS.Timeout | null = null;

  protected intervalFdTasksInfos: NodeJS.Timeout | null = null;

  constructor() {
    super();

    if (instance) {
      return instance;
    }

    // Set the reference time that will be sent to the slaves
    this.referenceStartTime = Date.now();

    this.name = CONSTANT.DEFAULT_ROLES.MASTER_ROLE.name;
    this.id = CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id;

    // Get the tasks related to the master role
    const tasks = RoleAndTask.getInstance()
      .getRoleTasks(CONSTANT.DEFAULT_ROLES.MASTER_ROLE.id);

    // Define all tasks handled by this role
    // We turn the tasks array into an object containing the tasks
    this.setTaskHandler(new TaskHandler(tasks.reduce((tmp, x) => {
      tmp[x.name] = x;

      return tmp;
    }, {})));

    this.initProperties();

    instance = this;

    return instance;
  }

  /**
   * Init the properties
   */
  protected initProperties(): void {
    // Define none communicationSystem for now
    this.communicationSystem = false;

    // Array of current approved slaves
    this.slaves = [];

    // Array of slaves that are in the confirmation process
    this.notConfirmedSlaves = [];

    // Array that contains the relation between console process ptr and programIdentifier
    // We use it too when there is no console launch, because it work with both soluce
    this.consoleChildObjectPtr = [];

    // Functions called when something happend to a slave connection
    this.newConnectionListeningFunction = [];
    this.newDisconnectionListeningFunction = [];

    // Data we keep as attribute to give to handleProgramTask later
    this.cpuUsageAndMemory = false;
    this.tasksInfos = false;

    // Store the mutexes here, we use to avoid concurrency between slaves on specific actions
    this.mutexes = {};
  }

  public getCommunicationSystem(): ZeroMQServerRouter | false {
    return this.communicationSystem;
  }

  public static getInstance(): Master {
    return instance || new Master();
  }

  /**
   * Pull a function that get fired when a slave get connected
   */
  public unlistenSlaveConnectionEvent(func: Function): void {
    this.newConnectionListeningFunction = this.newConnectionListeningFunction.filter(x => x.func !== func);
  }

  /**
   * Pull a function that get fired when a slave get disconnected
   */
  public unlistenSlaveDisconnectionEvent(func: Function): void {
    this.newDisconnectionListeningFunction = this.newDisconnectionListeningFunction.filter(x => x.func !== func);
  }

  /**
   * Push a function that get fired when a slave get connected
   */
  public listenSlaveConnectionEvent(func: Function, context: unknown = this): void {
    this.newConnectionListeningFunction.push({
      func,
      context,
    });
  }

  /**
   * Push a function that get fired when a slave get disconnected
   */
  public listenSlaveDisconnectionEvent(func: Function, context: unknown = this): void {
    this.newDisconnectionListeningFunction.push({
      func,
      context,
    });
  }

  public getNonConfirmedSlaves(): Slave[] {
    return this.notConfirmedSlaves;
  }

  public getSlaves(): Slave[] {
    return this.slaves;
  }

  /**
   * We get asked to spread a news to every slave tasks and our tasks
   *
   * WARNING - DO NOT SEND IT TO NON-REGULAR SLAVES (CRON_EXECUTOR_ROLE FOR EXAMPLE)
   */
  public sendDataToEveryProgramTaskWhereverItIsLowLevel(_: ClientIdentityByte, __: string, body: {
    dataName: string;
    data: any;
    timestamp: number;
    limitToTaskList: string[];
  }): void {
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
        this.sendMessageToSlaveHeadBodyPattern(x.programIdentifier, CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.GENERIC_CHANNEL_DATA, body);
      }
    });

    // For itself tasks
    RoleAndTask.getInstance()
      .spreadDataToEveryLocalTask(body);
  }

  /**
   * We get asked to spread a news to every slave tasks and our tasks
   */
  public sendDataToEveryProgramTaskWhereverItIs(data: any): void {
    this.sendDataToEveryProgramTaskWhereverItIsLowLevel([], '', data);
  }

  public tellMasterAboutSlaveError(clientIdentityString: string, err: Error): void {
    const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);

    if (!slave) {
      return;
    }

    slave.error = err;

    this.somethingChangedAboutSlavesOrI();
  }

  public errorHappenedIntoSlave(_: ClientIdentityByte, clientIdentityString: string, body: string): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const err: any = Errors.deserialize(body);

        // Display the error
        Utils.displayMessage({
          str: Errors.staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
          out: process.stderr,
        });

        try {
          // Get the client that got the problem
          // We try to change the program state to error
          await RoleAndTask.getInstance()
            .changeProgramState(CONSTANT.DEFAULT_STATES.ERROR.id);

          // We goodly changed the program state
          // Add informations on error

          Utils.displayMessage({
            str: Errors.staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
            out: process.stderr,
          });

          // Tell the task handleProgram that there had been an error for the slave
          this.tellMasterAboutSlaveError(clientIdentityString, err);

          // If the errors are supposed to be fatal, exit!
          if (RoleAndTask.getInstance().makesErrorFatal) {
            await RoleAndTask.getInstance().makeTheMasterToQuitTheWholeApp();

            RoleAndTask.exitProgramUnproperDueToError();
          }
          // We leave the process because something get broken
        } catch (errNested) {
          Utils.displayMessage({
            str: 'Exit program unproper ERROR HAPPENED IN SLAVE',
            out: process.stderr,
          });

          Utils.displayMessage({
            str: String((errNested && errNested.stack) || errNested),
            out: process.stderr,
          });

          RoleAndTask.exitProgramUnproperDueToError();
        }
      },
    });
  }

  /**
   * In master/slave protocol, we ask to get a token. We get directly asked as the master
   */
  public takeMutex(id: string): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        // The mutex has already been taken
        if (this.mutexes[id]) {
          throw new Errors('E7024');
        }

        // Custom function to call when taking or releasing the mutex (if one got set by the user)
        // If the function throw, we do not take the token
        const customFunctions = RoleAndTask.getInstance()
          .getMasterMutexFunctions()
          .find((x: any) => x.id === id);

        if (customFunctions && customFunctions.funcTake) {
          await customFunctions.funcTake();
        }

        this.mutexes[id] = true;
      },
    });
  }

  /**
   * In master/slave protocol, we ask to release the token. We get directly asked as the master.
   */
  public releaseMutex(id: string): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        // Custom function to call when taking or releasing the mutex (if one got set by the user)
        // If the function throw, we do not take the token
        const customFunctions = RoleAndTask.getInstance()
          .getMasterMutexFunctions()
          .find(x => x.id === id);

        if (customFunctions && customFunctions.funcRelease) {
          await customFunctions.funcRelease();
        }

        this.mutexes[id] = false;
      },
    });
  }

  /**
   * Take the mutex behind the given ID if it's available
   */
  protected protocolTakeMutex(_: ClientIdentityByte, clientIdentityString: string, body: {
    id: string;
  }): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          TAKE_MUTEX,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        // Det the slave that asked
        const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);

        if (!slave) {
          return;
        }

        try {
          // The mutex has already been taken
          if (this.mutexes[body.id]) {
            throw new Errors('E7024');
          }

          // Custom function to call when taking or releasing the mutex (if one got set by the user)
          // If the function throw, we do not take the token
          const customFunctions = RoleAndTask.getInstance()
            .getMasterMutexFunctions()
            .find(x => x.id === body.id);

          if (customFunctions && customFunctions.funcTake) {
            await customFunctions.funcTake();
          }

          this.mutexes[body.id] = true;

          this.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, TAKE_MUTEX, JSON.stringify({
            error: false,
          }));
        } catch (err) {
          this.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, TAKE_MUTEX, JSON.stringify({
            error: err instanceof Errors ? (err.serialize && err.serialize()) : String(err),
          }));
        }
      },
    });
  }

  /**
   * Release the mutex behind the given ID
   */
  protected protocolReleaseMutex(_: ClientIdentityByte, clientIdentityString: string, body: {
    id: string;
  }): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          RELEASE_MUTEX,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        // Det the slave that asked
        const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);

        if (!slave) {
          return;
        }

        try {
          // Custom function to call when taking or releasing the mutex (if one got set by the user)
          // If the function throw, we do not take the token
          const customFunctions = RoleAndTask.getInstance()
            .getMasterMutexFunctions()
            .find(x => x.id === body.id);

          if (customFunctions && customFunctions.funcRelease) {
            await customFunctions.funcRelease();
          }

          this.mutexes[body.id] = false;

          this.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, RELEASE_MUTEX, JSON.stringify({
            error: false,
          }));
        } catch (err) {
          this.sendMessageToSlaveHeadBodyPattern(slave.programIdentifier, RELEASE_MUTEX, JSON.stringify({
            error: err instanceof Errors ? (err.serialize && err.serialize()) : String(err),
          }));
        }
      },
    });
  }

  /**
   * Define the master/slave basic protocol
   * (Authentification)
   */
  protected protocolMasterSlave(): void {
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
      TAKE_MUTEX,
      RELEASE_MUTEX,
    } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

    if (this.communicationSystem === false) {
      return;
    }

    // Listen at new Socket connection
    //
    // 1/ Check if the new slave have a correct identifier
    // 2/ Ask the slave for running tasks
    // 3/ Get the slave answer
    // 4/ Add the slave into handled slave
    //
    this.communicationSystem.listenClientConnectionEvent((clientIdentityByte, clientIdentityString) => {
      const [
        programIdentifier,
        clientPID,
      ] = clientIdentityString.split('_');

      // Look at the identity of the slave (and if we have duplicate)
      if (this.slaves.find(x => x.programIdentifier === programIdentifier) ||
        this.notConfirmedSlaves.find(x => x.programIdentifier === programIdentifier)) {
        // Identity already in use by an other slave
        // Close the connection
        RoleAndTask.getInstance()
          .displayMessage({
            str: `[${this.name}] Refuse slave cause of identity`.cyan,
          });

        if (this.communicationSystem === false) {
          throw new Errors('EXXXX', 'communication system id false');
        }

        return this.communicationSystem.closeConnectionToClient(clientIdentityByte, clientIdentityString);
      }

      // So here the client do not exist already and the identifier is free

      // Add the slave into the declared not confirmed array
      this.notConfirmedSlaves.push({
        clientIdentityString,
        clientIdentityByte,
        programIdentifier,
        clientPID,
        tasks: [],
        error: false,
      });

      if (this.communicationSystem === false) {
        throw new Errors('EXXXX', 'communication system id false');
      }

      // Ask the slaves about its tasks
      return this.communicationSystem.sendMessageToClient(clientIdentityByte, clientIdentityString, SLAVE_CONFIRMATION_INFORMATIONS);
    });

    // Listen to slaves disconnection
    this.communicationSystem.listenClientDisconnectionEvent((clientIdentityString: string) => {
      this.slaves = this.slaves.filter((x) => {
        if (x.clientIdentityString === clientIdentityString) {
          RoleAndTask.getInstance()
            .displayMessage({
              str: `[${this.name}] Slave get removed (connection)`.red,
            });

          // Fire when a slave get disconnected
          Utils.fireUp(this.newDisconnectionListeningFunction, [
            x,
          ]);

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
          Utils.fireUp(this.newDisconnectionListeningFunction, [
            x,
          ]);

          return false;
        }

        return true;
      });
    });

    // Confirm a slave that wasn't
    const confirmSlave = (clientIdentityByte: ClientIdentityByte, clientIdentityString: string, dataJSON: {
      body: Slave;
    }): void => {
      const index = this.notConfirmedSlaves.findIndex(x => x.clientIdentityString === clientIdentityString);

      if (index === -1) {
        return;
      }

      // Confirm the slave
      const slave = this.notConfirmedSlaves[index];

      slave.tasks = dataJSON[BODY].tasks;
      slave.role = dataJSON[BODY].role;

      this.slaves.push(slave);

      this.notConfirmedSlaves.splice(index, 1);

      // Fire when a slave get connected
      Utils.fireUp(this.newConnectionListeningFunction, [
        slave,
      ]);
    };

    // We listen to incoming messages
    this.communicationSystem.listenToIncomingMessage((clientIdentityByte: ClientIdentityByte, clientIdentityString: string, dataString: string) => {
      const dataJSON = Utils.convertStringToJSON(dataString);

      // Here we got all messages that comes from clients (so slaves)
      // Check if the message answer particular message
      // If it does apply the particular job
      [
        // Check about the slave infos
        {
          checkFunc: (): boolean => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === SLAVE_CONFIRMATION_INFORMATIONS),

          // It means we get the tasks list
          applyFunc: (): void => confirmSlave(clientIdentityByte, clientIdentityString, dataJSON),
        },

        // Check about generic news
        {
          checkFunc: (): boolean => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === GENERIC_CHANNEL_DATA),
          applyFunc: (): void => this.sendDataToEveryProgramTaskWhereverItIsLowLevel(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        },

        // Check about messages to display
        {
          checkFunc: (): boolean => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === OUTPUT_TEXT),
          applyFunc: (): Promise<void> => this.displayMessage(dataJSON[BODY]),
        },

        // Check about infos about slaves
        {
          checkFunc: (): boolean => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === INFOS_ABOUT_SLAVES),
          applyFunc: (): void => this.infosAboutSlaveIncomming(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        },

        // Check about error happened into slave
        {
          checkFunc: (): boolean => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === ERROR_HAPPENED),
          applyFunc: (): Promise<void> => this.errorHappenedIntoSlave(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        },

        // Check about slave asking for taking a mutex
        {
          checkFunc: (): boolean => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === TAKE_MUTEX),
          applyFunc: (): Promise<void> => this.protocolTakeMutex(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        },

        // Check about slave asking for releasing a mutex
        {
          checkFunc: (): boolean => (dataJSON && dataJSON[HEAD] && dataJSON[HEAD] === RELEASE_MUTEX),
          applyFunc: (): Promise<void> => this.protocolReleaseMutex(clientIdentityByte, clientIdentityString, dataJSON[BODY]),
        },
      ].forEach((x) => {
        if (x.checkFunc()) {
          x.applyFunc();
        }
      });
    });
  }

  /**
   * We got news about a slave -> infos
   * Store it and call HandleProgramTask if it's up
   */
  protected infosAboutSlaveIncomming(_: ClientIdentityByte, clientIdentityString: string, data: any): void {
    // Get the right slave
    const slave = this.slaves.find(x => x.clientIdentityString === clientIdentityString);
    const notConfirmedSlave = this.notConfirmedSlaves.find(x => x.clientIdentityString === clientIdentityString);

    const ptr: Slave | undefined = slave || notConfirmedSlave;

    if (!ptr) {
      return;
    }

    if (!ptr.moreInfos) {
      ptr.moreInfos = {};
    }

    // Apply values to moreInfos
    [
      'cpuAndMemory',
      'ips',
      'tasksInfos',
    ]
      .forEach((x) => {
        // To get the 0 value
        if (data[x] !== void 0) {
          ptr.moreInfos[x] = data[x];
        }
      });

    // Tell something changed in the conf
    this.somethingChangedAboutSlavesOrI();
  }

  /**
   * Returns in an array the whole system pids (Master + Slaves processes)
   */
  public getFullSystemPids(): Promise<string[]> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve) => {
        resolve([
          String(process.pid),

          ...this.slaves.map(x => String(x.clientPID)),
        ]);
      }),
    });
  }

  /**
   * Connect the second Task to the first one
   */
  public connectMasterToTask(idTaskToConnectTo: string, idTaskToConnect: string, args: unknown[]): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        try {
          RoleAndTask.getInstance()
            .displayMessage({
              str: Utils.monoline([
                `[${this.name}] Ask Master to connect the Task N°${idTaskToConnect}`,
                ` to the Task N°${idTaskToConnectTo}`,
              ])
                .blue,
            });

          const handler: TaskHandler | false = this.getTaskHandler();

          if (handler === false) {
            throw new Errors('EXXXX', 'no task handler');
          }

          const task: ATask = await handler.getTask(idTaskToConnectTo);

          // We get the task
          // Error if the task is not active
          if (!task.isActive()) {
            throw new Errors('E7009', `idTask: ${idTaskToConnectTo}`);
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
              ]).red,
            });

          throw err;
        }
      },
    });
  }

  /**
   * Connect the second Task to the first one
   */
  public connectTaskToTask(identifierSlave: string, idTaskToConnectTo: string, idTaskToConnect: string, args: unknown[]): Promise<string> {
    return PromiseCommandPattern({
      func: async () => {
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
        if (ret === '') {
          return ret;
        }

        console.error(ret, '----> Master -- 4');

        throw ret;
      },
    });
  }

  /**
   * Modify the status of the task attached to the given identifier
   * (local data, have no impact in the real slave)
   */
  protected modifyTaskStatusToSlaveLocalArray(identifier: string, idTask: string, status: boolean): void {
    this.slaves.some((x, xi) => {
      if (x.programIdentifier === identifier) {
        return x.tasks.some((y, yi) => {
          if (y.id === idTask) {
            // @WARNING IT WAS isActive BEFORE
            this.slaves[xi].tasks[yi].active = status;

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
   */
  public startTaskToSlave(identifier: string, idTask: string, args: unknown[]): Promise<string> {
    return PromiseCommandPattern({
      func: async () => {
        const ret = (await this.sendMessageAndWaitForTheResponse({
          identifierSlave: identifier,
          isHeadBodyPattern: true,
          messageHeaderToSend: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK,

          messageBodyToSend: {
            idTask,
            args,
          },

          messageHeaderToGet: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.START_TASK,
        })) as string;

        // We get either an errors object or an error
        if (ret === '') {
          // Modify the task status for the given slave
          this.modifyTaskStatusToSlaveLocalArray(identifier, idTask, true);

          // Say something changed
          this.somethingChangedAboutSlavesOrI();

          return ret;
        }

        console.error(ret, '----> Master -- 1');

        throw Errors.deserialize(ret);
      },
    });
  }

  public listSlaves(): Slave[] {
    return this.getSlaves();
  }

  /**
   * List a slave tasks using its identifier (Ask the slave to it)
   */
  protected distantListSlaveTask(identifier: string): Promise<unknown> {
    return PromiseCommandPattern({
      func: () => this.sendMessageAndWaitForTheResponse({
        identifierSlave: identifier,
        isHeadBodyPattern: false,
        messageHeaderToSend: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
        messageBodyToSend: {},
        messageHeaderToGet: CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES.LIST_TASKS,
      }),
    });
  }

  /**
   * List a slave tasks using its identifier (Use local data to it)
   */
  public listSlaveTask(identifier: string): Promise<ATask[]> {
    return PromiseCommandPattern({
      func: async () => {
        // Look for the slave in confirmSlave
        const slave = this.getSlaveByProgramIdentifier(identifier);

        if (!slave || slave instanceof Errors) {
          return [];
        }

        return slave.tasks;
      },
    });
  }

  /**
   * Handle the fact the program state change
   * We spread the data on our tasks and to our slaves
   */
  public handleProgramStateChange(programState: ProgramState, oldProgramState: ProgramState): Promise<void> {
    return PromiseCommandPattern({
      func: () => {
        const taskHandler: TaskHandler | false = this.getTaskHandler();

        if (taskHandler === false) {
          throw new Errors('EXXXX', 'no task handler');
        }

        return Promise.all([
          // Spread to our tasks
          taskHandler.applyNewProgramState(programState, oldProgramState),

          // Spread to slaves
          this.tellAllSlaveThatProgramStateChanged(programState, oldProgramState),
        ]);
      },
    });
  }

  /**
   * Return only the slaves that are regular slaves (not CRON_EXECUTOR_ROLE for example)
   */
  public getSlavesOnlyThatAreRegularSlaves(): Slave[] {
    return this.slaves.filter((x) => {
      if (!x.role) {
        return false;
      }

      return x.role.id === CONSTANT.DEFAULT_ROLES.SLAVE_ROLE.id;
    });
  }

  /**
   * Tell all slave that the program state did change
   *
   * WARNING - DO NOT INCLUDE CRON_EXECUTOR_ROLE SLAVES INTO THE PIPE
   */
  protected tellAllSlaveThatProgramStateChanged(programState: ProgramState, oldProgramState: ProgramState): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        const regularSlaves = this.getSlavesOnlyThatAreRegularSlaves();

        return Promise.all(regularSlaves.map(x => this.tellASlaveThatProgramStateChanged(x.programIdentifier, programState, oldProgramState)));
      },
    });
  }

  tellASlaveThatProgramStateChanged(slaveIdentifier: string, programState: ProgramState, oldProgramState: ProgramState): Promise<string> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          STATE_CHANGE,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        const ret = (await this.sendMessageAndWaitForTheResponse({
          identifierSlave: slaveIdentifier,
          isHeadBodyPattern: true,
          messageHeaderToSend: STATE_CHANGE,

          messageBodyToSend: {
            programState,
            oldProgramState,
          },

          messageHeaderToGet: STATE_CHANGE,
          timeoutToGetMessage: RoleAndTask.getInstance().masterMessageWaitingTimeoutStateChange,
        })) as string;

        // We get either an errors object or an error
        if (ret === '') {
          return ret;
        }

        console.error(ret, '----> Master -- 2');

        RoleAndTask.getInstance()
          .displayMessage({
            str: `[${this.name}] program state get not spread in Slave N°${slaveIdentifier}`.red,
          });

        throw Errors.deserialize(ret);
      },
    });
  }

  protected removeExistingSlave(identifiersSlaves: string[]): Promise<void> {
    return PromiseCommandPattern({
      func: () => Utils.promiseQueue([
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
      ]),
    });
  }

  /**
   * Kill a slave using its identifier
   */
  public killSlave(programIdentifier: string): void {
    // Look for the given identifier
    this.consoleChildObjectPtr.filter((x) => {
      if (x.programIdentifier === programIdentifier) {
        try {
          // Kill the process
          process.kill(x.pid, CONSTANT.SIGNAL_UNPROPER.SIGUSR1);

          // Remove the slave from the slave list
          this.slaves = this.slaves.filter(y => !(y.programIdentifier === programIdentifier));
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
   */
  public removeTaskFromSlave(identifier: string, idTask: string, args: unknown[]): Promise<string> {
    return PromiseCommandPattern({
      func: async () => {
        const {
          STOP_TASK,
        } = CONSTANT.PROTOCOL_MASTER_SLAVE.MESSAGES;

        RoleAndTask.getInstance()
          .displayMessage({
            str: `[${this.name}] Ask Slave N°${identifier} to stop the Task N°${idTask}`.blue,
          });

        const ret = (await this.sendMessageAndWaitForTheResponse({
          identifierSlave: identifier,
          isHeadBodyPattern: true,
          messageHeaderToSend: STOP_TASK,

          messageBodyToSend: {
            idTask,
            args,
          },

          messageHeaderToGet: STOP_TASK,
          timeoutToGetMessage: RoleAndTask.getInstance().masterMessageWaitingTimeoutStopChange,
        })) as string;

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

        console.error(ret, '----> Master -- 3');


        RoleAndTask.getInstance()
          .displayMessage({
            str: `[${this.name}] Task N°${idTask} failed to be stopped to Slave N°${identifier}`.red,
          });

        throw ret;
      },
    });
  }

  /**
   * Display a message directly
   */
  public displayMessage(param: DisplayMessage): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        try {
          // If we have the display task active, we give the message to it
          const displayTask = RoleAndTask.getInstance().displayTask;

          if (displayTask !== false) {
            const taskHandler: TaskHandler | false = this.getTaskHandler();

            if (taskHandler === false) {
              throw new Errors('EXXXX', 'no task handler');
            }

            const task = await taskHandler.getTask(displayTask);

            // If we disallow log display, stop it here
            if (!RoleAndTask.getInstance().displayLog) {
              return false;
            }

            if (task.isActive() && task.displayMessage) {
              return task.displayMessage(param);
            }
          }

          // If not we display
          Utils.displayMessage(param);
        } catch (err) {
          // Ignore error - We can't display the data - it do not require further error treatment
          // Store the message into file tho
          Utils.displayMessage({
            str: Errors.staticIsAnError(err) ? err.getErrorString() : String(err.stack || err),
            out: process.stderr,
          });
        }

        return false;
      },
    });
  }

  /**
   * Start a new slave not in a console but in a regular process
   */
  public startNewSlaveInProcessMode(slaveOpts: {
    opts: string[];
    uniqueSlaveId: string;
  }, _: any, connectionTimeout: number): Promise<Slave> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        // We create a unique Id that will referenciate the slave at the connexion
        const uniqueSlaveId = (slaveOpts && slaveOpts.uniqueSlaveId) || Utils.generateUniqueProgramID();

        // Options to send to the new created slave
        const programOpts: string[] = (slaveOpts && slaveOpts.opts) || [
          `--${CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE.name}`,
          `${CONSTANT.PROGRAM_LAUNCHING_MODE.SLAVE}`,
          `--${CONSTANT.PROGRAM_LAUNCHING_PARAMETERS.MODE_OPTIONS.name}`,
          `${CONSTANT.SLAVE_START_ARGS.IDENTIFIER}=${uniqueSlaveId}`,
          `${CONSTANT.SLAVE_START_ARGS.ELIOT_START_TIME}=${this.referenceStartTime}`,
        ];

        // Options to give to fork(...)
        const forkOpts = {};

        // If there is no path to the entry file to execute
        if (!this.pathToEntryFile) {
          throw new Errors('EXXXX', 'Cannot start the slave : No pathToEntryFile configured');
        }

        // Path that lead to the exe of PROGRAM
        const pathToExec = this.pathToEntryFile;

        // LaunchScenarios program in slave mode in a different process
        const child = childProcess.fork(pathToExec, programOpts, forkOpts);

        // LaunchScenarios a timeout of connection
        const timeoutConnection = setTimeout(() => {
          // Kill the process we did created
          child.kill(CONSTANT.SIGNAL_TO_KILL_SLAVE_COMMAND);

          return reject(new Errors('E7003', `Timeout ${connectionTimeout} ms passed`));
        }, connectionTimeout);

        // Look at error event (If it get fired it means the program failed to get launched)
        // Handle the fact a child can result an error later on after first connection
        // Error detected
        child.on('error', err => reject(new Errors('E7003', `Exit Code: ${err}`)));

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

        // Now we need to look at communicationSystem of the master to know if the new slave connect to PROGRAM
        // If we pass a connection timeout time, we kill the process we just created and return an error
        const connectEvent = (slaveInfos: Slave): void => {
          // Wait for a new client with the identifier like -> uniqueSlaveId_processId
          if (slaveInfos && slaveInfos.programIdentifier === uniqueSlaveId) {
            // We got our slave working well
            clearTimeout(timeoutConnection);
            this.unlistenSlaveConnectionEvent(connectEvent);

            // Store the child data
            this.consoleChildObjectPtr.push({
              programIdentifier: uniqueSlaveId,
              pid: slaveInfos.clientPID,
            });

            resolve({
              ...slaveInfos,
              pid: slaveInfos.clientPID,
            } as Slave);
          }

          // This is not our slave
          return;
        };

        this.listenSlaveConnectionEvent(connectEvent);
      }),
    });
  }

  /**
   * Tell one task about what changed in the architecture
   */
  protected tellOneTaskAboutArchitectureChange(idTask: string): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        try {
          const taskHandler: TaskHandler | false = this.getTaskHandler();

          if (taskHandler === false) {
            throw new Errors('EXXXX', 'cannot find task handler');
          }

          const task: ATask = await taskHandler.getTask(idTask);

          // Can't find the task  so -> don't tell a new archiecture is here
          if (!task) {
            return;
          }

          if (task.isActive() && task.dynamicallyRefreshDataIntoList) {
            // Tell HandleProgramTask about new conf
            task.dynamicallyRefreshDataIntoList({
              notConfirmedSlaves: this.notConfirmedSlaves,
              confirmedSlaves: this.slaves,

              master: {
                tasks: taskHandler.getTaskListStatus(),
                communication: this.getCommunicationSystem(),
                ips: Utils.givesLocalIps(),
                cpuAndMemory: this.cpuUsageAndMemory,
                tasksInfos: this.tasksInfos,
              },
            });
          }
        } catch (e) {
          // Don't od anything because it's not an error
        }
      },
    });
  }

  /**
   * Do something when an information changed about PROGRAM architecture
   */
  protected somethingChangedAboutSlavesOrI(): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        // Look at all tasks
        await Promise.all(RoleAndTask.getInstance()
          .tasks.filter(x => x.notifyAboutArchitectureChange)
          .map(x => this.tellOneTaskAboutArchitectureChange(x.id)));
      },
    });
  }

  /**
   * When called : start a new slave
   * Take options in parameters or start a regular slave
   */
  public startNewSlave(slaveOpts: { opts: string[], uniqueSlaveId: string }, specificOpts: any, connectionTimeout: number = CONSTANT.SLAVE_CREATION_CONNECTION_TIMEOUT): Promise<string> {
    return PromiseCommandPattern({
      func: async () => {
        const ret = await this.startNewSlaveInProcessMode(slaveOpts, specificOpts, connectionTimeout);

        // Say something changed
        await this.somethingChangedAboutSlavesOrI();

        return ret;
      },
    });
  }

  /**
   * Send a message that match head/body pattern
   *
   * Messages are like: { head: Object, body: Object }
   */
  protected sendMessageToSlaveHeadBodyPattern(programIdentifier: string, headString: string, body: unknown): Promise<true> {
    return PromiseCommandPattern({
      func: async () => {
        // Build up the message
        const message = {
          [CONSTANT.PROTOCOL_KEYWORDS.HEAD]: headString,
          [CONSTANT.PROTOCOL_KEYWORDS.BODY]: body,
        };

        // Send the message
        return this.sendMessageToSlave(programIdentifier, JSON.stringify(message));
      },
    });
  }

  /**
   * Send a message to a slave using an programIdentifier
   */
  protected sendMessageToSlave(programIdentifier: string, message: string): Promise<true> {
    return PromiseCommandPattern({
      func: async () => {
        // Look for the slave in confirmSlave
        const slave = this.getSlaveByProgramIdentifier(programIdentifier);

        if (this.communicationSystem === false || slave instanceof Errors) {
          throw new Errors('EXXXX', 'communication system false');
        }

        // Send the message
        this.communicationSystem
          .sendMessageToClient(slave.clientIdentityByte, slave.clientIdentityString, message);

        return true;
      },
    });
  }

  /**
   * Get a slave using its program id
   */
  protected getSlaveByProgramIdentifier(programIdentifier: string): Slave | Errors {
    // Look for the slave in confirmSlave
    const slave = this.slaves.find(x => x.programIdentifier === programIdentifier);

    return slave || new Errors('E7004', `Identifier: ${programIdentifier}`);
  }

  /**
   * Using the programIdentifier, wait a specific incoming message from a specific slave
   *
   * Messages are like: { head: Object, body: Object }
   *
   * If there is no answer before the timeout, stop waiting and send an error
   */
  protected getMessageFromSlave(headString: string, programIdentifier: string, timeout: number = RoleAndTask.getInstance().masterMessageWaitingTimeout): Promise<unknown> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        let timeoutFunction: NodeJS.Timeout | false = false;

        // Look for the slave in confirmSlave
        const slave = this.getSlaveByProgramIdentifier(programIdentifier);

        // Function that will receive messages from slaves
        const msgListener = (clientIdentityByte: ClientIdentityByte, clientIdentityString: string, dataString: string): void => {
          // Check the identifier to be the one we are waiting a message for

          if (!(slave instanceof Errors) && clientIdentityString === slave.clientIdentityString) {
            const dataJSON = Utils.convertStringToJSON(dataString);

            // Here we got all messages that comes from clients (so slaves)
            // Check if the message answer particular message
            if (dataJSON && dataJSON[CONSTANT.PROTOCOL_KEYWORDS.HEAD] &&
              dataJSON[CONSTANT.PROTOCOL_KEYWORDS.HEAD] === headString) {
              // Stop the timeout
              if (timeoutFunction) {
                clearTimeout(timeoutFunction);
              }

              if (this.communicationSystem === false) {
                throw new Errors('EXXXX', 'communication system is false');
              }

              // Stop the listening
              this.communicationSystem.unlistenToIncomingMessage(msgListener);

              // We get our message
              return resolve(dataJSON[CONSTANT.PROTOCOL_KEYWORDS.BODY]);
            }
          }
        };

        // If the function get triggered, we reject an error
        timeoutFunction = setTimeout(() => {
          if (this.communicationSystem === false) {
            throw new Errors('EXXXX', 'communication system is false');
          }

          // Stop the listening
          this.communicationSystem.unlistenToIncomingMessage(msgListener);

          return reject(new Errors('E7005'));
        }, timeout);

        if (this.communicationSystem === false) {
          throw new Errors('EXXXX', 'communication system is false');
        }

        // Listen to incoming messages
        return this.communicationSystem.listenToIncomingMessage(msgListener);
      }),
    });
  }

  /**
   * Send the cpu load to the server periodically
   */
  protected infiniteGetCpuAndMemory(): Promise<void> {
    return PromiseCommandPattern({
      func: async () => {
        if (this.intervalFdCpuAndMemory) {
          return;
        }

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

                this.intervalFdCpuAndMemory = null;
              }
            } catch (err) {
              RoleAndTask.getInstance()
                .errorHappened(err);
            }
          }, CONSTANT.DISPLAY_CPU_MEMORY_CHANGE_TIME);
        }
      },
    });
  }

  /**
   * Get periodically the infos about tasks running in master
   */
  protected infiniteGetTasksInfos(): void {
    if (this.intervalFdTasksInfos) {
      return;
    }

    this.intervalFdTasksInfos = setInterval(async () => {
      try {
        const taskHandler: TaskHandler | false = this.getTaskHandler();

        if (taskHandler === false) {
          throw new Errors('EXXXX', 'no task handler');
        }

        const infos = await taskHandler.getInfosFromAllActiveTasks();

        this.tasksInfos = infos;

        this.somethingChangedAboutSlavesOrI();

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
   * PROGRAM start to play the role
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
  public start({
    ipServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS,
    portServer = CONSTANT.ZERO_MQ.DEFAULT_SERVER_IP_PORT,
  }: {
    ipServer: string;
    portServer: string;
  }): Promise<true> {
    return PromiseCommandPattern({
      func: async () => {
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

        // LaunchScenarios an infite get of cpu usage to give to handleProgramTask
        this.infiniteGetCpuAndMemory();

        // LaunchScenarios an infite get of tasks infos to give to handleProgramTask
        this.infiniteGetTasksInfos();

        return true;
      },
    });
  }

  /**
   * Get the hierarchy level of the given task
   */
  public static getHierarchyLevelByIdTask(computeListClosure, idTask: string): Promise<boolean | number> {
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
  public static sortArray<T extends {
    closureHierarchy: number;
  }>(ptr: T[]): T[] {
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
  protected chooseWhichTaskToStop(): any {
    const taskHandler: TaskHandler | false = this.getTaskHandler();

    if (taskHandler === false) {
      throw new Errors('EXXXX', 'no task handler');
    }

    const tasksMaster = taskHandler.getTaskListStatus();

    // Compute a list in order of tasksID to close (following the closure hierarchy)
    const computeListClosure = Master.sortArray(tasksMaster.map((x: any) => ({
      idTask: x.id,
      closureHierarchy: x.closureHierarchy,
    })));

    // Now look at slaves tasks, then master task, about the task that is the higher in closure hierarchy
    const ret: any = {
      idTaskToRemove: false,
      isMasterTask: false,
      isSlaveTask: false,
      identifierSlave: false,
      hierarchyLevel: false,
      args: {},
    };

    const foundHighestInHierarchy = this.slaves.some(x => x.tasks.some((y) => {
      // Look at the hierarchy level of the given task
      const hierarchyY = Master.getHierarchyLevelByIdTask(computeListClosure, y.id);

      if (!y.isActive) {
        return false;
      }

      // Look if this hierarchy is higher than the save one
      if (ret.hierarchyLevel === false || (ret.hierarchyLevel > hierarchyY)) {
        // Save the task to be the one that get to be removed (for now!)
        ret.hierarchyLevel = hierarchyY;
        ret.idTaskToRemove = y.id;
        ret.isSlaveTask = true;
        ret.isMasterTask = false;
        ret.identifierSlave = x.programIdentifier;

        // If the task we have is the highest in hierarchy, no need to look furthers
        if (computeListClosure.length && hierarchyY === computeListClosure[0].closureHierarchy) {
          return true;
        }
      }

      return false;
    }));

    if (foundHighestInHierarchy) {
      return ret;
    }

    // We didn't found the higest task in the hierarchy so look at master tasks, its maybe there
    tasksMaster.some((x) => {
      const hierarchyX = Master.getHierarchyLevelByIdTask(computeListClosure, x.id);

      if (!x.isActive) {
        return false;
      }

      // Look if this hierarchy is higher than the save one
      if (ret.hierarchyLevel === false || (ret.hierarchyLevel > hierarchyX)) {
        // Save the task to be the one that get to be removed (for now!)
        ret.hierarchyLevel = hierarchyX;
        ret.idTaskToRemove = x.id;
        ret.isSlaveTask = false;
        ret.isMasterTask = true;
        ret.identifierSlave = false;

        // If the task we have is the highest in hierarchy, no need to look furthers
        if (computeListClosure.length && hierarchyX === computeListClosure[0].closureHierarchy) {
          return true;
        }
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
  protected stopAllTaskOnEverySlaveAndMaster(): Promise<any> {
    return PromiseCommandPattern({
      func: async () => {
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
          if (this.taskHandler === false) {
            throw new Errors('EXXXX', 'task handler is false');
          }

          await this.taskHandler.stopTask(idTaskToRemove, args);

          // Call next
          return this.stopAllTaskOnEverySlaveAndMaster();
        }

        if (isSlaveTask) {
          await this.removeTaskFromSlave(identifierSlave, idTaskToRemove, args);

          // Call next
          return this.stopAllTaskOnEverySlaveAndMaster();
        }

        return true;
      },
    });
  }

  public stop(): Promise<any> {
    return PromiseCommandPattern({
      func: async () => {
        // Say bye to every slaves
        await this.stopAllTaskOnEverySlaveAndMaster();

        await this.removeExistingSlave(this.slaves.map(x => x.programIdentifier));

        // Stop the infinite loops
        if (this.intervalFdCpuAndMemory) {
          clearInterval(this.intervalFdCpuAndMemory);
        }

        if (this.intervalFdTasksInfos) {
          clearInterval(this.intervalFdTasksInfos);
        }

        if (this.communicationSystem !== false) {
          // Stop the communication system
          await this.communicationSystem.stop();
        }

        this.active = false;

        return true;
      },
    });
  }

  /**
   * Send the given message and wait for the response
   *
   * HERE WE CREATE TWO EXECUTIONS LIFES
   *
   * Put isHeadBodyPattern = true if you want to use the headBodyPattern
   */
  public sendMessageAndWaitForTheResponse({
    identifierSlave,
    messageHeaderToSend,
    messageBodyToSend,
    messageHeaderToGet,
    isHeadBodyPattern,

    // Can be equals to undefined -> default timeout
    timeoutToGetMessage,
  }: {
    identifierSlave: string;
    messageHeaderToSend: string;
    messageBodyToSend: any;
    messageHeaderToGet: string;
    isHeadBodyPattern: boolean;
    timeoutToGetMessage?: undefined | number;
  }): Promise<unknown> {
    return PromiseCommandPattern({
      func: () => new Promise((resolve, reject) => {
        // We switch to the appropriated func
        const sendMessageGoodFunc = (): Function => {
          if (isHeadBodyPattern) {
            return this.sendMessageToSlaveHeadBodyPattern;
          }

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
      }),
    });
  }
}
